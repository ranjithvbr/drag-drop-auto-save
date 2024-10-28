# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's files
COPY . .

# Expose port and start the React app
EXPOSE 3000
CMD ["npm", "start"]
