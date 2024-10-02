# Email Notification System

This project implements an automated email notification system using Brevo for managing and sending emails, with integration through Strapi and Kafka.

## Features

* **Automated Email Notifications:** Sends emails to users based on specific events or triggers
* **Brevo Integration:** Uses Brevo (formerly Sendinblue) for sending emails via an automated process
* **Strapi Integration:** Collects user data from Strapi and utilizes it to personalize email notifications
* **User-Specific Notifications:** Email content tailored to user details stored in the Strapi admin panel
* **JSON Data Storage:** Saves incoming data from Strapi into a JSON file for easy retrieval and management
* **Kafka Integration:** Uses Kafka for messaging and queuing the notifications

## Project Structure

```
Email-noti/
├── backend/          # Strapi backend
├── frontend/         # React frontend
├── consumer.py       # Kafka consumer script
├── producer.py       # Kafka producer script
└── docker-compose.yml # Docker configuration for Kafka
```

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/Rubbershredder/Email-noti.git
cd Email-noti
```

2. Navigate to the backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables in `backend/.env`:
```
BREVO_API_KEY=your_brevo_api_key
STRAPI_URL=http://your_strapi_url
```

### Kafka Setup (Docker)

1. Ensure Docker and Docker Compose are installed
2. Start Kafka and Zookeeper:
```bash
docker-compose up -d
```

3. Install Kafka Python client:
```bash
pip install kafka-python
```

## Usage

1. Start the backend application:
```bash
cd backend
npm run develop
```

2. Kafka Setup:
   * Kafka broker available on `localhost:9092`
   * Use `producer.py` and `consumer.py` for message handling

3. Configure email templates:
   * Add templates in `/templates` folder
   * Configure triggers in `notification-config.js`

4. Logs are stored in `logs/` directory

## Technologies Used

* Strapi (Headless CMS)
* Brevo (Email platform)
* Node.js
* Kafka
* kafka-python
* Docker Compose
* JSON

## Prerequisites

* Node.js (14 or higher)
* Python 3.x
* Docker and Docker Compose
* npm or yarn

## Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests.

## Troubleshooting

Common issues and their solutions:
1. Kafka connection issues: Ensure Docker containers are running
2. Email not sending: Verify Brevo API key and configuration
3. Strapi errors: Check backend/.env configuration
