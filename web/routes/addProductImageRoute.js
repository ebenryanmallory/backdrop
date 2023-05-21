import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export const addProductImageRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
	const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });
  const product_id = _req.body.product_id;
  const image_url = _req.body.image_url;
  try {
    const returnedStatus = await client.query({
      data: {
        "query": `mutation productAppendImages($input: ProductAppendImagesInput!) {
          productAppendImages(input: $input) {
            newImages {
              id
              altText
            }
            product {
              id
            }
            userErrors {
              field
              message
            }
          }
        }`,
        "variables": {
          "input": {
            "id": product_id,
            "images": [
              {
                "altText": "updated product shot",
                "src": image_url
              }
            ]
          }
        }
      },
    });
    return res.send({ message: returnedStatus.body.data.productAppendImages?.newImages})
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
