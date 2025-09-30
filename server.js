const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 4000;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle form submission and send email
app.post('/send-message', (req, res) => {
    console.log('Received form data:', req.body); // Log the incoming data

    const { email, phone, message } = req.body;

    if (!email || !phone || !message) {
        return res.status(400).send('Please fill out all fields.');
    }

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Use 465 for SSL
        secure: false,  // Use true for port 465 (SSL)
        auth: {
            user: process.env.EMAIL_USER, // Use environment variables for sensitive data
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // Disable TLS verification for testing
        },
    });

    // Set up email options
    let mailOptions = {
        from: email,  // sender's email
        to: process.env.EMAIL_USER,  // your email (recipient)
        subject: 'New Message from Abdulkhaliq Property Solutions Website',  
        text: `Email: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending message:', error);
            return res.status(500).send(`Error sending message: ${error.message}`);
        }
        console.log('Message sent:', info.response);
        res.status(200).send('Message sent successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



