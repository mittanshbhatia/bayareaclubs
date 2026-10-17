# -*- coding: utf-8 -*-
"""
Character Sculpt: The Bellarmine Mascot 2.0  --  Maya build script
===================================================================

Run this inside Autodesk Maya (Script Editor > Python tab). It builds the whole
assignment scene from the project's reference images, then saves the native
.mb scene and renders the PNG through Maya itself.

How to run (short version; see README.md for the long one):
  1. Copy the whole project folder somewhere on your computer.
  2. In Maya: Windows > General Editors > Script Editor > Python tab.
  3. File > Load Script... and pick this file (or paste it).
  4. Set PROJECT_ROOT below if the script cannot find the project on its own.
  5. Run it (Ctrl+Enter). Watch the Script Editor history for "[BellMascot]" lines.

The code is written in small, named steps so you can read it top to bottom and
change one thing at a time. Every number you are likely to want to change is in
the CONFIG and SHAPE TABLES sections.

Compatible with Maya 2020+ (Python 2 and 3). It only uses maya.cmds.
"""
from __future__ import print_function, division

import datetime
import math
import os
import re
import shutil
import struct
import sys
import time

try:
    import maya.cmds as cmds
except ImportError:  # offline test harness injects a stand-in
    cmds = None

# ---------------------------------------------------------------------------
# CONFIG  (edit these)
# ---------------------------------------------------------------------------
PROJECT_ROOT = None          # e.g. r"C:/Users/you/Documents/maya/projects/BellMascot2"
STUDENT_PREFIX = "Bhatia Mittansh -Bell Character"   # required submission naming
RENDER_WIDTH = 1920
RENDER_HEIGHT = 1080
DO_RENDER = True             # set False to build + save without rendering
DO_REOPEN_CHECK = True       # re-open the saved .mb and look for missing files
LIVE_DELAY = 0.0             # seconds to pause after each step so you can watch the viewport build
CAMERA_AZIMUTH_DEG = 38.0    # three-quarter angle (0 = straight on, + = toward +X)
CAMERA_ELEVATION_DEG = 9.0
CAMERA_FOCAL_MM = 85.0       # long lens = little perspective distortion

# Light strengths. If your render looks too dark / too bright, change these.
LIGHT_TUNE = {
    "arnold":       {"key": 1.35, "fill": 0.38, "rim": 0.95, "sky": 0.30},
    "mayaSoftware": {"key": 0.95, "fill": 0.34, "rim": 0.70, "ambient": 0.10},
}

# ---------------------------------------------------------------------------
# REFERENCE IMAGES  (measured landmarks; see docs/reference_measurements.md)
# ---------------------------------------------------------------------------
# All pixel numbers are measured on the cropped reference images in sourceimages/.
# Both views are scaled so the body (ground -> top of the cap) is BODY_HEIGHT
# units tall. That is the "corresponding landmark" alignment: ground and cap top
# line up exactly; the front and side drawings differ by ~3% in scale because of
# camera perspective, which is why each view gets its own pixel->unit scale.
BODY_HEIGHT = 12.0
REF_FRONT = {
    "file": "reference_front.png", "size": (832, 1544),
    "axis_px": 416.0,        # x pixel of the mascot's centre line
    "ground_px": 1525.0,     # y pixel where the base touches the ground
    "cap_px": 323.0,         # y pixel of the top of the blue cap
}
REF_SIDE = {
    "file": "reference_side.png", "size": (770, 1544),
    "axis_px": 329.0, "ground_px": 1503.0, "cap_px": 338.0,
}
HANDLE_TOP = 14.85           # reconciled between front (15.2) and side (14.6)
EYE_LEVEL = 8.43             # reconciled between front (8.49) and side (8.37)

# ---------------------------------------------------------------------------
# SHAPE TABLES  (height -> size).  Edit these to reshape the whole body.
# ---------------------------------------------------------------------------
# half-width in X (front view), distance to the front (z+) and to the back (z-)
# at each height. Read from both reference silhouettes with the arms removed.
HALF_WIDTH_X = [
    (0.0, 1.90), (0.3, 2.15), (0.7, 2.46), (1.0, 2.52), (1.5, 2.66), (2.0, 2.82),
    (2.5, 2.74), (3.0, 2.64), (3.5, 2.60), (4.5, 2.62), (5.5, 2.66), (6.5, 2.70),
    (7.5, 2.76), (8.0, 2.68), (8.5, 2.50), (9.0, 2.34), (9.5, 2.20), (10.0, 2.04),
    (10.5, 1.90), (11.0, 1.62), (11.5, 1.22), (11.9, 0.92), (12.0, 0.75),
]
FRONT_Z = [
    (0.0, 1.90), (0.3, 2.35), (0.7, 2.68), (1.2, 2.82), (1.5, 2.85), (2.0, 3.00),
    (2.5, 2.92), (3.0, 2.76), (3.5, 2.60), (4.0, 2.46), (5.0, 2.40), (6.0, 2.32),
    (7.0, 2.20), (7.5, 2.10), (8.0, 2.08), (8.5, 2.05), (9.0, 2.00), (9.5, 1.98),
    (10.0, 1.98), (10.5, 1.88), (11.0, 1.70), (11.5, 1.50), (11.9, 1.30), (12.0, 1.20),
]
BACK_Z = [
    (0.0, 2.00), (0.3, 2.46), (0.7, 2.76), (1.2, 2.86), (1.5, 2.86), (2.0, 3.02),
    (3.0, 2.92), (4.0, 2.84), (5.0, 2.78), (6.0, 2.76), (7.0, 2.82), (8.0, 2.78),
    (9.0, 2.73), (10.0, 2.60), (10.5, 2.50), (11.0, 2.42), (11.5, 2.28), (11.9, 2.14),
    (12.0, 2.05),
]
SECTION_POWER = 2.4          # 2 = ellipse; higher = slightly squarer cross-section
CAP_DOME = 0.10              # how much the flat top of the cap bulges up

# Cube subdivisions: SX/SZ around, SY up. Row heights are listed so the rows sit
# where the face, arms and base band need edge loops.
SX, SZ = 16, 16
ROW_HEIGHTS = (
    [0.0, 0.25, 0.6, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5]
    + [4.0 + 0.5 * i for i in range(14)]          # 4.0 ... 10.5, every 0.5
    + [11.0, 11.4, 11.7, 11.9, 12.0]
)
SY = len(ROW_HEIGHTS) - 1

# Soft-selection sculpting of the face and belly: (name, x, height, radius, (dx, dy, dz)).
# x > 0 entries are mirrored to -x automatically.
SCULPT = [
    ("nose",         0.00, 7.55, 0.90, (0.00, -0.05, 0.46)),
    ("nostrils",     0.55, 7.25, 0.50, (0.05, 0.00, 0.22)),
    ("cheeks",       1.90, 7.55, 1.10, (0.08, 0.00, 0.30)),
    ("eye_sockets",  1.10, 8.45, 0.75, (0.00, 0.00, -0.26)),
    ("brow_shelf",   1.30, 9.20, 0.90, (0.00, 0.00, 0.14)),
    ("jaw_lump",     0.00, 6.10, 1.50, (0.00, 0.00, 0.42)),
    ("snarl_corners", 2.20, 6.60, 1.00, (0.15, 0.00, 0.16)),
    ("belly_bump",   0.00, 4.10, 1.10, (0.00, 0.00, 0.32)),
]

# Brow centre line, (|x|, height) from the nose outward. Mirrored for the other side.
BROW_PATH = [(0.12, 8.95), (0.55, 9.12), (1.00, 9.32), (1.45, 9.55),
             (1.85, 9.68), (2.08, 9.58), (2.18, 9.36)]

# Eyes: centre x (mirrored), centre height, sclera radii (x, y, z), tilt in degrees.
EYE = {"x": 1.12, "h": EYE_LEVEL, "radii": (0.60, 0.47, 0.34), "tilt": 13.0,
       "iris": (0.29, 0.29, 0.13), "pupil": (0.13, 0.13, 0.08)}

# Teeth: white crescents each side of the centre. x range, centre height at the
# inner end, how fast it rises toward the outside, and the half-height.
TEETH = {"x0": 0.95, "x1": 2.30, "h_inner": 5.95, "rise": 0.22, "half": 0.40}

# Base band ("rolled rim") and back waist band.
BAND_TOP = 1.5
BAND_OUT = 0.12
WAIST = {"h0": 4.85, "h1": 5.5, "out": 0.07, "max_z": -0.2}

