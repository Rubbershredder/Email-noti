import React from "react";
import axios from "axios";

const App = () => {
  const sendTestEmail = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1337/api/send-test-email"
      );
      alert(response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div>
      <button onClick={sendTestEmail}>Send Test Email with PDF</button>
    </div>
  );
};

export default App;
