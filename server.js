const express = require("express");
const nodemailer = require("nodemailer");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error("MySQL Connection Failed:", err);
        return;
    }
    console.log("Connected to MySQL Database!");
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Handle Contact Form Submission
app.post("/send-email", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: "All fields are required!" });
        }

        // Save to MySQL
        const sql = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
        await db.promise().query(sql, [name, email, message]);

        // Send Email
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Message saved & email sent!" });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// AI Chatbot Route Using OpenRouter
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required!" });

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("OpenRouter Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch AI response." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
