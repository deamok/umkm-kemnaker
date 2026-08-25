"""
backup.py - Full Backup Script for Warung Digital / Yuuk Jajan (e-Lapak Kemnaker)

Mencakup:
1. Database Cloud Firestore (Users, Lapaks, Products, Orders, Chats) -> JSON
2. Source Code & Konfigurasi Web App -> ZIP
3. Sesi WhatsApp Evolution API (Docker Volumes) dari Server Remote -> TAR.GZ

Semua dibundel menjadi 1 arsip: backups/backup_YYYYMMDD_HHMMSS.zip
"""

import os
import sys
import json
import zipfile
import datetime
import urllib.request
import urllib.error
import socket
import tempfile
import shutil

# Support UTF-8 output on Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Konfigurasi
PROJECT_ID = "jajan-yuk-5e71a"
COLLECTIONS = ["users", "lapaks", "products", "orders", "chats"]

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
# Helper: Konversi Tipe Data Firestore REST <-> Python Native
# -------------------------------------------------------------
def firestore_to_dict(fields):
    result = {}
    for key, val in fields.items():
        result[key] = decode_firestore_val(val)
    return result

def decode_firestore_val(val):
    if "stringValue" in val:
        return val["stringValue"]
    elif "integerValue" in val:
        try:
            return int(val["integerValue"])
        except ValueError:
            return val["integerValue"]
    elif "doubleValue" in val:
        return float(val["doubleValue"])
    elif "booleanValue" in val:
        return bool(val["booleanValue"])
    elif "timestampValue" in val:
        return val["timestampValue"]
    elif "nullValue" in val:
        return None
    elif "mapValue" in val:
        return firestore_to_dict(val["mapValue"].get("fields", {}))
    elif "arrayValue" in val:
        values = val["arrayValue"].get("values", [])
        return [decode_firestore_val(v) for v in values]
    return str(val)

# -------------------------------------------------------------
# 1. Backup Firestore Database
# -------------------------------------------------------------
def backup_firestore(output_dir):
    print("\n📦 [1/3] Memulai backup Database Cloud Firestore...")
    db_backup = {}
    total_docs = 0

    for col in COLLECTIONS:
        url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{col}?pageSize=1000"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as res:
                data = json.loads(res.read().decode("utf-8"))
                raw_docs = data.get("documents", [])
                
                parsed_docs = []
                for doc in raw_docs:
                    doc_id = doc.get("name", "").split("/")[-1]
                    fields = doc.get("fields", {})
                    data_dict = firestore_to_dict(fields)
                    data_dict["_doc_id"] = doc_id
                    parsed_docs.append(data_dict)
                
                db_backup[col] = {
                    "count": len(parsed_docs),
                    "raw": raw_docs,
                    "clean": parsed_docs
                }
                total_docs += len(parsed_docs)
                print(f"   ✓ Koleksi '{col}': {len(parsed_docs)} dokumen")
        except Exception as e:
            print(f"   ⚠️ Gagal mengambil koleksi '{col}': {e}")
            db_backup[col] = {"count": 0, "raw": [], "clean": []}

    json_path = os.path.join(output_dir, "firestore_database.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(db_backup, f, indent=2, ensure_ascii=False)
    
    print(f"   --> Berhasil mengekspor {total_docs} dokumen ke JSON ({os.path.basename(json_path)})")
    return json_path

# -------------------------------------------------------------
# 2. Backup Remote Server WhatsApp Evolution API Sesi (SSH)
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

def backup_evolution_sessions(output_dir):
    print("\n💬 [2/3] Memeriksa koneksi Server untuk backup Sesi WhatsApp (Evolution API)...")
    ip, label = detect_server_host()
    if not ip:
        print("   ⚠️ Server tidak terjangkau (offline / ZeroTier mati). Melewati backup sesi Evolution.")
        return None

    print(f"   --> Terhubung ke server {label} ({ip}). Mengarsip volume Docker...")
    try:
        import paramiko
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip, port=SERVER_PORT, username=SERVER_USER, password=SERVER_PASS, timeout=30)

        remote_tar = "/tmp/evolution_backup.tar.gz"
        # Buat tar.gz volume evolution_instances dan evolution_store via helper alpine container
        cmd = f"echo {SERVER_PASS} | sudo -S docker run --rm -v evolution_instances:/instances -v evolution_store:/store -v /tmp:/backup alpine tar -czf /backup/evolution_backup.tar.gz -C / instances store 2>&1"
        stdin, stdout, stderr = ssh.exec_command(cmd)
        stdout.read() # wait finish

        local_tar = os.path.join(output_dir, "evolution_sessions.tar.gz")
        sftp = ssh.open_sftp()
        sftp.get(remote_tar, local_tar)
        # Hapus temporary file di server
        ssh.exec_command(f"rm -f {remote_tar}")
        sftp.close()
        ssh.close()

        print(f"   ✓ Berhasil mengunduh backup sesi Evolution API ({os.path.basename(local_tar)})")
        return local_tar
    except Exception as e:
        print(f"   ⚠️ Gagal membackup sesi Evolution dari server: {e}")
        return None

# -------------------------------------------------------------
# 3. Bundling Full Backup Zip
# -------------------------------------------------------------
def create_full_backup():
    os.makedirs(BACKUP_ROOT, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_dir = tempfile.mkdtemp(prefix="elapak_backup_")

    try:
        # 1. DB
        backup_firestore(temp_dir)

        # 2. Evolution
        backup_evolution_sessions(temp_dir)

        # 3. Source Code
        print("\n💻 [3/3] Mengarsip Source Code & Konfigurasi Web App...")
        code_dir = os.path.join(temp_dir, "code")
        os.makedirs(code_dir, exist_ok=True)

        include_folders = ["app", "css", "img"]
        include_files = [
            "index.html", "Dockerfile", "docker-compose.yml", "nginx.conf",
            "vercel.json", "README.md", "deploy.py", "deploy.ps1",
            "jalankan_lokal.bat", "upload_ke_server.bat", "start_local.ps1",
            "check_docker.py", "check_npm.py", ".dockerignore"
        ]

        for folder in include_folders:
            src = os.path.join(LOCAL_DIR, folder)
            if os.path.exists(src):
                shutil.copytree(src, os.path.join(code_dir, folder))

        for file_name in include_files:
            src = os.path.join(LOCAL_DIR, file_name)
            if os.path.exists(src):
                shutil.copy2(src, os.path.join(code_dir, file_name))

        # Metadata backup
        metadata = {
            "backup_date": datetime.datetime.now().isoformat(),
            "project": "Warung Digital / Yuuk Jajan (e-Lapak)",
            "firebase_project": PROJECT_ID,
            "included": ["firestore_database", "evolution_sessions", "source_code"]
        }
        with open(os.path.join(temp_dir, "backup_manifest.json"), "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        # Create Final ZIP
        final_zip = os.path.join(BACKUP_ROOT, f"backup_{timestamp}.zip")
        with zipfile.ZipFile(final_zip, "w", zipfile.ZIP_DEFLATED) as zf:
            for root, _, files in os.walk(temp_dir):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, temp_dir)
                    zf.write(full_path, rel_path)

        size_mb = os.path.getsize(final_zip) / (1024 * 1024)
        print("\n========================================================")
        print(f"🎉 FULL BACKUP SELESAI!")
        print(f"📁 Lokasi: {final_zip}")
        print(f"📊 Ukuran: {size_mb:.2f} MB")
        print("========================================================")
        return final_zip

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == "__main__":
    create_full_backup()
