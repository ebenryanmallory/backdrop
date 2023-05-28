import sqlite3 from "sqlite3";

export const updatePreferencesRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id } = session;
  console.log(id)
  const { compression, use_compression, bg_color, use_transparency } = _req.body;

  async function updatePreferences(userId, compression, use_compression, bg_color, use_transparency) {
    const db = new sqlite3.Database('database.sqlite');
    db.on('error', (err) => {
      console.error('Database error:', err);
    });
    try {
      const sql = `Update users SET compression = $compression, use_compression = $use_compression, bg_color = $bg_color, use_transparency = $use_transparency WHERE id = $userID`;
      const updateParams = {
        $compression: compression,
        $use_compression: use_compression,
        $bg_color: bg_color,
        $use_transparency: use_transparency,
        $userID: userId
      };
      db.run(sql, updateParams, (err) => {
        res.send('ok');
      });
    } catch (err) {
      console.error(err);
    } finally {
      db.close();
    }
  }
  updatePreferences(id, compression, use_compression, bg_color, use_transparency);
}