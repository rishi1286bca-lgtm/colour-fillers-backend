import Quote from "../models/Quote.js";
import nodemailer from "nodemailer";
import dns from "dns";

// Render's containers have no outbound IPv6 route, but smtp.gmail.com
// resolves to an IPv6 address, causing ENETUNREACH. `family`/
// `setDefaultResultOrder` aren't reliably honored by nodemailer's
// underlying socket connect, so we force it with a custom `lookup`
// function that always resolves to an IPv4 address.
const ipv4Lookup = (hostname, options, callback) => {
  dns.lookup(hostname, { family: 4 }, callback);
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  lookup: ipv4Lookup,
  timeout: 10000
});

// @desc    Create new quote & send email
// @route   POST /api/quotes
const createQuote = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // 1. Save to Database — this is the part that MUST succeed for the client
  let newQuote;
  try {
    newQuote = await Quote.create({ name, email, phone, message });
  } catch (dbError) {
    console.error("DB SAVE ERROR:", dbError);
    return res.status(500).json({ success: false, error: "Failed to save quote." });
  }

  // 2. Send Email — best-effort, should NOT fail the client response
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "rishitiwari1286@gmail.com",
      subject: `New Quote Request from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
  } catch (mailError) {
    // Log it so you can see it in Render logs, but don't block the user
    console.error("EMAIL SEND ERROR (quote was still saved):", mailError);
  }

  res.status(201).json({ success: true, data: newQuote });
};

// @desc    Get all quotes for the dashboard
// @route   GET /api/quotes
const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    console.error("🔥 DASHBOARD FETCH ERROR:", error);
    res.status(500).json({ success: false, error: "Failed to fetch quotes." });
  }
};

export { createQuote, getQuotes };