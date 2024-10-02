"use strict";

const { createCoreController } = require("@strapi/strapi").factories;
const fs = require("fs");
const path = require("path");
const Brevo = require("@getbrevo/brevo");

module.exports = createCoreController("api::email.email", ({ strapi }) => ({
  async sendTestEmail(ctx) {
    try {
      // Log the request body for debugging
      console.log("Received request body:", ctx.request.body);

      const {
        subject,
        htmlContent,
        recipientEmail,
        organizationName,
        teamName,
        recipientName,
      } = ctx.request.body;

      // Define path to PDF attachment
      const publicDir = path.join(process.cwd(), "public");
      const filePath = path.join(publicDir, "uploads", "docker_cheatsheet.pdf");

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return ctx.throw(404, "PDF file not found");
      }

      // Read the PDF file and convert it to Base64
      const pdfFile = fs.readFileSync(filePath);
      const pdfBase64 = pdfFile.toString("base64");

      const apiKey = process.env.BREVO_API_KEY;
      if (!apiKey) {
        return ctx.throw(500, "Brevo API key not found");
      }

      // Initialize Brevo API
      const emailApi = new Brevo.TransactionalEmailsApi();
      emailApi.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

      // Construct the dynamic email content
      const dynamicHtmlContent =
        htmlContent ||
        `
        <p>Dear ${recipientName || "[Recipient's Name]"} / ${
          teamName || "[Team Name]"
        },</p>
        <p>I hope this email finds you well.</p>
        <p>We have completed the API testing for your organization, ${
          organizationName || "[Organization Name]"
        }, and I am attaching the detailed diagnostic report in PDF format for your review.</p>
        <p>Please review the attached report. If you have any questions or require further clarification, feel free to reach out.</p>
        <p>Best regards,</p>
        <p>Aman Muleva</p>
        <p>Testing Team</p>
        <p>${organizationName || "[Your Organization Name]"}</p>
      `;

      // Set up email data
      const emailData = {
        sender: { email: "amanmuleva@gmail.com" }, // Your email
        to: [{ email: recipientEmail || "quantumbeast07@gmail.com" }], // Recipient email
        subject:
          subject ||
          `API Testing Report - ${organizationName || "[Organization Name]"}`,
        htmlContent: dynamicHtmlContent,
        attachment: [
          {
            content: pdfBase64,
            name: `API_Test_Report_${
              organizationName || "OrganizationName"
            }.pdf`,
            contentType: "application/pdf",
          },
        ],
      };

      // Send the email via Brevo
      await emailApi.sendTransacEmail(emailData);

      // Return success response
      ctx.send({ message: "API testing report email sent successfully" });
    } catch (err) {
      console.error("Error in sendTestEmail:", err);
      ctx.throw(
        500,
        err.message || "An error occurred while sending the email"
      );
    }
  },

  // Optional: You can also keep this if you still want Strapi to start a Kafka consumer directly
  async startKafkaConsumer(ctx) {
    try {
      const kafka = new Kafka({
        clientId: "strapi-email-consumer",
        brokers: ["localhost:9092"], // Update with your Kafka broker address
      });

      const consumer = kafka.consumer({ groupId: "strapi-email-group" });

      await consumer.connect();
      await consumer.subscribe({ topic: "email-topic", fromBeginning: true });

      console.log("Kafka consumer connected and subscribed to email-topic");

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log("Received Kafka message:", message.value.toString());

          try {
            const emailData = JSON.parse(message.value.toString());

            console.log("Parsed email data:", emailData);

            // Call sendTestEmail with the data from Kafka
            await this.sendTestEmail({
              request: {
                body: {
                  subject: emailData.subject,
                  htmlContent: emailData.htmlContent,
                  recipientEmail: emailData.recipientEmail,
                  organizationName: emailData.organizationName,
                  teamName: emailData.teamName,
                  recipientName: emailData.recipientName,
                },
              },
            });

            console.log("Email sent successfully");
          } catch (error) {
            console.error(
              "Error parsing Kafka message or sending email:",
              error
            );
          }
        },
      });

      ctx.send({ message: "Kafka consumer started successfully" });
    } catch (err) {
      console.error("Error starting Kafka consumer:", err);
      ctx.throw(
        500,
        err.message || "An error occurred while starting Kafka consumer"
      );
    }
  },
}));
