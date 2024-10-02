module.exports = () => ({
  email: {
    config: {
      provider: "strapi-provider-email-brevo",
      providerOptions: {
        apiKey: process.env.BREVO_API_KEY,
      },
      settings: {
        defaultSenderEmail: "amanmuleva@gmail.com",
        defaultSenderName: "PacMan",
        defaultReplyTo: "no-reply@accounts.google.com",
      },
    },
  },
});
