import sqlite3 from "sqlite3";
import { DB_PATH } from '../db_path.js';

export const createUsersTable = async (_req, res) => {
  
  const db = new sqlite3.Database(DB_PATH);
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
          plan_id TEXT DEFAUlT,
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
