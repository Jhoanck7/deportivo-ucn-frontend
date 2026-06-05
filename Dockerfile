FROM node:20-alpine AS build
WORKDIR /app

# Instalar Angular CLI globalmente primero
RUN npm install -g @angular/cli@21

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN ng build --configuration=production

FROM nginx:alpine
COPY --from=build /app/dist/deportivo-ucn-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]