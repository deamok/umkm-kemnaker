"""
deploy.py - Deployment Script for e-Lapak Kemnaker to Docker Server

Mekanisme:
1. Otomatis deteksi host aktif (LAN 192.168.1.12 atau ZeroTier 10.147.19.13).
2. Sinkronisasi kode di server via Git Pull (cepat & efisien).
3. Fallback sinkronisasi berkas via SFTP jika git belum tersinkron.
4. Rebuild & jalankan container elapak-web via Docker Compose.
"""

import os
import sys
import socket
import paramiko

# Support UTF-8 output on Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

HOSTS = [
    ('192.168.1.12', 'Local Network'),
    ('10.147.19.13', 'ZeroTier')
]
PORT = 22
USER = 'deamok'
PASS = 'sa123'
REMOTE_DIR = '/home/deamok/e-umkm'
LOCAL_DIR = os.path.dirname(os.path.abspath(__file__))

def detect_host():
    for ip, label in HOSTS:
        print(f"Memeriksa koneksi ke {label} ({ip}:{PORT})...")
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2.0)
        try:
            s.connect((ip, PORT))
            s.close()
            print(f"--> Terhubung ke {label} ({ip})")
            return ip
        except Exception:
            print(f"    {label} ({ip}) tidak terjangkau.")
            continue
    return None

def run_ssh(ssh, cmd):
    print(f"\n[EXEC] {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore').strip()
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    if out:
        print(out)
    if err and "warning" not in err.lower():
        print("[ERR]", err)
    return out

def sftp_sync_dir(sftp, local_dir, remote_dir):
    try:
        sftp.stat(remote_dir)
    except FileNotFoundError:
        sftp.mkdir(remote_dir)

    ignored = {
        '.git', 'node_modules', '__pycache__', 'backups',
        'deploy.py', 'deploy.bat', 'backup.bat',
        'backup.py', 'restore.bat', 'restore.py', 'jalankan_lokal.bat'
    }
    for item in os.listdir(local_dir):
        if item in ignored or item.endswith('.pyc') or item.endswith('.tmp'):
            continue
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"

        if os.path.isfile(local_path):
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            sftp_sync_dir(sftp, local_path, remote_path)

def main():
    print("=" * 60)
    print("🚀 DEPLOY e-Lapak Kemnaker -> Server Docker")
    print("=" * 60)

    host = detect_host()
    if not host:
        print("\n❌ GAGAL: Tidak dapat terhubung ke server (cek LAN / ZeroTier).")
        sys.exit(1)

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        ssh.connect(host, port=PORT, username=USER, password=PASS, timeout=15)
        print(f"✓ Berhasil login SSH ke {USER}@{host}\n")

        # 1. Pastikan folder kerja di server
        run_ssh(ssh, f"mkdir -p {REMOTE_DIR}")

        # 2. Cek apakah repositori Git tersedia di server
        git_check = run_ssh(ssh, f"test -d {REMOTE_DIR}/.git && echo 'GIT_EXISTS' || echo 'NO_GIT'")
        if 'GIT_EXISTS' in git_check:
            print("\n📥 Menarik update terbaru via Git Pull...")
            run_ssh(ssh, f"cd {REMOTE_DIR} && git fetch origin && git reset --hard origin/main")
        else:
            print("\n📦 Repositori git belum ada, mengunggah via SFTP...")
            sftp = ssh.open_sftp()
            sftp_sync_dir(sftp, LOCAL_DIR, REMOTE_DIR)
            sftp.close()

        # 3. Jalankan Docker Compose
        print("\n🐳 Membangun dan menjalankan container Docker...")
        run_ssh(ssh, f"cd {REMOTE_DIR} && docker compose up -d --build")

        # 4. Verifikasi status container
        print("\n🔍 Memeriksa status container elapak-web...")
        status = run_ssh(ssh, "docker ps --filter 'name=elapak-web' --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'")
        print(status)

        print("\n" + "=" * 60)
        print("🎉 DEPLOYMENT BERHASIL & AKTIF!")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Terjadi kesalahan saat deployment: {e}")
        sys.exit(1)
    finally:
        ssh.close()

if __name__ == "__main__":
    main()
