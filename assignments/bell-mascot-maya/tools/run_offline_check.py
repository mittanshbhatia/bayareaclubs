"""Offline verification of build_bell_mascot.py WITHOUT Maya.

Runs the real script functions against tools/fake_maya.py, then
  * audits every mesh (closed, manifold, no duplicate faces, outward normals),
  * compares the model silhouettes with the front and side reference photos,
  * writes quick preview pictures (front, side, back, three-quarter, camera framing).

These previews are a rough software rasteriser, NOT a Maya render.
Usage:  python3 tools/run_offline_check.py [output_dir]
Needs:  pillow, numpy
"""
import importlib
import json
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "scripts"))

import fake_maya  # noqa: E402
import build_bell_mascot as bm  # noqa: E402


def catmull_clark(verts, faces, fids):
    """One level of Catmull-Clark. Returns new verts, quad faces, parent face ids."""
    V = np.array(verts, float)
    edge_faces = {}
    for fi, f in enumerate(faces):
        for i in range(len(f)):
            e = tuple(sorted((f[i], f[(i + 1) % len(f)])))
            edge_faces.setdefault(e, []).append(fi)
    fpts = [V[f].mean(axis=0) for f in faces]
    epts = {}
    for e, fl in edge_faces.items():
        mid = (V[e[0]] + V[e[1]]) / 2.0
        epts[e] = mid if len(fl) == 1 else (V[e[0]] + V[e[1]] + fpts[fl[0]] + fpts[fl[1]]) / 4.0
    vert_faces = {}
    vert_edges = {}
    for fi, f in enumerate(faces):
        for v in f:
            vert_faces.setdefault(v, []).append(fi)
    for e in edge_faces:
        for v in e:
            vert_edges.setdefault(v, []).append(e)
    newV = np.zeros_like(V)
    for v in range(len(V)):
        es = vert_edges.get(v, [])
        border = [e for e in es if len(edge_faces[e]) == 1]
        if len(border) >= 2:
            nb = [e[0] if e[1] == v else e[1] for e in border[:2]]
            newV[v] = (6 * V[v] + V[nb[0]] + V[nb[1]]) / 8.0
            continue
        n = len(vert_faces[v])
        F = np.mean([fpts[i] for i in vert_faces[v]], axis=0)
        R = np.mean([(V[e[0]] + V[e[1]]) / 2.0 for e in es], axis=0)
        newV[v] = (F + 2 * R + (n - 3) * V[v]) / n
    out_v = [tuple(p) for p in newV]
    fidx = {}
    for fi in range(len(faces)):
        fidx[fi] = len(out_v)
        out_v.append(tuple(fpts[fi]))
    eidx = {}
    for e, p in epts.items():
        eidx[e] = len(out_v)
        out_v.append(tuple(p))
    out_f, out_ids = [], []
    for fi, f in enumerate(faces):
        n = len(f)
        for i in range(n):
            a, b, c = f[i - 1], f[i], f[(i + 1) % n]
            e1 = eidx[tuple(sorted((a, b)))]
            e2 = eidx[tuple(sorted((b, c)))]
            out_f.append([b, e2, fidx[fi], e1])
            out_ids.append(fids[fi])
    return out_v, out_f, out_ids


def smoothed(mesh, level):
    v, f, ids = list(mesh.verts), [list(x) for x in mesh.faces], list(range(len(mesh.faces)))
    for _ in range(level):
        v, f, ids = catmull_clark(v, f, ids)
    return np.array(v), f, ids


def build_scene(fake):
    bm.cmds = fake
    mats = bm.build_materials()
    char = bm.build_character(mats)
    plat, cyc = bm.build_stage(mats)
    cam = bm.build_camera()
    return mats, char, plat, cyc, cam


def face_color(fake, mesh_name, face_index, default=(0.5, 0.5, 0.5)):
    sg = fake.assignments.get(mesh_name, {}).get(face_index)
    mat = fake.sg_material.get(sg)
    col = fake.material_color.get(mat)
    if col is None:
        return default
    return col


