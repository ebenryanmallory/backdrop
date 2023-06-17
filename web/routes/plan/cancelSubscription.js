import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../../shopify.js";
import sqlite3 from "sqlite3";

export const cancelSubscription = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });

    try {
      async function getSubscriptionID(userId) {
        const db = new sqlite3.Database('database.sqlite');
        db.on('error', (err) => {
          console.error('Database error:', err);
        });
        const sql = 'SELECT * FROM users WHERE user_id = ?';
        db.get(sql, [userId], (err, row) => {
          if (row === undefined) {
            return res.send({ message: 'No subscription found'})
          } else {
            const { plan_id } = row;
            return plan_id
          }
        });
      }
      const subscriptionID = getSubscriptionID(id);
      console.log(subscriptionID)

      const returnedStatus = await client.query({
        data: {
          "query": `mutation AppSubscriptionCancel($id: ID!) {
            appSubscriptionCancel(id: $id) {
              userErrors {
                field
                message
              }
              appSubscription {
                id
                status
              }
            }
          }`,
          "variables": {
            "id": subscriptionID
          },
        },
      });
        
      return res.send({ message: returnedStatus.body.data.appSubscriptionCancel?.appSubscription?.status})

    } catch (error) {
      if (error instanceof GraphqlQueryError) {
        throw new Error(
          `${error.message}\n${JSON.stringify(error.response, null, 2)}`
        );
      } else {
        throw error;
      }
    } finally {
      if (db) {
        db.close();
      }
    }
}
