from kafka import KafkaProducer
import json

# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],  # Update with your Kafka broker address
    value_serializer=lambda v: json.dumps(v).encode('utf-8')  # Serialize data to JSON format
)

# Message payload (This should match your consumer's expected structure)
email_data = {
    "subject": "Custom Subject",
    "recipientEmail": "pacmanatwork26@gmail.com",
    "organizationName": "ACME Corp",
    "teamName": "QA Team",
    "recipientName": "John Doe",
    "htmlContent": "Optional custom HTML content"
}

# Send the message to the topic
producer.send('email-topic', value=email_data)
print(f"Sent email data to Kafka topic 'email-topic': {email_data}")

# Ensure all messages are sent before closing the producer
producer.flush()
producer.close()
