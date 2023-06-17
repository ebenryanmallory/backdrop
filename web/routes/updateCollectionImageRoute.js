import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export const updateCollectionImageRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
	const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });
  const collection_id = _req.body.collection_id;
  const image_url = _req.body.image_url;

  try {
    const returnedStatus = await client.query({
      data: {
        "query": `mutation collectionUpdate($input: CollectionInput!) {
          collectionUpdate(input: $input) {
            collection {
              id
              image {
                src
                altText
              }
            }
            userErrors {
              field
              message
            }
          }
        }`,
        "variables": {
          "input": {
            "id": collection_id,
            "image": {
              "altText": "updated collection image",
              "src": image_url
            }
          }
        }
      }
    });
    return res.send({
      content: "Collection image updated!",
      error: false
    })
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
