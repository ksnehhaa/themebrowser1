// routes/uploadRoutes.js
import express from 'express';
import {
  handleUpload,
  getUploadsByCategory,
  getUploadsByUser,
} from '../controllers/uploadController.js';

import { verifyToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ✅ Single clean POST /api/upload route
router.post(
  '/upload',
  verifyToken,
  upload.single('file'),
  (req, res, next) => {
    if (!req.file) {
      console.warn('⚠️ No file received in route.');
    } else {
      console.log(
        '📥 File received:',
        req.file.originalname,
        req.file.mimetype,
        `${req.file.size} bytes`
      );
    }
    next();
  },
  handleUpload
);

// ✅ Get uploads by category
router.get('/category/:category', getUploadsByCategory);

// ✅ Get uploads by logged-in user
router.get('/user/uploads', verifyToken, getUploadsByUser);

export default router;