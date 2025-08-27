const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const db = require("./db"); // your SQLite database file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Home route (serves index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Upload notes
app.post("/upload", upload.single("note"), (req, res) => {
  const { title } = req.body;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filename = req.file.filename;
  db.run("INSERT INTO notes (title, filename) VALUES (?, ?)", [title, filename], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Get all notes
app.get("/notes", (req, res) => {
  db.all("SELECT * FROM notes", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start server on Render with dynamic port
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

// Optional: increase timeouts to avoid Render crashes
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000;   // 120 seconds
