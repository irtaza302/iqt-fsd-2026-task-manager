const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "tasks.db");
const db = new Database(dbPath);

// Enable WAL for better concurrent read performance
db.pragma("journal_mode = WAL");

// Create tasks table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
