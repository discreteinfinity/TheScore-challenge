FROM node:12.18-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY . ./
RUN npm test
EXPOSE 3000
CMD ["npm", "start"]
