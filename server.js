const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage
let messages = [];
let idCounter = 1;

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => res.send("Backend is running ✅"));

// Send message
app.post("/send", (req, res) => {
  const { message } = req.body;
  if(!message) return res.status(400).json({ error: "Message required" });

  const msgObj = { id: idCounter++, message, date: new Date().toLocaleString() };
  messages.push(msgObj);
  res.json({ success: true });
});

// Get messages
app.get("/messages", (req, res) => res.json(messages));

// Delete message
app.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  messages = messages.filter(m => m.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
