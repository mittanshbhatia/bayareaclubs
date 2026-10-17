# Character Sculpt: The Bellarmine Mascot 2.0 (Maya project)

Student: Mittansh Bhatia

## Read this first: what is and is not finished

| Item                                                                         | Status                                                 |
| ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| Maya project folder (`scenes/`, `sourceimages/`, `images/`, `workspace.mel`) | Created                                                |
| Reference images (front + side crops, original photo, decal texture)         | Created, in `sourceimages/`                            |
| Maya build script `scripts/build_bell_mascot.py`                             | Written. **Not yet run inside Maya**                   |
| `Bhatia Mittansh -Bell Character-final.mb`                                   | **Does not exist yet.** Maya must write it (see below) |
| `Bhatia Mittansh -Bell Character-final.png` (render)                         | **Does not exist yet.** The script renders it in Maya  |
| Offline checks (stand-in for Maya, no Maya involved)                         | Run and passing, see "What was tested"                 |

The cloud environment that produced this project has no Autodesk Maya, so no `.mb` or Maya render could
be made there. A `.mb` is a proprietary binary that only Maya can write; nothing here is a renamed
text/ASCII file. Running the script in your Maya produces both required files in about a minute.

## Run it (about 5 minutes)

1. Copy this whole folder to your computer, for example
   `Documents/maya/projects/BellMascot2`. Keep `sourceimages/` next to `scripts/`.
2. Open Maya. Use **File > New Scene** (the script refuses to run over unsaved work).
3. Open **Windows > General Editors > Script Editor**, switch to the **Python** tab.
4. Run this, changing the path to where you copied the folder:

   ```python
   PATH = r"C:/Users/YOU/Documents/maya/projects/BellMascot2/scripts/build_bell_mascot.py"
   src = open(PATH).read()
   src = src.replace("PROJECT_ROOT = None", "PROJECT_ROOT = r'C:/Users/YOU/Documents/maya/projects/BellMascot2'", 1)
   exec(compile(src, PATH, "exec"), {"__name__": "__main__", "__file__": PATH})
   ```

   (Alternatively open the script, set `PROJECT_ROOT = r"..."` near the top, and press Ctrl+Enter.)

5. Watch the Script Editor history. Lines start with `[BellMascot]`. It finishes with a SUMMARY.
   If something fails, the message names the step that failed; nothing is silently skipped.

The script then writes:

- `scenes/Bhatia Mittansh -Bell Character-v01-modeling-base.mb` : clean, un-posed modeling version, saved
  before the stage is added (your "preserve a clean modeling version" file).
- `scenes/Bhatia Mittansh -Bell Character-final.mb` : **submission scene**, saved with Maya's own
  save command as Maya Binary.
- `images/Bhatia Mittansh -Bell Character-final.png` : **submission render**, 1920 x 1080.

Existing files with those names are moved to `_archive/` with a timestamp, never overwritten.

If the render step cannot write the PNG itself, the script says so. Then use the Render View:
**File > Save Image...** and name it exactly `Bhatia Mittansh -Bell Character-final.png` inside `images/`.
If the scene ever ends up as `.ma`, use **File > Save Scene As...** and choose type **Maya Binary**.

## Option: watch it build live in your open Maya

The script can pause after each step (body, sculpt, rim, arms, handle, face, stage...) and redraw the
viewport, so you see the mascot grow. The perspective view is pointed at it automatically.

1. In Maya's Script Editor (Python tab) run once. It listens on your own computer only:

   ```python
   import maya.cmds as cmds
   if not cmds.commandPort("127.0.0.1:7001", query=True):
       cmds.commandPort(name="127.0.0.1:7001", sourceType="python")
   ```

2. In a Terminal on the same computer, from the project folder:

   ```bash
   python3 tools/maya_live.py --delay 0.8
   ```

3. When finished, close the port in Maya:
   `cmds.commandPort(name="127.0.0.1:7001", close=True)`

