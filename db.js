import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
const parsed = new URL(dbUrl);

const pool = mysql.createPool({
  host: parsed.hostname,
  user: parsed.username,
  password: parsed.password,
  database: parsed.pathname.replace('/', ''),
  port: parsed.port || 3306,
});

export default pool;
