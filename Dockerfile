# 构建阶段
FROM node:18-alpine AS build-stage

# 设置工作目录
WORKDIR /app

# 设置npm使用淘宝镜像
RUN npm config set registry https://registry.npmmirror.com


# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建项目
RUN npx vite build

# 生产阶段
FROM nginx:stable-alpine AS production-stage

# 复制构建产物到 Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"] 