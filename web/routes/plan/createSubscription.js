import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../../shopify.js";
import sqlite3 from "sqlite3";

export const createSubscription = async (_req, res) => {

    const session = res.locals.shopify.session;
    const { id, shop } = session;
    const client = new shopify.api.clients.Graphql({ session });
    const { plan_type } = _req.body;
    console.log(plan_type)

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
            }
            confirmationUrl
          }
        }`,
        "variables": {
          "name": "Professional Plan",
          "returnUrl": "http://super-duper.shopifyapps.com/",
          "test": true,
          "lineItems": [
            {
              "plan": {
                "appRecurringPricingDetails": {
                  "price": {
                    "amount": 10.0,
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

    console.log(returnedStatus.body.data.appSubscriptionCreate?.appSubscription?.id)
    const plan_id = returnedStatus.body.data.appSubscriptionCreate?.appSubscription?.id;
    async function updatePlanType(userId, plan_type, plan_id) {
      const db = new sqlite3.Database('database.sqlite');
      db.on('error', (err) => {
        console.error('Database error:', err);
      });
      try {
        const sql = `UPDATE users SET plan_type = $plan_type, plan_type = $plan_type WHERE WHERE user_id = $userID`;
        const updateParams = {
          $plan_type: plan_type,
          $plan_id: plan_id,
          $userID: userId
        };
        db.run(sql, updateParams, function(err) {
          console.log(this.changes)
          if (this.changes < 1) { return res.send({ message: 'Something went wrong. Please try again.'})}
        });
      } catch (err) {
        return res.send({ message: 'Something went wrong. Please try again.'})
      } finally {
        db.close();
      }
    }
    updatePlanType(id, plan_type, plan_id);

    return res.send({ message: returnedStatus.body.data.appSubscriptionCreate?.confirmationUrl})
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