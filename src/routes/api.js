import fs from 'node:fs/promises';
import path from 'node:path';

import express from 'express';

import {
  createCategory,
  createRecord,
  deleteCategory,
  deleteRecord,
  getAllCategories,
  getRecordById,
  getRecordsByCategoryId,
  searchRecordsByName,
  updateRecord,
} from '../db/queries.js';
import { httpError } from '../lib/httpError.js';
import { upload } from '../upload/upload.js';

export const router = express.Router();

const projectRoot = path.resolve(process.cwd());
const uploadDir = path.join(projectRoot, 'image_uploads');

async function tryUnlinkUpload(filename) {
  if (!filename) return;
  const full = path.join(uploadDir, filename);
  try {
    await fs.unlink(full);
  } catch {
    // ignore
  }
}

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

router.get('/categories', async (req, res) => {
  const categories = await getAllCategories();
  res.json(categories);
});

router.post('/categories', express.json(), async (req, res) => {
  const categoryName = (req.body?.categoryName ?? '').trim();
  if (!categoryName) throw httpError(400, 'categoryName is required');

  const id = await createCategory({ categoryName });
  res.status(201).json({ categoryID: id, categoryName });
});

router.delete('/categories/:categoryId', async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  if (!categoryId) throw httpError(400, 'Invalid category ID');

  try {
    await deleteCategory(categoryId);
  } catch (err) {
    if (err?.code === 'ER_ROW_IS_REFERENCED_2' || err?.errno === 1451) {
      throw httpError(
        409,
        'Cannot delete category while records still reference it. Remove or reassign those records first.'
      );
    }
    throw err;
  }

  res.status(204).end();
});

router.get('/records/search', async (req, res) => {
  const q = (req.query.q ?? '').trim();
  if (!q) {
    res.json([]);
    return;
  }
  const rows = await searchRecordsByName(q);
  res.json(rows);
});

router.get('/records', async (req, res) => {
  const categoryId = Number(req.query.categoryId);
  if (!categoryId) throw httpError(400, 'categoryId query parameter is required');

  const rows = await getRecordsByCategoryId(categoryId);
  res.json(rows);
});

router.get('/records/:recordId', async (req, res) => {
  const recordId = Number(req.params.recordId);
  if (!recordId) throw httpError(400, 'Invalid record ID');

  const row = await getRecordById(recordId);
  if (!row) throw httpError(404, 'Record not found');

  res.json(row);
});

router.post('/records', upload.single('image'), async (req, res) => {
  const categoryId = Number(req.body.category_id);
  const name = (req.body.name ?? '').trim();
  const price = Number(req.body.price);

  if (!categoryId || !name || Number.isNaN(price)) {
    if (req.file?.filename) await tryUnlinkUpload(req.file.filename);
    throw httpError(400, 'Invalid record data: category_id, name, and price are required');
  }

  const image = req.file?.filename ?? '';
  const insertId = await createRecord({ categoryId, name, price, image });

  res.status(201).json({
    recordID: insertId,
    categoryID: categoryId,
    name,
    price,
    image,
  });
});

router.put('/records/:recordId', upload.single('image'), async (req, res) => {
  const recordId = Number(req.params.recordId);
  if (!recordId) throw httpError(400, 'Invalid record ID');

  const existing = await getRecordById(recordId);
  if (!existing) {
    if (req.file?.filename) await tryUnlinkUpload(req.file.filename);
    throw httpError(404, 'Record not found');
  }

  const categoryId = Number(req.body.category_id);
  const name = (req.body.name ?? '').trim();
  const price = Number(req.body.price);

  if (!categoryId || !name || Number.isNaN(price)) {
    if (req.file?.filename) await tryUnlinkUpload(req.file.filename);
    throw httpError(400, 'Invalid record data: category_id, name, and price are required');
  }

  const image = req.file?.filename ?? existing.image ?? '';
  await updateRecord({ recordId, categoryId, name, price, image });

  if (req.file?.filename && existing.image) {
    await tryUnlinkUpload(existing.image);
  }

  const updated = await getRecordById(recordId);
  res.json(updated);
});

router.delete('/records/:recordId', async (req, res) => {
  const recordId = Number(req.params.recordId);
  if (!recordId) throw httpError(400, 'Invalid record ID');

  const existing = await getRecordById(recordId);
  if (!existing) throw httpError(404, 'Record not found');

  if (existing.image) await tryUnlinkUpload(existing.image);
  await deleteRecord(recordId);

  res.status(204).end();
});
