const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

let users = [
  { id: 1, username: "admin", password: "1234", role: "admin", active: true }
];

let protocols = [];
let nextProtocolId = 1;

function nextNumber() {
  let max = 0;
  protocols.forEach(p => {
    const n = parseInt(p.number, 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return max === 0 ? 100 : max + 1;
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const u = users.find(x => x.username === username && x.password === password && x.active);
  if (!u) return res.status(401).json({ error: "Λάθος στοιχεία" });
  res.json({ user: { username: u.username, role: u.role } });
});

app.get("/next-protocol", (req, res) => {
  res.json({ next: String(nextNumber()) });
});

app.post("/new-protocol", (req, res) => {
  const { number, to, summary, date, createdBy } = req.body;
  protocols.push({ id: nextProtocolId++, number, to, summary, date, createdBy });
  res.json({ success: true });
});

app.get("/list-protocols", (req, res) => {
  res.json(protocols.sort((a,b)=>parseInt(a.number)-parseInt(b.number)));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
