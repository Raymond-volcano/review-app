const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '..', 'data', 'review.db');
let db;

function initDB() {
  const fs = require('fs');
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      password TEXT NOT NULL DEFAULT '123456',
      welcome_text TEXT DEFAULT '欢迎光临！',
      logo TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL REFERENCES stores(id),
      filename TEXT NOT NULL,
      label TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS copy_templates (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL REFERENCES stores(id),
      content TEXT NOT NULL,
      style TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS scan_logs (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL REFERENCES stores(id),
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_images_store ON images(store_id);
    CREATE INDEX IF NOT EXISTS idx_copies_store ON copy_templates(store_id);
    CREATE INDEX IF NOT EXISTS idx_logs_store ON scan_logs(store_id);
    CREATE INDEX IF NOT EXISTS idx_logs_date ON scan_logs(created_at);
  `);

  // Seed demo store if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM stores').get();
  if (count.c === 0) {
    seedDemoStore();
  }
  return db;
}

function seedDemoStore() {
  const storeId = 'demo001';
  db.prepare(`INSERT INTO stores (id, name, phone, password, welcome_text, logo) VALUES (?, ?, ?, ?, ?, ?)`).run(
    storeId, '美宝月子中心', '13800138000', '123456', '欢迎来到美宝月子中心！点击开始，用好评记录您的蜜月之旅 🎉', '/uploads/logo.jpg'
  );

  // Seed images - use the actual filenames
  const imageFiles = [
    '微信图片_20260528110414_26_10.jpg',
    '微信图片_20260528110415_27_10.jpg',
    '微信图片_20260528110415_28_10.jpg',
    '微信图片_20260528110416_29_10.jpg',
    '微信图片_20260528110417_30_10.jpg',
    '微信图片_20260528110418_31_10.jpg',
    '微信图片_20260528110420_33_10.jpg',
    '微信图片_20260528110422_35_10.jpg',
    '微信图片_20260528110423_36_10.jpg',
    '微信图片_20260528110423_37_10.jpg'
  ];

  const imageLabels = [
    '花鸟背景墙，东方韵味',
    '超大客厅空间',
    '独立婴儿护理台',
    '巨幕投影，休闲时光',
    '独立洗衣机，洁净安心',
    '真皮大床，舒适入眠',
    '开放式中央岛台',
    '时尚水龙头设计',
    '温馨灯光氛围',
    '宽敞客厅全景'
  ];

  const insertImage = db.prepare(`INSERT INTO images (id, store_id, filename, label, sort_order) VALUES (?, ?, ?, ?, ?)`);
  imageFiles.forEach((f, i) => {
    insertImage.run(uuidv4(), storeId, f, imageLabels[i] || '', i);
  });

  // Seed copy templates
  const copies = [
    {
      style: '尊贵体验',
      content: `🌸 用爱拥抱新生，尊享女王般的月子时光 🌸

告别传统月子的忙乱，在这里遇见更好的自己。✨

步入套房，映入眼帘的是如诗如画的背景墙和柔软舒适的真皮大床，阳光透过大落地窗洒下，温暖而明亮。在这里，您只需负责好好休息，其余的一切，交给我们。

【五星标准】星级酒店般的居住环境，配备巨幕投影，休息时光不再枯燥。
【细节关怀】独立洗衣机洁净安心，开放式岛台满足日常需求。
【专业服务】24小时专业护士团队，产后修复导师全程跟进，科学定制营养月子餐。

来美宝月子中心，开启一段舒适、安心、尊贵的蜜月之旅。`
    },
    {
      style: '小红书分享',
      content: `小红书爆款预警🔥｜这里的月子套房，大到可以开Party🎉！

今天来给大家安利一家神仙月子中心——美宝月子中心！真的颠覆了我对月子的认知，这哪里是坐月子，简直是住进了时尚艺术酒店！😍

🌟 亮点一：一眼万年的神仙颜值
背景墙上的花鸟刺绣高级感满满，怎么拍都好看。真皮大床超级舒服，整个人都治愈了。

🌟 亮点二：超大套房空间
独立的客厅区域，家人陪护不拥挤。专门的婴儿护理台，细节💯！

🌟 亮点三：黑科技加持
房间里的巨幕投影，躺在床上就能看大片，太解压了。

🌟 亮点四：细节控福音
独立洗衣机、开放式厨房岛台、超大镜面，都非常实用。

在这里坐月子，真的是一种享受！`
    },
    {
      style: '科学专业',
      content: `美宝月子中心：把科学搬进家，给宝宝最好的开始

科学月子，安心之选。产后是妈妈身体恢复的黄金期，也是宝宝建立安全感的关键期。在这里，我们提供一个如家般温暖、如医院般专业的环境。

🏡 科学配置的安心空间
大落地窗确保充足采光和空气流通，专用婴儿护理区避免交叉感染。

💡 功能齐全，科学养育
独立客厅方便家人分区分功能使用，独立洗衣机确保母婴衣物及时清洁。

🤝 专业团队，科学照护
拥有多年三甲医院产科经验的专家团队，为您定制产后康复计划。专业的护士团队，为您提供最科学的婴儿喂养和护理指导。

选择美宝月子中心，就是选择了一个无忧、科学、健康的月子体验。`
    }
  ];

  const insertCopy = db.prepare(`INSERT INTO copy_templates (id, store_id, content, style, sort_order) VALUES (?, ?, ?, ?, ?)`);
  copies.forEach((c, i) => {
    insertCopy.run(uuidv4(), storeId, c.content, c.style, i);
  });
}

// ====== Store ======
function getStore(id) {
  return db.prepare('SELECT id, name, welcome_text, logo, created_at FROM stores WHERE id = ?').get(id);
}

function updateStore(id, data) {
  const { name, welcome_text, phone } = data;
  db.prepare('UPDATE stores SET name = COALESCE(?, name), welcome_text = COALESCE(?, welcome_text), phone = COALESCE(?, phone) WHERE id = ?')
    .run(name || null, welcome_text || null, phone || null, id);
}

// ====== Images ======
function getImages(storeId) {
  return db.prepare('SELECT id, filename, label, sort_order FROM images WHERE store_id = ? ORDER BY sort_order ASC').all(storeId);
}

function addImage(storeId, filename, label) {
  const id = uuidv4();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM images WHERE store_id = ?').get(storeId);
  db.prepare('INSERT INTO images (id, store_id, filename, label, sort_order) VALUES (?, ?, ?, ?, ?)').run(id, storeId, filename, label || '', maxOrder.next);
  return { id, filename, label, sort_order: maxOrder.next };
}

function deleteImage(id, storeId) {
  const img = db.prepare('SELECT filename FROM images WHERE id = ? AND store_id = ?').get(id, storeId);
  if (img) {
    db.prepare('DELETE FROM images WHERE id = ? AND store_id = ?').run(id, storeId);
  }
  return img;
}

function updateImageSort(storeId, imageIds) {
  const stmt = db.prepare('UPDATE images SET sort_order = ? WHERE id = ? AND store_id = ?');
  const tx = db.transaction(() => {
    imageIds.forEach((id, i) => stmt.run(i, id, storeId));
  });
  tx();
}

// ====== Copy Templates ======
function getCopies(storeId) {
  return db.prepare('SELECT id, content, style, sort_order FROM copy_templates WHERE store_id = ? ORDER BY sort_order ASC').all(storeId);
}

function addCopy(storeId, content, style) {
  const id = uuidv4();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM copy_templates WHERE store_id = ?').get(storeId);
  db.prepare('INSERT INTO copy_templates (id, store_id, content, style, sort_order) VALUES (?, ?, ?, ?, ?)').run(id, storeId, content, style || '', maxOrder.next);
  return { id, content, style, sort_order: maxOrder.next };
}

function updateCopy(id, storeId, content, style) {
  db.prepare('UPDATE copy_templates SET content = ?, style = ? WHERE id = ? AND store_id = ?').run(content, style || '', id, storeId);
}

function deleteCopy(id, storeId) {
  db.prepare('DELETE FROM copy_templates WHERE id = ? AND store_id = ?').run(id, storeId);
}

// ====== Scan Logs ======
function logScan(storeId, completed) {
  const id = uuidv4();
  db.prepare('INSERT INTO scan_logs (id, store_id, completed) VALUES (?, ?, ?)').run(id, storeId, completed ? 1 : 0);
  return { id };
}

function getStats(storeId) {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  const todayScans = db.prepare("SELECT COUNT(*) as c FROM scan_logs WHERE store_id = ? AND created_at >= ?").get(storeId, today);
  const todayCompletes = db.prepare("SELECT COUNT(*) as c FROM scan_logs WHERE store_id = ? AND completed = 1 AND created_at >= ?").get(storeId, today);
  const totalScans = db.prepare("SELECT COUNT(*) as c FROM scan_logs WHERE store_id = ?").get(storeId);
  const totalCompletes = db.prepare("SELECT COUNT(*) as c FROM scan_logs WHERE store_id = ? AND completed = 1").get(storeId);

  // Last 7 days trend
  const trend = db.prepare(`
    SELECT date(created_at) as day,
           COUNT(*) as scans,
           SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completes
    FROM scan_logs
    WHERE store_id = ? AND created_at >= ?
    GROUP BY date(created_at)
    ORDER BY day ASC
  `).all(storeId, weekAgo);

  // Fill in missing days
  const trendMap = {};
  trend.forEach(t => { trendMap[t.day] = { scans: t.scans, completes: t.completes }; });
  const fullTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split('T')[0];
    fullTrend.push({
      day: key,
      scans: trendMap[key]?.scans || 0,
      completes: trendMap[key]?.completes || 0
    });
  }

  return {
    todayScans: todayScans.c,
    todayCompletes: todayCompletes.c,
    totalScans: totalScans.c,
    totalCompletes: totalCompletes.c,
    trend: fullTrend
  };
}

module.exports = { initDB, getStore, updateStore, getImages, addImage, deleteImage, updateImageSort, getCopies, addCopy, updateCopy, deleteCopy, logScan, getStats };
