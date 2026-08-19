FROM node:22-slim

WORKDIR /app
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
RUN npm install -g pnpm@11.13.1


COPY package.json ./

CMD ["pnpm", "start:dev"]
