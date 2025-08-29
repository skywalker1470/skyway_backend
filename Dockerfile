FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev if needed)
RUN npm install

# Copy remaining source code
COPY . .

# Expose port your app listens on
EXPOSE 5000

# Run backend with default environment
CMD ["node", "server.js"]
