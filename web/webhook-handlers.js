import { DeliveryMethod } from "@shopify/shopify-api";
import sqlite3 from "sqlite3";

export default {

  APP_SUBSCRIPTIONS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('--- APP_SUBSCRIPTIONS_UPDATE ---');
      const payload = JSON.parse(body);
      console.log(shop);
      console.log(payload);
      if (payload?.app_subscription?.status === "ACTIVE") {
        console.log('ACTIVE')
        // Determine update wasn't pushed due to other reason
        // Query subscriptions, return time of charge was today (Query all charges for shop)
          // REST Billing RecurringApplicationCharge
          // recurring_application_charge.billing_on is today or 30 days future &&
          // ecurring_application_charge.created_at is today or multiple of 30 days ago
        // Update image count
      }
      console.log('--- / APP_SUBSCRIPTIONS_UPDATE ---');
      /**
      {
        "app_subscription": {
          "admin_graphql_api_id": "gid://shopify/AppSubscription/1029266952",
          "name": "Webhook Test",
          "status": "PENDING",
          "admin_graphql_api_shop_id": "gid://shopify/Shop/548380009",
          "created_at": "2021-12-31T19:00:00-05:00",
          "updated_at": "2021-12-31T19:00:00-05:00",
          "currency": "USD",
          "capped_amount": "20.0"
        }
      }
      */
    }
  },
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log('--- APP_UNINSTALLED ---');
      const payload = JSON.parse(body);
      console.log(shop);
      console.log(payload);
      console.log('--- / APP_UNINSTALLED ---');
      /**
      {
        id: 73997156649,
        name: 'motionstoryline-dev',
        email: 'eben@motionstoryline.com',
        domain: 'motionstoryline-dev.myshopify.com',
        province: null,
        country: 'US',
        address1: null,
        zip: null,
        city: null,
        source: null,
        phone: null,
        latitude: null,
        longitude: null,
        primary_locale: 'en',
        address2: null,
        created_at: '2023-04-03T03:37:37-04:00',
        updated_at: '2023-04-03T04:25:04-04:00',
        country_code: 'US',
        country_name: 'United States',
        currency: 'USD',
        customer_email: 'eben@motionstoryline.com',
        timezone: '(GMT-05:00) America/New_York',
        iana_timezone: 'America/New_York',
        shop_owner: 'Eben Mallory',
        money_format: '${{amount}}',
        money_with_currency_format: '${{amount}} USD',
        weight_unit: 'lb',
        province_code: null,
        taxes_included: false,
        auto_configure_tax_inclusivity: null,
        tax_shipping: null,
        county_taxes: true,
        plan_display_name: 'Developer Preview',
        plan_name: 'partner_test',
        has_discounts: false,
        has_gift_cards: false,
        myshopify_domain: 'motionstoryline-dev.myshopify.com',
        google_apps_domain: null,
        google_apps_login_enabled: null,
        money_in_emails_format: '${{amount}}',
        money_with_currency_in_emails_format: '${{amount}} USD',
        eligible_for_payments: true,
        requires_extra_payments_agreement: false,
        password_enabled: true,
        has_storefront: true,
        finances: true,
        primary_location_id: 80641392937,
        checkout_api_supported: false,
        multi_location_enabled: true,
        setup_required: false,
        pre_launch_enabled: false,
        enabled_presentment_currencies: [ 'USD' ],
        transactional_sms_disabled: false,
        marketing_sms_consent_enabled_at_checkout: false
        2023-07-29 18:29:07 | backend  | 
      }
      */
    }
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
          console.log('ok')
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
