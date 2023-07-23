import sqlite3 from "sqlite3";
import { DB_PATH } from '../db_path.js';

export const deleteAllDataRoute = async (_req, res) => {
  
  const session = res.locals.shopify.session;
  const { id } = session;
  
  const db = new sqlite3.Database(DB_PATH);
  const userQuery = `DELETE FROM users WHERE user_id = ?`;
  const imagesQuery = `DELETE FROM user_images WHERE user_id = ?`;
  db.run(userQuery, [id], function() {
    if (this.changes < 1) { res.status(200).send('No user found') }
    db.run(imagesQuery, [id], function() {
      res.status(200).send('OK');
    });
  });
  db.close();
}
