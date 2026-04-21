import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import multer from 'multer';

const projectRoot = path.resolve(process.cwd());
const uploadDir = path.join(projectRoot, 'image_uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.gif']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString('hex');
    cb(null, `${name}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExt.has(ext)) return cb(new Error('Only JPG, JPEG, PNG & GIF files are allowed.'));
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

