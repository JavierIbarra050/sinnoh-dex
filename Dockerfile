# Etapa de construcción
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar el build compilado (asumiendo que vite genera en 'dist')
COPY --from=build /app/dist /usr/share/nginx/html

# Opcional: Copiar configuración de nginx para manejar SPA (Single Page Application)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
