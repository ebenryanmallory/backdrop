import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export const addCollectionImageRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
	const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });
  const collection_id = _req.body.collection_id;
  const image_id = _req.body.image_id;
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
              "id": image_id,
              "altText": "updated product shot",
              "src": image_url
            }
          }
        }
      }
    });
    
    console.log(returnedStatus.body.data.collectionUpdate.collection.image)
    return res.send({ message: returnedStatus.body.data.collectionUpdate.collection.image.src})
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
