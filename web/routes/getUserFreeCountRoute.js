import sqlite3 from "sqlite3";
import { DB_PATH } from '../db_path.js';

export const getUserFreeCountRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id } = session;

  async function getUserImages(userId) {
    const db = new sqlite3.Database(DB_PATH);
    db.on('error', (err) => {
      console.error('Database error:', err);
    });
    try {
      const sql = 'SELECT * FROM users WHERE user_id = ?';
      db.get(sql, [userId], (err, row) => {
        if (row === undefined) {
          return res.json({
            plan_type: 'free',
            free_count: 5
          });
        } else {
          const { free_count, plan_type } = row;
          return res.send({
            plan_type: plan_type,
            free_count: free_count
          });
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      db.close();
    }
  }
  getUserImages(id);
}
