const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./notes.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, title TEXT, filename TEXT)");
});

module.exports = db;