Or skip the Terminal: set `LIVE_DELAY = 0.8` at the top of the script and run it from the Script Editor as
described above. Safety: a command port has no password and runs any text sent to it as Python, so keep it
on `127.0.0.1`, never expose it through a tunnel, and close it afterwards. The client refuses non-local hosts.
`python3 tools/test_maya_live.py` checks the client against a fake port (no Maya).

## Option: run without opening Maya (Terminal)

Maya 2027 includes `mayapy`, Maya's own Python. From the project folder (adjust the Maya path if yours differs):

```bash
/Applications/Autodesk/maya2027/Maya.app/Contents/bin/mayapy scripts/run_headless.py
```

It runs the same build and exits with code 0 only if the scene and render were written with no problems.
This path is also unverified in Maya; batch rendering in particular may need a different Arnold call.

## Submit (manual, nothing is uploaded for you)

Copy into the shared OneDrive Maya Projects folder:
`scenes/Bhatia Mittansh -Bell Character-final.mb`, `images/Bhatia Mittansh -Bell Character-final.png`,
and the whole `sourceimages/` folder (reference images + decal texture).

## What was tested, and what was not

Tested offline with `tools/fake_maya.py`, a small stand-in that implements the polygon commands the script
uses (this is **not Maya**):

- The real script functions run end to end for both renderer branches (Arnold and Maya Software) and for
  both soft-selection paths. Reproduce with `python3 tools/run_main_smoke_test.py`.
- Geometry audit of every mesh: closed, no non-manifold edges, no duplicate faces, no degenerate faces,
  outward normals. The text decal is intentionally an open strip.
- Silhouette overlap with your drawings (all character parts, same scale and landmarks):
  front 93.9 percent, side 89.5 percent (`docs/offline_checks/silhouette_overlay_*.png`; grey = both,
  red = model only, blue = reference only).
- Camera framing: whole character inside the 1920 x 1080 frame with about 133 px above the handle and
  113 px below the platform.
- Rough software previews from front, side, back, three-quarter and the render camera
  (`docs/offline_checks/preview_*.png`). These are a crude rasteriser, **not** a Maya render: no real
  lighting, shadows or the "GO BELLS!" texture.

**Not verified (needs your Maya):**

- That every `maya.cmds` flag behaves as written in your Maya version (Maya 2020+ is the target; version
  unknown).
- Image plane size and offset. Size is set with Fit = To Size in scene units; the four coloured guide lines
  (`ref_guide_*`) show ground, eye level, top of the cap and top of the handle. If the drawings do not line up with
  the guides, tell me the Maya version and I will correct the unit handling.
- Soft Selection from scripts (falls back to an equal Python falloff and prints a warning).
- Light strengths and the final look of the render. Tune `LIGHT_TUNE` at the top of the script if it is too
  dark or bright. The script prints no judgement about the picture; look at it yourself.
- Saved `.mb` contents, render output, re-open check. These happen only when you run it.

## How the references were used

The supplied photo contained both views. `tools/prepare_assets.py` crops it into
`sourceimages/reference_front.png` (832 x 1544) and `reference_side.png` (770 x 1544) with no resizing, so
aspect ratios are preserved. Landmarks, measured in `docs/reference_measurements.md`:

- Ground (the base touches the floor) and the top of the blue cap are aligned in both views, so the body is
  12 units tall in both.
- Front is symmetric about the mascot's centre line (image-plane X offset 0); the side view is offset so
  the body axis sits at world Z = 0. Mascot faces +Z, which is the right way to face Maya's front camera.
- Front and side drawings differ about 3 percent in scale (camera perspective). Each view gets its own
  pixel-to-unit scale so landmarks agree. Eye level agrees within 0.12 units.
- The handle top differs more (front 15.2, side 14.6, a tilted handle seen in perspective); it is reconciled
  to 14.85.
