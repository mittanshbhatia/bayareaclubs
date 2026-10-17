"""Smoke-test build_bell_mascot.main() end to end against the offline stand-in.

Copies the project to a temp folder, runs main() once pretending only Maya Software
exists and once pretending Arnold is loaded, and checks the output file names.
This validates the script's flow and Python code, not Maya's acceptance of every flag.
"""
import os
import shutil
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "scripts"))

import fake_maya  # noqa: E402
import build_bell_mascot as bm  # noqa: E402


def run(arnold):
    tmp = tempfile.mkdtemp(prefix="bellproj_")
    proj = os.path.join(tmp, "BellMascot2")
    shutil.copytree(os.path.join(ROOT, "sourceimages"), os.path.join(proj, "sourceimages"))
    fake = fake_maya.FakeCmds()
    fake.arnold_available = arnold
    bm.cmds = fake
    bm.PROJECT_ROOT = proj
    bm.DO_RENDER = False
    result = bm.main()
    scenes = sorted(os.listdir(os.path.join(proj, "scenes")))
    print("renderer branch:", "arnold" if arnold else "mayaSoftware")
    print("scenes written :", scenes)
    print("problems       :", result["problems"])
    assert "Bhatia Mittansh -Bell Character-final.mb" in scenes
    assert not result["problems"], result["problems"]
    shutil.rmtree(tmp)


if __name__ == "__main__":
    run(False)
    run(True)
    print("SMOKE TEST OK")