# Arm: patch of side faces to extrude, and the path the arm follows.
# Each entry: (|x|, height, z, scale, material tag of the new wall faces)
ARM_PATCH = {"x_min": 2.3, "h0": 5.0, "h1": 6.5, "z0": 0.0, "z1": 1.30}
ARM_PATH = [
    (2.82, 6.05, 0.72, 1.04, "navy"),   # short collar so the shoulder blends into the body
    (2.95, 6.20, 0.75, 1.12, "navy"),   # shoulder / upper arm
    (3.00, 5.72, 0.95, 1.04, "navy"),   # elbow bulge
    (2.98, 5.28, 1.30, 0.88, "navy"),   # forearm
    (2.96, 5.02, 1.60, 0.84, "navy"),
    (2.94, 4.93, 1.74, 0.84, "sky"),    # cuff stripe 1
    (2.92, 4.86, 1.87, 0.82, "navy"),
    (2.90, 4.80, 2.00, 0.82, "sky"),    # cuff stripe 2
    (2.86, 4.74, 2.13, 0.80, "navy"),
    (2.78, 4.68, 2.27, 0.62, "skin"),   # wrist
    (2.70, 4.63, 2.47, 0.88, "skin"),   # back of fist
    (2.62, 4.59, 2.77, 0.96, "skin"),
    (2.58, 4.56, 3.04, 0.90, "skin"),   # knuckles
]
FINGER_BUMP = 0.07
FINGER_SHRINK = 0.80

# Handle (the olive "crown" on top). Heights, per-level boundaries; see build_handle.
HANDLE_LEVELS = [11.2, 12.7, 13.55, 14.2, 14.85]
HANDLE_BOUNDS = [                 # ascending z; one list per boundary, one value per level
    [-4.05, -4.05, -4.05, -4.15, -3.80],   # b0 end of the top bar (back)
    [-2.50, -3.00, -3.50, -3.60, -3.35],   # b1 back leg, outer edge
    [-1.92, -1.92, -1.92, -1.92, -1.92],   # b2 back leg, inner edge
    [-0.89, -0.89, -0.89, -0.89, -0.89],   # b3 centre post, back edge
    [0.15, 0.15, 0.15, 0.15, 0.15],        # b4 centre post, front edge
    [1.30, 1.30, 1.30, 1.30, 1.30],        # b5 front leg, inner edge
    [1.75, 2.50, 3.15, 3.25, 2.85],        # b6 front leg, outer edge / bar end
]
HANDLE_FILLED = {                 # cell columns (ascending z) that exist per row of cells
    0: (1, 3, 5), 1: (1, 3, 5), 2: (0, 1, 2, 3, 4, 5), 3: (0, 1, 2, 3, 4, 5),
}
HANDLE_THICK = (2.00, 1.45)       # X thickness at the bottom and at the top
HANDLE_X_CENTER = 0.10

# GO BELLS! decal wrapped around the lower front of the body.
DECAL = {"h0": 1.55, "h1": 3.02, "arc_deg": 118.0, "lift": 0.022}

# Colours sampled from the reference photo (sRGB 0-255). See docs.
PALETTE = {
    "navy":  (22, 42, 92),
    "sky":   (122, 170, 190),
    "olive": (84, 74, 46),
    "skin":  (198, 164, 110),
    "black": (24, 24, 26),
    "white": (240, 240, 236),
    "iris":  (44, 82, 170),
    "text":  (244, 244, 240),
}

# ---------------------------------------------------------------------------
# Small utilities
# ---------------------------------------------------------------------------


class BuildError(RuntimeError):
    """Raised with a message a student can act on."""


def log(msg):
    print("[BellMascot] " + msg)


def warn(msg):
    text = "[BellMascot] WARNING: " + msg
    if cmds is not None and hasattr(cmds, "warning"):
        cmds.warning(text)
    else:
        print(text)


def lerp(a, b, t):
    return a + (b - a) * t


def smoothstep(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)


def catmull(table, h):
    """Smooth interpolation through (height, value) knots (Catmull-Rom)."""
    if h <= table[0][0]:
        return table[0][1]
    if h >= table[-1][0]:
        return table[-1][1]
    for i in range(len(table) - 1):
        h0, v1 = table[i]
        h1, v2 = table[i + 1]
        if h0 <= h <= h1:
            v0 = table[i - 1][1] if i > 0 else v1
            v3 = table[i + 2][1] if i + 2 < len(table) else v2
            t = (h - h0) / (h1 - h0)
            return 0.5 * ((2 * v1) + (-v0 + v2) * t + (2 * v0 - 5 * v1 + 4 * v2 - v3) * t * t
                          + (-v0 + 3 * v1 - 3 * v2 + v3) * t ** 3)
    return table[-1][1]


def vsub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def vadd(a, b):
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def vscale(a, s):
    return (a[0] * s, a[1] * s, a[2] * s)


def vlen(a):
    return math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])


def vnorm(a):
    n = vlen(a)
    return (a[0] / n, a[1] / n, a[2] / n) if n > 1e-12 else (0.0, 0.0, 0.0)


def vcross(a, b):
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


def vdot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def vmean(points):
    n = float(len(points))
    return (sum(p[0] for p in points) / n, sum(p[1] for p in points) / n,
            sum(p[2] for p in points) / n)


def rotation_between(a, b):
    """3x3 matrix (rows) rotating unit vector a onto unit vector b."""
    a, b = vnorm(a), vnorm(b)
    v = vcross(a, b)
    c = vdot(a, b)
    if c < -0.999999:
        axis = vnorm(vcross(a, (1, 0, 0) if abs(a[0]) < 0.9 else (0, 1, 0)))
        x, y, z = axis
        return ((2 * x * x - 1, 2 * x * y, 2 * x * z), (2 * x * y, 2 * y * y - 1, 2 * y * z),
                (2 * x * z, 2 * y * z, 2 * z * z - 1))
    k = 1.0 / (1.0 + c)
    return (
        (v[0] * v[0] * k + c, v[0] * v[1] * k - v[2], v[0] * v[2] * k + v[1]),
        (v[1] * v[0] * k + v[2], v[1] * v[1] * k + c, v[1] * v[2] * k - v[0]),
        (v[2] * v[0] * k - v[1], v[2] * v[1] * k + v[0], v[2] * v[2] * k + c),
    )


def mat_apply(m, p):
    return (m[0][0] * p[0] + m[0][1] * p[1] + m[0][2] * p[2],
            m[1][0] * p[0] + m[1][1] * p[1] + m[1][2] * p[2],
            m[2][0] * p[0] + m[2][1] * p[1] + m[2][2] * p[2])


def squircle(u, w, power=SECTION_POWER):
    """Map a point of a square lattice (u, w in [-1, 1]) to a rounded cross-section.

    Points on the outside of the square land on a smooth rounded outline and the
    inner lattice squares become concentric rounded rings. This keeps clean quads."""
    m = max(abs(u), abs(w))
    if m < 1e-9:
        return 0.0, 0.0
    n = (abs(u) ** power + abs(w) ** power) ** (1.0 / power)
    return u / n * m, w / n * m


def srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


# ---------------------------------------------------------------------------
# Body shape functions (pure math: no Maya calls, so they can be tested offline)
# ---------------------------------------------------------------------------


def body_section(h):
    """Return (half_width_x, front_z, back_z) of the body at height h."""
    return catmull(HALF_WIDTH_X, h), catmull(FRONT_Z, h), catmull(BACK_Z, h)


def body_point(u, k, w):
    """Cube lattice coordinates -> position on the bell body.

    u, w in [-1, 1] across the cube; k is the row index (0 = bottom, SY = top)."""
    h = ROW_HEIGHTS[k]
    qx, qz = squircle(u, w)
    a, zf, zb = body_section(h)
    if k == SY:
        h += CAP_DOME * (1.0 - max(abs(u), abs(w)) ** 2)
    z = qz * (zf if qz >= 0 else zb)
    return (a * qx, h, z)


def surface_point_at_angle(theta_deg, h, lift=0.0):
    """Point on the outer body surface at a horizontal angle (0 = straight ahead)."""
    a, zf, zb = body_section(h)
    t = math.radians(theta_deg)
    s, c = math.sin(t), math.cos(t)
    e = 2.0 / SECTION_POWER
    x = a * math.copysign(abs(s) ** e, s)
    z = (zf if c >= 0 else zb) * math.copysign(abs(c) ** e, c)
    if lift:
        nx, nz = x / (a * a), z / ((zf if c >= 0 else zb) ** 2)
        n = math.sqrt(nx * nx + nz * nz)
        x += lift * nx / n
        z += lift * nz / n
    return (x, h, z)


def outward_xz(point, h):
    """Approximate horizontal outward normal of the body at a surface point."""
    a, zf, zb = body_section(h)
    zr = zf if point[2] >= 0 else zb
    nx, nz = point[0] / (a * a), point[2] / (zr * zr)
    n = math.sqrt(nx * nx + nz * nz) or 1.0
    return (nx / n, 0.0, nz / n)


def teeth_centre_height(ax):
    return TEETH["h_inner"] + TEETH["rise"] * (ax - TEETH["x0"])


def is_tooth(center):
    ax = abs(center[0])
    if center[2] < 1.2 or not (TEETH["x0"] <= ax <= TEETH["x1"]):
        return False
    return abs(center[1] - teeth_centre_height(ax)) < TEETH["half"]


# ---------------------------------------------------------------------------
# Mesh helpers (thin wrappers over maya.cmds)
# ---------------------------------------------------------------------------


def get_vertices(mesh):
    flat = cmds.xform(mesh + ".vtx[*]", query=True, translation=True, worldSpace=True)
    return [(flat[i], flat[i + 1], flat[i + 2]) for i in range(0, len(flat), 3)]


def set_vertex(mesh, index, p):
    cmds.xform("%s.vtx[%d]" % (mesh, index), translation=(p[0], p[1], p[2]), worldSpace=True)


