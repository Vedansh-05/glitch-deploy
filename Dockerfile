# Stage 1: build dependencies
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose port (adjust according to your app)
EXPOSE 5173

# Command to run the app
CMD ["npm", "run", "dev"]
