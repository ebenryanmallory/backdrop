import sqlite3 from "sqlite3";

export const deleteUserImageRoute = async (_req, res) => {
  
  const db = new sqlite3.Database('database.sqlite');
  db.on('error', (err) => {
    console.error('Database error:', err);
  });
  res.on('finish', () => {
    console.log('database connection closed')
    db.close();
  });
  const session = res.locals.shopify.session;
  const { id } = session;
  const url = _req.body.url;

  async function deleteUserImage(userId, imageURL) {
    try {
      db.run(`DELETE FROM user_images WHERE user_id = ? AND image_url = ?`, [userId, imageURL], function() {
        if (this.changes === 0) {
          res.send({ message: "No image found" })
        } 
        if (this.changes === 1) {
          res.send({ message: "Image deleted successfully" })
        } 
        if (this.changes > 1) {
          res.send({ message: "Multiple images found and deleted successfully" })
        }
      });
    } catch (err) {
        res.send({ message: err.message })
    }
  }
  deleteUserImage(id, url);
}
