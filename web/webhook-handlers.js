import { DeliveryMethod } from "@shopify/shopify-api";
import sqlite3 from "sqlite3";

export default {
  SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('--- Payment Success update ---');
      const payload = JSON.parse(body);
      console.log(payload);
      console.log('--- /Payment Success update ---');
      res.status(200).send('OK');
    },
  },
  SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('--- Failure update ---');
      const payload = JSON.parse(body);
      console.log(payload);
      console.log('--- /Failure update ---');
      res.status(200).send('OK');
    },
  },
  APP_SUBSCRIPTIONS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('--- APP_SUBSCRIPTIONS_UPDATE ---');
      const payload = JSON.parse(body);
      console.log(payload);
      console.log('--- / APP_SUBSCRIPTIONS_UPDATE ---');
      res.status(200).send('OK');
    },
  },
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      const { shop_id, orders_requested, customer } = payload;

      // This Shopify app does not request scopes to access customer data

      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "orders_requested": [
      //     299938,
      //     280263,
      //     220458
      //   ],
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "data_request": {
      //     "id": 9999
      //   }
      // }
    },
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      const { shop_id, shop_domain, customer, orders_to_redact } = payload;
      // This Shopify app does not request scopes to access customer data

      res.status(200).send('OK');
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }
    },
  },

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      const { shop_id, shop_domain } = payload;

      const db = new sqlite3.Database(DB_PATH);
      const userQuery = `DELETE FROM users WHERE user_id = ?`;
      const imagesQuery = `DELETE FROM user_images WHERE user_id = ?`;
      db.run(userQuery, [shop_domain], function() {
        if (this.changes < 1) { res.status(200).send('No user found') }
        db.run(imagesQuery, [shop_domain], function() {
          res.status(200).send('OK');
        });
      });
      db.close();


      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com"
      // }
    },
  }
};
