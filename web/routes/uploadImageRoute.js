import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
import fetch from 'node-fetch'
import fs from 'fs';
import sqlite3 from "sqlite3";
import { STAGE_UPLOAD_IMAGE_MUTATION } from './queries/STAGE_UPLOAD_IMAGE_MUTATION.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const uploadImageRoute = async (_req, res) => {

  const session = res.locals.shopify.session;
	const { id, shop } = session;
  const client = new shopify.api.clients.Graphql({ session });
  const { use_compression, filename } = _req.body;

  const filePath = use_compression === true ? `${process.cwd()}/images/${shop}/compressed/${filename}` :
    `${process.cwd()}/images/${shop}/${filename}`;
  const imageFile = fs.readFileSync(filePath);
  const isPNG = filename.includes('.png');

  try {
    // image staging to CDN
    const stagedUpload = await client.query({
      data: {
        query: STAGE_UPLOAD_IMAGE_MUTATION,
        variables: {
          input: [
            {
              filename: filename,
              mimeType: isPNG ? "image/png" : "image/jpeg",
              resource: "IMAGE",
              httpMethod: "PUT"
            }
          ]
        },
      },
    });

    // console.log(stagedUpload.body.data.stagedUploadsCreate.stagedTargets[0])
    const stagedUploadUrl = stagedUpload.body.data.stagedUploadsCreate.stagedTargets[0].url;
    const urlRemoved = stagedUploadUrl.substring(stagedUploadUrl.lastIndexOf('/') + 1);
    const queryRemoved = urlRemoved.split('?')[0];
    const alt_text = queryRemoved.replace('.jpg', '').replace('.png', '').replace('.jpeg', '');

    const imageUploadResponse = await fetch(stagedUploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": isPNG ? "image/png" : "image/jpeg",
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
      await poll();
      if (altImageQuery.body.data.files.edges.length > 0 && 
        altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        await sleep(250);
        await poll();
      }
      if (altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        await sleep(250);
        await poll();
      }
      if (altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        await sleep(500);
        await poll();
      }
      if (altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        await sleep(500);
        await poll();
      }
      if (altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        await sleep(3000);
        await poll();
      }
      if (altImageQuery.body.data.files.edges[0].node.fileStatus === 'PROCESSING') {
        return res.send({ 
          content: "Image upload took longer than expected. Please check internet connection.",
          error: true
        })
      }
      if (altImageQuery && altImageQuery.body.data.files.edges.length > 0 &&
        altImageQuery.body.data.files.edges[0].node.createdAt === createdFilter) {
          const timestamp = new Date().toISOString();
          const hostedCDNurl = altImageQuery.body.data.files.edges[0].node.image.originalSrc;
          if (!hostedCDNurl.includes('https://cdn.shopify.com/s/files')) {
            console.log('CDN URL seems wrong')
            return res.send({ 
              content: "Image upload took longer than expected. Please check your files.",
              error: true
            })
          }
          await addImageUrl(id, hostedCDNurl, timestamp);
          return res.send({ content: "Success!" });
      } else {
        return res.send({ 
          content: "Image upload took longer than expected. Please check your files.",
          error: true
        })
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
      if (this.changes !== 1) { console.log('no update made...')}
    });
  } catch (err) {
    console.error(err);
  } finally {
    if (db) {
      db.close();
    }
  }
}