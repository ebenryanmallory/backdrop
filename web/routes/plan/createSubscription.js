import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../../shopify.js";
import sqlite3 from "sqlite3";
import { DB_PATH } from '../../db_path.js';

export const createSubscription = async (_req, res) => {

  const appname = '04e6705a1f39e47c62e5816f3e38a770';

  const session = res.locals.shopify.session;
  const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });
  const { targetPlan } = _req.body;

  if (targetPlan !== 'professional' && targetPlan !== 'studio') { return res.send({ message: 'No plan provided.'}) };

  try {
    const returnedStatus = await client.query({
      data: {
        "query": `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!) {
          appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
            userErrors {
              field
              message
            }
            appSubscription {
              id
              status
              lineItems {
                id
              }
            }
            confirmationUrl
          }
        }`,
        "variables": {
          "name": `${targetPlan.charAt(0).toUpperCase() + targetPlan.slice(1)}`,
          "returnUrl": `https://${shop}/admin/apps/${appname}/confirmation`, //https://motionstoryline-dev.myshopify.com/admin/apps/04e6705a1f39e47c62e5816f3e38a770/confirmation
          "test": false,
          "lineItems": [
            {
              "plan": {
                "appRecurringPricingDetails": {
                  "price": {
                    "amount": targetPlan === "professional" ? 10.0 : targetPlan === "studio" ? 20 : null,
                    "currencyCode": "USD"
                  },
                  "interval": "EVERY_30_DAYS"
                }
              }
            }
          ]
        },
      },
    });

    const gid = returnedStatus.body.data.appSubscriptionCreate?.appSubscription?.id;
    const plan_id = gid.replace('gid://shopify/AppSubscription/', '');

    const db = new sqlite3.Database(DB_PATH);
    db.on('error', (err) => {
      console.error('Database error:', err);
    });
    try {
      const sql = `UPDATE users SET plan_id = $plan_id WHERE user_id = $userID`;
      const updateParams = {
        $plan_id: plan_id,
        $userID: id
      };
      db.run(sql, updateParams, function(err) {
        if (this.changes < 1) { 
          return res.send({ message: 'Something went wrong. Please try again.'})
        } else {
          return res.send({ message: returnedStatus.body.data.appSubscriptionCreate?.confirmationUrl})
        }
      });
    } catch (err) {
      console.log(err)
      return res.send({ message: 'Something went wrong. Please try again.'})
    } finally {
      db.close();
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
}
