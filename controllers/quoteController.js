import Quote from "../models/Quote.js"; // Note the .js extension
import nodemailer from "nodemailer";

// Setup Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD 
  }
});

// @desc    Create new quote & send email
// @route   POST /api/quotes
const createQuote = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // 1. Save to Database
    const newQuote = await Quote.create({ name, email, phone, message });

    // 2. Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@colourfillers.com',
      subject: `New Quote Request from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };
    
    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, data: newQuote });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to submit quote." });
  }
};

// @desc    Get all quotes for the dashboard
// @route   GET /api/quotes
const getQuotes = async (req, res) => {
  try {
    // Fetches all quotes, sorted by newest first
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch quotes." });
  }
};

export { createQuote, getQuotes };