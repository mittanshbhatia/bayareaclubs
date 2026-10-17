"""Run the Bell mascot build with Maya's own Python, no Maya window.

macOS example (adjust the version folder if yours differs):
  /Applications/Autodesk/maya2027/Maya.app/Contents/bin/mayapy scripts/run_headless.py

Windows example:
  "C:\\Program Files\\Autodesk\\Maya2027\\bin\\mayapy.exe" scripts\\run_headless.py

Optional first argument: the project folder (default: the folder that contains scripts/).
Exit code 0 only if the scene and the render were written without problems.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.dirname(HERE)
os.environ["BELL_MASCOT_PROJECT"] = ROOT
sys.path.insert(0, HERE)

import maya.standalone  # noqa: E402

maya.standalone.initialize(name="python")
status = 1
try:
    import build_bell_mascot as bm  # noqa: E402

    result = bm.main()
    status = 0 if (result["render"] and not result["problems"] and not result["missing"]) else 2
finally:
    maya.standalone.uninitialize()
sys.exit(status)
