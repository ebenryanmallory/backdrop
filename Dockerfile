FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

EXPOSE 8081
WORKDIR /app

# LiteFS
ADD litefs.yml /tmp/litefs.yml
RUN cp /tmp/litefs.yml /etc/litefs.yml
RUN apk add ca-certificates fuse3 sqlite
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs
ENTRYPOINT litefs mount

# Install build-tools
RUN apk add --no-cache build-base autoconf automake libtool nasm zlib-dev libpng libpng-dev libjpeg-turbo libjpeg-turbo-dev libwebp libwebp-dev

COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
