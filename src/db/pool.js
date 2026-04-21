import 'dotenv/config';
import mysql from 'mysql2/promise';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

export const pool = mysql.createPool({
  host: required('DB_HOST'),
  user: required('DB_USER'),
  password: process.env.DB_PASSWORD ?? '',
  database: required('DB_NAME'),
  connectionLimit: 10,
});

