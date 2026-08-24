import paramiko

HOST = '192.168.1.12'
PORT = 22
USER = 'deamok'
PASS = 'sa123'

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(HOST, port=PORT, username=USER, password=PASS, timeout=30, banner_timeout=30, auth_timeout=30)
        ssh.get_transport().set_keepalive(5)
        
        print("--- Docker PS ---")
        stdin, stdout, stderr = ssh.exec_command(f"sudo -S docker ps -a << EOF\n{PASS}\nEOF")
        print(stdout.read().decode())
        
        print("--- Docker Logs ---")
        stdin, stdout, stderr = ssh.exec_command(f"sudo -S docker logs elapak-web << EOF\n{PASS}\nEOF")
        print(stdout.read().decode())
        print("STDERR:", stderr.read().decode())
        
        print("--- Firewall Status ---")
        stdin, stdout, stderr = ssh.exec_command(f"sudo -S ufw status << EOF\n{PASS}\nEOF")
        print(stdout.read().decode())
        
    except Exception as e:
        print("Error:", e)
    finally:
        ssh.close()

if __name__ == "__main__":
    main()
