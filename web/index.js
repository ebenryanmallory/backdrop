// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import multer from 'multer';

import shopify from "./shopify.js";
import webhookHandlers from "./webhook-handlers.js";

import { compressRoute } from './routes/compressRoute.js'
import { createUserRoute } from './routes/createUserRoute.js'
import { getUserImagesRoute } from './routes/getUserImagesRoute.js'
import { getUserFreeCountRoute } from './routes/getUserFreeCountRoute.js'
import { updateFreeCountRoute } from './routes/updateFreeCountRoute.js'
import { removeRoute } from './routes/removeRoute.js'
import { uploadImageRoute } from './routes/uploadImageRoute.js'
import { deleteUserImageRoute } from './routes/deleteUserImageRoute.js'
import { deleteAllDataRoute } from './routes/deleteAllDataRoute.js'
import { addProductImageRoute } from './routes/addProductImageRoute.js'
import { updateCollectionImageRoute } from './routes/updateCollectionImageRoute.js'
import { updatePreferencesRoute } from './routes/updatePreferencesRoute.js'
import { getPreferencesRoute } from './routes/getPreferencesRoute.js'

import { createSubscription } from './routes/plan/createSubscription.js'
import { confirmSubscription } from './routes/plan/confirmSubscription.js'
import { cancelSubscription } from './routes/plan/cancelSubscription.js'
import { modifyWebhooks } from "./routes/webhookAPI.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post( shopify.config.webhooks.path, shopify.processWebhooks({
  webhookHandlers
}) );

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/api/create-user", createUserRoute);
app.get("/api/get-user-free-count", getUserFreeCountRoute);
app.get("/api/get-user-images", getUserImagesRoute);
app.get("/api/get-preferences", getPreferencesRoute);

app.post("/api/remove-bg", upload.any(), removeRoute);
app.post("/api/compress", compressRoute);
app.post("/api/upload", uploadImageRoute);
app.post("/api/add-product-image", addProductImageRoute);
app.post("/api/update-collection-image", updateCollectionImageRoute);
app.post("/api/update-preferences", updatePreferencesRoute);
app.post("/api/update-free-count", updateFreeCountRoute);
app.post("/api/create-subscription", createSubscription);
app.post("/api/confirm-subscription", confirmSubscription);
app.post("/api/cancel-subscription", cancelSubscription);
app.post("/api/modify-webhooks", modifyWebhooks);

app.post("/api/delete-user-image", deleteUserImageRoute);
app.post("/api/delete-all-data", deleteAllDataRoute);

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
