FROM node:20-alpine AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
RUN mkdir -p /etc/nginx/certs
COPY nginx.crt /etc/nginx/certs/nginx.crt
COPY nginx.key /etc/nginx/certs/nginx.key
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]