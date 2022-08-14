FROM node
WORKDIR /app
COPY . .
WORKDIR /app/backend/
RUN npm install
WORKDIR /app/frontend/
RUN npm install
WORKDIR /app
CMD 
