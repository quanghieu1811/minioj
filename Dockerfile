# Sử dụng môi trường Node.js để chạy Next.js
FROM node:18-alpine

# Cài đặt thêm các trình biên dịch để chấm bài (C++, Python)
RUN apk update && apk add --no-cache g++ python3 make

WORKDIR /app

# Copy file cấu hình và cài đặt thư viện cho web
COPY package*.json ./
RUN npm install

# Copy toàn bộ code từ AI Studio sang
COPY . .

# Build dự án Next.js
RUN npm run build

EXPOSE 3000

# Chạy ứng dụng Next.js ở chế độ Production 24/7
CMD ["npm", "start"]
