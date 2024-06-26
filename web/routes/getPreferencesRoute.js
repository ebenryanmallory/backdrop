import sqlite3 from "sqlite3";
import { DB_PATH } from '../db_path.js';

export const getPreferencesRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id } = session;

  async function getPreferences(userId) {
    const db = new sqlite3.Database(DB_PATH);
    db.on('error', (err) => {
      console.error('Database error:', err);
    });
    try {
      const sql = 'SELECT * FROM users WHERE user_id = ?';
      db.get(sql, [userId], (err, row) => {
        if (row === undefined) {
          return res.json({
            userNotFound: true,
            compression: 70,
            use_compression: true,
            bg_color: '#FFFFFF',
            use_transparency: false,
            bypass_removal: false,
            plan_type: 'free',
            free_count: 5
          });
        } else {
          const { compression, use_compression, bg_color, use_transparency, bypass_removal, plan_type, free_count } = row;
          const responseObject = {
            compression: compression,
            use_compression: use_compression ? true : false,
            bg_color: bg_color,
            use_transparency: use_transparency ? true : false,
            bypass_removal: bypass_removal ? true : false,
            plan_type: plan_type,
            free_count: free_count === null ? 0 : free_count
          };
          return res.json(responseObject)
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      db.close();
    }
  }
  getPreferences(id);
}