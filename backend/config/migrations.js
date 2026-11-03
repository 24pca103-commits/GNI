import { GNI_COURSE_PRICING } from '../models/pricingConfig.js';
import { durationText, parseDurations, splitDurationText } from '../models/courseDurations.js';

/**
 * One-time data migrations. Each runs once per database and is recorded in
 * `schema_migrations`, so it never repeats (e.g. a course you delete after a
 * migration is not re-created on the next restart).
 */

const MIGRATIONS = [
  {
    // Course fees used to come from the hard-coded price list (models/pricingConfig.js).
    // Move them into offerings so the admin is the only source of courses, durations and fees.
    name: '2026-11-02-durations-from-price-list',
    async run(pool) {
      const [courses] = await pool.query('SELECT * FROM `courses`');
      const byTitle = new Map(courses.map((c) => [String(c.title).trim().toLowerCase(), c]));
      const listOptions = (entry) =>
        entry.durations
          .map((d) => {
            const parsed = splitDurationText(d.duration);
            return parsed ? { days: parsed.days, label: parsed.label, fee: Number(d.fee), original_price: Number(d.originalPrice) || Number(d.fee) } : null;
          })
          .filter(Boolean);

      // 1. Existing offerings: keep the admin's own duration and fee as the main option,
      //    and add the extra durations the price list offered for the same course.
      for (const course of courses) {
        if (course.durations) continue;
        const options = parseDurations(null, course);
        const entry = GNI_COURSE_PRICING.find((p) => p.courseName.trim().toLowerCase() === String(course.title).trim().toLowerCase());
        if (entry && entry.durations.length > 1) {
          for (const opt of listOptions(entry)) {
            if (!options.some((o) => o.days === opt.days)) options.push(opt);
          }
        }
        if (options.length) {
          await pool.query('UPDATE `courses` SET `durations` = ? WHERE `id` = ?', [JSON.stringify(options), course.id]);
        }
      }

      // 2. Courses that only existed in the price list become hidden offerings,
      //    so nothing appears on the website until the admin publishes them.
      for (const entry of GNI_COURSE_PRICING) {
        if (byTitle.has(entry.courseName.trim().toLowerCase())) continue;
        const options = listOptions(entry);
        if (!options.length) continue;
        const main = options[0];
        const isJourney = main.days >= 10;
        let slug = entry.id;
        const [taken] = await pool.query('SELECT `id` FROM `courses` WHERE `slug` = ?', [slug]);
        if (taken.length) slug = `${slug}-${Date.now().toString().slice(-5)}`;
        await pool.query(
          `INSERT INTO \`courses\` (
            \`title\`, \`slug\`, \`category\`, \`badge\`, \`duration\`, \`mode\`,
            \`original_price\`, \`discount_price\`, \`discount_percent\`, \`description\`,
            \`highlights\`, \`image_url\`, \`seats_total\`, \`seats_available\`,
            \`pillar_id\`, \`pillar_title\`, \`is_active\`, \`durations\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
          [
            entry.courseName,
            slug,
            entry.pillarTitle ? `${entry.pillarTitle} • ${isJourney ? 'Learning Journey' : 'Workshop'}`.slice(0, 150) : isJourney ? 'Learning Journey' : 'Workshop',
            '',
            durationText(main),
            String(entry.durations[0].mode || 'Studio Hands-on').slice(0, 100),
            main.original_price,
            main.fee,
            main.original_price > main.fee ? Math.round(((main.original_price - main.fee) / main.original_price) * 100) : 0,
            entry.description || entry.courseName,
            null,
            isJourney ? '/artisan/pedagogy-practice.jpg' : '/artisan/workshop.jpg',
            50,
            50,
            entry.pillarId || null,
            entry.pillarTitle || null,
            JSON.stringify(options),
          ]
        );
        console.log(`[Migration] Added hidden offering from price list: ${entry.courseName}`);
      }
    },
  },
];

export async function runMigrations(pool) {
  await pool.query(
    'CREATE TABLE IF NOT EXISTS `schema_migrations` (`name` VARCHAR(150) PRIMARY KEY, `ran_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
  );
  const [done] = await pool.query('SELECT `name` FROM `schema_migrations`');
  const ran = new Set(done.map((r) => r.name));
  for (const m of MIGRATIONS) {
    if (ran.has(m.name)) continue;
    try {
      await m.run(pool);
      await pool.query('INSERT INTO `schema_migrations` (`name`) VALUES (?)', [m.name]);
      console.log(`[Migration] Completed ${m.name}`);
    } catch (err) {
      console.error(`[Migration] ${m.name} failed and will retry on next start:`, err.message);
    }
  }
}
