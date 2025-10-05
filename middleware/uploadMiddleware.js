import multer from 'multer';
import DatauriParser from 'datauri/parser.js';
import path from 'path';

// ✅ Multer storage: stores files in memory (RAM)
const storage = multer.memoryStorage();

const allowedTypes = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream', // fallback ZIP
  'text/html',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'application/pdf',
];

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max file size: 50MB
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      console.log(`✅ Accepted file type: ${file.mimetype}`);
      cb(null, true);
    } else {
      console.warn(`🚫 Blocked unsupported file type: ${file.mimetype}`);
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  },
});

const parser = new DatauriParser();

const formatBufferTo64 = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    console.error("❌ Invalid file for base64 conversion.");
    return null;
  }

  const ext = path.extname(file.originalname).toString();
  const base64 = parser.format(ext, file.buffer);

  if (!base64?.content) {
    console.error("⚠️ Could not convert buffer to base64.");
    return null;
  }

  console.log("🔁 File converted to base64:", base64.mimetype || ext);
  return base64;
};

export { upload, formatBufferTo64 };