import sqlite3 from "sqlite3";

export const deleteUserImageRoute = async (_req, res) => {
  const db = new sqlite3.Database('database.sqlite');
  db.on('error', (err) => {
    console.error('Database error:', err);
  });
  const session = res.locals.shopify.session;
  const { id } = session;
  const url = _req.body.url;

  async function deleteUserImage(userId, imageURL) {
    try {
        db.all(`DELETE FROM images WHERE user_id = ? AND url = ?`, [userId, imageURL], (err) => {
            if (err) {
                throw err;
            } else {
                res.send({ message: "Image deleted successfully" })
            }
            db.close();
        });
    } catch (err) {
        console.error(err.message);
        res.send({ message: err.message })
        db.close();
    }
  }
  deleteUserImage(id, url);
}
