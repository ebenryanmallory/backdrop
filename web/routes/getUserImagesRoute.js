import sqlite3 from "sqlite3";

export const getUserImagesRoute = async (_req, res) => {
  const db = new sqlite3.Database('database.sqlite');
  db.on('error', (err) => {
    console.error('Database error:', err);
  });
  const session = res.locals.shopify.session;
  const { id } = session;

  async function getUserImages(userId) {
    try {
        db.all('SELECT image_url FROM user_images WHERE user_id = ?', userId, (err, rows) => {
          if (rows === undefined) {
            return res.json({ images: [] });
          } else {
                const imageUrls = [...rows.map(row => row.image_url)];
                res.send({ images: imageUrls })
            }
            db.close();
        });
    } catch (err) {
        console.error(err.message);
        db.close();
    }
  }
  getUserImages(id);
}
