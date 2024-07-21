# Stage 1: Build the backend
FROM node:18-slim as build-backend

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the backend service
CMD ["npm", "run", "dev"]
