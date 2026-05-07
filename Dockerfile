# Etapa 1: Compilación (Build) con Node
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar para producción
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Servidor Web con Nginx
FROM nginx:alpine
# Copiamos los archivos compilados desde la etapa 'build'
# NOTA: Verifica que la ruta 'dist/deportivo-ucn-frontend/browser' coincida con tu proyecto
COPY --from=build /app/dist/deportivo-ucn-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]