def set_all_vertices(mesh, positions):
    for i, p in enumerate(positions):
        set_vertex(mesh, i, p)


def face_table(mesh):
    """{face index: [vertex indices]} read with polyInfo (independent of cube numbering)."""
    out = {}
    for line in cmds.polyInfo(mesh, faceToVertex=True) or []:
        head, tail = line.split(":")
        out[int(head.split()[-1])] = [int(t) for t in tail.split()]
    return out


def face_centers(mesh, verts=None, table=None):
    verts = verts if verts is not None else get_vertices(mesh)
    table = table if table is not None else face_table(mesh)
    return {f: vmean([verts[i] for i in vs]) for f, vs in table.items()}


def comp_indices(components, kind):
    pat = re.compile(r"\.%s\[(\d+)(?::(\d+))?\]" % kind)
    out = []
    for c in components:
        m = pat.search(c)
        if m:
            lo = int(m.group(1))
            hi = int(m.group(2)) if m.group(2) else lo
            out.extend(range(lo, hi + 1))
    return out


def face_names(mesh, ids):
    return ["%s.f[%d]" % (mesh, i) for i in ids]


def extrude_faces(mesh, face_ids, together=True):
    """Topology-only extrude (Mesh Edit > Extrude with zero distance).

    Returns (cap_face_ids, new_face_ids). Afterwards you move the cap's vertices
    yourself, which makes the result exactly repeatable."""
    before = set(face_table(mesh).keys())
    cmds.select(face_names(mesh, face_ids), replace=True)
    cmds.polyExtrudeFacet(keepFacesTogether=together)
    caps = comp_indices(cmds.ls(selection=True, flatten=True), "f")
    if not caps:
        raise BuildError("Extrude did not leave the new faces selected on %s." % mesh)
    cmds.delete(mesh, constructionHistory=True)
    after = set(face_table(mesh).keys())
    return sorted(caps), sorted((after - before) | set(caps))


def verts_of_faces(mesh, face_ids, table=None):
    table = table if table is not None else face_table(mesh)
    seen = []
    have = set()
    for f in face_ids:
        for v in table[f]:
            if v not in have:
                have.add(v)
                seen.append(v)
    return seen


def mesh_report(mesh):
    """Pure-Python geometry audit used for the verification report."""
    verts = get_vertices(mesh)
    table = face_table(mesh)
    edge_faces = {}
    degenerate = 0
    keys = {}
    dup_faces = 0
    for f, vs in table.items():
        if len(set(vs)) != len(vs):
            degenerate += 1
        key = tuple(sorted(vs))
        if key in keys:
            dup_faces += 1
        keys[key] = f
        for i in range(len(vs)):
            e = tuple(sorted((vs[i], vs[(i + 1) % len(vs)])))
            edge_faces[e] = edge_faces.get(e, 0) + 1
    borders = sum(1 for n in edge_faces.values() if n == 1)
    nonmanifold = sum(1 for n in edge_faces.values() if n > 2)
    volume = 0.0
    for f, vs in table.items():
        p0 = verts[vs[0]]
        for i in range(1, len(vs) - 1):
            volume += vdot(p0, vcross(verts[vs[i]], verts[vs[i + 1]])) / 6.0
    return {"mesh": mesh, "verts": len(verts), "faces": len(table), "open_edges": borders,
            "nonmanifold_edges": nonmanifold, "duplicate_faces": dup_faces,
            "degenerate_faces": degenerate, "signed_volume": volume}


def fix_closed_mesh_normals(mesh):
    """Reverse normals if the closed mesh is inside-out (negative signed volume)."""
    rep = mesh_report(mesh)
    if rep["open_edges"] == 0 and rep["signed_volume"] < 0:
        cmds.polyNormal(mesh, normalMode=0, constructionHistory=False)
        rep = mesh_report(mesh)
        log("%s: normals were reversed; flipped them (volume now %.3f)" % (mesh, rep["signed_volume"]))
    return rep


def sample_front_z(verts, x, h, radius=0.45):
    """Height-field lookup of the outermost front surface of a mesh at (x, h)."""
    near = [v for v in verts if v[2] > 0.3 and (v[0] - x) ** 2 + (v[1] - h) ** 2 < radius * radius]
    if not near:
        raise BuildError("No body surface found near x=%.2f h=%.2f; check the shape tables." % (x, h))
    zmax = max(v[2] for v in near)
    top = [v for v in near if v[2] > zmax - 0.3]
    wsum = zsum = 0.0
    for v in top:
        d = math.sqrt((v[0] - x) ** 2 + (v[1] - h) ** 2)
        wt = 1.0 / (d + 0.05)
        wsum += wt
        zsum += wt * v[2]
    return zsum / wsum


def smooth_preview(mesh, level):
    """Smooth Mesh Preview (key 3). The editable cage stays low-poly; render uses the smoothed shape."""
    shape = (cmds.listRelatives(mesh, shapes=True, fullPath=False) or [mesh])[0]
    for attr, val in (("displaySmoothMesh", 2), ("smoothLevel", level),
                      ("useSmoothPreviewForRender", 1), ("renderSmoothLevel", level),
                      ("aiSubdivType", 1), ("aiSubdivIterations", level)):
        if cmds.attributeQuery(attr, node=shape, exists=True):
            cmds.setAttr("%s.%s" % (shape, attr), val)


# ---------------------------------------------------------------------------
# 0. Project folders and scene safety
# ---------------------------------------------------------------------------


def resolve_project_root():
    root = PROJECT_ROOT or os.environ.get("BELL_MASCOT_PROJECT")
    if not root:
        try:
            root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        except NameError:
            root = None
    if not root:
        raise BuildError("Set PROJECT_ROOT at the top of the script to your project folder "
                         "(the folder that contains sourceimages/).")
    root = os.path.normpath(os.path.expanduser(root))
    needed = [os.path.join(root, "sourceimages", REF_FRONT["file"]),
              os.path.join(root, "sourceimages", REF_SIDE["file"]),
              os.path.join(root, "sourceimages", "texture_go_bells_decal.png")]
    missing = [p for p in needed if not os.path.isfile(p)]
    if missing:
        raise BuildError("These project files are missing:\n  " + "\n  ".join(missing) +
                         "\nCopy the complete project folder (including sourceimages/) and set PROJECT_ROOT.")
    return root


def setup_project(root):
    for sub in ("scenes", "sourceimages", "images"):
        path = os.path.join(root, sub)
        if not os.path.isdir(path):
            os.makedirs(path)
    cmds.workspace(root, openWorkspace=True)
    cmds.workspace(fileRule=["scene", "scenes"])
    cmds.workspace(fileRule=["sourceImages", "sourceimages"])
    cmds.workspace(fileRule=["images", "images"])
    log("Maya project set to %s" % root)


def start_clean_scene():
    if cmds.file(query=True, modified=True):
        raise BuildError("The open scene has unsaved changes. Save it (File > Save Scene As...) or "
                         "choose File > New Scene first, then run the script again. "
                         "Nothing was overwritten.")
    cmds.file(newFile=True, force=True)
    cmds.currentUnit(linear="cm")
    cmds.currentUnit(time="film")


def archive_if_exists(path):
    """Never overwrite: move an existing file into scenes/_archive/ with a timestamp."""
    if os.path.exists(path):
        folder = os.path.join(os.path.dirname(path), "_archive")
        if not os.path.isdir(folder):
            os.makedirs(folder)
        stamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        base, ext = os.path.splitext(os.path.basename(path))
        dest = os.path.join(folder, "%s.%s%s" % (base, stamp, ext))
        shutil.move(path, dest)
        log("Existing file kept as %s" % dest)


# ---------------------------------------------------------------------------
# 1. Reference image planes
# ---------------------------------------------------------------------------


def ref_scale(ref):
    return BODY_HEIGHT / (ref["ground_px"] - ref["cap_px"])


def make_image_plane(cam_shape, ref, name, root):
    k = ref_scale(ref)
    w_px, h_px = ref["size"]
    plane = cmds.imagePlane(camera=cam_shape, fileName=os.path.join(root, "sourceimages", ref["file"]), name=name)
    shape = plane[1]
    cmds.setAttr(shape + ".imageName", "sourceimages/" + ref["file"], type="string")   # project-relative
    cmds.setAttr(shape + ".fit", 4)                                  # To Size: keep aspect ratio
    cmds.setAttr(shape + ".width", w_px * k)
    cmds.setAttr(shape + ".height", h_px * k)
    for attr, want in (("sizeX", w_px * k), ("sizeY", h_px * k)):   # keep both size attributes in step
        if cmds.attributeQuery(attr, node=shape, exists=True) and abs(cmds.getAttr(shape + "." + attr) - want) > 1e-3:
            cmds.setAttr(shape + "." + attr, want)
    cmds.setAttr(shape + ".offsetX", (w_px / 2.0 - ref["axis_px"]) * k)
    cmds.setAttr(shape + ".offsetY", (ref["ground_px"] - h_px / 2.0) * k)
    cmds.setAttr(shape + ".displayMode", 3)                          # RGB
    cmds.setAttr(shape + ".alphaGain", 0.55)                         # see-through so the model shows
    cmds.setAttr(shape + ".displayOnlyIfCurrent", 1)                 # only in its own orthographic view
    cmds.setAttr(shape + ".depth", 900)
    return plane


