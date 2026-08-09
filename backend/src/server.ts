import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { CORS_ORIGIN } from './config/config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env FIRST before importing anything that reads env
dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));

// Webhook route must receive raw body for signature verification
app.use('/api/payments/razorpay/webhook', express.raw({ type: 'application/json' }));

// General JSON parsing for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // raised slightly to avoid blocking checkout flows
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Hooks-Knots API is running' });
});

// Import routes AFTER dotenv.config() and after middleware setup
const { default: apiRoutes } = await import('./routes/index.js');
app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(port, () => {
    console.log(`Hooks-Knots backend running on http://localhost:${port}`);
});
