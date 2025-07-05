const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Autorise les requêtes du frontend

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT), // Assure-toi que c'est bien un nombre
    secure: false, // true si port 465, false sinon
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // <-- Utilise l'adresse authentifiée
      to: process.env.EMAIL_USER,
      subject: subject,
      text: `Message de ${name} <${email}>:\n\n${message}`,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erreur d'envoi email :", err); // <-- Ajoute ce log
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API contact démarrée sur ${PORT}`));
