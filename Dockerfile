FROM node:24-slim AS build
WORKDIR /opt/qrx-scanner
ADD *.json ./
RUN npm install --ignore-scripts
ADD . .
RUN npm run demo:build

FROM sebp/lighttpd
WORKDIR /var/www/localhost/htdocs
COPY --from=build /opt/qrx-scanner/dist/demo ./
