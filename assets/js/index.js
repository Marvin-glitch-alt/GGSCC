const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password",
  },
});

const sendHandoffEmail = async ({ name, phone, message }) => {
  await transporter.sendMail({
    from: "your-email@gmail.com",
    to: "you@yourdomain.com",
    subject: "🔔 User Requested a Consultant",
    text: `A user requested to speak with a consultant:\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`,
  });
};

app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const contact = req.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

    if (!msg || !contact) return res.sendStatus(200);

    const userMessage = msg.text?.body || "";
    const userPhone = contact.wa_id;
    const userName = contact.profile?.name || "Unknown";

    // Only act if the user asks to talk to a consultant
    if (userMessage.toLowerCase().includes("talk to a consultant")) {
      await sendHandoffEmail({ name: userName, phone: userPhone, message: userMessage });
      console.log("Handoff email sent.");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

// Optional: webhook verification (GET)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "your_verify_token";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.listen(3000, () => console.log("🚀 Webhook running at http://localhost:3000"));
