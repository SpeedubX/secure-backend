const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// 📁 LOAD SAVED MESSAGES
let messages = [];
if (fs.existsSync("messages.json")) {
    messages = JSON.parse(fs.readFileSync("messages.json"));
}

// 💾 SAVE FUNCTION
function saveMessages() {
    fs.writeFileSync("messages.json", JSON.stringify(messages, null, 2));
}

// 🔐 STORAGE
let otpStore = {};
let sessions = {};

// 🔐 EMAIL CONFIG (PUT YOUR NEW APP PASSWORD HERE)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "endi4473@gmail.com",
        pass: "Suka01"
    }
});

// 📩 SEND MESSAGE
app.post("/send", (req, res) => {
    const { message } = req.body;

    const newMsg = {
        id: Date.now(),
        message,
        date: new Date().toLocaleString()
    };

    messages.push(newMsg);
    saveMessages();

    res.send({ success: true, count: messages.length });
});

// 🔢 REQUEST OTP
app.post("/request-otp", async (req, res) => {
    const { email } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = code;

    try {
        await transporter.sendMail({
            from: "endi4473@gmail.com",
            to: email,
            subject: "Your Login Code",
            text: `Your code is: ${code}`
        });

        res.send({ success: true });
    } catch (err) {
        console.log(err);
        res.send({ success: false });
    }
});

// ✅ VERIFY OTP
app.post("/verify-otp", (req, res) => {
    const { email, code } = req.body;

    if (otpStore[email] == code) {
        const token = Math.random().toString(36);
        sessions[token] = true;

        return res.send({ success: true, token });
    }

    res.send({ success: false });
});

// 🔒 GET MESSAGES
app.get("/messages", (req, res) => {
    const token = req.headers.authorization;

    if (!sessions[token]) {
        return res.status(403).send("Unauthorized");
    }

    res.send(messages);
});

// ❌ DELETE MESSAGE
app.delete("/delete/:id", (req, res) => {
    const token = req.headers.authorization;

    if (!sessions[token]) {
        return res.status(403).send("Unauthorized");
    }

    const id = parseInt(req.params.id);

    messages = messages.filter(m => m.id !== id);
    saveMessages();

    res.send({ success: true });
});

// 🚀 START SERVER (RENDER COMPATIBLE)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running..."));