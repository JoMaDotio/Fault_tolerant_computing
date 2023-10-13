import requests
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2023, 10, 11),
    'retries': 1,
    'retry_delay': timedelta(minutes=1),
}

dag = DAG('ecommerce_data_pipeline', default_args=default_args, schedule_interval=timedelta(days=1))

def extract_data():
    response = requests.get('https://jsonplaceholder.typicode.com/posts')
    data = response.json()
    print(data)
    return data

def clean_data(**kwargs):
    ti = kwargs['ti']
    data = ti.xcom_pull(task_ids='extract_data')
    cleaned_data = []
    user_ids = set()
    for record in data:
        user_id = record['userId']
        if user_id not in user_ids:
            cleaned_data.append(record)
            user_ids.add(user_id)
    ti.xcom_push(key='cleaned_data', value=cleaned_data)

def transform_data(**kwargs):
    ti = kwargs['ti']
    cleaned_data = ti.xcom_pull(key='cleaned_data')
    print(f"Log de console: {cleaned_data}")

    transformed_data = []
    for record in cleaned_data:
        transformed_record = {
            'user_id': record['userId'],
            'title_and_body': f"{record['title']} - {record['body']}"
        }
        transformed_data.append(transformed_record)
    ti.xcom_push(key='transformed_data', value=transformed_data)

def load_data_to_warehouse(**kwargs):
    ti = kwargs['ti']
    transformed_data = ti.xcom_pull(key='transformed_data')
    # In this example, we are not performing data loading to a warehouse
    return "Data loaded successfully"

def send_notifications(**kwargs):
    # In this example, we are not sending actual notifications
    ti = kwargs['ti']
    results = ti.xcom_pull(task_ids='load_data_to_warehouse')
    return "Notification sent" if results else 'Error notification sent'

extract_task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_data,
    provide_context=True,
    dag=dag
)

clean_task = PythonOperator(
    task_id='clean_data',
    python_callable=clean_data,
    provide_context=True,
    dag=dag
)

transform_task = PythonOperator(
    task_id='transform_data',
    python_callable=transform_data,
    provide_context=True,
    dag=dag
)

load_task = PythonOperator(
    task_id='load_data_to_warehouse',
    python_callable=load_data_to_warehouse,
    provide_context=True,
    dag=dag
)

notification_task = PythonOperator(
    task_id='send_notifications',
    python_callable=send_notifications,
    provide_context=True,
    dag=dag
)

extract_task >> clean_task
clean_task >> transform_task
transform_task >> load_task
load_task >> notification_task
