require('dotenv').config();
const express = require('express');
const { neon } = require('@neondatabase/serverless');
const app = express();
const PORT = 3000;

const sql = neon(process.env.DATABASE_URL);

app.use(express.static('.'));
app.use(express.json());

// ── CREATE TABLES ON STARTUP ──
async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS entries (
      id         SERIAL PRIMARY KEY,
      type       TEXT NOT NULL,
      title      TEXT DEFAULT '',
      body       TEXT NOT NULL,
      date       TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id         SERIAL PRIMARY KEY,
      category   TEXT NOT NULL,
      emoji      TEXT DEFAULT '✦',
      title      TEXT NOT NULL,
      excerpt    TEXT DEFAULT '',
      body       TEXT NOT NULL,
      date       TEXT NOT NULL,
      read_time  TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('Database ready');
}

// ── ENTRIES ──
app.get('/api/entries', async (req, res) => {
  const { type } = req.query;
  const rows = type
    ? await sql`SELECT * FROM entries WHERE type = ${type} ORDER BY created_at DESC`
    : await sql`SELECT * FROM entries ORDER BY created_at DESC`;
  res.json(rows);
});

app.get('/api/entries/:id', async (req, res) => {
  const rows = await sql`SELECT * FROM entries WHERE id = ${req.params.id}`;
  if (!rows.length) return res.status(404).json({ error: 'not found' });
  res.json(rows[0]);
});

app.post('/api/entries', async (req, res) => {
  const { type, title, body, date } = req.body;
  if (!type || !body) return res.status(400).json({ error: 'type and body required' });
  const rows = await sql`
    INSERT INTO entries (type, title, body, date)
    VALUES (${type}, ${title || ''}, ${body}, ${date})
    RETURNING id
  `;
  res.json({ id: rows[0].id });
});

app.delete('/api/entries/:id', async (req, res) => {
  await sql`DELETE FROM entries WHERE id = ${req.params.id}`;
  res.json({ success: true });
});

// ── POSTS ──
app.get('/api/posts', async (req, res) => {
  const { category } = req.query;
  const rows = category
    ? await sql`SELECT * FROM posts WHERE category = ${category} ORDER BY created_at DESC`
    : await sql`SELECT * FROM posts ORDER BY created_at DESC`;
  res.json(rows);
});

app.get('/api/posts/:id', async (req, res) => {
  const rows = await sql`SELECT * FROM posts WHERE id = ${req.params.id}`;
  if (!rows.length) return res.status(404).json({ error: 'not found' });
  res.json(rows[0]);
});

app.post('/api/posts', async (req, res) => {
  const { category, emoji, title, excerpt, body, date, read_time } = req.body;
  if (!category || !title || !body) return res.status(400).json({ error: 'category, title and body required' });
  const rows = await sql`
    INSERT INTO posts (category, emoji, title, excerpt, body, date, read_time)
    VALUES (${category}, ${emoji || '✦'}, ${title}, ${excerpt || ''}, ${body}, ${date}, ${read_time || ''})
    RETURNING id
  `;
  res.json({ id: rows[0].id });
});

app.delete('/api/posts/:id', async (req, res) => {
  await sql`DELETE FROM posts WHERE id = ${req.params.id}`;
  res.json({ success: true });
});

initDb().then(() => {
  app.listen(PORT, () => console.log(`server running at http://localhost:${PORT}`));
});