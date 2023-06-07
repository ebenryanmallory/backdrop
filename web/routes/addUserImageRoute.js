import { GraphqlQueryError } from "@shopify/shopify-api";
import fs from 'fs';
import sqlite3 from "sqlite3";

export const uploadImageRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
	const { id, shop } = session;
  const { hostedCDNurl } = _req.body;

  try {
    async function addImageUrl(userId, imageUrl, timestamp) {
      let db = null;
      try {
        db = new sqlite3.Database('database.sqlite')
        const query = `INSERT INTO user_images (user_id, image_url, created_at) VALUES (?, ?, ?)`;
        db.run(query, [userId, imageUrl, timestamp], function() {
          console.log(this.changes)
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
