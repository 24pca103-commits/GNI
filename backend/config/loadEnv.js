import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Load environment variables before any other module reads process.env.
 *
 * ES module imports are evaluated before the importing file's own code runs, so
 * calling dotenv.config() inside server.js is too late for modules such as
 * config/mysql.js that read process.env at import time. Import this file first.
 *
 * Looks in backend/.env, then the project root .env, then the working directory.
 * Variables already set (e.g. in the Hostinger panel) are never overwritten.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();
