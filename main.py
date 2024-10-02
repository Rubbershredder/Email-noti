from flask import Flask, jsonify, redirect, url_for
from producer import get_producer

app = Flask(__name__)

@app.route('/')
def home():
    return 'hello'

@app.route('/produce')
def produce():
    producer = get_producer()
    email_data = {
        "subject": "Custom Subject",
        "recipientEmail": "pacmanatwork26@gmail.com",
        "organizationName": "ACME Corp",
        "teamName": "QA Team",
        "recipientName": "John Doe",
        "htmlContent": "Optional custom HTML content"
    }
    
    if producer.send_email(email_data):
        return redirect(url_for('home'))
    else:
        return jsonify({"error": "Failed to send email"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)