"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/email/send-test",
      handler: "email.sendTestEmail",
      config: {
        policies: [], // You can define policies here if needed
        middlewares: [], // You can also add any specific middlewares
      },
    },
  ],
};
