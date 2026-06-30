CREATE TABLE IF NOT EXISTS feedback (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  message   TEXT    NOT NULL CHECK(length(message) <= 1000),
  created_at TEXT   NOT NULL DEFAULT (datetime('now'))
);
ALTER TABLE feedback ADD COLUMN ip_hash TEXT;
