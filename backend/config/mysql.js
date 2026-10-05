import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL Configuration
const dbConfig = {
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
  try {
    // 1. Connect without database first to ensure database exists
    const serverConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await serverConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await serverConnection.end();

    // 2. Create pool connected to the target database
    pool = mysql.createPool(dbConfig);

    // 3. Create registrations table if not exists
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

    await pool.query(createTableQuery);
    console.log(`[MySQL] Connected to database '${dbConfig.database}' and verified 'registrations' table.`);
    return pool;
  } catch (error) {
    console.warn(`[MySQL] Connection warning / offline mode: ${error.message}`);
    // Create pool anyway for when MySQL server becomes ready
    try {
      pool = mysql.createPool(dbConfig);
    } catch (e) {
      console.error('[MySQL] Pool creation error:', e.message);
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
