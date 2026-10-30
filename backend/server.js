import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initMySQL, getPool } from './config/mysql.js';
import registrationRoutes from './routes/registrationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import pillarRoutes from './routes/pillarRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

// Detect frontend dist directory (works both locally and on Hostinger)
const possibleFrontendPaths = [
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(__dirname, '../public_html'),
  path.resolve(__dirname, '../dist'),
];
const frontendDistPath = possibleFrontendPaths.find(
  (dir) => fs.existsSync(dir) && fs.existsSync(path.join(dir, 'index.html'))
);

// Initialize MySQL database connection & tables
initMySQL();

const app = express();

// Trust reverse proxy (Hostinger / Cloudflare)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", 'http://localhost:*', 'https:*'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://localhost:3001',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) : []),
  ...(process.env.ADMIN_URL ? process.env.ADMIN_URL.split(',').map((s) => s.trim()) : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production' ||
        origin.endsWith('.globalnagasinstitute.in') ||
        origin === 'https://globalnagasinstitute.in'
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Dedicated upload route with 10MB limit for image uploads (stored in database)
app.use('/api/upload', express.json({ limit: '10mb' }), uploadRoutes);

// Support legacy /uploads/:filename requests by serving from database or disk
app.get('/uploads/:filename', async (req, res, next) => {
  const { filename } = req.params;
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT `mime_type`, `data` FROM `uploaded_images` WHERE `filename` = ? LIMIT 1',
      [filename]
    );
    if (rows && rows.length > 0) {
      res.setHeader('Content-Type', rows[0].mime_type || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(rows[0].data);
    }
  } catch (_) {}
  next();
});

// Static file serving fallback for uploads
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Body parsing with limit to prevent DoS for other endpoints
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Global Nagas Institute API',
  });
});

// Mount API Routes
app.use('/api', registrationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/pillars', pillarRoutes);
app.use('/pillars', pillarRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend static build (Production)
if (frontendDistPath) {
  app.use(express.static(frontendDistPath));

  // SPA Catch-All: Send index.html for client-side routing (skip /api routes)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      service: 'Global Nagas Institute API',
      status: 'online',
    });
  });
}

// Fallback & Error Handlers
app.use('/api/*', notFound);
app.use(notFound);
app.use(errorHandler);

// Start server (supports Hostinger Passenger socket, named pipes, and normal TCP ports)
const rawPort = process.env.PORT;
const PORT = (rawPort && isNaN(Number(rawPort))) ? rawPort : (Number(rawPort) || 5000);
const HOST = process.env.HOST || '0.0.0.0';

const onListening = () => {
  console.log(`[Server] Global Nagas Institute Backend running | PORT: ${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`);
  if (frontendDistPath) {
    console.log(`[Server] Serving frontend from: ${frontendDistPath}`);
  }
};

if (rawPort && isNaN(Number(rawPort))) {
  // Hostinger Passenger uses a socket/pipe, not a TCP port
  app.listen(PORT, onListening);
} else {
  app.listen(PORT, HOST, onListening);
}
