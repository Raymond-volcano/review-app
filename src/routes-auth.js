const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/login', (req, res) => {
  const { storeId, password } = req.body;
  if (!storeId || !password) return res.status(400).json({ error: '请输入店铺ID和密码' });

  const store = db.getStore(storeId);
  if (!store) return res.status(401).json({ error: '店铺不存在' });

  const storePassword = process.env.STORE_PASSWORD || '123456';
  if (password !== storePassword) return res.status(401).json({ error: '密码错误' });

  res.json({ success: true, store: { id: store.id, name: store.name } });
});

module.exports = router;
