import prefect
from prefect import task, flow, get_run_logger
from prefect.task_runners import SequentialTaskRunner
from prefect.tasks import task_input_hash
from datetime import timedelta
import requests
import sqlite3


# Tarea para obtener datos de la API de usuarios una vez cada 23 horas para evitar el gasto computacional
@task(cache_key_fn=task_input_hash, cache_expiration=timedelta(hours=23))
def get_users_data():
    try:
        # Realiza una solicitud GET a la API gratuita de usuarios
        response = requests.get("https://reqres.in/api/users?per_page=5")
        response.raise_for_status()  # Lanza una excepción si la solicitud no tiene éxito
        data = response.json()["data"]
        return data
    except Exception as e:
        # Registra un mensaje de error si la solicitud falla
        logger = get_run_logger()
        logger.error(f"Error en la solicitud de la API de usuarios: {e}")
        raise

# Tarea para procesar los datos y extraer 5 atributos
@task
def process_user_data(users_data):
    try:
        processed_data = []
        for user in users_data:
            user_attributes = {
                "id": user["id"],
                "nombre": user["first_name"],
                "apellido": user["last_name"],
                "correo": user["email"],
                "avatar": user["avatar"],
            }
            processed_data.append(user_attributes)
        return processed_data
    except Exception as e:
        # Registra un mensaje de error si hay un error en el procesamiento de datos
        logger = get_run_logger()
        logger.error(f"Error en el procesamiento de datos de usuarios: {e}")
        raise

# Tarea para almacenar datos en una base de datos SQLite local
@task
def save_to_database(user_data):
    try:
        # Conecta a la base de datos SQLite local o crea una nueva si no existe
        conn = sqlite3.connect("user_data.db")
        cursor = conn.cursor()

        # Crea una tabla si no existe
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                nombre TEXT,
                apellido TEXT,
                correo TEXT,
                avatar TEXT
            )
        ''')

        # Limpiar la DB para hacer el backup-completo
        cursor.execute('''DELETE FROM users''')

        # Inserta los datos en la tabla
        for user in user_data:
            cursor.execute(
                "INSERT INTO users (id, nombre, apellido, correo, avatar) VALUES (?, ?, ?, ?, ?)",
                (user["id"], user["nombre"], user["apellido"], user["correo"], user["avatar"]),
            )

        # Guarda los cambios y cierra la conexión
        conn.commit()
        conn.close()
        return "Backup generado"
    except Exception as e:
        # Registra un mensaje de error si la inserción en la base de datos falla
        logger = get_run_logger()
        logger.error(f"Error al guardar los datos en la base de datos: {e}")
        raise


# Define el flujo Prefect
@flow(retries=3, retry_delay_seconds=90, task_runner=SequentialTaskRunner())
def back_up_production_db_to_spanish():
    users_data = get_users_data()
    processed_data = process_user_data(users_data)
    message = save_to_database(processed_data)
    logger = get_run_logger()
    logger.info(message)


if __name__ == "__main__":
    # back_up_production_db_to_spanish.serve(name="prod-deploy", cron="0 0 * * *")
    back_up_production_db_to_spanish()
