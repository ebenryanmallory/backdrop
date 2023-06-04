import sqlite3 from "sqlite3";

export const createUsersTable = async (_req, res) => {
  
  const db = new sqlite3.Database('database.sqlite');
  db.on('error', (err) => {
    console.error('Database error:', err);
  });

    try {
      await db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          shop TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          free_count INTEGER DEFAULT,
          plan_type TEXT DEFAULT,
          compression INTEGER DEFAULT,
          use_compression BOOLEAN DEFAULT,
          bg_color TEXT DEFAULT,
          use_transparency BOOLEAN DEFAULT
        )
      `);
    } catch (err) {
      console.error(err);
    }

}
