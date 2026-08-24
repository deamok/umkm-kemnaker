import paramiko
import json

HOST = '192.168.1.12'
PORT = 22
USER = 'deamok'
PASS = 'sa123'

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(HOST, port=PORT, username=USER, password=PASS, timeout=30)
        
        print("--- Docker PS ---")
        stdin, stdout, stderr = ssh.exec_command(f"sudo -S docker ps --format '{{{{.Names}}}} : {{{{.Ports}}}}' << EOF\n{PASS}\nEOF")
        print(stdout.read().decode())
        
        print("--- Proxy Hosts ---")
        # Check NPM proxy hosts
        stdin, stdout, stderr = ssh.exec_command(f"sudo -S docker exec nginx-proxy-manager cat /data/nginx/proxy_host/1.conf /data/nginx/proxy_host/2.conf /data/nginx/proxy_host/3.conf /data/nginx/proxy_host/4.conf /data/nginx/proxy_host/5.conf /data/nginx/proxy_host/6.conf /data/nginx/proxy_host/7.conf 2>/dev/null << EOF\n{PASS}\nEOF")
        print(stdout.read().decode())
        
    except Exception as e:
        print("Error:", e)
    finally:
        ssh.close()

if __name__ == "__main__":
    main()
