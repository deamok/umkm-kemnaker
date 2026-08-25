"""
restore.py - Full Restore Script for Warung Digital / Yuuk Jajan (e-Lapak Kemnaker)

Mampu memulihkan:
1. Database Cloud Firestore (Users, Lapaks, Products, Orders, Chats)
2. Source Code & Konfigurasi Web App
3. Sesi WhatsApp Evolution API (Docker Volumes) ke Server Remote

Penggunaan:
  python restore.py                # Mode interaktif (pilih backup terbaru)
  python restore.py --all          # Restore semua komponen otomatis
  python restore.py --db           # Hanya restore Database Firestore
  python restore.py --code         # Hanya restore Source Code
  python restore.py --evolution    # Hanya restore Sesi WhatsApp Evolution API
  python restore.py --file <path>  # Gunakan file zip backup tertentu
"""

import os
import sys
import json
import zipfile
import urllib.request
import urllib.error
import socket
import tempfile
import shutil
import glob

# Support UTF-8 output on Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Konfigurasi
PROJECT_ID = "jajan-yuk-5e71a"

SERVER_HOSTS = [
    ('192.168.1.12', 'Local Network'),
    ('10.147.19.13', 'ZeroTier')
]
SERVER_PORT = 22
SERVER_USER = 'deamok'
SERVER_PASS = 'sa123'

LOCAL_DIR = os.path.dirname(os.path.abspath(__file__))
BACKUP_ROOT = os.path.join(LOCAL_DIR, "backups")

# -------------------------------------------------------------
# Helper: Konversi Python Native -> Firestore REST Format
# -------------------------------------------------------------
def py_to_firestore_val(val):
    if isinstance(val, bool):
        return {"booleanValue": val}
    elif isinstance(val, int):
        return {"integerValue": str(val)}
    elif isinstance(val, float):
        return {"doubleValue": val}
    elif isinstance(val, str):
        return {"stringValue": val}
    elif isinstance(val, list):
        return {"arrayValue": {"values": [py_to_firestore_val(x) for x in val]}}
    elif isinstance(val, dict):
        return {"mapValue": {"fields": {k: py_to_firestore_val(v) for k, v in val.items()}}}
    elif val is None:
        return {"nullValue": None}
    return {"stringValue": str(val)}

def dict_to_firestore_fields(data_dict):
    fields = {}
    for k, v in data_dict.items():
        if k.startswith("_"):
            continue  # Abaikan field metadata internal seperti _doc_id
        fields[k] = py_to_firestore_val(v)
    return fields

# -------------------------------------------------------------
# 1. Restore Database Firestore
# -------------------------------------------------------------
def restore_firestore(temp_dir):
    json_path = os.path.join(temp_dir, "firestore_database.json")
    if not os.path.exists(json_path):
        print("   ⚠️ File firestore_database.json tidak ditemukan di dalam paket backup.")
        return False

    print("\n📦 [1/3] Memulai Restore Database Cloud Firestore...")
    with open(json_path, "r", encoding="utf-8") as f:
        db_backup = json.load(f)

    total_restored = 0
    for col, data in db_backup.items():
        docs = data.get("clean", [])
        if not docs:
            continue

        print(f"   --> Memulihkan koleksi '{col}' ({len(docs)} dokumen)...")
        for doc_item in docs:
            doc_id = doc_item.get("_doc_id")
            if not doc_id:
                continue

            fields = dict_to_firestore_fields(doc_item)
            payload = json.dumps({"fields": fields}).encode("utf-8")
            url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{col}/{doc_id}"

            try:
                req = urllib.request.Request(
                    url,
                    data=payload,
                    headers={
                        "Content-Type": "application/json",
                        "User-Agent": "Mozilla/5.0"
                    },
                    method="PATCH"
                )
                with urllib.request.urlopen(req, timeout=10) as res:
                    total_restored += 1
            except Exception as e:
                print(f"      ⚠️ Gagal restore dokumen {col}/{doc_id}: {e}")

    print(f"   ✓ Sukses memulihkan {total_restored} dokumen ke Firestore!")
    return True

# -------------------------------------------------------------
# 2. Restore Source Code
# -------------------------------------------------------------
def restore_source_code(temp_dir):
    code_dir = os.path.join(temp_dir, "code")
    if not os.path.exists(code_dir):
        print("   ⚠️ Folder code tidak ditemukan di dalam paket backup.")
        return False

    print("\n💻 [2/3] Memulihkan Source Code & Konfigurasi...")
    for item in os.listdir(code_dir):
        src = os.path.join(code_dir, item)
        dst = os.path.join(LOCAL_DIR, item)

        if os.path.isdir(src):
            shutil.copytree(src, dst, dirs_exist_ok=True)
        else:
            shutil.copy2(src, dst)

    print("   ✓ Sukses memulihkan file source code proyek lokal!")
    return True

