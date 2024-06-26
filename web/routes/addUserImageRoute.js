import { GraphqlQueryError } from "@shopify/shopify-api";
import sqlite3 from "sqlite3";
import { DB_PATH } from '../db_path.js';

export const uploadImageRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
	const { id, shop } = session;
  const { hostedCDNurl } = _req.body;

  try {
    async function addImageUrl(userId, imageUrl, timestamp) {
      let db = null;
      try {
        db = new sqlite3.Database(DB_PATH)
        const query = `INSERT INTO user_images (user_id, image_url, created_at) VALUES (?, ?, ?)`;
        db.run(query, [userId, imageUrl, timestamp], function() {
          if (this.changes !== 1) {
            console.log('Image URL not inserted')
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (db) {
          db.close();
        }
      }
    }
    const timestamp = new Date().toISOString();
    await addImageUrl(id, hostedCDNurl, timestamp);
    return res.send(hostedCDNurl);
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
