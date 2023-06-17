import sqlite3 from "sqlite3";

export const updateFreeCountRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id } = session;
  const updated_count = _req.body.updated_count;

  async function updateFreeCount(userId, count) {
    const db = new sqlite3.Database('database.sqlite');
    db.on('error', (err) => {
      console.error('Database error:', err);
    });
    try {
      const sql = 'UPDATE users SET free_count = ? WHERE user_id = ?';
      db.run(sql, [count, userId], function(err) {
        console.log(this.changes)
        return res.send({
          free_count: count
        });
      });
    } catch (err) {
      console.error(err);
    } finally {
      db.close();
    }
  }
  updateFreeCount(id, updated_count);
}
