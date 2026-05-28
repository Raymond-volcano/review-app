#!/bin/bash
# 评价素材助手 - 启动脚本（用于 Zeabur 等部署平台）

echo "🚀 安装依赖..."
npm install

echo "📦 构建顾客端..."
cd customer && npm install && npm run build && cd ..

echo "📦 构建管理后台..."
cd admin && npm install && npm run build && cd ..

echo "✅ 启动服务器..."
node server.js