def lin_to_srgb(c):
    c = np.clip(np.array(c), 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def raster_silhouette(fake, names, view, size, scale, axis_px, ground_px):
    """Filled-polygon silhouette in reference pixel space."""
    img = Image.new("L", size, 0)
    d = ImageDraw.Draw(img)
    for n in names:
        level = int(fake.attrs.get(n + "Shape.smoothLevel", 0)) if fake.attrs.get(n + "Shape.displaySmoothMesh") else 0
        V, F, _ = smoothed(fake.meshes[n], level)
        if view == "front":
            px = axis_px + V[:, 0] / scale
        else:
            px = axis_px - V[:, 2] / scale
        py = ground_px - V[:, 1] / scale
        for f in F:
            d.polygon([(px[i], py[i]) for i in f], fill=255)
    return np.array(img) > 0


def reference_mask(path):
    im = np.array(Image.open(path).convert("RGB")).astype(int)
    return im.sum(axis=2) < 735


def compare(model_mask, ref_mask, name, out_dir):
    inter = (model_mask & ref_mask).sum()
    union = (model_mask | ref_mask).sum()
    iou = inter / float(union)
    # body-only: ignore rows above the cap top (handle) and compare the body zone
    rgb = np.zeros(model_mask.shape + (3,), np.uint8) + 255
    rgb[ref_mask] = (190, 190, 190)
    rgb[model_mask & ~ref_mask] = (230, 70, 70)
    rgb[ref_mask & ~model_mask] = (70, 110, 230)
    rgb[model_mask & ref_mask] = (110, 110, 110)
    Image.fromarray(rgb).save(os.path.join(out_dir, "silhouette_overlay_%s.png" % name))
    return iou


def shade_render(fake, names, cam_pos, cam_rot, focal_mm, film_w_in, size, out_path, key_dir, bg=(0.92, 0.94, 0.97)):
    rx, ry = math.radians(cam_rot[0]), math.radians(cam_rot[1])
    cy, sy_ = math.cos(ry), math.sin(ry)
    cx, sx = math.cos(rx), math.sin(rx)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy_], [0, 1, 0], [-sy_, 0, cy]])
    R = Ry @ Rx                       # camera-to-world
    W, H = size
    f_px = focal_mm / (film_w_in * 25.4) * W
    polys = []
    for n in names:
        level = int(fake.attrs.get(n + "Shape.smoothLevel", 0)) if fake.attrs.get(n + "Shape.displaySmoothMesh") else 0
        V, F, ids = smoothed(fake.meshes[n], level)
        cam = (V - np.array(cam_pos)) @ R          # world -> camera (rows)
        for f, fid in zip(F, ids):
            pts = cam[f]
            if (pts[:, 2] > -0.5).any():
                continue
            n3 = np.cross(pts[1] - pts[0], pts[2] - pts[0])
            ln = np.linalg.norm(n3)
            if ln < 1e-12:
                continue
            n3 /= ln
            nw = R @ n3
            centre = pts.mean(axis=0)
            if np.dot(n3, centre) > 0:      # facing away from camera (winding is outward)
                n3 = -n3
                nw = -nw if n not in ("stage_backdrop_geo",) else nw
            proj = np.stack([W / 2 + f_px * pts[:, 0] / -pts[:, 2], H / 2 - f_px * pts[:, 1] / -pts[:, 2]], axis=1)
            col = np.array(face_color(fake, n, fid))
            diff = max(0.0, float(np.dot(nw, key_dir))) * 0.95
            fill = max(0.0, float(np.dot(nw, np.array([-0.6, 0.25, 0.75])))) * 0.28
            rim = max(0.0, float(np.dot(nw, np.array([-0.3, 0.4, -0.85])))) * 0.25
            lit = col * (0.16 + diff + fill + rim)
            polys.append((centre[2], proj, tuple(int(v * 255) for v in lin_to_srgb(lit))))
    polys.sort(key=lambda t: t[0])
    img = Image.new("RGB", (W, H), tuple(int(v * 255) for v in bg))
    d = ImageDraw.Draw(img)
    for _, proj, c in polys:
        d.polygon([tuple(p) for p in proj], fill=c)
    img.save(out_path)
    return img


def view_rotations(az_deg, el_deg, target, dist):
    az, el = math.radians(az_deg), math.radians(el_deg)
    pos = (target[0] + dist * math.sin(az) * math.cos(el), target[1] + dist * math.sin(el),
           target[2] + dist * math.cos(az) * math.cos(el))
    rx, ry = bm.aim_angles(bm.vsub(target, pos))
    return pos, (rx, ry)


