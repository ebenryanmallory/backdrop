import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../../shopify.js";
import sqlite3 from "sqlite3";

export const confirmSubscription = async (_req, res) => {

  const session = res.locals.shopify.session;
  const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });

  async function confirmStatus(plan_id) {
    try {
      const returnedStatus = await client.query({
        data: {
          "query": `mutation appSubscriptionLineItemUpdate($cappedAmount: MoneyInput!, $id: ID!) {
            appSubscriptionLineItemUpdate(cappedAmount: $cappedAmount, id: $id) {
              userErrors {
                field
                message
              }
              confirmationUrl
              appSubscription {
                id
                status
                name
              }
            }
          }`,
          "variables": {
            "id": plan_id,
            "cappedAmount": {
              "amount": 20,
              "currencyCode": "USD"
            }
          },
        },
      });
      const status = returnedStatus.body.data.appSubscriptionLineItemUpdate?.appSubscription?.status;
      const name = returnedStatus.body.data.appSubscriptionLineItemUpdate?.appSubscription?.name;
      // https://shopify.dev/docs/api/admin-graphql/2023-04/enums/AppSubscriptionStatus
      if (status === 'ACTIVE') {
        await updateFreeCount(id, name === 'professional' ? 100 : name === 'studio' ? 250 : 5);
      };
      if (status === 'PENDING') { return };
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

  const db = new sqlite3.Database('database.sqlite');
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
        console.log(plan_id)
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
  const db = new sqlite3.Database('database.sqlite');
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