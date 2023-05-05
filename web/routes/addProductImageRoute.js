import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export const addProductImageRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
	const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });
  const product_id = _req.body.product_id;
  const image_id = _req.body.image_id;
  const image_url = _req.body.image_url;
  console.log(product_id)
  try {
    const returnedStatus = await client.query({
      data: {
        "query": `mutation productImageUpdate($productId: ID!, $image: ImageInput!) {
          productImageUpdate(productId: $productId, image: $image) {
            image {
              id
              altText
              src
            }
            userErrors {
              field
              message
            }
          }
        }`,
        "variables": {
          "productId": product_id,
          "image": {
            "id": image_id,
            "altText": "updated product shot",
            "src": image_url
          }
        },
      },
    });
    return res.send({ message: returnedStatus.body.data.productImageUpdate.image.src})
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