def build_references(root):
    front = make_image_plane("frontShape", REF_FRONT, "ref_front_imagePlane", root)
    side = make_image_plane("sideShape", REF_SIDE, "ref_side_imagePlane", root)
    guides = []
    levels = (("ground", 0.0), ("eyeLevel", EYE_LEVEL), ("capTop", BODY_HEIGHT), ("handleTop", HANDLE_TOP))
    for label, h in levels:
        gx = cmds.curve(degree=1, point=[(-5.0, h, 0.0), (5.0, h, 0.0)], name="ref_guide_%s_X" % label)
        gz = cmds.curve(degree=1, point=[(0.0, h, -5.0), (0.0, h, 5.0)], name="ref_guide_%s_Z" % label)
        guides.extend([gx, gz])
    grp = cmds.group(guides, name="REFERENCES_grp")
    layer = cmds.createDisplayLayer(grp, name="REF_locked_layer", noRecurse=True)
    cmds.setAttr(layer + ".displayType", 2)       # Reference: visible but cannot be selected
    cmds.setAttr(layer + ".color", 13)
    log("Reference image planes attached to the front and side cameras; guides locked in %s" % layer)
    return {"front": front, "side": side, "group": grp, "layer": layer}


# ---------------------------------------------------------------------------
# 2. Body from a polygon cube
# ---------------------------------------------------------------------------


def build_body():
    """Step 1 of the character: a subdivided cube pushed into the bell shape.

    Every cube vertex is moved by body_point(): rows are lifted to ROW_HEIGHTS, each
    row is rounded into the bell cross-section, and the cap is domed. This is
    vertex editing driven by the measured front and side profiles."""
    body = cmds.polyCube(width=2, height=2, depth=2, subdivisionsX=SX, subdivisionsY=SY,
                         subdivisionsZ=SZ, name="bell_body_geo", constructionHistory=False)[0]
    verts = get_vertices(body)
    moved = []
    for (x, y, z) in verts:
        k = int(round((y + 1.0) / 2.0 * SY))
        moved.append(body_point(x, k, z))
    set_all_vertices(body, moved)
    log("Body: cube %dx%dx%d -> bell, %d vertices" % (SX, SY, SZ, len(moved)))
    return body


def soft_move(mesh, original, centre_xh, radius, delta):
    """Move vertices near (x, height) on the front surface with a soft falloff.

    Uses Maya's Soft Selection first. If this Maya build ignores soft selection from
    scripts, falls back to the same falloff computed in Python and says so."""
    cx, ch = centre_xh
    front = [(i, v) for i, v in enumerate(original) if v[2] > 0.3]
    i0, p0 = min(front, key=lambda iv: (iv[1][0] - cx) ** 2 + (iv[1][1] - ch) ** 2 + 0.01 * (iv[1][2] < 0.8))
    probe = None
    for i, v in front:
        d = vlen(vsub(v, p0))
        if i != i0 and 0.15 * radius < d < 0.7 * radius:
            probe = (i, v)
            break
    cmds.select("%s.vtx[%d]" % (mesh, i0), replace=True)
    cmds.softSelect(softSelectEnabled=True, softSelectDistance=radius, softSelectFalloff=0)
    cmds.move(delta[0], delta[1], delta[2], relative=True, worldSpace=True)
    cmds.softSelect(softSelectEnabled=False)
    cmds.select(clear=True)
    if probe is not None:
        now = cmds.xform("%s.vtx[%d]" % (mesh, probe[0]), query=True, translation=True, worldSpace=True)
        if vlen(vsub(tuple(now), probe[1])) > 1e-5:
            return True
    warn("Maya did not apply Soft Selection to the script move near x=%.2f h=%.2f; "
         "using an equivalent falloff computed in Python." % (cx, ch))
    for i, v in enumerate(original):
        d = vlen(vsub(v, p0))
        if d < radius:
            w = 1.0 - smoothstep(d / radius)
            set_vertex(mesh, i, vadd(v, vscale(delta, w)))
    return False


def sculpt_face(body):
    """Soft Selection sculpting: nose, cheeks, eye sockets, brow shelf, lip and belly."""
    for name, x, h, radius, delta in SCULPT:
        sides = (1,) if abs(x) < 1e-6 else (1, -1)
        for s in sides:
            original = get_vertices(body)
            soft_move(body, original, (x * s, h), radius, (delta[0] * s, delta[1], delta[2]))
    log("Face sculpted with soft selection: %s" % ", ".join(n for n, _, _, _, _ in SCULPT))


def extrude_with_vertex_fn(mesh, face_ids, move_fn, together=True):
    """Extrude faces, then move each cap vertex with move_fn(position) -> position."""
    caps, new = extrude_faces(mesh, face_ids, together=together)
    table = face_table(mesh)
    verts = get_vertices(mesh)
    for vi in verts_of_faces(mesh, caps, table):
        set_vertex(mesh, vi, move_fn(verts[vi]))
    return caps, new


def add_bands_and_teeth(body):
    """Face extrusions: rolled base rim, back waist stripe, raised teeth."""
    centers = face_centers(body)

    band = [f for f, c in centers.items() if 0.05 < c[1] < BAND_TOP and abs(c[0]) < 10]

    def out_band(p):
        n = outward_xz(p, max(p[1], 0.0))
        d = BAND_OUT * smoothstep(p[1] / 0.6)
        return (p[0] + n[0] * d, p[1], p[2] + n[2] * d)

    band_caps, _ = extrude_with_vertex_fn(body, band, out_band)
    border = cmds.polyListComponentConversion(face_names(body, band_caps), fromFace=True,
                                              toEdge=True, border=True)
    cmds.polyBevel3(cmds.ls(border, flatten=True), fraction=0.35, segments=2, constructionHistory=False)
    cmds.delete(body, constructionHistory=True)
    log("Base band extruded and edge-beveled (%d faces)" % len(band_caps))

    centers = face_centers(body)
    waist = [f for f, c in centers.items()
             if WAIST["h0"] < c[1] < WAIST["h1"] and c[2] < WAIST["max_z"] and c[1] > 4.0]

    def out_waist(p):
        n = outward_xz(p, p[1])
        return (p[0] + n[0] * WAIST["out"], p[1], p[2] + n[2] * WAIST["out"])

    extrude_with_vertex_fn(body, waist, out_waist)
    centers = face_centers(body)
    teeth = [f for f, c in centers.items() if is_tooth(c)]

    def out_tooth(p):
        n = outward_xz(p, p[1])
        return (p[0] + n[0] * 0.05, p[1], p[2] + n[2] * 0.05 + 0.02)

    extrude_with_vertex_fn(body, teeth, out_tooth)
    log("Waist stripe (%d faces) and teeth (%d faces) extruded" % (len(waist), len(teeth)))


def arm_patch_faces(mesh, sign):
    centers = face_centers(mesh)
    p = ARM_PATCH
    return [f for f, c in centers.items()
            if sign * c[0] > p["x_min"] and p["h0"] < c[1] < p["h1"] and p["z0"] < c[2] < p["z1"]]


def build_arm(body, sign):
    """Arms grow out of the body: extrude a patch of side faces step by step.

    Each ring of the arm is moved along ARM_PATH, rotated to follow the bend and scaled
    for the sleeve, cuff, wrist and fist. Because the arm is extruded from body faces,
    the attachment has no seam."""
    patch = arm_patch_faces(body, sign)
    if len(patch) < 8:
        raise BuildError("Arm patch selected only %d faces (expected about 12); check ARM_PATCH." % len(patch))
    verts = get_vertices(body)
    table = face_table(body)
    ring0 = verts_of_faces(body, patch, table)
    centre = vmean([verts[i] for i in ring0])
    direction = vnorm((centre[0], 0.0, centre[2] * 0.3))
    tags = {}
    cap_ids = patch
    for step, (ax, h, z, s, tag) in enumerate(ARM_PATH):
        target = (sign * ax, h, z)
        nxt = ARM_PATH[step + 1] if step + 1 < len(ARM_PATH) else None
        move_dir = vnorm(vsub(target, centre))
        if nxt:
            ahead = vnorm(vsub((sign * nxt[0], nxt[1], nxt[2]), target))
            new_dir = vnorm(vadd(move_dir, ahead))
        else:
            new_dir = move_dir
        rot = rotation_between(direction, new_dir)
        prev_scale = ARM_PATH[step - 1][3] if step else 1.0
        ratio = s / prev_scale
        caps, new = extrude_faces(body, cap_ids)
        table = face_table(body)
        verts = get_vertices(body)
        ids = verts_of_faces(body, caps, table)
        cen = vmean([verts[i] for i in ids])
        for vi in ids:
            local = mat_apply(rot, vscale(vsub(verts[vi], cen), ratio))
            set_vertex(body, vi, vadd(target, local))
        for f in new:
            tags[f] = tag
        cap_ids, centre, direction = caps, target, new_dir
    caps, new = extrude_faces(body, cap_ids, together=False)
    table = face_table(body)
    verts = get_vertices(body)
    for f in caps:
        pts = [verts[i] for i in table[f]]
        fc = vmean(pts)
        for vi in table[f]:
            moved = vadd(fc, vscale(vsub(verts[vi], fc), FINGER_SHRINK))
            set_vertex(body, vi, vadd(moved, vscale(direction, FINGER_BUMP)))
    for f in new:
        tags[f] = "skin"
    log("Arm %s built from %d patch faces through %d extrusions + finger bumps"
        % ("+X" if sign > 0 else "-X", len(patch), len(ARM_PATH)))
    return tags


