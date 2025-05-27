# Use an official Node.js runtime as a parent image
FROM node:20-slim AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application code
COPY . .

CMD ["npm", "run", "dev"]

# Build the Next.js application
# RUN npm run build
# # If using yarn:
# # RUN yarn build

# # --- Production Stage ---
# # For a smaller production image, you can use a multi-stage build.
# # This is a simplified single-stage build for this task, but multi-stage is recommended.
# # Example for multi-stage (not fully implemented here to keep it simpler for the task):
# # FROM node:18-alpine AS production
# # WORKDIR /app
# # COPY --from=base /app/.next ./.next
# # COPY --from=base /app/public ./public
# # COPY --from=base /app/package.json ./package.json
# # COPY --from=base /app/node_modules ./node_modules # Or run npm install --production

# # Make port 3000 available to the world outside this container
# EXPOSE 3000

# # Define environment variable for the port (Next.js default is 3000)
# ENV PORT 3000

# # Run the Next.js production server when the container launches
# # npm run start typically executes `next start`
# CMD ["npm", "run", "start"]
