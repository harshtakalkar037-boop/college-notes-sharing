const express = require("express");
const multer = require("multer");
const cors = require("cors");
const db = require("./db");
const path = require("path");

const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Upload notes
app.post("/upload", upload.single("note"), (req, res) => {
  const { title } = req.body;
  const filename = req.file.filename;
  db.run("INSERT INTO notes (title, filename) VALUES (?, ?)", [title, filename], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Get notes
app.get("/notes", (req, res) => {
  db.all("SELECT * FROM notes", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running at http://0.0.0.0:5000");
});