# -------------------------------------------------------------
# 3. Restore WhatsApp Evolution Sessions (Remote Server)
# -------------------------------------------------------------
def detect_server_host():
    for ip, label in SERVER_HOSTS:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2.0)
        try:
            s.connect((ip, SERVER_PORT))
            s.close()
            return ip, label
        except Exception:
            continue
    return None, None

def restore_evolution_sessions(temp_dir):
    tar_path = os.path.join(temp_dir, "evolution_sessions.tar.gz")
    if not os.path.exists(tar_path):
        print("   ⚠️ File evolution_sessions.tar.gz tidak ditemukan di dalam paket backup.")
        return False

    print("\n💬 [3/3] Memeriksa koneksi Server untuk restore Sesi WhatsApp...")
    ip, label = detect_server_host()
    if not ip:
        print("   ⚠️ Server tidak terjangkau (offline / ZeroTier mati). Melewati restore sesi Evolution.")
        return False

    print(f"   --> Terhubung ke server {label} ({ip}). Mengunggah sesi WhatsApp...")
    try:
        import paramiko
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip, port=SERVER_PORT, username=SERVER_USER, password=SERVER_PASS, timeout=30)

        remote_tar = "/tmp/evolution_restore.tar.gz"
        sftp = ssh.open_sftp()
        sftp.put(tar_path, remote_tar)
        sftp.close()

        print("   --> Menghentikan container Evolution sementara...")
        ssh.exec_command(f"echo {SERVER_PASS} | sudo -S docker stop evolution-api 2>&1")

        print("   --> Mengekstrak volume Docker...")
        cmd = f"echo {SERVER_PASS} | sudo -S docker run --rm -v evolution_instances:/instances -v evolution_store:/store -v /tmp:/backup alpine sh -c 'tar -xzf /backup/evolution_restore.tar.gz -C /' 2>&1"
        stdin, stdout, stderr = ssh.exec_command(cmd)
        stdout.read()

        print("   --> Menyalakan kembali container Evolution API...")
        ssh.exec_command(f"echo {SERVER_PASS} | sudo -S docker start evolution-api 2>&1")
        ssh.exec_command(f"rm -f {remote_tar}")
        ssh.close()

        print("   ✓ Sukses memulihkan sesi WhatsApp Evolution API di server!")
        return True
    except Exception as e:
        print(f"   ⚠️ Gagal restore sesi Evolution ke server: {e}")
        return False

# -------------------------------------------------------------
# Main Runner
# -------------------------------------------------------------
def get_latest_backup():
    if not os.path.exists(BACKUP_ROOT):
        return None
    backups = glob.glob(os.path.join(BACKUP_ROOT, "backup_*.zip"))
    if not backups:
        return None
    backups.sort(key=os.path.getmtime, reverse=True)
    return backups[0]

def run_restore():
    args = sys.argv[1:]
    backup_file = None

    # Parse args
    if "--file" in args:
        idx = args.index("--file")
        if idx + 1 < len(args):
            backup_file = args[idx + 1]

    if not backup_file:
        backup_file = get_latest_backup()

    if not backup_file or not os.path.exists(backup_file):
        print("❌ Tidak ditemukan file backup di folder 'backups/'. Silakan jalankan 'python backup.py' terlebih dahulu.")
        sys.exit(1)

    print("========================================================")
    print("🔄 RESTORE WARUNG DIGITAL / YUUK JAJAN")
    print(f"📁 Menggunakan backup: {os.path.basename(backup_file)}")
    print("========================================================")

    # Determine what to restore
    do_db = "--db" in args or "--all" in args
    do_code = "--code" in args or "--all" in args
    do_evo = "--evolution" in args or "--all" in args

    if not (do_db or do_code or do_evo):
        print("\nPilih komponen yang ingin dipulihkan:")
        print("  1. Semua Komponen (Database Firestore + Source Code + Sesi WA)")
        print("  2. Hanya Database Firestore")
        print("  3. Hanya Source Code Web")
        print("  4. Hanya Sesi WhatsApp Evolution API di Server")
        print("  0. Batal")
        choice = input("\nMasukkan pilihan (1-4) [default: 1]: ").strip() or "1"

        if choice == "1":
            do_db = do_code = do_evo = True
        elif choice == "2":
            do_db = True
        elif choice == "3":
            do_code = True
        elif choice == "4":
            do_evo = True
        else:
            print("Operasi dibatalkan.")
            sys.exit(0)

    temp_dir = tempfile.mkdtemp(prefix="elapak_restore_")
    try:
        print("\n📂 Mengekstrak arsip backup...")
        with zipfile.ZipFile(backup_file, "r") as zf:
            zf.extractall(temp_dir)

        if do_db:
            restore_firestore(temp_dir)
        if do_code:
            restore_source_code(temp_dir)
        if do_evo:
            restore_evolution_sessions(temp_dir)

        print("\n========================================================")
        print("🎉 RESTORE SELESAI!")
        print("========================================================")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == "__main__":
    run_restore()
