const express = require("express");
const db = require("../db");
const app = express();
const PORT = 3000;

app.use(express.static("."));
app.use(express.json());

// ── ENTRIES (notes, letters, thoughts) ──
app.get("/api/entries", (req, res) => {
  const { type } = req.query;
  const rows = type
    ? db
        .prepare(
          "SELECT * FROM entries WHERE type = ? ORDER BY created_at DESC",
        )
        .all(type)
    : db.prepare("SELECT * FROM entries ORDER BY created_at DESC").all();
  res.json(rows);
});

app.get("/api/entries/:id", (req, res) => {
  const row = db
    .prepare("SELECT * FROM entries WHERE id = ?")
    .get(req.params.id);
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

app.post("/api/entries", (req, res) => {
  const { type, title, body, date } = req.body;
  if (!type || !body)
    return res.status(400).json({ error: "type and body required" });
  const result = db
    .prepare(
      "INSERT INTO entries (type, title, body, date) VALUES (?, ?, ?, ?)",
    )
    .run(type, title || "", body, date);
  res.json({ id: result.lastInsertRowid });
});

app.delete("/api/entries/:id", (req, res) => {
  db.prepare("DELETE FROM entries WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// ── POSTS (blog) ──
app.get("/api/posts", (req, res) => {
  const { category } = req.query;
  const rows = category
    ? db
        .prepare(
          "SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC",
        )
        .all(category)
    : db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  res.json(rows);
});

app.get("/api/posts/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "not found" });
  res.json(row);
});

app.post("/api/posts", (req, res) => {
  const { category, emoji, title, excerpt, body, date, read_time } = req.body;
  if (!category || !title || !body)
    return res.status(400).json({ error: "category, title and body required" });
  const result = db
    .prepare(
      "INSERT INTO posts (category, emoji, title, excerpt, body, date, read_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(
      category,
      emoji || "✦",
      title,
      excerpt || "",
      body,
      date,
      read_time || "",
    );
  res.json({ id: result.lastInsertRowid });
});

app.delete("/api/posts/:id", (req, res) => {
  db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
