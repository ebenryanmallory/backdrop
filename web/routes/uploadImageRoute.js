import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
import fetch from 'node-fetch'
import fs from 'fs';
import sqlite3 from "sqlite3";

const STAGE_UPLOAD_IMAGE_MUTATION = `
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }   
`;

export const uploadImageRoute = async (_req, res) => {
  const imageFile = fs.readFileSync(`${process.cwd()}/app-icon.jpeg`);
  const session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });

  try {
    // GQL image staging to CDN
    const stagedUpload = await client.query({
      data: {
        query: STAGE_UPLOAD_IMAGE_MUTATION,
        variables: {
          input: [
            {
              filename: "test.jpeg",
              mimeType: "image/jpeg",
              resource: "IMAGE",
              httpMethod: "PUT"
            }
          ]
        },
      },
    });

    const stagedUploadUrl = stagedUpload.body.data.stagedUploadsCreate.stagedTargets[0].url;
    const resourceUrl = stagedUpload.body.data.stagedUploadsCreate.stagedTargets[0].resourceUrl;
    const imageUploadResponse = await fetch(stagedUploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "image/jpeg",
        "acl": "private"
      },
      body: imageFile
    });

    if (!imageUploadResponse.ok) {
      throw new Error(`Failed to upload image: ${imageUploadResponse.statusText}`);
    } else {
        async function addImageUrl(userId, imageUrl, created_at) {
          let db = null;
          try {
            db = new sqlite3.Database('database.sqlite')
            const query = `INSERT INTO user_images (user_id, image_url, created_at) VALUES (?, ?, ?)`;
            await db.run(query, [userId, imageUrl, timestamp]);
          } catch (err) {
            console.error(err);
          } finally {
            if (db) {
              db.close();
            }
          }
        }
        const { id } = session;
        const timestamp = new Date().toISOString();
        addImageUrl(id, resourceUrl, timestamp);
    }
    return res.send(resourceUrl);
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
