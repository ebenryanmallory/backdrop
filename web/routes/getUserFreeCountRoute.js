import sqlite3 from "sqlite3";

export const getUserFreeCountRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id } = session;
  console.log(id)

  async function getUserImages(userId) {
    const db = new sqlite3.Database('database.sqlite');
    db.on('error', (err) => {
      console.error('Database error:', err);
    });
    try {
      const sql = 'SELECT * FROM users WHERE user_id = ?';
      db.get(sql, [userId], (err, row) => {
        const { free_count, plan_type } = row;
        const responseObject = {
          plan_type: plan_type,
          free_count: free_count
        };
        return res.send(responseObject);
      });
    } catch (err) {
      console.error(err);
    } finally {
      db.close();
    }
  }
  getUserImages(id);
}
