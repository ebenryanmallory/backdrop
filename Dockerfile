FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

EXPOSE 8081
WORKDIR /app

# Install build-tools
RUN apk add --no-cache build-base autoconf automake libtool nasm zlib-dev libpng libpng-dev libjpeg-turbo libjpeg-turbo-dev libwebp libwebp-dev

COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
