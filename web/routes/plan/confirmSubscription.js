import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../../shopify.js";
import sqlite3 from "sqlite3";
import { DB_PATH } from '../../db_path.js';

export const confirmSubscription = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });

  async function confirmStatus(plan_id) {
    try {
      const chargeResult = await shopify.api.rest.RecurringApplicationCharge.find({
        session: session,
        id: plan_id
      });
      const status = chargeResult.status;
      const confirmation_url = chargeResult.confirmation_url;
      const name = chargeResult.name;
      if (status === 'active') {
        await updateFreeCount(id, name === 'Professional' ? 50 : name === 'Studio' ? 100 : 5);
      };
      if (status === 'pending') {
        console.log('pending')
        return res.send({ message: confirmation_url}) 
      };

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

  const db = new sqlite3.Database(DB_PATH);
  db.on('error', (err) => {
    console.error('Database error:', err);
  });
  try {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    db.get(sql, [id], (err, row) => {
      if (row === undefined) {
        return res.json({
          error: "ID not found"
        });
      } else {
        const { plan_id } = row;
        confirmStatus(plan_id)
      }
    });
  } catch (err) {
    console.log(err)
    return res.send({ message: 'Something went wrong. Please try again.'})
  } finally {
    db.close();
  }

}

async function updateFreeCount(userId, count) {
  const db = new sqlite3.Database(DB_PATH);
  db.on('error', (err) => {
    console.error('Database error:', err);
  });
  try {
    const sql = 'UPDATE users SET free_count = ? WHERE user_id = ?';
    db.run(sql, [count, userId], function(err) {
      console.log(this.changes)
      return res.send('ok');
    });
  } catch (err) {
    console.error(err);
  } finally {
    db.close();
  }
}