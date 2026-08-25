import paramiko
import os
import socket
import sys
from stat import S_ISDIR

def detect_host():
    hosts = [
        ('192.168.1.12', 'Local Network'),
        ('10.147.19.13', 'ZeroTier')
    ]
    for ip, label in hosts:
        print(f"Checking connection to {label} ({ip}:22)...")
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2.0)
        try:
            s.connect((ip, 22))
            s.close()
            print(f"--> Found active host: {label} ({ip})")
            return ip
        except Exception:
            print(f"   {label} ({ip}) is not reachable.")
            continue
    return None

PORT = 22
USER = 'deamok'
PASS = 'sa123'
REMOTE_DIR = '/home/deamok/e-lapak'
LOCAL_DIR = os.path.dirname(os.path.abspath(__file__))

def ssh_command(ssh, command):
    print(f"Running: {command}")
    stdin, stdout, stderr = ssh.exec_command(command)
    print("STDOUT:", stdout.read().decode())
    err = stderr.read().decode()
    if err:
        print("STDERR:", err)

def sftp_upload_dir(sftp, local_dir, remote_dir):
    try:
        sftp.stat(remote_dir)
    except FileNotFoundError:
        sftp.mkdir(remote_dir)

    ignored = {'.git', 'node_modules', '__pycache__', 'deploy.py', 'deploy.ps1', 'check_docker.py', 'check_npm.py', 'jalankan_lokal.bat', 'upload_ke_server.bat', 'start_local.ps1'}
    for item in os.listdir(local_dir):
        if item in ignored or item.endswith('.lnk') or item.endswith('.pyc'):
            continue
        
        local_path = os.path.join(local_dir, item)
        remote_path = remote_dir + '/' + item

        if os.path.isfile(local_path):
            print(f"Uploading {local_path} to {remote_path}")
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            sftp_upload_dir(sftp, local_path, remote_path)

def main():
    print("Detecting server host...")
    host = detect_host()
    if not host:
        print("ERROR: Cannot reach server. Check network/ZeroTier.")
        sys.exit(1)
        
    print(f"Connecting to SSH at {host}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(host, port=PORT, username=USER, password=PASS, timeout=30, banner_timeout=30, auth_timeout=30)
        ssh.get_transport().set_keepalive(5)
        
        print("Creating remote directory...")
        ssh_command(ssh, f"mkdir -p {REMOTE_DIR}")
        
        print("Uploading files via SFTP...")
        sftp = ssh.open_sftp()
        sftp_upload_dir(sftp, LOCAL_DIR, REMOTE_DIR)
        sftp.close()
        
        print("Stopping old container...")
        ssh_command(ssh, f"echo {PASS} | sudo -S docker compose -f {REMOTE_DIR}/docker-compose.yml down 2>&1")

        print("Building fresh image (no cache)...")
        ssh_command(ssh, f"echo {PASS} | sudo -S docker compose -f {REMOTE_DIR}/docker-compose.yml build --no-cache 2>&1")

        print("Starting container...")
        ssh_command(ssh, f"echo {PASS} | sudo -S docker compose -f {REMOTE_DIR}/docker-compose.yml up -d 2>&1")
        
        print("Checking assigned port...")
        ssh_command(ssh, f"echo {PASS} | sudo -S docker port elapak-web 80 2>&1")
        
        print("\nDeployment completed successfully!")
    except Exception as e:
        print("Error during deployment:", e)
    finally:
        ssh.close()

if __name__ == "__main__":
    main()
