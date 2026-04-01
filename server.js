<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Secure Message Dashboard</title>
<style>
body { font-family: Arial, sans-serif; background: #111; color: #eee; display: flex; justify-content: center; align-items: center; height: 100vh; margin:0; }
#verifyCode, #dashboard { display: none; }
input, button { padding: 10px; margin:5px; border-radius:5px; border:none; }
button { cursor:pointer; background:#ff3b3b; color:white; }
#messages { max-height: 400px; overflow-y: auto; margin-top:10px; border:1px solid #444; padding:5px; width: 400px; }
.message { background:#222; margin:5px 0; padding:5px; border-radius:5px; display:flex; justify-content:space-between; }
</style>
</head>
<body>

<!-- VERIFY CODE SCREEN -->
<div id="verifyCode">
  <h2>Enter Access Code</h2>
  <input type="text" id="accessCodeInput" placeholder="Enter code"><br>
  <button id="verifyAccessCode">Verify</button>
  <p id="verifyStatus"></p>
</div>

<!-- DASHBOARD -->
<div id="dashboard">
  <h2>Messages (<span id="msgCount">0</span>)</h2>
  <div id="messages"></div>
  <button id="logout">Logout</button>
</div>

<script>
const backendUrl = "https://secure-backend01.onrender.com"; // your backend URL
let accessGranted = false;

// DOM elements
const verifyDiv = document.getElementById("verifyCode");
const dashboardDiv = document.getElementById("dashboard");

verifyDiv.style.display = "block";

// VERIFY ACCESS CODE
document.getElementById("verifyAccessCode").onclick = () => {
    const code = document.getElementById("accessCodeInput").value.trim();
    if(code === "Suka_01"){ // ✅ predefined code
        accessGranted = true;
        verifyDiv.style.display = "none";
        dashboardDiv.style.display = "block";
        loadMessages();
    } else {
        document.getElementById("verifyStatus").innerText = "Wrong code! Access denied.";
    }
};

// LOAD MESSAGES FROM BACKEND
async function loadMessages(){
  if(!accessGranted) return;
  const res = await fetch(backendUrl + "/messages");
  const msgs = await res.json();
  const container = document.getElementById("messages");
  container.innerHTML = "";
  msgs.forEach(m => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<span>${m.message} <small>(${m.date})</small></span><button onclick="deleteMsg(${m.id})">Delete</button>`;
    container.appendChild(div);
  });
  document.getElementById("msgCount").innerText = msgs.length;
}

// DELETE MESSAGE
async function deleteMsg(id){
  if(!accessGranted) return;
  await fetch(backendUrl + "/delete/" + id, { method:"DELETE" });
  loadMessages();
}

// LOGOUT
document.getElementById("logout").onclick = () => {
  accessGranted = false;
  dashboardDiv.style.display = "none";
  verifyDiv.style.display = "block";
};

// OPTIONAL: auto-refresh messages every 5s
setInterval(() => {
  if(accessGranted) loadMessages();
}, 5000);

</script>
</body>
</html>