# ---------------------------------------------------------------------------
# 3. Separate parts: handle, brows, eyes, GO BELLS! decal
# ---------------------------------------------------------------------------


def build_handle():
    """Olive crown handle: a flat grid with window holes, extruded for thickness.

    Delete the cells that are windows, extrude the whole remaining sheet (that makes
    the side walls of every window), then give it taper. Smooth Mesh Preview rounds it."""
    ncols = len(HANDLE_BOUNDS) - 1
    nrows = len(HANDLE_LEVELS) - 1
    name = cmds.polyPlane(width=ncols, height=nrows, subdivisionsX=ncols, subdivisionsY=nrows,
                          axis=(1, 0, 0), name="bell_handle_half_geo", constructionHistory=False)[0]
    verts = get_vertices(name)
    ys = sorted(set(round(v[1], 3) for v in verts))
    zs = sorted(set(round(v[2], 3) for v in verts))
    if len(zs) == ncols + 1 and len(ys) == nrows + 1:
        col_axis, row_axis = 2, 1
    elif len(ys) == ncols + 1 and len(zs) == nrows + 1:
        col_axis, row_axis = 1, 2
    else:
        raise BuildError("Unexpected handle grid layout (%d x %d unique coordinates)." % (len(ys), len(zs)))
    col_vals = sorted(set(round(v[col_axis], 3) for v in verts))
    row_vals = sorted(set(round(v[row_axis], 3) for v in verts))

    def lattice(v):
        return col_vals.index(round(v[col_axis], 3)), row_vals.index(round(v[row_axis], 3))

    table = face_table(name)
    centers = face_centers(name, verts, table)
    doomed = []
    for f, c in centers.items():
        ci = min(range(ncols), key=lambda i: abs(0.5 * (col_vals[i] + col_vals[i + 1]) - c[col_axis]))
        ri = min(range(nrows), key=lambda i: abs(0.5 * (row_vals[i] + row_vals[i + 1]) - c[row_axis]))
        if ci not in HANDLE_FILLED[ri]:
            doomed.append(f)
    cmds.delete(face_names(name, doomed))
    cmds.delete(name, constructionHistory=True)

    verts = get_vertices(name)
    for i, v in enumerate(verts):
        ci, ri = lattice(v)
        z = HANDLE_BOUNDS[ci][ri]
        h = HANDLE_LEVELS[ri]
        s = (z + 0.4) / 3.5
        if ri == 4:
            h -= 0.55 * s * s
        elif ri == 3:
            h -= 0.30 * s * s
        set_vertex(name, i, (0.0, h, z))
    table = face_table(name)
    all_faces = sorted(table.keys())
    caps, _ = extrude_faces(name, all_faces)
    table = face_table(name)
    verts = get_vertices(name)
    cap_verts = set(verts_of_faces(name, caps, table))
    for i, v in enumerate(verts):
        t = (v[1] - HANDLE_LEVELS[0]) / (HANDLE_TOP - HANDLE_LEVELS[0])
        thick = lerp(HANDLE_THICK[0], HANDLE_THICK[1], max(0.0, min(1.0, t)))
        set_vertex(name, i, ((0.5 * thick) if i in cap_verts else 0.0, v[1], v[2]))
    # The extruded sheet is a tray that is open at x = 0. Mirror it across x = 0 (symmetry),
    # unite the halves and merge the vertices along the seam to get a closed slab.
    mirror = cmds.duplicate(name, name="bell_handle_mirror_tmp")[0]
    for i, v in enumerate(get_vertices(mirror)):
        set_vertex(mirror, i, (-v[0], v[1], v[2]))
    cmds.polyNormal(mirror, normalMode=0, constructionHistory=False)
    united = cmds.polyUnite(name, mirror, name="bell_handle_geo", constructionHistory=False)[0]
    cmds.polyMergeVertex(united + ".vtx[*]", distance=0.001, constructionHistory=False)
    cmds.delete(united, constructionHistory=True)
    name = cmds.rename(united, "bell_handle_geo")
    for i, v in enumerate(get_vertices(name)):
        set_vertex(name, i, (v[0] + HANDLE_X_CENTER, v[1], v[2]))
    fix_closed_mesh_normals(name)
    smooth_preview(name, 2)
    log("Handle: grid with %d window faces removed, extruded for thickness" % len(doomed))
    return name


def build_brow(sign, front_verts):
    cube = cmds.polyCube(width=1, height=1, depth=1, subdivisionsX=14, subdivisionsY=2,
                         subdivisionsZ=2, name="bell_brow_%s_geo" % ("L" if sign < 0 else "R"),
                         constructionHistory=False)[0]
    # base the path on measured surface so the brow sits on the face
    pts = []
    for (ax, h) in BROW_PATH:
        x = sign * ax
        pts.append((x, h, sample_front_z(front_verts, x, h) + 0.06))
    seg = []
    total = 0.0
    for i in range(len(pts) - 1):
        total += vlen(vsub(pts[i + 1], pts[i]))
        seg.append(total)

    def centre_at(s):
        d = s * total
        i = 0
        while i < len(seg) - 1 and d > seg[i]:
            i += 1
        lo = seg[i - 1] if i else 0.0
        t = (d - lo) / (seg[i] - lo)
        a, b = pts[i], pts[i + 1]
        return (vadd(a, vscale(vsub(b, a), t)), vnorm(vsub(b, a)))

    verts = get_vertices(cube)
    out = []
    for (u, v, w) in verts:
        s = u + 0.5
        c, tan = centre_at(max(0.0, min(1.0, s)))
        up = vnorm(vcross((0, 0, 1), tan))
        if up[1] < 0:
            up = vscale(up, -1)
        thick = 0.50 + 0.42 * math.sin(math.pi * s) ** 0.7
        depth = 0.62
        qv, qw = squircle(v * 2.0, w * 2.0, 2.2)
        p = vadd(c, vadd(vscale(up, qv * 0.5 * thick), (0.0, 0.0, qw * 0.5 * depth)))
        out.append(p)
    set_all_vertices(cube, out)
    fix_closed_mesh_normals(cube)
    smooth_preview(cube, 2)
    return cube


def build_eye_part(name, centre, radii, tilt_deg, sign, offset=(0, 0, 0)):
    sphere = cmds.polySphere(radius=1, subdivisionsX=16, subdivisionsY=12, name=name,
                             constructionHistory=False)[0]
    t = math.radians(tilt_deg * sign)
    c, s = math.cos(t), math.sin(t)
    out = []
    for (x, y, z) in get_vertices(sphere):
        x, y, z = x * radii[0], y * radii[1], z * radii[2]
        rx, ry = x * c - y * s, x * s + y * c
        out.append((centre[0] + rx, centre[1] + ry, centre[2] + z))
    set_all_vertices(sphere, out)
    fix_closed_mesh_normals(sphere)
    return sphere


def build_eyes(front_verts):
    parts = {}
    for sign in (1, -1):
        side = "R" if sign > 0 else "L"
        x = EYE["x"] * sign
        z = sample_front_z(front_verts, x, EYE["h"])
        rz = EYE["radii"][2]
        centre = (x, EYE["h"], z + 0.02)
        parts["sclera_" + side] = build_eye_part("bell_eye_%s_geo" % side, centre, EYE["radii"], EYE["tilt"], sign)
        iris_c = (x - sign * 0.07, EYE["h"] - 0.02, z + 0.02 + rz * 0.86)
        parts["iris_" + side] = build_eye_part("bell_iris_%s_geo" % side, iris_c, EYE["iris"], 0.0, sign)
        pupil_c = (iris_c[0], iris_c[1], iris_c[2] + EYE["iris"][2] * 0.80)
        parts["pupil_" + side] = build_eye_part("bell_pupil_%s_geo" % side, pupil_c, EYE["pupil"], 0.0, sign)
    log("Eyes: sclera, iris and pupil spheres placed on the sculpted sockets")
    return parts


