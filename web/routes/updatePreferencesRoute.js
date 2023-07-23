import sqlite3 from "sqlite3";
import { DB_PATH } from '../db_path.js';

export const updatePreferencesRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id } = session;
  const { compression, use_compression, bg_color, use_transparency, bypass_removal } = _req.body;

  async function updatePreferences(userId, compression, use_compression, bg_color, use_transparency, bypass_removal) {
    const db = new sqlite3.Database(DB_PATH);
    db.on('error', (err) => {
      console.error('Database error:', err);
    });
    try {
      const sql = `Update users SET compression = $compression, use_compression = $use_compression, bg_color = $bg_color, use_transparency = $use_transparency, bypass_removal = $bypass_removal WHERE user_id = $userID`;
      const updateParams = {
        $compression: compression,
        $use_compression: use_compression,
        $bg_color: bg_color,
        $use_transparency: use_transparency,
        $bypass_removal: bypass_removal,
        $userID: userId
      };
      db.run(sql, updateParams, function(err, rows) {
        console.log(rows)
        console.log('Changes is SET user preferences')
        console.log(this.changes)
        res.send('ok');
      });
    } catch (err) {
      console.error(err);
    } finally {
      db.close();
    }
  }
  updatePreferences(id, compression, use_compression, bg_color, use_transparency, bypass_removal);
}