import sqlite3 from "sqlite3";

export const createUserRoute = async (_req, res) => {
  const db = new sqlite3.Database('database.sqlite');
  db.on('error', (err) => {
    console.error('Database error:', err);
  });
  const session = res.locals.shopify.session;
  
  const { id, shop } = session;
  const timestamp = new Date().toISOString();

  const user = {
    user_id: id,
    shop: shop,
    created_at: timestamp
  };
  // Check to make sure users exists
  async function createUsersTable() {
    try {
      await db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          shop TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (err) {
      console.error(err);
    }
  }

  // Check if user_id already exists
  const existingUser = await db.get("SELECT user_id FROM users WHERE user_id = ?", user.user_id);

  if (existingUser) {
    console.log("User ID already exists.");
    return res.send(user.user_id);
  } else {
    // Insert the new user into the database
    await db.run(`INSERT INTO users(user_id, shop, created_at)
            VALUES(?,?,?)`, [user.user_id, user.shop, user.created_at], function(err) {
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
}
