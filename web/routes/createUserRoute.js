import sqlite3 from "sqlite3";
import { DB_PATH } from '../db_path.js';

export const createUserRoute = async (_req, res) => {

  const db = new sqlite3.Database(DB_PATH);
  db.on('error', (err) => {
    console.error('Database error:', err);
  });
  const session = res.locals.shopify.session;
  
  const { id, shop } = session;
  const timestamp = new Date().toISOString();

  const user = {
    user_id: id,
    shop: shop,
    created_at: timestamp,
    free_count: 5, 
    plan_type: 'free',
    plan_id: 'none',
    compression: 20,
    use_compression: true,
    bg_color: '#FFFFFF',
    use_transparency: false
  };

  const insertQuery = `
    INSERT INTO users(
      user_id,
      shop,
      created_at,
      free_count,
      plan_type,
      plan_id,
      compression,
      use_compression,
      bg_color,
      use_transparency
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const insertParams = [
    user.user_id,
    user.shop,
    user.created_at,
    user.free_count,
    user.plan_type,
    user.plan_id,
    user.compression,
    user.use_compression,
    user.bg_color,
    user.use_transparency
  ];

  // Check if user_id already exists
  db.get("SELECT user_id FROM users WHERE user_id = ?", user.user_id, function(err, row) {
    if (row && row.user_id === user.user_id) {
      return res.send(user.user_id);
    } else {
      db.run(insertQuery, insertParams, function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`A new user has been added with user_id ${user.user_id}.`);
    
        res.send(user.user_id);
        res.on('finish', () => {
          console.log('database connection closed')
          db.close();
        });
      });
    }
  });
}
