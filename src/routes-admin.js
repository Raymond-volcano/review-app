const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const db = require('./db');
const { generateQR } = require('./qrcode');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('只支持图片格式'), false);
    cb(null, true);
  }
});

// All admin routes require auth
router.use((req, res, next) => {
  const token = req.headers.authorization;
  const storeId = req.headers['x-store-id'];
  if (!token || !storeId) return res.status(401).json({ error: '未登录' });

  const store = db.getStore(storeId);
  if (!store) return res.status(401).json({ error: '店铺不存在' });

  const password = process.env.STORE_PASSWORD || '123456';
  if (token !== 'Bearer ' + password) return res.status(401).json({ error: '密码错误' });

  req.storeId = storeId;
  next();
});

// Store info
router.get('/store', (req, res) => {
  res.json(db.getStore(req.storeId));
});

router.put('/store', (req, res) => {
  db.updateStore(req.storeId, req.body);
  res.json({ success: true });
});

// Images
router.get('/images', (req, res) => {
  const images = db.getImages(req.storeId);
  res.json(images.map(img => ({
    ...img,
    url: '/uploads/' + img.filename
  })));
});

router.post('/images', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '请选择图片' });

  try {
    // Compress image: max 1600px, JPEG quality 80%
    const filePath = req.file.path;
    const ext = path.extname(req.file.filename).toLowerCase();
    const isLossy = ['.jpg', '.jpeg'].includes(ext);

    const compressedPath = filePath.replace(/(\.[^.]+)$/, '_comp$1');
    await sharp(filePath)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(compressedPath);

    // Swap files
    fs.unlinkSync(filePath);
    let filename = req.file.filename;
    if (!isLossy) {
      // Converted to JPEG from PNG/etc
      filename = filename.replace(/\.[^.]+$/, '.jpg');
    }
    const finalPath = path.join(path.dirname(filePath), filename);
    fs.renameSync(compressedPath, finalPath);

    const img = db.addImage(req.storeId, filename, req.body.label || '');
    res.json({ ...img, url: '/uploads/' + filename });
  } catch (err) {
    console.error('Image compression error:', err);
    // Fallback: save uncompressed
    const img = db.addImage(req.storeId, req.file.filename, req.body.label || '');
    res.json({ ...img, url: '/uploads/' + img.filename });
  }
});

router.delete('/images/:id', (req, res) => {
  const img = db.deleteImage(req.params.id, req.storeId);
  if (img) {
    // Optionally delete file
    const fs = require('fs');
    const filePath = path.join(__dirname, '..', 'uploads', img.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  res.json({ success: true });
});

router.put('/images/sort', (req, res) => {
  db.updateImageSort(req.storeId, req.body.ids);
  res.json({ success: true });
});

// Copy templates
router.get('/copies', (req, res) => {
  res.json(db.getCopies(req.storeId));
});

router.post('/copies', (req, res) => {
  const { content, style } = req.body;
  if (!content) return res.status(400).json({ error: '请输入文案内容' });
  res.json(db.addCopy(req.storeId, content, style));
});

router.put('/copies/:id', (req, res) => {
  const { content, style } = req.body;
  if (!content) return res.status(400).json({ error: '请输入文案内容' });
  db.updateCopy(req.params.id, req.storeId, content, style);
  res.json({ success: true });
});

router.delete('/copies/:id', (req, res) => {
  db.deleteCopy(req.params.id, req.storeId);
  res.json({ success: true });
});

// Stats
router.get('/stats', (req, res) => {
  res.json(db.getStats(req.storeId));
});

// QR Code
router.get('/qrcode', async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/?store=${req.storeId}`;
    const svg = await generateQR(url);
    const store = db.getStore(req.storeId);
    res.json({ svg, url, storeName: store?.name || '' });
  } catch (err) {
    res.status(500).json({ error: '生成二维码失败' });
  }
});

module.exports = router;
