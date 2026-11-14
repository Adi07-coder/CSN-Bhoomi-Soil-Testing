"""
AI Bhoomi - Backend Server Launcher with Dynamic Port Fallback
==============================================================
Automatically starts FastAPI/Uvicorn on port 8000.
If port 8000 is occupied by another process, it automatically increments
and binds to the next available port (8001, 8002, 8003, etc.).
Also synchronizes frontend/.env.local so Vite connects seamlessly.
"""

import os
import sys
import socket
from pathlib import Path

# Add backend directory to sys.path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

DEFAULT_PORT = int(os.getenv("PORT", "8000"))
DEFAULT_HOST = os.getenv("HOST", "0.0.0.0")


def is_port_free(port: int, host: str = "127.0.0.1") -> bool:
    """Check if a port is free on both 127.0.0.1 and 0.0.0.0."""
    for test_host in [host, "0.0.0.0"]:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                s.bind((test_host, port))
        except OSError:
            return False
    return True


def find_next_available_port(start_port: int = 8000, max_attempts: int = 50, host: str = "0.0.0.0") -> int:
    """Iterate starting from start_port until a free port is found."""
    for port in range(start_port, start_port + max_attempts):
        if is_port_free(port, "127.0.0.1"):
            return port
        print(f"[!] Port {port} is currently occupied by another process. Trying port {port + 1}...")
    raise RuntimeError(f"Could not find an available port between {start_port} and {start_port + max_attempts}!")


def sync_active_port(port: int):
    """Save active port to backend/.active_port and sync frontend/.env.local."""
    # 1. backend/.active_port
    active_port_file = BACKEND_DIR / ".active_port"
    try:
        active_port_file.write_text(str(port), encoding="utf-8")
    except Exception as e:
        print(f"[-] Notice: Could not save .active_port: {e}")

    # 2. frontend/.env.local
    frontend_dir = BACKEND_DIR.parent / "frontend"
    if frontend_dir.exists():
        env_local = frontend_dir / ".env.local"
        try:
            env_local.write_text(f"VITE_API_BASE_URL=http://localhost:{port}\n", encoding="utf-8")
            print(f"[OK] Synchronized frontend/.env.local -> VITE_API_BASE_URL=http://localhost:{port}")
        except Exception as e:
            print(f"[-] Notice: Could not write frontend/.env.local: {e}")


def main():
    import uvicorn

    port = find_next_available_port(DEFAULT_PORT, host=DEFAULT_HOST)

    if port != DEFAULT_PORT:
        print("\n" + "=" * 60)
        print(f" [PORT SWITCH] Initial port {DEFAULT_PORT} was already in use.")
        print(f" [PORT SWITCH] Successfully switched backend to: http://localhost:{port}")
        print("=" * 60 + "\n")
    else:
        print(f"[+] Initial port {port} is available.")

    sync_active_port(port)

    print(f"[->] Starting Uvicorn FastAPI Server on http://{DEFAULT_HOST}:{port} ...\n")
    uvicorn.run("app.main:app", host=DEFAULT_HOST, port=port, reload=True)


if __name__ == "__main__":
    main()
