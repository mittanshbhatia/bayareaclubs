"""A tiny stand-in for maya.cmds used ONLY for offline testing of build_bell_mascot.py.

It implements the polygon commands the script relies on (primitives, vertex editing,
extrude, delete faces, soft select + move, material sets) with real geometry, and
records everything else. It is NOT Maya: passing offline checks proves the script's
logic and geometry maths, not that Maya accepts every command flag.
"""
import math
import re


def _smoothstep(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)


class Mesh(object):
    def __init__(self, name):
        self.name = name
        self.verts = []
        self.faces = []
        self.uvs = {}

    def add_vert(self, p):
        self.verts.append(tuple(p))
        return len(self.verts) - 1

    def compact(self):
        used = sorted(set(v for f in self.faces for v in f))
        remap = {old: new for new, old in enumerate(used)}
        self.verts = [self.verts[i] for i in used]
        self.faces = [[remap[v] for v in f] for f in self.faces]


class FakeCmds(object):
    def __init__(self, soft_select_works=True):
        self.meshes = {}
        self.attrs = {}
        self.selection = []
        self.soft = {"on": False, "radius": 0.0}
        self.soft_select_works = soft_select_works
        self.assignments = {}      # mesh -> {face: sg}
        self.sg_material = {}      # sg -> material
        self.material_color = {}
        self.node_types = {}
        self.xforms = {}
        self.calls = []
        self._counter = 0
        self.history_deletes = 0
        self.arnold_available = False
        self._scene_path = None

    # --- helpers ----------------------------------------------------------
    def _mesh_of(self, comp):
        return self.meshes[comp.split(".")[0]]

    def _name(self, base):
        self._counter += 1
        return "%s%d" % (base, self._counter)

    def _ok(self, flag):
        return flag

    # --- primitives ---------------------------------------------------------
    def polyCube(self, **kw):
        name = kw.get("name", "pCube1")
        w, h, d = kw.get("width", 1), kw.get("height", 1), kw.get("depth", 1)
        sx, sy, sz = kw.get("subdivisionsX", 1), kw.get("subdivisionsY", 1), kw.get("subdivisionsZ", 1)
        m = Mesh(name)
        key = {}

        def vid(i, j, k):
            x = -w / 2.0 + w * i / float(sx)
            y = -h / 2.0 + h * j / float(sy)
            z = -d / 2.0 + d * k / float(sz)
            kk = (round(x, 6), round(y, 6), round(z, 6))
            if kk not in key:
                key[kk] = m.add_vert((x, y, z))
            return key[kk]

        def quad_grid(fn, n1, n2):
            for a in range(n1):
                for b in range(n2):
                    f = [fn(a, b), fn(a + 1, b), fn(a + 1, b + 1), fn(a, b + 1)]
                    m.faces.append(f)

        quad_grid(lambda a, b: vid(a, b, sz), sx, sy)
        quad_grid(lambda a, b: vid(sx - a, b, 0), sx, sy)
        quad_grid(lambda a, b: vid(sx, b, sz - a), sz, sy)
        quad_grid(lambda a, b: vid(0, b, a), sz, sy)
        quad_grid(lambda a, b: vid(a, sy, sz - b), sx, sz)
        quad_grid(lambda a, b: vid(a, 0, b), sx, sz)
        for f in m.faces:
            pts = [m.verts[i] for i in f]
            n = _cross(_sub(pts[1], pts[0]), _sub(pts[2], pts[0]))
            c = [sum(p[i] for p in pts) / 4.0 for i in range(3)]
            if _dot(n, c) < 0:
                f.reverse()
        self.meshes[name] = m
        return [name, name + "Shape_hist"]

    def polyPlane(self, **kw):
        name = kw.get("name", "pPlane1")
        w, h = kw.get("width", 1), kw.get("height", 1)
        sx, sy = kw.get("subdivisionsX", 1), kw.get("subdivisionsY", 1)
        axis = kw.get("axis", (0, 1, 0))
        m = Mesh(name)
        grid = {}
        for j in range(sy + 1):
            for i in range(sx + 1):
                a = -w / 2.0 + w * i / float(sx)
                b = -h / 2.0 + h * j / float(sy)
                if axis == (0, 1, 0):
                    p = (a, 0.0, b)
                elif axis == (1, 0, 0):
                    p = (0.0, a, b)       # width along Y, height along Z: exercises the swapped branch
                else:
                    p = (a, b, 0.0)
                grid[(i, j)] = m.add_vert(p)
        for j in range(sy):
            for i in range(sx):
                m.faces.append([grid[(i, j)], grid[(i, j + 1)], grid[(i + 1, j + 1)], grid[(i + 1, j)]])
        self.meshes[name] = m
        return [name, name + "Shape_hist"]

    def polySphere(self, **kw):
        name = kw.get("name", "pSphere1")
        r = kw.get("radius", 1)
        sx, sy = kw.get("subdivisionsX", 20), kw.get("subdivisionsY", 20)
        m = Mesh(name)
        top = m.add_vert((0, r, 0))
        rings = []
        for j in range(1, sy):
            phi = math.pi * j / sy
            ring = []
            for i in range(sx):
                th = 2 * math.pi * i / sx
                ring.append(m.add_vert((r * math.sin(phi) * math.cos(th), r * math.cos(phi),
                                        r * math.sin(phi) * math.sin(th))))
            rings.append(ring)
        bot = m.add_vert((0, -r, 0))
        for i in range(sx):
            m.faces.append([top, rings[0][(i + 1) % sx], rings[0][i]])
        for j in range(len(rings) - 1):
            for i in range(sx):
                m.faces.append([rings[j][i], rings[j][(i + 1) % sx], rings[j + 1][(i + 1) % sx], rings[j + 1][i]])
        for i in range(sx):
            m.faces.append([bot, rings[-1][i], rings[-1][(i + 1) % sx]])
        self.meshes[name] = m
        return [name, name + "Shape_hist"]

    def polyCylinder(self, **kw):
        name = kw.get("name", "pCylinder1")
        r, h = kw.get("radius", 1), kw.get("height", 2)
        sx = kw.get("subdivisionsX", 20)
        m = Mesh(name)
        lo = [m.add_vert((r * math.cos(2 * math.pi * i / sx), -h / 2.0, r * math.sin(2 * math.pi * i / sx))) for i in range(sx)]
        hi = [m.add_vert((r * math.cos(2 * math.pi * i / sx), h / 2.0, r * math.sin(2 * math.pi * i / sx))) for i in range(sx)]
        for i in range(sx):
            j = (i + 1) % sx
            m.faces.append([lo[i], hi[i], hi[j], lo[j]])
        m.faces.append(list(reversed(hi)))
        m.faces.append(list(lo))
        for f in m.faces:
            pts = [m.verts[i] for i in f]
            n = _cross(_sub(pts[1], pts[0]), _sub(pts[2], pts[0]))
            c = [sum(p[i] for p in pts) / len(pts) for i in range(3)]
            if _dot(n, c) < 0:
                f.reverse()
        self.meshes[name] = m
        return [name, name + "Shape_hist"]

    # --- component editing --------------------------------------------------
    def xform(self, target, **kw):
        if ".vtx[" in target or target.endswith(".vtx[*]"):
            m = self._mesh_of(target)
            if kw.get("query"):
                flat = []
                for v in m.verts:
                    flat.extend(v)
                return flat
            idx = int(re.search(r"\[(\d+)\]", target).group(1))
            m.verts[idx] = tuple(kw["translation"])
            return None
        if kw.get("query"):
            return list(self.xforms.get(target, (0, 0, 0)))
        if "translation" in kw:
            self.xforms[target] = tuple(kw["translation"])
        return None

    def polyInfo(self, mesh, **kw):
        m = self.meshes[mesh]
        return ["FACE %6d: %s \n" % (i, " ".join("%6d" % v for v in f)) for i, f in enumerate(m.faces)]

    def select(self, *args, **kw):
        if kw.get("clear"):
            self.selection = []
            return
        items = args[0] if args else []
        self.selection = list(items) if isinstance(items, (list, tuple)) else [items]

    def ls(self, *args, **kw):
        if kw.get("selection"):
            return list(self.selection)
        if kw.get("type") == "shadingEngine":
            return [n for n, k in self.node_types.items() if k == "shadingEngine"]
        if kw.get("type") == "camera":
            return ["bell_render_camShape", "perspShape"]
        if args:
            return list(args[0]) if isinstance(args[0], (list, tuple)) else [args[0]]
        return []

    def polyExtrudeFacet(self, *args, **kw):
        together = kw.get("keepFacesTogether", True)
        sel = [s for s in self.selection if ".f[" in s]
        m = self._mesh_of(sel[0])
        ids = sorted(int(re.search(r"\[(\d+)\]", s).group(1)) for s in sel)
        idset = set(ids)
        edge_count_all = {}
        for f in m.faces:
            for i in range(len(f)):
                e = tuple(sorted((f[i], f[(i + 1) % len(f)])))
                edge_count_all[e] = edge_count_all.get(e, 0) + 1
        edge_count_sel = {}
        for fi in ids:
            f = m.faces[fi]
            for i in range(len(f)):
                e = tuple(sorted((f[i], f[(i + 1) % len(f)])))
                edge_count_sel[e] = edge_count_sel.get(e, 0) + 1
        walls = []
        if together:
            boundary = set()
            for e, n in edge_count_sel.items():
                if n == 1:
                    boundary.add(e)
            bverts = set(v for e in boundary for v in e)
            newid = {}
            for v in sorted(bverts):
                newid[v] = m.add_vert(m.verts[v])
            for fi in ids:
                f = m.faces[fi]
                for i in range(len(f)):
                    a, b = f[i], f[(i + 1) % len(f)]
                    if tuple(sorted((a, b))) in boundary:
                        walls.append([a, b, newid[b], newid[a]])
            for fi in ids:
                m.faces[fi] = [newid.get(v, v) for v in m.faces[fi]]
        else:
            for fi in ids:
                f = m.faces[fi]
                newf = [m.add_vert(m.verts[v]) for v in f]
                for i in range(len(f)):
                    j = (i + 1) % len(f)
                    walls.append([f[i], f[j], newf[j], newf[i]])
                m.faces[fi] = newf
        m.faces.extend(walls)
        self.selection = ["%s.f[%d]" % (m.name, i) for i in ids]
        return ["polyExtrudeFace1"]

    def delete(self, *args, **kw):
        if kw.get("constructionHistory"):
            self.history_deletes += 1
            return
        items = args[0] if isinstance(args[0], (list, tuple)) else [args[0]]
        faces = [s for s in items if ".f[" in s]
        if faces:
            m = self._mesh_of(faces[0])
            kill = set(int(re.search(r"\[(\d+)\]", s).group(1)) for s in faces)
            m.faces = [f for i, f in enumerate(m.faces) if i not in kill]
            m.compact()

    def polyListComponentConversion(self, comps, **kw):
        if kw.get("toUV"):
            return [comps.replace(".vtx[", ".map[")] if isinstance(comps, str) else comps
        return []

    def polyEditUV(self, uv, **kw):
        name = uv[0] if isinstance(uv, (list, tuple)) else uv
        mesh = name.split(".")[0]
        idx = int(re.search(r"\[(\d+)\]", name).group(1))
        self.meshes[mesh].uvs[idx] = (kw["uValue"], kw["vValue"])

    def polyBevel3(self, *a, **k):
        self.calls.append("polyBevel3")

    def polyNormal(self, mesh, **kw):
        m = self.meshes[mesh]
        m.faces = [list(reversed(f)) for f in m.faces]

    def softSelect(self, **kw):
        if "softSelectEnabled" in kw:
            self.soft["on"] = kw["softSelectEnabled"]
        if "softSelectDistance" in kw:
            self.soft["radius"] = kw["softSelectDistance"]

    def move(self, dx, dy, dz, **kw):
        verts = [s for s in self.selection if ".vtx[" in s]
        for s in verts:
            m = self._mesh_of(s)
            i = int(re.search(r"\[(\d+)\]", s).group(1))
            p0 = m.verts[i]
            if self.soft["on"] and self.soft_select_works:
                r = self.soft["radius"]
                new = []
                for p in m.verts:
                    d = math.sqrt(sum((p[k] - p0[k]) ** 2 for k in range(3)))
                    w = 1.0 - _smoothstep(d / r) if d < r else 0.0
                    new.append((p[0] + dx * w, p[1] + dy * w, p[2] + dz * w))
                m.verts = new
            else:
                m.verts[i] = (p0[0] + dx, p0[1] + dy, p0[2] + dz)

    # --- shading ------------------------------------------------------------
    def shadingNode(self, kind, **kw):
        name = kw.get("name", self._name(kind))
        self.node_types[name] = kind
        return name

    def sets(self, *args, **kw):
        if kw.get("empty"):
            name = kw["name"]
            self.node_types[name] = "shadingEngine"
            return name
        if kw.get("query"):
            return [self._fmt(m, f) for m, d in self.assignments.items() for f, sg in d.items() if sg == args[0]]
        if kw.get("edit") and "forceElement" in kw:
            sg = kw["forceElement"]
            comps = args[0] if isinstance(args[0], (list, tuple)) else [args[0]]
            for c in comps:
                if ".f[" in c:
                    m = c.split(".")[0]
                    idx = int(re.search(r"\[(\d+)\]", c).group(1))
                    self.assignments.setdefault(m, {})[idx] = sg
                else:
                    m = self.meshes[c]
                    self.assignments[c] = {i: sg for i in range(len(m.faces))}
        return None

    def _fmt(self, m, f):
        return "%s.f[%d]" % (m, f)

    def connectAttr(self, src, dst, **kw):
        if dst.endswith(".surfaceShader"):
            self.sg_material[dst.split(".")[0]] = src.split(".")[0]

    def setAttr(self, attr, *vals, **kw):
        self.attrs[attr] = vals if len(vals) != 1 else vals[0]
        if attr.endswith(".color") and len(vals) == 3:
            self.material_color[attr.split(".")[0]] = tuple(vals)

    def getAttr(self, attr):
        return self.attrs.get(attr, 0)

    def attributeQuery(self, attr, node=None, exists=False):
        return attr in ("displaySmoothMesh", "smoothLevel", "useSmoothPreviewForRender", "renderSmoothLevel")

    def listRelatives(self, node, **kw):
        if kw.get("shapes"):
            return [node + "Shape"]
        if kw.get("parent"):
            return [node.replace("Shape", "")]
        return []

    def nodeType(self, node):
        return self.node_types.get(node, "transform")

    # --- scene / misc ------------------------------------------------------------
    def camera(self, **kw):
        n = kw.get("name", "camera1")
        return [n, n + "Shape"]

    def directionalLight(self, **kw):
        return self._name("directionalLight") + "Shape"

    def ambientLight(self, **kw):
        return self._name("ambientLight") + "Shape"

    def rename(self, a, b):
        if a in self.meshes:
            m = self.meshes.pop(a)
            m.name = b
            self.meshes[b] = m
        return b

    def duplicate(self, src_name, **kw):
        src = self.meshes[src_name]
        new = kw.get("name", src_name + "1")
        m = Mesh(new)
        m.verts = list(src.verts)
        m.faces = [list(f) for f in src.faces]
        self.meshes[new] = m
        return [new]

    def polyUnite(self, *names, **kw):
        out = Mesh(kw.get("name", "polySurface1"))
        for n in names:
            src = self.meshes.pop(n)
            base = len(out.verts)
            out.verts.extend(src.verts)
            out.faces.extend([[v + base for v in f] for f in src.faces])
        self.meshes[out.name] = out
        return [out.name, "polyUnite1"]

    def polyMergeVertex(self, comp, **kw):
        m = self._mesh_of(comp)
        tol = kw.get("distance", 0.001)
        cell = {}
        remap = {}
        for i, v in enumerate(m.verts):
            key = tuple(int(round(c / tol)) for c in v)
            if key not in cell:
                cell[key] = i
            remap[i] = cell[key]
        m.faces = [[remap[v] for v in f] for f in m.faces]
        m.compact()

    def group(self, *a, **kw):
        return kw.get("name", "group1")

    def curve(self, **kw):
        return kw.get("name", "curve1")

    def createDisplayLayer(self, *a, **kw):
        return kw.get("name", "layer1")

    def imagePlane(self, **kw):
        n = kw.get("name", "imagePlane1")
        return [n, n + "Shape"]

    def warning(self, msg):
        print(msg)

    def listConnections(self, plug, **kw):
        sg = plug.split(".")[0]
        return [self.sg_material[sg]] if sg in self.sg_material else []

    def renderer(self, **kw):
        return ["mayaSoftware", "mayaHardware2"]

    def pluginInfo(self, name, **kw):
        return self.arnold_available

    def loadPlugin(self, *a, **k):
        return None

    def about(self, **kw):
        return True

    def file(self, *args, **kw):
        if kw.get("query"):
            return False
        if "rename" in kw:
            self._scene_path = kw["rename"]
        if kw.get("save"):
            with open(self._scene_path, "wb") as fh:
                fh.write(b"FOR4\x00\x00\x00\x10MAYAFAKE_TEST")
        return None

    def workspace(self, *a, **k):
        return None

    def __getattr__(self, name):
        def _generic(*a, **k):
            self.calls.append(name)
            return None
        return _generic


def _sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def _cross(a, b):
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


def _dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
