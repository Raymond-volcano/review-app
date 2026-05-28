const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { initDB } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Init database (seeds demo data on first run)
initDB();

// Generate missing thumbnails for existing uploads (async)
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  fs.readdirSync(uploadsDir).forEach(file => {
    if (file.startsWith('thumb_')) return;
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) return;
    const thumbFile = 'thumb_' + file;
    if (fs.existsSync(path.join(uploadsDir, thumbFile))) return;
    sharp(path.join(uploadsDir, file))
      .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 65 })
      .toFile(path.join(uploadsDir, thumbFile))
      .catch(() => {});
  });
}

// Middleware
app.use(express.json());

// Static files with caching headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  immutable: true,
}));
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
