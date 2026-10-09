import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

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
  const createTableQuery = `
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
      \`experience_level\` VARCHAR(100) NOT NULL,
      \`learning_purpose\` TEXT NOT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_email\` (\`email\`),
      INDEX \`idx_created_at\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    // 1. Connect directly to target database via pool (Standard for Hostinger & production)
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    const dbTarget = typeof dbConfig === 'string' ? 'via DATABASE_URL' : `'${dbConfig.database}' on ${dbConfig.host}:${dbConfig.port}`;
    console.log(`[MySQL] Connected to database ${dbTarget}`);
    connection.release();

    // 2. Ensure registrations table exists
    await pool.query(createTableQuery);
    console.log(`[MySQL] Verified 'registrations' table structure.`);
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
        await pool.query(createTableQuery);
        console.log(`[MySQL] Database created and verified 'registrations' table.`);
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
