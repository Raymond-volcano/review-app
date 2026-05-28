const QRCode = require('qrcode');

async function generateQR(text) {
  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      width: 400,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' }
    });
    return svg;
  } catch (err) {
    console.error('QR generation error:', err);
    throw err;
  }
}

module.exports = { generateQR };
