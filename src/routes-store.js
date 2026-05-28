const express = require('express');
const router = express.Router();
const db = require('./db');

// Get store info + images + copies
router.get('/:id', (req, res) => {
  const store = db.getStore(req.params.id);
  if (!store) return res.status(404).json({ error: '店铺不存在' });

  const images = db.getImages(req.params.id).map(img => ({
    ...img,
    url: '/uploads/' + img.filename,
    thumbUrl: '/uploads/thumb_' + img.filename,
  }));
  const copies = db.getCopies(req.params.id);

  res.json({ store, images, copies });
});

// Log scan or completion
router.post('/:id/log', (req, res) => {
  const { completed } = req.body;
  const store = db.getStore(req.params.id);
  if (!store) return res.status(404).json({ error: '店铺不存在' });

  const log = db.logScan(req.params.id, completed === true);
  res.json({ success: true, id: log.id });
});

module.exports = router;
