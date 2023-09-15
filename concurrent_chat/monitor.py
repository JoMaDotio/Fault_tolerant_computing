import psutil
import subprocess
import time

# Comando de inicio del servidor de chat (windows)
# El comando se conforma del path al ejecutable de pythom + espacio + el path del archivo ejecutado (windows)
SERVER_START_COMMAND = "C:\\Windows\\py.exe D:\\local_server\\server.py"

def is_server_running():
    for process in psutil.process_iter(attrs=['pid', 'cmdline']):
        if process.info['cmdline'] and SERVER_START_COMMAND in ' '.join(process.info['cmdline']):
            return True
    return False

def start_server():
    subprocess.Popen(SERVER_START_COMMAND, shell=True)

def main():
    while True:
        if not is_server_running():
            start_server()
        time.sleep(60)  # Verifica cada 60 segundos si el servidor está en ejecución

if __name__ == "__main__":
    main()
