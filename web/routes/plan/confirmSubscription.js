import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../../shopify.js";
import sqlite3 from "sqlite3";
import { DB_PATH } from '../../db_path.js';

export const confirmSubscription = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });

  const db = new sqlite3.Database(DB_PATH);
  db.on('error', (err) => {
    console.error('Database error:', err);
  });
  
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
        try {
          const planSQL = `UPDATE users SET free_count = $free_count, plan_type = $plan_type WHERE user_id = $userID`;
          const updateParams = {
            $plan_type: chargeResult.name.toLowerCase(),
            $free_count: name === 'Professional' ? 50 : name === 'Studio' ? 100 : 5,
            $userID: id
          };
          db.run(planSQL, updateParams, function(err) {
            if (this.changes < 1) { 
              return 'Something went wrong. Please try again.'
            } else {
              return res.send({ message: confirmation_url }) 
            }
          });
        } catch (err) {
          console.error(err);
          return 'Something went wrong. Please try again.';
        } finally {
          db.close();
        }
      };
      if (status === 'pending') {
        return res.send({ message: confirmation_url }) 
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

  try {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    db.get(sql, [id], (err, row) => {
      if (row === undefined) {
        return res.json({
          message: "ID not found"
        });
      } else {
        const { plan_id } = row;
        confirmStatus(plan_id)
      }
    });
  } catch (err) {
    console.log(err)
    return res.send({ message: 'Something went wrong. Please try again.'})
  }
}