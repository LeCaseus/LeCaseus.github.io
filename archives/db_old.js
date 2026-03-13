const Database = require("better-sqlite3");
const db = Database("caseus.db");

// create tables if they don't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    type      TEXT NOT NULL,
    title     TEXT DEFAULT '',
    body      TEXT NOT NULL,
    date      TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    category  TEXT NOT NULL,
    emoji     TEXT DEFAULT '✦',
    title     TEXT NOT NULL,
    excerpt   TEXT DEFAULT '',
    body      TEXT NOT NULL,
    date      TEXT NOT NULL,
    read_time TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;