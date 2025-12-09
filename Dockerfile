# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage - Usando Apache (httpd)
FROM httpd:alpine

# Copiar los archivos construidos al directorio de Apache
COPY --from=build /app/dist /usr/local/apache2/htdocs/

# Habilitar mod_rewrite para que funcionen las rutas de React
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

# Configurar FallbackResource para SPA (La forma más simple en Apache moderno)
# Esto le dice a Apache: "Si no encuentras el archivo, sirve index.html"
RUN echo "FallbackResource /index.html" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
