# Sử dụng base image nginx nhẹ
FROM nginx:stable-alpine

# Xoá config mặc định của nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copy file cấu hình nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build Angular vào thư mục root của nginx
COPY dist/emailer-fe /usr/share/nginx/html

# Expose port 80 để container có thể truy cập từ ngoài
EXPOSE 80

# Khởi động nginx khi container start
CMD ["nginx", "-g", "daemon off;"]
