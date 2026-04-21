import { pool } from './pool.js';

export async function getAllCategories() {
  const [rows] = await pool.query(
    'SELECT categoryID, categoryName FROM categories ORDER BY categoryID'
  );
  return rows;
}

export async function getCategoryById(categoryId) {
  const [rows] = await pool.query(
    'SELECT categoryID, categoryName FROM categories WHERE categoryID = ?',
    [categoryId]
  );
  return rows[0] ?? null;
}

export async function getRecordsByCategoryId(categoryId) {
  const [rows] = await pool.query(
    'SELECT recordID, categoryID, name, price, image FROM records WHERE categoryID = ? ORDER BY recordID',
    [categoryId]
  );
  return rows;
}

export async function getRecordById(recordId) {
  const [rows] = await pool.query(
    'SELECT recordID, categoryID, name, price, image FROM records WHERE recordID = ?',
    [recordId]
  );
  return rows[0] ?? null;
}

export async function searchRecordsByName(searchTerm) {
  const like = `%${searchTerm}%`;
  const [rows] = await pool.query(
    'SELECT recordID, categoryID, name, price, image FROM records WHERE name LIKE ? ORDER BY recordID',
    [like]
  );
  return rows;
}

export async function createCategory({ categoryName }) {
  const [result] = await pool.query(
    'INSERT INTO categories (categoryName) VALUES (?)',
    [categoryName]
  );
  return result.insertId;
}

export async function deleteCategory(categoryId) {
  await pool.query('DELETE FROM categories WHERE categoryID = ?', [categoryId]);
}

export async function createRecord({ categoryId, name, price, image }) {
  const [result] = await pool.query(
    'INSERT INTO records (categoryID, name, price, image) VALUES (?, ?, ?, ?)',
    [categoryId, name, price, image]
  );
  return result.insertId;
}

export async function updateRecord({ recordId, categoryId, name, price, image }) {
  await pool.query(
    'UPDATE records SET categoryID = ?, name = ?, price = ?, image = ? WHERE recordID = ?',
    [categoryId, name, price, image, recordId]
  );
}

export async function deleteRecord(recordId) {
  await pool.query('DELETE FROM records WHERE recordID = ?', [recordId]);
}

