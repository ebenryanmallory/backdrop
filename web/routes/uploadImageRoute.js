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

  const session = res.locals.shopify.session;
	const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });
  const { use_compression, filename } = _req.body;

  const filePath = use_compression === true ? `${process.cwd()}/images/${shop}/compressed/${filename}` :
    `${process.cwd()}/images/${shop}/${filename}`;
  const imageFile = fs.readFileSync(filePath);

  try {
    // image staging to CDN
    const stagedUpload = await client.query({
      data: {
        query: STAGE_UPLOAD_IMAGE_MUTATION,
        variables: {
          input: [
            {
              filename: filename,
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
      const createdFile = await client.query({
        data: {
          "query": `mutation fileCreate($files: [FileCreateInput!]!) {
            fileCreate(files: $files) {
              files {
                alt
                createdAt
              }
            }
          }`,
          "variables": {
            "files": {
              "alt": "",
              "contentType": "IMAGE", // image/jpeg
              "originalSource": stagedUploadUrl
            }
          },
        },
      });
      const createdFilter = createdFile.body.data.fileCreate.files[0].createdAt;
      const uploadedImageQuery = await client.query({
        data: `query {
          files(first: 1, query: "created_at:${createdFilter}") {
            edges {
              node {
                ... on MediaImage {
                  id
                  image {
                    id
                    originalSrc: url
                    width
                    height
                  }
                }
              }
            }
          }
        }`,
      });
      if (uploadedImageQuery.body.data.files.edges.length < 1) {
        return res.send('Created image not found')
      }
      let hostedCDNurl = uploadedImageQuery.body.data.files.edges[0].node.image?.originalSrc;
      if (!hostedCDNurl.includes(filename)) {
        const uploadedImageQuery = await client.query({
          data: `query {
            files(first: 1, query: "created_at:${createdFilter}") {
              edges {
                node {
                  ... on MediaImage {
                    id
                    image {
                      id
                      originalSrc: url
                      width
                      height
                    }
                  }
                }
              }
            }
          }`,
        });
        hostedCDNurl = uploadedImageQuery.body.data.files.edges[0].node.image?.originalSrc;
      }
      async function addImageUrl(userId, imageUrl, timestamp) {
        let db = null;
        try {
          db = new sqlite3.Database('database.sqlite')
          const query = `INSERT INTO user_images (user_id, image_url, created_at) VALUES (?, ?, ?)`;
          db.run(query, [userId, imageUrl, timestamp], function() {
            console.log(this.changes)
          });
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
      addImageUrl(id, hostedCDNurl, timestamp);
      return res.send(hostedCDNurl);
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
