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
    created_at: timestamp,
    free_count: 5, 
    plan_type: 'free',
    compression: 20,
    use_compression: true,
    bg_color: '#FFFFFF',
    use_bg_color: true
  };
  // Check to make sure users exists
  async function createUsersTable() {
    try {
      await db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          shop TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          free_count INTEGER DEFAULT,
          plan_type TEXT DEFAULT,
          compression INTEGER DEFAULT,
          use_compression BOOLEAN DEFAULT,
          bg_color TEXT DEFAULT,
          use_bg_color BOOLEAN DEFAULT
        )
      `);
    } catch (err) {
      console.error(err);
    }
  }


  const insertQuery = `
  INSERT INTO users(
    user_id,
    shop,
    created_at,
    free_count,
    plan_type,
    compression,
    use_compression,
    bg_color,
    use_bg_color
  )
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const insertParams = [
  user.user_id,
  user.shop,
  user.created_at,
  user.free_count,
  user.plan_type,
  user.compression,
  user.use_compression,
  user.bg_color,
  user.use_bg_color
];

  // Check if user_id already exists
  const existingUser = await db.get("SELECT user_id FROM users WHERE user_id = ?", user.user_id);

  if (existingUser) {
    console.log("User ID already exists.");
    return res.send(user.user_id);
  } else {
    // Insert the new user into the database
    await db.run(insertQuery, insertParams, function(err) {
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
