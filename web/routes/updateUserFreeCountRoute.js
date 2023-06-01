import sqlite3 from "sqlite3";

export const getUserFreeCountRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id } = session;
  const free_count = _req.body.free_count;

  async function updateFreeCount(userId, count) {
    const db = new sqlite3.Database('database.sqlite');
    db.on('error', (err) => {
      console.error('Database error:', err);
    });
    try {
      const sql = 'UPDATE users SET free_count = ? WHERE user_id = ?';
      db.run(sql, [count, userId], (err, row) => {
        const responseObject = {
          free_count: count
        }
        return res.send(responseObject);
      });
    } catch (err) {
      console.error(err);
    } finally {
      db.close();
    }
  }
  updateFreeCount(id, free_count);
}
