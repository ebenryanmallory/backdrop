import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../../shopify.js";
import sqlite3 from "sqlite3";

export const cancelSubscription = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id, shop } = session;
  const db = new sqlite3.Database('database.sqlite');
  db.on('error', (err) => {
    console.error('Database error:', err);
  });
  try {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
      db.get(sql, [id], async function(err, row) {
        if (row === undefined) {
          return res.send({ message: 'No subscription found'})
        }
        const { plan_id } = row;
        const client = new shopify.api.clients.Graphql({ session });
        try {
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
                "id": plan_id
              },
            },
          });
          console.log(returnedStatus.body.data.appSubscriptionCancel?.appSubscription?.status)
          if (returnedStatus.body.data.appSubscriptionCancel?.appSubscription?.status === "CANCELLED") {
            async function setFreePlan(userId) {
              const db = new sqlite3.Database('database.sqlite');
              db.on('error', (err) => {
                console.error('Database error:', err);
              });
              try {
                const sql = 'UPDATE users SET plan_type = ? WHERE user_id = ?';
                db.run(sql, ['free', userId], function(err) {
                  console.log(this.changes)
                  return res.send({
                    plan_type: 'free'
                  });
                });
              } catch (err) {
                console.error(err);
              } finally {
                db.close();
              }
            }
            setFreePlan(id);
          }
        } catch (error) {
          if (error instanceof GraphqlQueryError) {
            throw new Error(
              `${error.message}\n${JSON.stringify(error.response, null, 2)}`
            );
          } else {
            throw error;
          }
        }
      });
  } catch (err) {
    console.log(err)
    return res.send({ message: 'Something went wrong. Please try again.'})
  } finally {
    db.close();
  }
}