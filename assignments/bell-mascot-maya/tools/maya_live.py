"""Drive an already-open Maya over its local command port, to build the mascot live.

1) In Maya's Script Editor (Python tab) run this once. It listens on this computer only (127.0.0.1):

       import maya.cmds as cmds
       if not cmds.commandPort("127.0.0.1:7001", query=True):
           cmds.commandPort(name="127.0.0.1:7001", sourceType="python")

2) In a Terminal on the SAME computer, from the project folder:

       python3 tools/maya_live.py            # builds, pausing 0.6 s after each step
       python3 tools/maya_live.py --delay 1.5 --no-render

3) When done, close the port in Maya:

       cmds.commandPort(name="127.0.0.1:7001", close=True)

SECURITY: a command port runs whatever text it receives as Python with your user rights and has no
password. Keep it on 127.0.0.1, never expose it through a tunnel or the network, and close it afterwards.
"""
import argparse
import os
import socket
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_ROOT = os.path.normpath(os.path.join(HERE, ".."))


def send(sock, line, timeout):
    """Send one Python line; return Maya's reply (it ends with a NUL byte)."""
    sock.settimeout(timeout)
    sock.sendall(line.encode("utf-8") + b"\n")
    data = b""
    while not data.endswith(b"\x00"):
        chunk = sock.recv(65536)
        if not chunk:
            break
        data += chunk
    return data.rstrip(b"\x00").decode("utf-8", "replace").strip()


def commands(root, delay, render, reopen):
    scripts = os.path.join(root, "scripts")
    return [
        ("import modules", "import sys, importlib; sys.path.insert(0, %r)" % scripts),
        ("load build script", "import build_bell_mascot as bm; importlib.reload(bm)"),
        ("configure", "bm.PROJECT_ROOT = %r; bm.LIVE_DELAY = %r; bm.DO_RENDER = %r; bm.DO_REOPEN_CHECK = %r"
         % (root, delay, render, reopen)),
        ("build (watch the Maya viewport)", "bm.main()"),
    ]


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=7001)
    ap.add_argument("--root", default=DEFAULT_ROOT, help="project folder as seen by Maya's computer")
    ap.add_argument("--delay", type=float, default=0.6, help="seconds to pause after each build step")
    ap.add_argument("--no-render", action="store_true")
    ap.add_argument("--no-reopen", action="store_true")
    args = ap.parse_args(argv)
    if args.host not in ("127.0.0.1", "localhost", "::1"):
        sys.exit("Refusing to talk to a non-local host: a Maya command port has no password.")
    try:
        sock = socket.create_connection((args.host, args.port), timeout=5)
    except OSError as exc:
        sys.exit("Cannot reach Maya on %s:%d (%s). Run the commandPort snippet from this file's "
                 "header in Maya's Script Editor first." % (args.host, args.port, exc))
    with sock:
        for label, line in commands(args.root, args.delay, not args.no_render, not args.no_reopen):
            print("-> %s" % label)
            reply = send(sock, line, timeout=1800 if line == "bm.main()" else 60)
            if reply:
                print(reply)
            if "Error" in reply or "Traceback" in reply:
                sys.exit("Maya reported an error in step '%s'." % label)
    print("Done. Check Maya's Script Editor for the [BellMascot] summary.")


if __name__ == "__main__":
    main()
