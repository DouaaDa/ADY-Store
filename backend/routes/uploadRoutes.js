import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// ─── Helper: ensure directory exists ─────────────────────────────────────────
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

// ─── Image Upload ─────────────────────────────────────────────────────────────
const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(ROOT_DIR, 'uploads', 'images');
    ensureDir(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `img-${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`);
  },
});

function checkImageType(file, cb) {
  const allowedExt = /\.(jpg|jpeg|png|webp|svg|ico)$/i;
  const allowedMime = /^image\/(jpeg|png|webp|svg\+xml|x-icon|vnd\.microsoft\.icon)$/;
  const extOk = allowedExt.test(path.extname(file.originalname));
  const mimeOk = allowedMime.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error('Images uniquement ! (jpg, jpeg, png, webp, svg, ico)'));
}

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => checkImageType(file, cb),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ─── Video Upload ─────────────────────────────────────────────────────────────
const videoStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(ROOT_DIR, 'uploads', 'videos');
    ensureDir(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `vid-${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`);
  },
});

function checkVideoType(file, cb) {
  const allowedExt = /\.(mp4|webm|mov|avi)$/i;
  const allowedMime = /^video\/(mp4|webm|quicktime|x-msvideo)$/;
  const extOk = allowedExt.test(path.extname(file.originalname));
  const mimeOk = allowedMime.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error('Vidéos uniquement ! (mp4, webm, mov, avi)'));
}

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => checkVideoType(file, cb),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

// ─── Asset Upload (logo / favicon) ────────────────────────────────────────────
const assetStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(ROOT_DIR, 'uploads', 'assets');
    ensureDir(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    const prefix = file.fieldname === 'logo' ? 'logo' : 'favicon';
    cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadAsset = multer({
  storage: assetStorage,
  fileFilter: (req, file, cb) => checkImageType(file, cb),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/upload/image — up to 10 images, 10 MB each
router.post('/image', (req, res) => {
  uploadImage.array('images', 10)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || String(err) });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image téléchargée' });
    }
    const urls = req.files.map(f => `/uploads/images/${f.filename}`);
    res.json({ urls, message: 'Images téléchargées avec succès' });
  });
});

// POST /api/upload/video — up to 5 videos, 50 MB each
router.post('/video', (req, res) => {
  uploadVideo.array('videos', 5)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || String(err) });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune vidéo téléchargée' });
    }
    const urls = req.files.map(f => `/uploads/videos/${f.filename}`);
    res.json({ urls, message: 'Vidéos téléchargées avec succès' });
  });
});

// POST /api/upload/logo
router.post('/logo', (req, res) => {
  uploadAsset.single('logo')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || String(err) });
    if (!req.file) return res.status(400).json({ message: 'Aucun logo téléchargé' });
    res.json({ url: `/uploads/assets/${req.file.filename}`, message: 'Logo téléchargé avec succès' });
  });
});

// POST /api/upload/favicon
router.post('/favicon', (req, res) => {
  uploadAsset.single('favicon')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || String(err) });
    if (!req.file) return res.status(400).json({ message: 'Aucun favicon téléchargé' });
    res.json({ url: `/uploads/assets/${req.file.filename}`, message: 'Favicon téléchargé avec succès' });
  });
});

export default router;