- Colours were sampled from the photo: navy, sky blue, olive, tan, black, white.
- The references show **no legs or feet**; the mascot is a bell with a flared rim sitting on the floor. I did not
  invent legs. The rim is the ground contact, with a flat base on the platform.
- The image planes are attached to Maya's **front** and **side** orthographic cameras and display only in
  those views, so the render camera never sees them. The guide lines live in `REFERENCES_grp`, which is on the
  display layer `REF_locked_layer` set to Reference (visible, not selectable).

## How the body grows from a cube (and where to change it)

All numbers live in tables at the top of `scripts/build_bell_mascot.py`.

1. **Cube.** `build_body()` makes a polygon cube with 16 x 27 x 16 subdivisions.
2. **Vertex editing.** Every vertex moves with `body_point()`. Rows go to the heights in `ROW_HEIGHTS`,
   each row is rounded into a bell section whose half-width and front/back depth come from
   `HALF_WIDTH_X`, `FRONT_Z`, `BACK_Z` (measured from both drawings). The top is domed slightly
   (`CAP_DOME`). The model is mirror-symmetric because the cube is.
   _Change:_ edit a number in a table, run again.
3. **Soft Selection sculpting.** `SCULPT` lists the nose, nostrils, cheeks, eye sockets, brow shelf, jaw lump,
   snarl corners and belly bump: position, radius, direction. Each is mirrored left and right. In Maya
   do the same with `B` (Soft Selection) and the Move tool.
4. **Face editing (extrude).** The rolled base rim, the back waist stripe and the raised teeth are sets of
   faces picked by position, then extruded, then moved outward. The rim edges are beveled with
   `polyBevel3` so they catch light.
5. **Arms after the body is complete.** `build_arm()` selects a patch of side faces and extrudes it
   along `ARM_PATH`: shoulder, elbow, forearm, two cuff stripes, wrist, fist. The last extrusion is done face
   by face to make knuckles. Because the arm is extruded from body faces, the attachment has no seam.
   Both arms use the same path, mirrored.
6. **Separate parts (allowed by the brief).** Olive handle (a flat grid with window faces deleted, extruded and mirrored
   for thickness), brows (bent cube strips), eyes (flattened spheres), and the "GO BELLS!" decal (a strip
   with a transparent texture wrapped on the body).
7. **Smoothing.** The editable cage stays low-poly. Smooth Mesh Preview (select the mesh, press `3`; `1`
   shows the cage) is used for display and rendering, so it never hides a wrong base shape.

### Materials (all Lambert, named by purpose)

`mtl_body_navy_lambert`, `mtl_band_skyBlue_lambert`, `mtl_handle_olive_lambert`, `mtl_hand_tan_lambert`,
`mtl_brow_black_lambert`, `mtl_teeth_eyeWhite_lambert`, `mtl_iris_blue_lambert`, `mtl_pupil_black_lambert`,
`mtl_text_goBells_lambert` (uses `texture_go_bells_decal.png`), `mtl_platform_whiteBlue_lambert`,
`mtl_backdrop_softGrey_lambert`. Lambert has no shine, so nothing looks like glossy plastic and it works in
both Arnold and Maya Software.

### Scene, lights, camera

- Platform + seamless backdrop in `ENVIRONMENT_grp`.
- `LIGHTS_grp`: key (warm, upper right front), fill (cool, left), rim (behind), plus a sky dome (Arnold) or a low
  ambient light (Maya Software). The script uses Arnold if the `mtoa` plug-in loads, else Maya Software.
- `CAMERAS_grp/bell_render_cam`: 85 mm lens (little perspective distortion), 38 degrees to the side and
  9 degrees above, framed from the numbers (computed so feet, handle and a margin all fit).

## Outliner

`CHARACTER_grp` (body, handle, face_features_grp, text decal), `ENVIRONMENT_grp`, `LIGHTS_grp`,
`CAMERAS_grp`, `REFERENCES_grp`. The reference image planes are children of the default `front` and
`side` cameras.

