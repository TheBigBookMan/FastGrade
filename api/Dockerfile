FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy Prisma schema before running generate
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the code
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
