import socket
import threading

# Configuración del cliente
HOST = '127.0.0.1'  # Cambia a la dirección IP o nombre de dominio del servidor
PORT = 8080

# Crear un socket del cliente
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((HOST, PORT))

# Función para enviar mensajes al servidor
def send_message():
    name = input("Ingrese su nombre: ")
    client.send(name.encode('utf-8'))

    while True:
        message = input()
        client.send(message.encode('utf-8'))

# Función para recibir mensajes del servidor
def receive_message():
    while True:
        try:
            message = client.recv(1024).decode('utf-8')
            print(message)
        except:
            print("Ha ocurrido un error al recibir el mensaje.")
            client.close()
            break

# Iniciar hilos para enviar y recibir mensajes
send_thread = threading.Thread(target=send_message)
receive_thread = threading.Thread(target=receive_message)

send_thread.start()
receive_thread.start()
