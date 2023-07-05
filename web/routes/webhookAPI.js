import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
export const modifyWebhooks = async (_req, res) => {

    const session = res.locals.shopify.session;
	const { id, shop } = session;

    const client = new shopify.api.clients.Graphql({ session });

    try {

        const checkWebhooks = await client.query({
        data: `query {
            webhookSubscriptions(first: 3) {
            edges {
                node {
                id
                topic
                endpoint {
                    __typename
                    ... on WebhookHttpEndpoint {
                        callbackUrl
                    }
                    ... on WebhookEventBridgeEndpoint {
                        arn
                    }
                    ... on WebhookPubSubEndpoint {
                        pubSubProject
                        pubSubTopic
                    }
                }
                }
            }
            }
        }`,
        });
        console.log(checkWebhooks.body.data.webhookSubscriptions.edges[0])
        console.log(checkWebhooks.body.data.webhookSubscriptions.edges[1])
        console.log(checkWebhooks.body.data.webhookSubscriptions.edges[2])
    } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }

/*

        const updated = await client.query({
            data: {
                "query": `mutation webhookSubscriptionUpdate($id: ID!, $webhookSubscription: WebhookSubscriptionInput!) {
                webhookSubscriptionUpdate(id: $id, webhookSubscription: $webhookSubscription) {
                    userErrors {
                        field
                        message
                    }
                    webhookSubscription {
                        id
                        topic
                        endpoint {
                            ... on WebhookHttpEndpoint {
                                callbackUrl
                            }
                        }
                    }
                }
                }`,
                "variables": {
                "id": "gid://shopify/WebhookSubscription/1334490693929",
                "webhookSubscription": {
                    "callbackUrl": "https://c8eb-216-82-140-151.ngrok-free.app/api/webhooks"
                }
                },
            },
        });
        console.log(updated.body.data)

    const created = await client.query({
        data: {
            "query": `mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
                webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
                    webhookSubscription {
                        id
                        topic
                        format
                        endpoint {
                            __typename
                            ... on WebhookHttpEndpoint {
                                callbackUrl
                            }
                        }
                    }
                }
            }`,
            "variables": {
            "topic": "APP_SUBSCRIPTIONS_UPDATE",
            "webhookSubscription": {
                "callbackUrl": "https://backdrop.fly.dev/api/webhooks",
                "format": "JSON"
            }
            },
        },
    });
    console.log(created.body.data)
    console.log(created.body.data.webhookSubscriptionCreate.webhookSubscription)

    const deletedReturn = await client.query({
        data: {
            "query": `mutation webhookSubscriptionDelete($id: ID!) {
            webhookSubscriptionDelete(id: $id) {
                userErrors {
                field
                message
                }
                deletedWebhookSubscriptionId
            }
            }`,
            "variables": {
            "id": "gid://shopify/WebhookSubscription/1334487417129"
            },
        },
    });

    
*/
}