def main():
    out_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "docs", "offline_checks")
    os.makedirs(out_dir, exist_ok=True)
    results = {}
    for mode in (True, False):
        fake = fake_maya.FakeCmds(soft_select_works=mode)
        build_scene(fake)
    fake = fake_maya.FakeCmds(soft_select_works=True)
    mats, char, plat, cyc, cam = build_scene(fake)

    all_meshes = [char["body"], char["handle"], char["decal"]] + char["face"] + [plat, cyc]
    reports = []
    for n in all_meshes:
        mesh = fake.meshes[n]
        rep = bm.mesh_report(n)
        reports.append(rep)
    results["mesh_reports"] = reports
    closed = [r for r in reports if r["mesh"] not in (char["decal"], cyc)]
    bad = [r for r in closed if r["open_edges"] or r["nonmanifold_edges"] or r["duplicate_faces"]
           or r["degenerate_faces"] or r["signed_volume"] <= 0]
    results["closed_mesh_problems"] = bad

    k_front, k_side = bm.ref_scale(bm.REF_FRONT), bm.ref_scale(bm.REF_SIDE)
    character_parts = [char["body"], char["handle"]] + char["face"]
    front_ref = reference_mask(os.path.join(ROOT, "sourceimages", bm.REF_FRONT["file"]))
    side_ref = reference_mask(os.path.join(ROOT, "sourceimages", bm.REF_SIDE["file"]))
    fm = raster_silhouette(fake, character_parts, "front", bm.REF_FRONT["size"], k_front,
                           bm.REF_FRONT["axis_px"], bm.REF_FRONT["ground_px"])
    sm = raster_silhouette(fake, character_parts, "side", bm.REF_SIDE["size"], k_side,
                           bm.REF_SIDE["axis_px"], bm.REF_SIDE["ground_px"])
    results["silhouette_iou_front"] = round(compare(fm, front_ref, "front", out_dir), 4)
    results["silhouette_iou_side"] = round(compare(sm, side_ref, "side", out_dir), 4)

    verts = np.array(fake.meshes[char["body"]].verts)
    hverts = np.array(fake.meshes[char["handle"]].verts)
    results["body_height"] = float(verts[:, 1].max())
    results["lowest_point"] = float(min(np.array(fake.meshes[m].verts)[:, 1].min() for m in character_parts))
    results["handle_top"] = float(hverts[:, 1].max())
    results["materials"] = sorted(set(fake.node_types.get(m) and m for m in fake.material_color))

    focal = fake.attrs["bell_render_camShape.focalLength"]
    film_w = fake.attrs["bell_render_camShape.horizontalFilmAperture"]
    pos = fake.xforms["bell_render_cam"]
    rot = (fake.attrs["bell_render_cam.rotateX"], fake.attrs["bell_render_cam.rotateY"])
    names = all_meshes
    shade_render(fake, names, pos, rot, focal, film_w, (1280, 720), os.path.join(out_dir, "preview_render_camera.png"),
                 np.array([0.55, 0.6, 0.6]))
    char_names = [char["body"], char["handle"], char["decal"]] + char["face"] + [plat, cyc]
    target = (0.0, 7.4, 0.0)
    for label, az, el in (("front", 0, 3), ("side", 90, 3), ("back", 180, 3), ("three_quarter", 38, 9)):
        p, r = view_rotations(az, el, target, 32.0)
        key = np.array([math.sin(math.radians(az)) * 0.5 + 0.3, 0.6, math.cos(math.radians(az)) * 0.6 + 0.2])
        shade_render(fake, char_names, p, r, 85.0, 1.41732, (900, 1200), os.path.join(out_dir, "preview_%s.png" % label),
                     key / np.linalg.norm(key), bg=(0.95, 0.95, 0.97))
    # project the character bounding box through the render camera to check framing
    allpts = np.concatenate([np.array(fake.meshes[m].verts) for m in character_parts])
    rx, ry = math.radians(rot[0]), math.radians(rot[1])
    cy, sy_, cx, sx = math.cos(ry), math.sin(ry), math.cos(rx), math.sin(rx)
    R = np.array([[cy, 0, sy_], [0, 1, 0], [-sy_, 0, cy]]) @ np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    cam_pts = (allpts - np.array(pos)) @ R
    f_px = focal / (film_w * 25.4) * 1920
    px = 960 + f_px * cam_pts[:, 0] / -cam_pts[:, 2]
    py = 540 - f_px * cam_pts[:, 1] / -cam_pts[:, 2]
    results["frame_margin_px"] = {"left": float(px.min()), "right": float(1920 - px.max()),
                                  "top": float(py.min()), "bottom": float(1080 - py.max())}
    with open(os.path.join(out_dir, "offline_results.json"), "w") as fh:
        json.dump(results, fh, indent=2, default=str)
    print(json.dumps({k: v for k, v in results.items() if k != "mesh_reports"}, indent=2, default=str))
    for r in reports:
        print("%-22s v%5d f%5d open %d nm %d dup %d deg %d vol %.2f" % (
            r["mesh"], r["verts"], r["faces"], r["open_edges"], r["nonmanifold_edges"],
            r["duplicate_faces"], r["degenerate_faces"], r["signed_volume"]))


if __name__ == "__main__":
    main()
