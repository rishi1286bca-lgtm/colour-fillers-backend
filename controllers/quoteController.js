import Quote from "../models/Quote.js"; 

// @desc    Create new quote & send email via Brevo API
// @route   POST /api/quotes
const createQuote = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // 1. Save to Database
    const newQuote = await Quote.create({ name, email, phone, message });

    // 2. Send Email using Brevo REST API (Bypasses Render's firewall)
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.EMAIL_APP_PASSWORD, // Aapki nayi Brevo API Key
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_USER, name: "Website Form" },
        to: [{ email: 'info@colourfillers.com' }], // Aapki receiver email
        subject: `New Quote Request from ${name}`,
        textContent: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
      })
    });

    if (!brevoResponse.ok) {
       const errData = await brevoResponse.json();
       console.error("🔥 BREVO API ERROR:", errData);
       throw new Error("Email sending failed at Brevo");
    }

    res.status(201).json({ success: true, data: newQuote });
  } catch (error) {
    console.error("🔥 CRITICAL ERROR DETAILS:", error);
    res.status(500).json({ success: false, error: "Failed to submit quote." });
  }
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