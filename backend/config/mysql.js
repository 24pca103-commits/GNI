import './loadEnv.js';
import mysql from 'mysql2/promise';
import { DEFAULT_COURSES } from '../models/defaultCourses.js';
import { DEFAULT_COURSE_CONTENT } from '../models/defaultCourseContent.js';
import { DEFAULT_PILLARS } from '../models/defaultPillars.js';
import { DEFAULT_FEEDBACKS } from '../models/defaultFeedbacks.js';


// MySQL Configuration with connection timeout to prevent hanging requests
const rawDbConfig = process.env.DATABASE_URL || process.env.DB_URL;
let dbConfig;
if (rawDbConfig) {
  try {
    const u = new URL(rawDbConfig);
    dbConfig = {
      host: u.hostname,
      port: Number(u.port) || 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ''),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000,
    };
  } catch (_) {
    dbConfig = rawDbConfig;
  }
} else {
  dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gni_institute',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 4000,
  };
}

let pool = null;

export const initMySQL = async () => {
  const createRegistrationsTableQuery = `
    CREATE TABLE IF NOT EXISTS \`registrations\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`full_name\` VARCHAR(255) NOT NULL,
      \`email\` VARCHAR(255) NOT NULL,
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
      \`pillar_id\` INT DEFAULT NULL,
      \`pillar_title\` VARCHAR(255) DEFAULT NULL,
      \`details\` LONGTEXT DEFAULT NULL,
      \`is_active\` TINYINT(1) DEFAULT 1,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_slug\` (\`slug\`),
      INDEX \`idx_active\` (\`is_active\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createPillarsTableQuery = `
    CREATE TABLE IF NOT EXISTS \`pillars\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`number\` VARCHAR(10) NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`category\` VARCHAR(150) NOT NULL,
      \`badge\` VARCHAR(100) DEFAULT 'Core Studio Track',
      \`image\` VARCHAR(500) DEFAULT '/artisan/pillar-painting.jpg',
      \`description\` TEXT NOT NULL,
      \`subjects\` VARCHAR(255) DEFAULT NULL,
      \`tags\` TEXT DEFAULT NULL,
      \`is_active\` TINYINT(1) DEFAULT 1,
      \`display_order\` INT DEFAULT 0,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_order\` (\`display_order\`),
      INDEX \`idx_active\` (\`is_active\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  // Direct Database Storage for Uploaded Images (Zero file modification to frontend codebase)
  const createUploadedImagesTableQuery = `
    CREATE TABLE IF NOT EXISTS \`uploaded_images\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`filename\` VARCHAR(255) NOT NULL,
      \`mime_type\` VARCHAR(100) NOT NULL,
      \`data\` LONGBLOB NOT NULL,
      \`size\` INT NOT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_filename\` (\`filename\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createFeedbacksTableQuery = `
    CREATE TABLE IF NOT EXISTS \`feedbacks\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(150) NOT NULL,
      \`role\` VARCHAR(150) DEFAULT NULL,
      \`batch\` VARCHAR(150) DEFAULT NULL,
      \`location\` VARCHAR(100) DEFAULT NULL,
      \`review\` TEXT NOT NULL,
      \`rating\` INT DEFAULT 5,
      \`status\` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_status\` (\`status\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const seedFeedbacksIfEmpty = async (p) => {
    try {
      const [rows] = await p.query('SELECT COUNT(*) as cnt FROM `feedbacks`');
      if (rows && rows[0]?.cnt === 0) {
        console.log('[MySQL] Seeding default student feedbacks into feedbacks table...');
        for (const fb of DEFAULT_FEEDBACKS) {
          await p.query(
            `INSERT INTO \`feedbacks\` (
              \`name\`, \`role\`, \`batch\`, \`location\`, \`review\`, \`rating\`, \`status\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              fb.name,
              fb.role,
              fb.batch,
              fb.location,
              fb.review,
              fb.rating || 5,
              fb.status || 'approved',
            ]
          );
        }
        console.log('[MySQL] Seeded default feedbacks successfully.');
      }
    } catch (seedErr) {
      console.warn('[MySQL] Feedback seeding skipped:', seedErr.message);
    }
  };

  const seedPillarsIfEmpty = async (p) => {
    try {
      const [rows] = await p.query('SELECT COUNT(*) as cnt FROM `pillars`');
      if (rows && rows[0]?.cnt === 0) {
        console.log('[MySQL] Seeding default pillars into pillars table...');
        for (const pl of DEFAULT_PILLARS) {
          await p.query(
            `INSERT INTO \`pillars\` (
              \`number\`, \`title\`, \`category\`, \`badge\`, \`image\`,
              \`description\`, \`subjects\`, \`tags\`, \`is_active\`, \`display_order\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              pl.number,
              pl.title,
              pl.category,
              pl.badge,
              pl.image,
              pl.description,
              pl.subjects,
              JSON.stringify(pl.tags),
              pl.is_active,
              pl.display_order,
            ]
          );
        }
        console.log('[MySQL] Seeded default heritage pillars successfully.');
      }
    } catch (seedErr) {
      console.warn('[MySQL] Pillar seeding skipped:', seedErr.message);
    }
  };

  const seedCoursesIfEmpty = async (p) => {
    try {
      const [rows] = await p.query('SELECT COUNT(*) as cnt FROM `courses`');
      if (rows && rows[0]?.cnt === 0) {
        console.log('[MySQL] Seeding default courses into courses table...');
        for (const c of DEFAULT_COURSES) {
          await p.query(
            `INSERT INTO \`courses\` (
              \`title\`, \`slug\`, \`category\`, \`pillar_id\`, \`pillar_title\`, \`badge\`, \`duration\`, \`mode\`,
              \`original_price\`, \`discount_price\`, \`discount_percent\`,
              \`description\`, \`highlights\`, \`image_url\`, \`seats_total\`,
              \`seats_available\`, \`is_active\`, \`details\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              c.title,
              c.slug,
              c.category,
              c.pillar_id || null,
              c.pillar_title || null,
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
              c.details ? JSON.stringify(c.details) : null,
            ]
          );
        }
        console.log('[MySQL] Seeded default heritage courses successfully.');
      }
    } catch (seedErr) {
      console.warn('[MySQL] Course seeding skipped:', seedErr.message);
    }
  };

  const ensureColumns = async (p) => {
    const regCols = [
      '`course_duration` VARCHAR(100) DEFAULT NULL',
      '`course_fee` DECIMAL(10,2) DEFAULT NULL',
      '`total_amount` DECIMAL(10,2) DEFAULT NULL',
      '`application_ref` VARCHAR(100) DEFAULT NULL',
      '`payment_status` VARCHAR(100) DEFAULT \'Pending Verification\'',
      '`payment_ref` VARCHAR(150) DEFAULT NULL',
      '`state` VARCHAR(150) DEFAULT NULL',
      '`city` VARCHAR(150) DEFAULT NULL',
    ];
    for (const col of regCols) {
      try {
        await p.query(`ALTER TABLE \`registrations\` ADD COLUMN ${col}`);
      } catch (_) {}
    }

    // Allow users to register for multiple different courses using the same email
    // Drop standalone UNIQUE constraint on email if present
    try {
      await p.query('ALTER TABLE `registrations` DROP INDEX `email`');
    } catch (_) {}
    try {
      await p.query('ALTER TABLE `registrations` DROP INDEX `idx_email`');
    } catch (_) {}
    try {
      await p.query('ALTER TABLE `registrations` ADD INDEX `idx_email` (`email`)');
    } catch (_) {}
    try {
      await p.query('ALTER TABLE `registrations` ADD UNIQUE KEY `uniq_email_course` (`email`, `interested_skill`)');
    } catch (_) {}

    const courseCols = [
      '`pillar_id` INT DEFAULT NULL',
      '`pillar_title` VARCHAR(255) DEFAULT NULL',
      '`details` LONGTEXT DEFAULT NULL',
    ];
    for (const col of courseCols) {
      try {
        await p.query(`ALTER TABLE \`courses\` ADD COLUMN ${col}`);
      } catch (_) {}
    }

    // Backfill structured content for canonical offerings created before these fields existed.
    // Only touches rows that were never edited through the structured admin form.
    for (const [slug, content] of Object.entries(DEFAULT_COURSE_CONTENT)) {
      try {
        await p.query(
          "UPDATE `courses` SET `details` = ? WHERE `slug` = ? AND (`details` IS NULL OR `details` = '')",
          [JSON.stringify(content.details), slug]
        );
        await p.query(
          "UPDATE `courses` SET `highlights` = ? WHERE `slug` = ? AND (`highlights` IS NULL OR `highlights` NOT LIKE '[%')",
          [JSON.stringify(content.highlights), slug]
        );
      } catch (_) {}
    }

    // Ensure image_url can hold database URLs or base64 without size limits
    try {
      await p.query('ALTER TABLE `courses` MODIFY COLUMN `image_url` LONGTEXT');
    } catch (_) {}

    // Backfill pillar associations for any existing courses with NULL pillar_id
    try {
      await p.query(`UPDATE \`courses\` SET \`pillar_id\` = 4, \`pillar_title\` = 'Heritage Applications & Interior Crafts' WHERE \`pillar_id\` IS NULL AND LOWER(\`title\`) LIKE '%ancient tamil%'`);
      await p.query(`UPDATE \`courses\` SET \`pillar_id\` = 3, \`pillar_title\` = 'Sculpturing & Sacred Nagas Metal Art' WHERE \`pillar_id\` IS NULL AND (LOWER(\`title\`) LIKE '%metal%' OR LOWER(\`title\`) LIKE '%jeweller%' OR LOWER(\`title\`) LIKE '%sculptur%')`);
      await p.query(`UPDATE \`courses\` SET \`pillar_id\` = 2, \`pillar_title\` = 'Libi – Language, Scripts & Epigraphy' WHERE \`pillar_id\` IS NULL AND (LOWER(\`title\`) LIKE '%epigraph%' OR LOWER(\`title\`) LIKE '%libi%' OR LOWER(\`title\`) LIKE '%script%')`);
      await p.query(`UPDATE \`courses\` SET \`pillar_id\` = 1, \`pillar_title\` = 'Painting & Natural Mineral Pigments' WHERE \`pillar_id\` IS NULL`);
    } catch (_) {}
  };

  try {
    // 1. Connect directly to target database via pool (Standard for Hostinger & production)
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    const dbTarget = typeof dbConfig === 'string' ? 'via DATABASE_URL' : `'${dbConfig.database}' on ${dbConfig.host}:${dbConfig.port}`;
    console.log(`[MySQL] Connected to database ${dbTarget}`);
    connection.release();

    // 2. Ensure registrations, courses, pillars, uploaded_images, and feedbacks tables exist
    await pool.query(createRegistrationsTableQuery);
    await pool.query(createCoursesTableQuery);
    await pool.query(createPillarsTableQuery);
    await pool.query(createUploadedImagesTableQuery);
    await pool.query(createFeedbacksTableQuery);
    await ensureColumns(pool);
    console.log(`[MySQL] Verified 'registrations', 'courses', 'pillars', 'uploaded_images', and 'feedbacks' tables structure.`);

    // 3. Seed default courses, pillars, and feedbacks if empty
    await seedCoursesIfEmpty(pool);
    await seedPillarsIfEmpty(pool);
    await seedFeedbacksIfEmpty(pool);

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
