"""Checks tools/maya_live.py against a fake local command port (no Maya)."""
import socket
import threading

import maya_live


def serve(srv, got):
    conn, _ = srv.accept()
    with conn:
        buf = b""
        while len(got) < 4:
            buf += conn.recv(4096)
            while b"\n" in buf:
                line, buf = buf.split(b"\n", 1)
                got.append(line.decode())
                conn.sendall(b"ok\x00")


def test_sends_four_steps():
    srv = socket.socket()
    srv.bind(("127.0.0.1", 0))
    srv.listen(1)
    got = []
    t = threading.Thread(target=serve, args=(srv, got), daemon=True)
    t.start()
    maya_live.main(["--port", str(srv.getsockname()[1]), "--root", "/tmp/proj", "--delay", "0.1", "--no-render"])
    t.join(5)
    assert got[-1] == "bm.main()"
    assert "bm.LIVE_DELAY = 0.1" in got[2] and "bm.DO_RENDER = False" in got[2]
    assert got[2].startswith("bm.PROJECT_ROOT = '/tmp/proj'")


def test_refuses_remote_host():
    try:
        maya_live.main(["--host", "203.0.113.5"])
    except SystemExit as exc:
        assert "non-local" in str(exc)
    else:
        raise AssertionError("remote host was not refused")


if __name__ == "__main__":
    test_sends_four_steps()
    test_refuses_remote_host()
    print("maya_live tests OK")
