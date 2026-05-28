const express = require('express');
const path = require('path');
const { initDB } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Init database (seeds demo data on first run)
initDB();

// Middleware
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/customer', express.static(path.join(__dirname, 'public/customer')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// API routes
app.use('/api/store', require('./src/routes-store'));
app.use('/api/admin', require('./src/routes-admin'));
app.use('/api/auth', require('./src/routes-auth'));

// Serve customer app at root (for QR code scanning)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/customer/index.html'));
});

// Fallback for SPA routes
app.get('/customer/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/customer/index.html'));
});
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🚀 评价素材助手已启动`);
  console.log(`  📍 http://localhost:${PORT}`);
  console.log(`  🏪 顾客端: http://localhost:${PORT}/?store=demo001`);
  console.log(`  🔧 管理后台: http://localhost:${PORT}/admin/`);
  console.log(`  🔑 店铺ID: demo001 / 密码: 123456\n`);
});
