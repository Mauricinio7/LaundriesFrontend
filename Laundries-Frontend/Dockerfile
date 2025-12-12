# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# deps
COPY package*.json ./
RUN npm ci

# source
COPY . .

# build (Vite)
RUN npm run build

# ---------- Run (Nginx) ----------
FROM nginx:1.27-alpine

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# static dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]