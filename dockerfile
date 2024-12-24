# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the bot source code
COPY . .

# Install yt-dlp directly in the container
RUN apt-get update && apt-get install -y curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Expose a port (optional for debugging)
EXPOSE 3000

# Set the default command to run the bot
CMD ["node", "bot.js"]