## Requirement checklist

| Requirement                                              | Where / how                                                                      | Status                                                         |
| -------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Reference images as image planes in orthographic views   | `ref_front_imagePlane` on `front`, `ref_side_imagePlane` on `side`               | Script written; not verified in Maya                           |
| Front and side aligned with shared landmarks             | ground + cap top matched; guides `ref_guide_*`; `docs/reference_measurements.md` | Measured and checked offline; on-screen alignment not verified |
| Start from a polygon cube                                | `bell_body_geo` from `polyCube`                                                  | Verified offline (stand-in)                                    |
| Face, vertex, edge editing                               | vertex: `body_point`; face: extrudes; edge: `polyBevel3` rim                     | Verified offline except bevel (stand-in cannot bevel)          |
| Body before arms and legs                                | `build_character` order: body, sculpt, bands, then arms                          | Verified offline. No legs, none in the references              |
| Simple geometry first, detail where needed               | 2,998-face cage, features added by sculpt and extrude                            | Verified offline                                               |
| Soft Selection / sculpting                               | `SCULPT` list via `softSelect` + move                                            | Verified offline (stand-in); Maya path unverified              |
| Lambert material                                         | 11 Lambert shaders listed above                                                  | Verified offline (assignment list)                             |
| Colored, lit, placed in a scene                          | palette sampled from photo; 3-point lights; platform and backdrop                | Scene built offline; look of render unverified                 |
| Native Maya scene                                        | `scenes/Bhatia Mittansh -Bell Character-final.mb`                                | **Not yet created** (run in Maya)                              |
| Rendered PNG                                             | `images/Bhatia Mittansh -Bell Character-final.png`, 1920 x 1080                  | **Not yet created** (run in Maya)                              |
| Reference images delivered                               | `sourceimages/reference_front.png`, `reference_side.png`, original               | Present                                                        |
| References visible in modeling, excluded from render     | `displayOnlyIfCurrent`; render camera only; guides on reference layer            | Unverified in Maya                                             |
| Back, side, three-quarter read correctly                 | `docs/offline_checks/preview_*.png`                                              | Checked on offline previews only                               |
| Clean geometry (no holes, flipped normals, non-manifold) | `mesh_report`, normals auto-fixed                                                | Passing offline; script re-checks in Maya                      |
| Contact shadows, key/fill/rim                            | directional key/fill/rim, ray-traced shadows, sky dome / ambient                 | Unverified                                                     |
| Render camera, three-quarter, nothing cropped            | `bell_render_cam`, 85 mm; frame margins computed                                 | Computed offline                                               |
| Outliner groups, descriptive names                       | groups above                                                                     | Script written; run to confirm                                 |
| Project folders, relative paths                          | `workspace.mel`; assets stored as `sourceimages/...`                             | Present; re-open check runs in Maya                            |
| Filenames exact                                          | `STUDENT_PREFIX` + `-final.mb` / `-final.png`                                    | Script uses exact names                                        |

## Known honest limits

- The teeth are plain raised white patches, not the cross-hatched relief in the photo.
- The handle is an approximation of the reference crown, with its asymmetry preserved; its windows are
  slightly smaller than the photo's.
- The face is simpler than the sculpted original (no lips detail). Eyes sit in sockets and read clearly in
  the offline previews, but the real render is not yet seen.
- Arms are stiff blocks after smoothing, with no elbow wrinkles.
- Optional decorations and posing were not added.

## Files

```
scenes/        Maya scenes (written by the script)
sourceimages/  reference_front.png, reference_side.png, reference_original_front_and_side.png, texture_go_bells_decal.png
images/        render PNG (written by the script)
scripts/       build_bell_mascot.py
tools/         prepare_assets.py (crops), fake_maya.py + run_offline_check.py + run_main_smoke_test.py (offline tests)
docs/          reference_measurements.md, offline_checks/ (overlays, previews, results JSON)
```
