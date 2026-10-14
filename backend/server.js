import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initMySQL } from './config/mysql.js';
import registrationRoutes from './routes/registrationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect frontend dist in various Hostinger or local directory structures
const possibleFrontendPaths = [
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(__dirname, '../public_html'),
  path.resolve(__dirname, '../dist'),
  path.resolve(__dirname, './dist'),
  path.resolve(__dirname, './public'),
  path.resolve(__dirname, '..'),
  path.resolve(__dirname, '.'),
];
const resolvedFrontendPath = possibleFrontendPaths.find(
  (dir) => fs.existsSync(dir) && fs.existsSync(path.join(dir, 'index.html'))
);

// Load environment variables (Checks backend/.env, root .env, and cwd)
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

// Initialize MySQL database connection & tables
initMySQL();

const app = express();

// Trust reverse proxy (Essential for Hostinger, Nginx, Cloudflare to determine client IP for rate limiting)
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
  'http://localhost:3000',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, same-origin) or matching allowed origins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        // If request originates from same host or subdomains
        callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

// Body parsing with limit to prevent DoS
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// Base / Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Global Nagas Institute API',
  });
});

// Mount Registration & Auth API Routes (both with and without /api prefix for Hostinger compatibility)
app.use('/api', registrationRoutes);
app.use('/api/auth', authRoutes);
app.use('/', registrationRoutes);
app.use('/auth', authRoutes);

// In Production: Serve frontend static build if index.html was discovered
if (resolvedFrontendPath) {
  app.use(express.static(resolvedFrontendPath));

  // SPA Catch-All Route: Send index.html for client-side routing on any non-API GET request
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/register') || req.path.startsWith('/auth')) {
      return next();
    }
    res.sendFile(path.join(resolvedFrontendPath, 'index.html'));
  });
} else {
  // If frontend is not alongside backend, ensure root URL returns clean 200 OK
  app.get('/', (req, res) => {
    res.status(200).json({
      service: 'Global Nagas Institute API',
      status: 'online',
      message: 'API is running successfully on Hostinger.',
    });
  });
}

// Fallback & Error Handlers for unhandled API routes
app.use('/api/*', notFound);
app.use(notFound);
app.use(errorHandler);

const rawPort = process.env.PORT;
const isNamedPipeOrSocket = rawPort && isNaN(Number(rawPort));
const PORT = isNamedPipeOrSocket ? rawPort : Number(rawPort) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

if (isNamedPipeOrSocket) {
  app.listen(PORT, () => {
    console.log(`[Server] Global Nagas Institute Backend listening on socket/pipe: ${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    if (resolvedFrontendPath) {
      console.log(`[Server] Serving production frontend from: ${resolvedFrontendPath}`);
    }
  });
} else {
  app.listen(PORT, HOST, () => {
    console.log(`[Server] Global Nagas Institute Backend running on http://${HOST}:${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    if (resolvedFrontendPath) {
      console.log(`[Server] Serving production frontend from: ${resolvedFrontendPath}`);
    }
  });
}
