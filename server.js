const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

let messages = []; // store messages in memory (for testing)

// ========== Backend API ==========

// Receive a message from sender
app.post("/send", (req, res) => {
  const { message } = req.body;
  if(!message) return res.status(400).json({error:"No message"});
  const msgObj = { id: Date.now(), message, date: new Date().toLocaleString() };
  messages.push(msgObj);
  res.json({ success: true });
});

// Get messages for dashboard
app.get("/messages", (req, res) => {
  res.json(messages);
});

// Delete a message
app.delete("/delete/:id", (req, res) => {
  messages = messages.filter(m => m.id != req.params.id);
  res.json({ success: true });
});

// ========== Serve HTML Pages ==========
app.get("/sender", (req, res) => {
  res.sendFile(path.join(__dirname, "sender.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// ========== Start server ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