def build_decal():
    """'GO BELLS!' as a transparent-texture strip that hugs the lower front of the body."""
    cols, rows = 30, 6
    plane = cmds.polyPlane(width=1, height=1, subdivisionsX=cols, subdivisionsY=rows,
                           axis=(0, 1, 0), name="bell_text_decal_geo", constructionHistory=False)[0]
    verts = get_vertices(plane)
    xs = sorted(set(round(v[0], 4) for v in verts))
    zs = sorted(set(round(v[2], 4) for v in verts))
    if len(xs) != cols + 1 or len(zs) != rows + 1:
        raise BuildError("Unexpected decal grid layout.")
    out = []
    uvs = []
    for (x, y, z) in verts:
        u = xs.index(round(x, 4)) / float(cols)
        v = zs.index(round(z, 4)) / float(rows)
        theta = lerp(-DECAL["arc_deg"] / 2.0, DECAL["arc_deg"] / 2.0, u)
        h = lerp(DECAL["h0"], DECAL["h1"], v)
        out.append(surface_point_at_angle(theta, h, DECAL["lift"]))
        uvs.append((u, v))
    set_all_vertices(plane, out)
    for i, (u, v) in enumerate(uvs):
        uv = cmds.polyListComponentConversion("%s.vtx[%d]" % (plane, i), fromVertex=True, toUV=True)
        cmds.polyEditUV(uv, uValue=u, vValue=v, relative=False)
    # Make sure the strip faces outward (a flat sheet has no inside to test, so use one face).
    table = face_table(plane)
    verts = get_vertices(plane)
    f0 = sorted(table)[len(table) // 2]
    vs = [verts[i] for i in table[f0]]
    n = vcross(vsub(vs[1], vs[0]), vsub(vs[2], vs[0]))
    cen = vmean(vs)
    if vdot(n, (cen[0], 0.0, cen[2])) < 0:
        cmds.polyNormal(plane, normalMode=0, constructionHistory=False)
    return plane


# ---------------------------------------------------------------------------
# 4. Materials
# ---------------------------------------------------------------------------


def color_managed():
    try:
        return bool(cmds.colorManagementPrefs(query=True, cmEnabled=True))
    except Exception:
        return False


def make_lambert(name, rgb255, converter):
    mat = cmds.shadingNode("lambert", asShader=True, name=name)
    sg = cmds.sets(renderable=True, noSurfaceShader=True, empty=True, name=name + "SG")
    cmds.connectAttr(mat + ".outColor", sg + ".surfaceShader", force=True)
    r, g, b = [converter(c) for c in rgb255]
    cmds.setAttr(mat + ".color", r, g, b, type="double3")
    cmds.setAttr(mat + ".diffuse", 0.85)
    return mat, sg


def build_materials():
    conv = srgb_to_linear if color_managed() else (lambda c: c / 255.0)
    spec = [
        ("navy", "mtl_body_navy_lambert", PALETTE["navy"]),
        ("sky", "mtl_band_skyBlue_lambert", PALETTE["sky"]),
        ("olive", "mtl_handle_olive_lambert", PALETTE["olive"]),
        ("skin", "mtl_hand_tan_lambert", PALETTE["skin"]),
        ("black", "mtl_brow_black_lambert", PALETTE["black"]),
        ("white", "mtl_teeth_eyeWhite_lambert", PALETTE["white"]),
        ("iris", "mtl_iris_blue_lambert", PALETTE["iris"]),
        ("text", "mtl_text_goBells_lambert", PALETTE["text"]),
        ("pupil", "mtl_pupil_black_lambert", PALETTE["black"]),
        ("platform", "mtl_platform_whiteBlue_lambert", (214, 222, 236)),
        ("backdrop", "mtl_backdrop_softGrey_lambert", (190, 198, 210)),
    ]
    out = {}
    for key, name, rgb in spec:
        out[key] = make_lambert(name, rgb, conv)
    mat, sg = out["text"]
    tex = cmds.shadingNode("file", asTexture=True, isColorManaged=True, name="tex_goBells_decal")
    cmds.setAttr(tex + ".fileTextureName", "sourceimages/texture_go_bells_decal.png", type="string")
    place = cmds.shadingNode("place2dTexture", asUtility=True, name="tex_goBells_place2d")
    for attr in ("coverage", "translateFrame", "rotateFrame", "mirrorU", "mirrorV", "stagger", "wrapU",
                 "wrapV", "repeatUV", "offset", "rotateUV", "noiseUV", "vertexUvOne", "vertexUvTwo",
                 "vertexUvThree", "vertexCameraOne"):
        cmds.connectAttr("%s.%s" % (place, attr), "%s.%s" % (tex, attr), force=True)
    cmds.connectAttr(place + ".outUV", tex + ".uvCoord", force=True)
    cmds.connectAttr(place + ".outUvFilterSize", tex + ".uvFilterSize", force=True)
    cmds.connectAttr(tex + ".outColor", mat + ".color", force=True)
    cmds.connectAttr(tex + ".outTransparency", mat + ".transparency", force=True)
    log("Materials: %d Lambert shaders created (incl. textured decal)" % len(out))
    return out


def assign(sg, comps):
    cmds.sets(comps, edit=True, forceElement=sg)


def assign_body_materials(body, mats, arm_tags):
    """Whole body navy, then override faces by what they are (teeth, bands, sleeves, hands)."""
    centers = face_centers(body)
    assign(mats["navy"][1], body)
    sky, white, skin = [], [], []
    for f, c in centers.items():
        if f in arm_tags:
            continue
        if 0.0 < c[1] < BAND_TOP + 0.06:
            sky.append(f)
        elif WAIST["h0"] - 0.02 < c[1] < WAIST["h1"] + 0.02 and c[2] < WAIST["max_z"] and c[1] > 4.0:
            sky.append(f)
        elif is_tooth(c):
            white.append(f)
    for f, tag in arm_tags.items():
        {"sky": sky, "skin": skin}.get(tag, []).append(f)
    # faces of the band that bulge out (ledge walls) sit just above BAND_TOP; include them
    for key, faces in (("sky", sky), ("white", white), ("skin", skin)):
        if faces:
            assign(mats[key][1], face_names(body, faces))
    log("Body materials: %d sky-blue, %d white, %d tan faces; rest navy" % (len(sky), len(white), len(skin)))


# ---------------------------------------------------------------------------
# 5. Presentation scene: stage, camera, lights
# ---------------------------------------------------------------------------


def build_stage(mats):
    plat = cmds.polyCylinder(radius=5.6, height=0.5, subdivisionsX=64, subdivisionsY=1,
                             subdivisionsZ=1, name="stage_platform_geo", constructionHistory=False)[0]
    set_all_vertices(plat, [(x, y - 0.25, z) for (x, y, z) in get_vertices(plat)])
    cmds.polyBevel3(plat + ".e[*]", fraction=0.18, segments=2, constructionHistory=False)
    cmds.delete(plat, constructionHistory=True)
    assign(mats["platform"][1], plat)

    rows = 36
    cyc = cmds.polyPlane(width=1, height=1, subdivisionsX=1, subdivisionsY=rows, axis=(0, 1, 0),
                         name="stage_backdrop_geo", constructionHistory=False)[0]
    profile = []
    floor_y, wall_z, radius = -0.5, -34.0, 16.0
    floor_pts = 12
    for i in range(floor_pts):
        profile.append((floor_y, lerp(90.0, wall_z + radius, i / float(floor_pts))))
    arc_pts = 12
    for i in range(arc_pts + 1):
        a = math.radians(90.0 * i / arc_pts)
        profile.append((floor_y + radius - radius * math.cos(a), wall_z + radius - radius * math.sin(a)))
    for i in range(1, rows + 1 - len(profile) + 1):
        profile.append((profile[-1][0] + 8.0, wall_z))
    profile = profile[:rows + 1]
    verts = get_vertices(cyc)
    zs = sorted(set(round(v[2], 4) for v in verts))
    out = []
    for (x, y, z) in verts:
        row = zs.index(round(z, 4))
        py, pz = profile[len(profile) - 1 - row]
        out.append((x * 260.0, py, pz))
    set_all_vertices(cyc, out)
    assign(mats["backdrop"][1], cyc)
    table = face_table(cyc)
    verts = get_vertices(cyc)
    f0 = sorted(table)[0]
    vs = [verts[i] for i in table[f0]]
    n = vcross(vsub(vs[1], vs[0]), vsub(vs[2], vs[0]))
    if n[1] < 0:
        cmds.polyNormal(cyc, normalMode=0, constructionHistory=False)
    log("Stage: beveled platform + seamless backdrop")
    return plat, cyc


def aim_angles(direction):
    """Rotation (rx, ry) in degrees so a node that looks down -Z points along direction."""
    d = vnorm(direction)
    rx = math.degrees(math.asin(max(-1.0, min(1.0, d[1]))))
    ry = math.degrees(math.atan2(-d[0], -d[2]))
    return rx, ry


def build_camera():
    target = (0.0, 7.5, 0.0)
    el = math.radians(CAMERA_ELEVATION_DEG)
    az = math.radians(CAMERA_AZIMUTH_DEG)
    aspect = RENDER_WIDTH / float(RENDER_HEIGHT)
    film_w = 1.41732                          # inches (36 mm)
    film_h = film_w / aspect
    vfov = 2.0 * math.atan((film_h * 25.4 / 2.0) / CAMERA_FOCAL_MM)
    height_needed = (HANDLE_TOP + 0.8) * 1.22   # whole character plus ~10% breathing room top and bottom
    dist = (height_needed / 2.0) / math.tan(vfov / 2.0) / math.cos(el) * 1.02
    pos = (target[0] + dist * math.sin(az) * math.cos(el), target[1] + dist * math.sin(el),
           target[2] + dist * math.cos(az) * math.cos(el))
    cam = cmds.camera(name="bell_render_cam")
    xform, shape = cam[0], cam[1]
    cmds.setAttr(shape + ".focalLength", CAMERA_FOCAL_MM)
    cmds.setAttr(shape + ".horizontalFilmAperture", film_w)
    cmds.setAttr(shape + ".verticalFilmAperture", film_h)
    cmds.setAttr(shape + ".nearClipPlane", 1.0)
    cmds.setAttr(shape + ".farClipPlane", 1500.0)
    cmds.setAttr(shape + ".displayResolution", 1)
    cmds.setAttr(shape + ".displayGateMask", 1)
    cmds.setAttr(shape + ".overscan", 1.0)
    rx, ry = aim_angles(vsub(target, pos))
    cmds.xform(xform, worldSpace=True, translation=pos)
    cmds.setAttr(xform + ".rotateX", rx)
    cmds.setAttr(xform + ".rotateY", ry)
    cmds.setAttr(xform + ".rotateZ", 0)
    log("Render camera: %.0f mm lens, %.1f units away, azimuth %.0f deg, elevation %.0f deg"
        % (CAMERA_FOCAL_MM, dist, CAMERA_AZIMUTH_DEG, CAMERA_ELEVATION_DEG))
    return xform, shape


def detect_renderer():
    """Pick a renderer that actually exists in this Maya."""
    try:
        if not cmds.pluginInfo("mtoa", query=True, loaded=True):
            cmds.loadPlugin("mtoa", quiet=True)
        if cmds.pluginInfo("mtoa", query=True, loaded=True):
            return "arnold"
    except Exception:
        pass
    renderers = cmds.renderer(query=True, namesOfAvailableRenderers=True) or []
    if "mayaSoftware" in renderers:
        return "mayaSoftware"
    raise BuildError("Neither Arnold (mtoa) nor Maya Software is available in this Maya. "
                     "Available renderers: %s" % ", ".join(renderers))


def light_transform(node):
    if cmds.nodeType(node) == "transform":
        return node
    return cmds.listRelatives(node, parent=True)[0]


def place_light(node, name, position, target, color=(1, 1, 1)):
    xf = cmds.rename(light_transform(node), name)
    cmds.xform(xf, worldSpace=True, translation=position)
    rx, ry = aim_angles(vsub(target, position))
    cmds.setAttr(xf + ".rotateX", rx)
    cmds.setAttr(xf + ".rotateY", ry)
    shape = cmds.listRelatives(xf, shapes=True)[0]
    cmds.setAttr(shape + ".color", color[0], color[1], color[2], type="double3")
    return xf, shape


def build_lights(renderer):
    tune = LIGHT_TUNE[renderer]
    target = (0.0, 7.0, 0.0)
    lights = []
    key = cmds.directionalLight()
    kx, ks = place_light(key, "light_key_dir", (22.0, 30.0, 26.0), target, (1.0, 0.96, 0.9))
    fill = cmds.directionalLight()
    fx, fs = place_light(fill, "light_fill_dir", (-26.0, 12.0, 20.0), target, (0.86, 0.92, 1.0))
    rim = cmds.directionalLight()
    rx_, rs = place_light(rim, "light_rim_dir", (-10.0, 20.0, -30.0), target, (0.9, 0.95, 1.0))
    for shape, val in ((ks, tune["key"]), (fs, tune["fill"]), (rs, tune["rim"])):
        cmds.setAttr(shape + ".intensity", val)
    lights.extend([kx, fx, rx_])
    if renderer == "arnold":
        for shape, angle in ((ks, 3.5), (fs, 8.0), (rs, 4.0)):
            if cmds.attributeQuery("aiAngle", node=shape, exists=True):
                cmds.setAttr(shape + ".aiAngle", angle)
        sky = cmds.shadingNode("aiSkyDomeLight", asLight=True)
        sx = cmds.rename(light_transform(sky), "light_sky_dome")
        sshape = cmds.listRelatives(sx, shapes=True)[0]
        cmds.setAttr(sshape + ".intensity", tune["sky"])
        cmds.setAttr(sshape + ".color", 0.82, 0.9, 1.0, type="double3")
        if cmds.attributeQuery("camera", node=sshape, exists=True):
            cmds.setAttr(sshape + ".camera", 0)       # lights the scene, invisible to the camera
        lights.append(sx)
    else:
        cmds.setAttr(ks + ".useRayTraceShadows", 1)
        cmds.setAttr(ks + ".lightAngle", 3.0)
        cmds.setAttr(ks + ".shadowRays", 24)
        cmds.setAttr(fs + ".useRayTraceShadows", 1)
        cmds.setAttr(fs + ".lightAngle", 8.0)
        cmds.setAttr(fs + ".shadowRays", 12)
        amb = cmds.ambientLight()
        ax_ = cmds.rename(light_transform(amb), "light_ambient_soft")
        ashape = cmds.listRelatives(ax_, shapes=True)[0]
        cmds.setAttr(ashape + ".intensity", tune["ambient"])
        cmds.setAttr(ashape + ".color", 0.85, 0.9, 1.0, type="double3")
        lights.append(ax_)
    log("Lights (%s): key, fill, rim%s" % (renderer, " + sky dome" if renderer == "arnold" else " + ambient"))
    return lights


def configure_render(renderer, camera_shape):
    prefix = STUDENT_PREFIX + "-final"
    for cam in cmds.ls(type="camera"):
        cmds.setAttr(cam + ".renderable", 1 if cam == camera_shape else 0)
    cmds.setAttr("defaultResolution.width", RENDER_WIDTH)
    cmds.setAttr("defaultResolution.height", RENDER_HEIGHT)
    cmds.setAttr("defaultResolution.pixelAspect", 1.0)
    cmds.setAttr("defaultResolution.deviceAspectRatio", RENDER_WIDTH / float(RENDER_HEIGHT))
    cmds.setAttr("defaultRenderGlobals.currentRenderer", renderer, type="string")
    cmds.setAttr("defaultRenderGlobals.imageFormat", 32)                      # PNG
    cmds.setAttr("defaultRenderGlobals.imageFilePrefix", prefix, type="string")
    cmds.setAttr("defaultRenderGlobals.animation", 0)
    if renderer == "arnold":
        try:
            import mtoa.core as mtoa_core
            mtoa_core.createOptions()                       # make sure the Arnold option nodes exist
        except Exception:
            pass
        try:
            cmds.setAttr("defaultArnoldDriver.aiTranslator", "png", type="string")
            cmds.setAttr("defaultArnoldRenderOptions.AASamples", 4)
            cmds.setAttr("defaultArnoldRenderOptions.GIDiffuseSamples", 2)
            cmds.setAttr("defaultArnoldRenderOptions.abortOnError", 0)
        except Exception as exc:  # pragma: no cover - depends on mtoa version
            warn("Could not set some Arnold options: %s" % exc)
    else:
        cmds.setAttr("defaultRenderQuality.enableRaytracing", 1)            # needed for shadows
        cmds.setAttr("defaultRenderQuality.edgeAntiAliasing", 0)            # highest quality
        cmds.setAttr("defaultRenderQuality.shadingSamples", 4)
        cmds.setAttr("defaultRenderQuality.maxShadingSamples", 16)
    return prefix


# ---------------------------------------------------------------------------
# 6. Outliner organisation
# ---------------------------------------------------------------------------


def organise(parts):
    """Group everything and name the groups clearly. parts is a dict of lists of nodes."""
    groups = {}
    face_nodes = parts["face"]
    groups["face"] = cmds.group(face_nodes, name="face_features_grp")
    char_nodes = [parts["body"], parts["handle"], groups["face"], parts["decal"]]
    groups["character"] = cmds.group(char_nodes, name="CHARACTER_grp")
    groups["environment"] = cmds.group(parts["environment"], name="ENVIRONMENT_grp")
    groups["lights"] = cmds.group(parts["lights"], name="LIGHTS_grp")
    groups["cameras"] = cmds.group(parts["cameras"], name="CAMERAS_grp")
    for g in ("CHARACTER_grp", "ENVIRONMENT_grp", "LIGHTS_grp", "CAMERAS_grp"):
        cmds.xform(g, pivots=(0, 0, 0), worldSpace=True)
    return groups


# ---------------------------------------------------------------------------
# 7. Verification, render, save
# ---------------------------------------------------------------------------


def png_info(path):
    with open(path, "rb") as fh:
        head = fh.read(33)
    if head[:8] != b"\x89PNG\r\n\x1a\n":
        raise BuildError("%s is not a real PNG file." % path)
    return struct.unpack(">II", head[16:24])


def find_render_output(images_dir, prefix):
    hits = [os.path.join(images_dir, f) for f in os.listdir(images_dir)
            if f.startswith(prefix) and f.lower().endswith(".png")]
    return max(hits, key=os.path.getmtime) if hits else None


def render_png(root, camera, prefix, renderer):
    images = os.path.join(root, "images")
    target = os.path.join(images, prefix + ".png")
    archive_if_exists(target)
    if not os.path.isdir(os.path.join(images, "_archive")):
        pass
    batch = bool(cmds.about(batch=True))
    if renderer == "arnold":
        try:
            cmds.arnoldRender(camera=camera, width=RENDER_WIDTH, height=RENDER_HEIGHT, batch=batch)
        except TypeError:
            cmds.render(camera)
    else:
        cmds.render(camera, x=RENDER_WIDTH, y=RENDER_HEIGHT)
    produced = find_render_output(images, prefix)
    if produced is None and not batch:
        cmds.renderWindowEditor("renderView", edit=True, writeImage=target)
        produced = target if os.path.isfile(target) else None
    if produced is None:
        raise BuildError("The render ran but no PNG appeared in %s. In the Render View use "
                         "File > Save Image... and save it there as \"%s.png\"." % (images, prefix))
    if produced != target:
        shutil.move(produced, target)
    w, h = png_info(target)
    log("Rendered %s (%d x %d)" % (target, w, h))
    return target


def save_scene(path, label):
    archive_if_exists(path)
    cmds.file(rename=path)
    cmds.file(save=True, type="mayaBinary")
    size = os.path.getsize(path)
    with open(path, "rb") as fh:
        magic = fh.read(4)
    if magic[:2] == b"//":
        raise BuildError("%s was written as Maya ASCII text, not binary (.mb). Use File > Save Scene As, "
                         "type 'Maya Binary', with the same name." % path)
    if magic not in (b"FOR4", b"FOR8"):
        warn("%s has an unexpected file header %r; open it in Maya to confirm it is a binary scene." % (path, magic))
    log("Saved %s: %s (%d bytes)" % (label, path, size))


def material_report(meshes):
    lines = []
    for sg in cmds.ls(type="shadingEngine"):
        if sg in ("initialShadingGroup", "initialParticleSE"):
            continue
        members = cmds.sets(sg, query=True) or []
        mats = cmds.listConnections(sg + ".surfaceShader") or []
        lines.append((mats[0] if mats else "?", cmds.nodeType(mats[0]) if mats else "?", len(members)))
    return lines


def verify_scene(meshes, root, open_ok=()):
    """open_ok lists meshes that are intentionally open sheets (the text decal)."""
    problems = []
    log("---- GEOMETRY CHECKS ----")
    for m in meshes:
        rep = mesh_report(m)
        log("%-22s verts %5d faces %5d open edges %d non-manifold %d duplicate faces %d degenerate %d volume %.2f"
            % (rep["mesh"], rep["verts"], rep["faces"], rep["open_edges"], rep["nonmanifold_edges"],
               rep["duplicate_faces"], rep["degenerate_faces"], rep["signed_volume"]))
        is_open_ok = m in open_ok
        if ((rep["open_edges"] and not is_open_ok) or rep["nonmanifold_edges"]
                or rep["duplicate_faces"] or rep["degenerate_faces"]):
            problems.append("%s has topology problems (see log line above)" % m)
        if not is_open_ok and rep["signed_volume"] <= 0:
            problems.append("%s normals point inward" % m)
    log("---- MATERIALS ----")
    lambert_count = 0
    for name, node_type, count in material_report(meshes):
        log("%-34s %-8s %d assigned members" % (name, node_type, count))
        if node_type == "lambert":
            lambert_count += 1
    if lambert_count == 0:
        problems.append("No Lambert material exists")
    stray = cmds.sets("initialShadingGroup", query=True) or []
    stray = [s for s in stray if any(s.startswith(m) for m in meshes)]
    if stray:
        problems.append("These visible parts still use the default material: %s" % ", ".join(stray[:6]))
    log("---- ASSETS ----")
    for attr_node, attr in (("ref_front_imagePlane", "imageName"), ("ref_side_imagePlane", "imageName")):
        for node in cmds.ls(type="imagePlane"):
            val = cmds.getAttr(node + ".imageName")
            path = os.path.join(root, val) if not os.path.isabs(val) else val
            if not os.path.isfile(path):
                problems.append("Image plane file missing: %s" % path)
        break
    return problems


def reopen_check(path):
    cmds.file(path, open=True, force=True)
    missing = []
    try:
        unresolved = cmds.filePathEditor(query=True, listFiles="", withAttribute=True, unresolved=True) or []
        missing = list(unresolved)
    except Exception as exc:  # pragma: no cover
        warn("filePathEditor query failed: %s" % exc)
    planes = cmds.ls(type="imagePlane")
    log("Re-opened %s: %d image planes, %d unresolved file paths" % (os.path.basename(path), len(planes), len(missing) // 2))
    return missing


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------


def live_tick():
    """Redraw the viewport and pause, so a person watching Maya sees each step appear."""
    if LIVE_DELAY > 0 and not cmds.about(batch=True):
        cmds.refresh(force=True)
        time.sleep(LIVE_DELAY)


def focus_viewport():
    """Point the perspective view at the mascot with smooth shading (viewport only, not the render camera)."""
    try:
        target = (0.0, 7.4, 0.0)
        pos = (30.0, 14.0, 44.0)
        rx, ry = aim_angles(vsub(target, pos))
        cmds.xform("persp", worldSpace=True, translation=pos)
        cmds.setAttr("persp.rotateX", rx)
        cmds.setAttr("persp.rotateY", ry)
        cmds.setAttr("persp.rotateZ", 0)
        panel = cmds.getPanel(withFocus=True)
        if panel and cmds.getPanel(typeOf=panel) == "modelPanel":
            cmds.modelEditor(panel, edit=True, displayAppearance="smoothShaded", displayTextures=True)
    except Exception as exc:
        warn("Could not frame the viewport: %s" % exc)


def step(label, fn, *args):
    log("== %s ==" % label)
    try:
        result = fn(*args)
    except BuildError:
        raise
    except Exception as exc:
        raise BuildError("Step '%s' failed: %s: %s" % (label, type(exc).__name__, exc))
    live_tick()
    return result


def build_character(mats):
    body = step("Body from a polygon cube", build_body)
    step("Sculpt face with Soft Selection", sculpt_face, body)
    step("Base band, waist stripe, teeth (face extrusions)", add_bands_and_teeth, body)
    tags = {}
    for sign in (1, -1):
        tags.update(step("Arms (extrude from body faces)" if sign > 0 else "Mirror arm", build_arm, body, sign))
    cmds.delete(body, constructionHistory=True)
    cmds.polySoftEdge(body, angle=62, constructionHistory=False)
    fix_closed_mesh_normals(body)
    step("Body materials", assign_body_materials, body, mats, tags)
    smooth_preview(body, 1)
    front_verts = get_vertices(body)
    handle = step("Handle", build_handle)
    assign(mats["olive"][1], handle)
    brows = [step("Brow", build_brow, s, front_verts) for s in (-1, 1)]
    for b in brows:
        assign(mats["black"][1], b)
    eyes = step("Eyes", build_eyes, front_verts)
    for name, node in eyes.items():
        key = "white" if name.startswith("sclera") else ("iris" if name.startswith("iris") else "pupil")
        assign(mats[key][1], node)
    decal = step("Text decal", build_decal)
    assign(mats["text"][1], decal)
    return {"body": body, "handle": handle, "face": brows + list(eyes.values()), "decal": decal}


def main():
    if cmds is None:
        raise BuildError("This script must run inside Autodesk Maya (maya.cmds not found).")
    root = resolve_project_root()
    setup_project(root)
    start_clean_scene()
    focus_viewport()
    step("Reference image planes + guides", build_references, root)
    mats = step("Materials", build_materials)
    char = build_character(mats)
    all_char_meshes = [char["body"], char["handle"], char["decal"]] + char["face"]
    scenes = os.path.join(root, "scenes")
    base_path = os.path.join(scenes, STUDENT_PREFIX + "-v01-modeling-base.mb")
    step("Save clean modeling version", save_scene, base_path, "modeling base")

    plat, cyc = step("Stage", build_stage, mats)
    cam_xf, cam_shape = step("Render camera", build_camera)
    renderer = detect_renderer()
    log("Renderer: %s" % renderer)
    lights = step("Lights", build_lights, renderer)
    prefix = configure_render(renderer, cam_shape)
    groups = organise({"body": char["body"], "handle": char["handle"], "face": char["face"],
                       "decal": char["decal"], "environment": [plat, cyc], "lights": lights,
                       "cameras": [cam_xf]})
    cmds.select(clear=True)
    problems = verify_scene(all_char_meshes, root, open_ok=(char["decal"],))

    final_path = os.path.join(scenes, STUDENT_PREFIX + "-final.mb")
    step("Save final scene", save_scene, final_path, "final scene")
    png = None
    if DO_RENDER:
        png = step("Render PNG", render_png, root, cam_xf, prefix, renderer)
    missing = []
    if DO_REOPEN_CHECK:
        missing = step("Re-open saved scene", reopen_check, final_path)
    log("================ SUMMARY ================")
    log("Scene : %s" % final_path)
    log("Render: %s" % (png or "(skipped)"))
    if problems or missing:
        for p in problems:
            warn(p)
        for m in missing:
            warn("Unresolved path after re-open: %s" % m)
    else:
        log("All automatic checks passed. Now inspect the model yourself (README: checklist).")
    return {"scene": final_path, "render": png, "problems": problems, "missing": missing}


if cmds is not None and __name__ in ("__main__", "__builtin__", "builtins"):
    main()
