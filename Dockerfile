FROM oven/bun:1-alpine

# Install Node.js (needed for smee-client)
RUN apk add --no-cache nodejs npm

# Install smee-client globally
RUN npm install -g smee-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies with Bun
RUN bun install

# Copy application files
COPY . .

# Expose the application port
EXPOSE 3000

# Environment variables (can be overridden at runtime)
ENV GITHUB_APP_ID=""
ENV GITHUB_PRIVATE_KEY_PATH="./private-key.pem"
ENV GROQ_API_KEY=""
ENV SMEE_URL=""
ENV PORT=3000

# Create an entrypoint script to run both smee and the app
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'smee --url $SMEE_URL --path /webhook &' >> /app/entrypoint.sh && \
    echo 'bun run index.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Run the entrypoint script
CMD ["/app/entrypoint.sh"]
