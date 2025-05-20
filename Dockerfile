FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache python3 make g++

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Compile TypeScript
RUN npm run build

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"] 