import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { DEFAULT_COURSES } from '../models/defaultCourses.js';

dotenv.config();

// MySQL Configuration
const dbConfig = process.env.DATABASE_URL || process.env.DB_URL
  ? process.env.DATABASE_URL || process.env.DB_URL
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gni_institute',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

let pool = null;

export const initMySQL = async () => {
  const createRegistrationsTableQuery = `
    CREATE TABLE IF NOT EXISTS \`registrations\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`full_name\` VARCHAR(255) NOT NULL,
      \`email\` VARCHAR(255) NOT NULL UNIQUE,
      \`phone\` VARCHAR(50) NOT NULL,
      \`country\` VARCHAR(100) DEFAULT NULL,
      \`country_code\` VARCHAR(10) DEFAULT NULL,
      \`country_dial\` VARCHAR(10) DEFAULT NULL,
      \`full_phone\` VARCHAR(60) DEFAULT NULL,
      \`location\` VARCHAR(255) NOT NULL,
      \`profession\` VARCHAR(255) NOT NULL,
      \`interested_skill\` VARCHAR(255) NOT NULL,
      \`course_duration\` VARCHAR(100) DEFAULT NULL,
      \`course_fee\` DECIMAL(10,2) DEFAULT NULL,
      \`total_amount\` DECIMAL(10,2) DEFAULT NULL,
      \`application_ref\` VARCHAR(100) DEFAULT NULL,
      \`payment_status\` VARCHAR(100) DEFAULT 'Pending Verification',
      \`payment_ref\` VARCHAR(150) DEFAULT NULL,
      \`experience_level\` VARCHAR(100) NOT NULL,
      \`learning_purpose\` TEXT NOT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_email\` (\`email\`),
      INDEX \`idx_created_at\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createCoursesTableQuery = `
    CREATE TABLE IF NOT EXISTS \`courses\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`slug\` VARCHAR(255) NOT NULL UNIQUE,
      \`category\` VARCHAR(150) NOT NULL,
      \`badge\` VARCHAR(100) DEFAULT 'Admissions Open',
      \`duration\` VARCHAR(100) DEFAULT '60 Days',
      \`mode\` VARCHAR(100) DEFAULT 'Hybrid / Studio Hands-on',
      \`original_price\` DECIMAL(10,2) NOT NULL DEFAULT 9999.00,
      \`discount_price\` DECIMAL(10,2) NOT NULL DEFAULT 4999.00,
      \`discount_percent\` INT DEFAULT 50,
      \`description\` TEXT NOT NULL,
      \`highlights\` TEXT DEFAULT NULL,
      \`image_url\` VARCHAR(500) DEFAULT '/artisan/workshop.jpg',
      \`seats_total\` INT DEFAULT 50,
      \`seats_available\` INT DEFAULT 18,
      \`is_active\` TINYINT(1) DEFAULT 1,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_slug\` (\`slug\`),
      INDEX \`idx_active\` (\`is_active\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const seedCoursesIfEmpty = async (p) => {
    try {
      const [rows] = await p.query('SELECT COUNT(*) as cnt FROM `courses`');
      if (rows && rows[0]?.cnt === 0) {
        console.log('[MySQL] Seeding default courses into courses table...');
        for (const c of DEFAULT_COURSES) {
          await p.query(
            `INSERT INTO \`courses\` (
              \`title\`, \`slug\`, \`category\`, \`badge\`, \`duration\`, \`mode\`,
              \`original_price\`, \`discount_price\`, \`discount_percent\`,
              \`description\`, \`highlights\`, \`image_url\`, \`seats_total\`,
              \`seats_available\`, \`is_active\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              c.title,
              c.slug,
              c.category,
              c.badge,
              c.duration,
              c.mode,
              c.original_price,
              c.discount_price,
              c.discount_percent,
              c.description,
              c.highlights,
              c.image_url,
              c.seats_total,
              c.seats_available,
              c.is_active,
            ]
          );
        }
        console.log('[MySQL] Seeded default heritage courses successfully.');
      }
    } catch (seedErr) {
      console.warn('[MySQL] Course seeding skipped:', seedErr.message);
    }
  };

  const ensureRegistrationColumns = async (p) => {
    const columns = [
      '`course_duration` VARCHAR(100) DEFAULT NULL',
      '`course_fee` DECIMAL(10,2) DEFAULT NULL',
      '`total_amount` DECIMAL(10,2) DEFAULT NULL',
      '`application_ref` VARCHAR(100) DEFAULT NULL',
      '`payment_status` VARCHAR(100) DEFAULT \'Pending Verification\'',
      '`payment_ref` VARCHAR(150) DEFAULT NULL',
    ];
    for (const col of columns) {
      try {
        await p.query(`ALTER TABLE \`registrations\` ADD COLUMN ${col}`);
      } catch (colErr) {
        // Error 1060 (ER_DUP_FIELDNAME) means column already exists - ignore safely
        if (colErr.errno !== 1060 && colErr.code !== 'ER_DUP_FIELDNAME') {
          // Ignore other non-critical alter warnings
        }
      }
    }
  };

  try {
    // 1. Connect directly to target database via pool (Standard for Hostinger & production)
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    const dbTarget = typeof dbConfig === 'string' ? 'via DATABASE_URL' : `'${dbConfig.database}' on ${dbConfig.host}:${dbConfig.port}`;
    console.log(`[MySQL] Connected to database ${dbTarget}`);
    connection.release();

    // 2. Ensure registrations and courses tables exist
    await pool.query(createRegistrationsTableQuery);
    await ensureRegistrationColumns(pool);
    await pool.query(createCoursesTableQuery);
    console.log(`[MySQL] Verified 'registrations' and 'courses' tables structure.`);

    // 3. Seed default courses if empty
    await seedCoursesIfEmpty(pool);

    return pool;
  } catch (error) {
    // If database does not exist (ER_BAD_DB_ERROR, error 1049) on local dev, attempt to create it
    if (error.errno === 1049 || error.code === 'ER_BAD_DB_ERROR') {
      try {
        console.log(`[MySQL] Database '${dbConfig.database}' not found. Attempting local creation...`);
        const serverConnection = await mysql.createConnection({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
        });
        await serverConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await serverConnection.end();

        pool = mysql.createPool(dbConfig);
        await pool.query(createRegistrationsTableQuery);
        await pool.query(createCoursesTableQuery);
        await seedCoursesIfEmpty(pool);
        console.log(`[MySQL] Database created and verified 'registrations' and 'courses' tables.`);
        return pool;
      } catch (createErr) {
        console.warn(`[MySQL] Automatic database creation skipped: ${createErr.message}`);
      }
    }

    console.warn(`[MySQL] Connection warning / offline mode: ${error.message}`);
    try {
      if (!pool) pool = mysql.createPool(dbConfig);
    } catch (e) {
      console.error('[MySQL] Pool creation fallback error:', e.message);
    }
    return pool;
  }
};

export const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

export default getPool;
