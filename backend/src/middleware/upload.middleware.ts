import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to backend/uploads/products, works regardless of CWD or compiled output location.
// __dirname at runtime = backend/dist/middleware  =>  ../../.. = backend root  =>  /uploads/products
const UPLOADS_DIR = path.resolve(__dirname, '..', '..', '..', 'uploads', 'products');

// Ensure the directory exists at startup (sync so multer never hits a missing dir)
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(6).toString('hex');
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `product_${Date.now()}_${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('INVALID_FILE_TYPE'));
    }
};

export const uploadProductImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});

/** Absolute path helper used by service layer for consistent file resolution. */
export { UPLOADS_DIR };
