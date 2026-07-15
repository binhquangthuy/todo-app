# Stage 1: Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package configuration files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy sources and compile static assets
COPY . .
RUN npm run build

# Stage 2: Production stage using Nginx
FROM nginx:alpine

# Copy built assets from build stage to Nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for proxying and routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
