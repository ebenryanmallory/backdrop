import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
import fetch from 'node-fetch'
import fs from 'fs';
import sqlite3 from "sqlite3";
import { STAGE_UPLOAD_IMAGE_MUTATION } from './queries/queries.js';

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
    const alt_text = filename.replace('.jpg', '').replace('.png', '').replace('.jpeg', '');
    console.log(alt_text)
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
              "alt": alt_text,
              "contentType": "IMAGE",
              "originalSource": stagedUploadUrl
            }
          },
        },
      });
      const createdFilter = createdFile.body.data.fileCreate.files[0].createdAt;
      const altFilter = createdFile.body.data.fileCreate.files[0].alt;
      console.log('alt filter: ' + altFilter)
      console.log('createdFilter: ' + createdFilter)
      let altImageQuery = await client.query({
        data: `query {
          files(first: 1, reverse: true, query: "alt:${altFilter}") {
            edges {
              node {
                ... on MediaImage {
                  id
                  createdAt
                  alt
                  fileStatus
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
        }`
      });
      console.log(altImageQuery.body.data.files.edges[0]);
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      const poll = async () => {
        altImageQuery = await client.query({
          data: `query {
            files(first: 1, reverse: true, query: "alt:${altFilter}") {
              edges {
                node {
                  ... on MediaImage {
                    id
                    createdAt
                    alt
                    fileStatus
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
          }`
        });
      }
      if (altImageQuery.body.data.files.edges.length > 0 && 
        altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        await sleep(250);
        poll();
      }
      if (altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        await sleep(250);
        poll();
      }
      if (altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        await sleep(500);
        poll();
      }
      if (altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        await sleep(500);
        poll();
      }
      console.log(altImageQuery.body.data.files.edges[0].node.fileStatus)
      if (altImageQuery && altImageQuery.body.data.files.edges.length > 0 &&
        altImageQuery.body.data.files.edges[0].node.createdAt === createdFilter) {
          console.log(id)
          const timestamp = new Date().toISOString();
          const hostedCDNurl = altImageQuery.body.data.files.edges[0].node.image.originalSrc;
          console.log(hostedCDNurl)
          console.log(!hostedCDNurl.includes(alt_text))
          if (!hostedCDNurl.includes(alt_text)) {
            return res.send('image not found')
          }
          console.log('running addImageUrl()...')
          await addImageUrl(id, hostedCDNurl, timestamp);
          console.log('addImageUrl() has completed')
          return res.send(hostedCDNurl);
      } else {
        return res.send('image not found')
      }
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