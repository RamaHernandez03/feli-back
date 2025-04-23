require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  methods: "POST",
  allowedHeaders: "Content-Type"
}));

app.use(express.json());

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  

app.post("/send_email", async (req, res) => {
  const { nombre, email, mensaje } = req.body;
  
  try {
    await transporter.sendMail({
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: "Mensaje recibido",
        text: `Hola ${nombre},\n\nHemos recibido tu mensaje. Nos pondremos en contacto pronto.\n\nSaludos,\nEquipo Escribanía.`,
    });
  
    await transporter.sendMail({
        from: process.env.SMTP_USERNAME,
        to: process.env.ADMIN_EMAIL,
        subject: "Nuevo mensaje recibido",
        text: `Correo recibido de: ${email}\nNombre: ${nombre}\n\nMensaje: ${mensaje}`,
    });
  

    res.status(200).json({ success: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ success: false, message: "Error al enviar el correo" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

