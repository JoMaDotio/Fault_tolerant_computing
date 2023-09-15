import socket
import threading

# Configuración del servidor
HOST = '0.0.0.0'  # Escucha en todas las interfaces de red
PORT = 8080

# Variable para mantener el estado del servidor
server_running = True

# Función para detener el servidor cuando se presiona "Esc"
def stop_server():
    global server_running
    input("Presiona 'Enter' para detener el servidor...")
    server_running = False

# Crear un socket del servidor
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))

# Lista para mantener un registro de todos los clientes conectados
clients = {}
clients_threads: threading.Thread = []


# Función para transmitir mensajes a todos los clientes
def broadcast(message, client_socket):
    name = clients[client_socket]
    message_with_name = f"{name}: {message}"
    for client in clients:
        if client != client_socket:
            try:
                client.send(message_with_name.encode('utf-8'))
            except:
                # Si hay un problema al enviar el mensaje, desconectar al cliente
                client.close()
                remove(client)

# Función para eliminar un cliente de la lista
def remove(client_socket):
    if client_socket in clients:
        name = clients[client_socket]
        print(f"{name} se ha desconectado.")
        del clients[client_socket]

# Función principal para manejar las conexiones de los clientes
def handle_client(client_socket):
    try:
        name = client_socket.recv(1024).decode('utf-8')
        print(f"{name} se ha conectado.")
        clients[client_socket] = name

        while server_running:
            message = client_socket.recv(1024)
            if message:
                # Transmite el mensaje a todos los clientes
                broadcast(message.decode('utf-8'), client_socket)
            else:
                # Si no hay datos recibidos, desconectar al cliente
                remove(client_socket)
        
        return
    except:
        pass

# Función principal del servidor
def main():
    server.listen(5)
    print("Servidor de chat en ejecución en el puerto", PORT)
    # Inicia un hilo para detener el servidor
    stop_thread = threading.Thread(target=stop_server)
    stop_thread.start()

    while server_running:
        print("Running")
        client_socket, client_address = server.accept()
        print("Conexión establecida desde:", client_address)
        clients[client_socket] = ""
        # Iniciar un hilo para manejar al cliente
        client_thread = threading.Thread(target=handle_client, args=(client_socket,))
        clients_threads.append(client_thread)
        client_thread.start()

    stop_thread.join()
    client_thread.join()
    for client_thread in clients_threads:
        client_thread.join()

if __name__ == "__main__":
    main()
