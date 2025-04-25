const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Setup sessions
app.use(session({
  secret: "Ilovemydog247", // You can use any string here
  resave: false,
  saveUninitialized: true,
}));

// 📦 Parse JSON
app.use(express.json());

// 🔗 Serve static files from the "client" folder
app.use(express.static(path.join(__dirname, "client")));

// 🛠️ Handle POST to /telegram
app.post("/telegram", require("./api/telegram"));

// 🌐 Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
