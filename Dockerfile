# Sử dụng môi trường ảo của Bun để chạy Next.js siêu nhanh
FROM oven/bun:1-alpine

# BẮT BUỘC: Cài thêm các trình biên dịch để phục vụ việc chấm bài (C++ và Python)
RUN apk update && apk add --no-cache g++ python3 make

WORKDIR /app

# Sao chép file quản lý thư viện và tiến hành cài đặt
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Sao chép toàn bộ mã nguồn dự án sang
COPY . .

# Build dự án Next.js
RUN bun run build

EXPOSE 3000

# Khởi chạy dự án Next.js 24/7 trên Render
CMD ["bun", "run", "start"]
