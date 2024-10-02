from kafka import KafkaProducer
import json

class EmailProducer:
    def __init__(self, bootstrap_servers=['localhost:9092']):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )

    def send_email(self, email_data):
        future = self.producer.send('email-topic', value=email_data)
        try:
            future.get(timeout=10)  # Wait for the send to complete
            return True
        except Exception as e:
            print(f"An error occurred: {e}")
            return False

    def close(self):
        if self.producer is not None:
            self.producer.close()
            self.producer = None

producer = None

def get_producer():
    global producer
    if producer is None:
        producer = EmailProducer()
    return producer 