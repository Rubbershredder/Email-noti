import requests
import json
from kafka import KafkaConsumer

# Kafka consumer settings
consumer = KafkaConsumer(
    'email-topic',
    bootstrap_servers='localhost:9092',
    auto_offset_reset='latest',  # Read only new messages
    enable_auto_commit=True,
    group_id='email-group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

print("Connected to Kafka topic 'email-topic' at localhost:9092")

# URL for Strapi API endpoint
strapi_url = "http://localhost:1337/api/email/sendTestEmail"

# Listen for messages on the Kafka topic
for message in consumer:
    email_data = message.value
    print(f"Received message: {email_data}")

    # Send the received data to Strapi via POST request
    try:
        response = requests.post(strapi_url, json=email_data)
        response.raise_for_status()  # Raises an error for 4xx/5xx responses
        print(f"Successfully sent data to Strapi: {email_data}")
    except requests.exceptions.RequestException as e:
        print(f"Error occurred: {e}")
