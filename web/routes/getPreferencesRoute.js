import sqlite3 from "sqlite3";

export const getPreferencesRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id } = session;

  async function getPreferences(userId) {
    const db = new sqlite3.Database('database.sqlite');
    db.on('error', (err) => {
      console.error('Database error:', err);
    });
    try {
      const sql = `SELECT compression, use_compression, bg_color, use_bg_color FROM users WHERE id = $userId`;
      db.run(sql, [userId], function(err, row) {
        const result = {
          compression: row.compression,
          use_compression: row.use_compression,
          bg_color: row.bg_color,
          use_bg_color: row.use_bg_color
        };
        return res.json(result);
      });
    } catch (err) {
      console.error(err);
    } finally {
      db.close();
    }
  }
  getPreferences(id);
}