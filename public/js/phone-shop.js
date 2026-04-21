const API_BASE = '/api/v1';

/** @type {{ categoryID: number, categoryName: string }[]} */
let categories = [];
let currentCategoryId = 1;
let searchActive = false;

function showAlert(message, kind = 'danger') {
  const el = document.getElementById('shop-alert');
  if (!el) return;
  el.className = `alert alert-${kind}`;
  el.textContent = message;
  el.classList.remove('d-none');
}

function hideAlert() {
  const el = document.getElementById('shop-alert');
  if (!el) return;
  el.classList.add('d-none');
}

async function apiRequest(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 204) return null;
  const text = await res.text();
  /** @type {any} */
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = (data && data.error) || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

function getSelectedCategoryId() {
  const sel = document.getElementById('category-filter');
  return sel ? Number(sel.value) : 1;
}

function syncCategorySelects() {
  const selectIds = ['category-filter', 'add-category', 'edit-category'];
  for (const id of selectIds) {
    const sel = document.getElementById(id);
    if (!sel) continue;
    const previous = sel.value;
    sel.innerHTML = '';
    categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = String(c.categoryID);
      opt.textContent = c.categoryName;
      sel.appendChild(opt);
    });
    if (previous && [...sel.options].some((o) => o.value === previous)) {
      sel.value = previous;
    }
  }
}

function renderCategoriesList() {
  const root = document.getElementById('categories-list');
  if (!root) return;
  root.innerHTML = '';
  if (!categories.length) {
    root.innerHTML = '<p class="text-muted mb-0">No categories yet.</p>';
    return;
  }
  categories.forEach((c) => {
    const item = document.createElement('div');
    item.className =
      'list-group-item d-flex justify-content-between align-items-center gap-2 flex-wrap';
    item.innerHTML = `
      <span>${escapeHtml(c.categoryName)} <span class="text-muted small">#${c.categoryID}</span></span>
      <button type="button" class="btn btn-sm btn-outline-danger" data-delete-category="${c.categoryID}">Delete</button>
    `;
    root.appendChild(item);
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderRecords(records) {
  const root = document.getElementById('records-container');
  if (!root) return;

  if (!records.length) {
    root.innerHTML = '<p class="text-muted mb-0">No products in this view.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = 'table table-hover align-middle mb-0';
  table.innerHTML = `
    <thead>
      <tr>
        <th style="width:140px">Photo</th>
        <th>Product</th>
        <th>Price</th>
        <th style="width:1%"></th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');

  records.forEach((r) => {
    const tr = document.createElement('tr');
    const imgCell = r.image
      ? `<img src="/image_uploads/${escapeHtml(r.image)}" alt="" width="120" class="rounded" />`
      : '<span class="text-muted">—</span>';
    tr.innerHTML = `
      <td>${imgCell}</td>
      <td>${escapeHtml(r.name)}</td>
      <td>€${escapeHtml(String(r.price))}</td>
      <td class="text-end text-nowrap">
        <button type="button" class="btn btn-sm btn-outline-primary me-1" data-edit="${r.recordID}">Edit</button>
        <button type="button" class="btn btn-sm btn-outline-danger" data-delete="${r.recordID}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  root.innerHTML = '';
  root.appendChild(table);

  root.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => startEdit(Number(btn.getAttribute('data-edit'))));
  });
  root.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => removeRecord(Number(btn.getAttribute('data-delete'))));
  });
}

async function refreshCategoriesAndUi() {
  hideAlert();
  categories = await apiRequest(`${API_BASE}/categories`);
  if (!categories.length) {
    currentCategoryId = 0;
    document.getElementById('records-container').innerHTML =
      '<p class="text-muted mb-0">Create a category first.</p>';
    syncCategorySelects();
    renderCategoriesList();
    return;
  }
  syncCategorySelects();
  renderCategoriesList();
  if (!currentCategoryId || !categories.some((c) => c.categoryID === currentCategoryId)) {
    currentCategoryId = categories[0].categoryID;
  }
  const filter = document.getElementById('category-filter');
  if (filter) filter.value = String(currentCategoryId);
}

async function loadRecordsForCategory() {
  hideAlert();
  searchActive = false;
  currentCategoryId = getSelectedCategoryId();
  if (!currentCategoryId) {
    renderRecords([]);
    return;
  }
  const rows = await apiRequest(`${API_BASE}/records?categoryId=${encodeURIComponent(currentCategoryId)}`);
  renderRecords(rows);
}

async function runSearch() {
  hideAlert();
  const q = document.getElementById('search-q').value.trim();
  if (!q) {
    showAlert('Enter a search term.', 'warning');
    return;
  }
  searchActive = true;
  const rows = await apiRequest(`${API_BASE}/records/search?q=${encodeURIComponent(q)}`);
  renderRecords(rows);
}

function hideEditCard() {
  const card = document.getElementById('edit-card');
  if (card) card.style.display = 'none';
  const form = document.getElementById('form-edit-record');
  if (form) form.reset();
  const wrap = document.getElementById('edit-current-image-wrap');
  if (wrap) wrap.innerHTML = '';
}

async function startEdit(recordId) {
  hideAlert();
  const record = await apiRequest(`${API_BASE}/records/${recordId}`);
  const card = document.getElementById('edit-card');
  const form = document.getElementById('form-edit-record');
  if (!card || !form) return;

  document.getElementById('edit-record-id').value = String(record.recordID);
  document.getElementById('edit-category').value = String(record.categoryID);
  document.getElementById('edit-name').value = record.name;
  document.getElementById('edit-price').value = String(record.price);

  const wrap = document.getElementById('edit-current-image-wrap');
  if (wrap) {
    wrap.innerHTML = record.image
      ? `<div class="small text-muted mb-1">Current image</div><img src="/image_uploads/${escapeHtml(record.image)}" height="120" alt="" class="rounded border" />`
      : '<p class="text-muted small mb-0">No image on file.</p>';
  }

  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function removeRecord(recordId) {
  hideAlert();
  if (!window.confirm('Remove this product from the catalog?')) return;
  await apiRequest(`${API_BASE}/records/${recordId}`, { method: 'DELETE' });
  showAlert('Product removed.', 'success');
  if (searchActive) {
    const q = document.getElementById('search-q').value.trim();
    if (q) {
      const rows = await apiRequest(`${API_BASE}/records/search?q=${encodeURIComponent(q)}`);
      renderRecords(rows);
    } else {
      await loadRecordsForCategory();
    }
  } else {
    await loadRecordsForCategory();
  }
}

async function init() {
  try {
    await refreshCategoriesAndUi();
    if (currentCategoryId) {
      await loadRecordsForCategory();
    }

    document.getElementById('category-filter')?.addEventListener('change', () => {
      loadRecordsForCategory();
    });

    document.getElementById('btn-search')?.addEventListener('click', () => runSearch());
    document.getElementById('btn-clear-search')?.addEventListener('click', async () => {
      document.getElementById('search-q').value = '';
      searchActive = false;
      await loadRecordsForCategory();
    });

    document.getElementById('search-q')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runSearch();
      }
    });

    document.getElementById('form-add-record')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();
      const form = e.target;
      const fd = new FormData(form);
      await apiRequest(`${API_BASE}/records`, { method: 'POST', body: fd });
      showAlert('Product added to the catalog.', 'success');
      form.reset();
      syncCategorySelects();
      document.getElementById('category-filter').value = fd.get('category_id');
      await loadRecordsForCategory();
    });

    document.getElementById('form-edit-record')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();
      const id = document.getElementById('edit-record-id').value;
      const form = e.target;
      const fd = new FormData(form);
      await apiRequest(`${API_BASE}/records/${id}`, { method: 'PUT', body: fd });
      showAlert('Product updated.', 'success');
      hideEditCard();
      if (searchActive) {
        const q = document.getElementById('search-q').value.trim();
        const rows = await apiRequest(`${API_BASE}/records/search?q=${encodeURIComponent(q)}`);
        renderRecords(rows);
      } else {
        await loadRecordsForCategory();
      }
    });

    document.getElementById('btn-cancel-edit')?.addEventListener('click', () => hideEditCard());

    document.getElementById('form-add-category')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();
      const name = document.getElementById('new-category-name').value.trim();
      await apiRequest(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: name }),
      });
      document.getElementById('new-category-name').value = '';
      showAlert('Category added.', 'success');
      await refreshCategoriesAndUi();
      await loadRecordsForCategory();
    });

    document.getElementById('categories-list')?.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-delete-category]');
      if (!btn) return;
      const id = Number(btn.getAttribute('data-delete-category'));
      if (!window.confirm('Delete this category? (Only if no products use it.)')) return;
      hideAlert();
      try {
        await apiRequest(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
        showAlert('Category deleted.', 'success');
      } catch (err) {
        showAlert(err.message, 'danger');
      }
      await refreshCategoriesAndUi();
      if (currentCategoryId) await loadRecordsForCategory();
      else renderRecords([]);
    });
  } catch (err) {
    showAlert(err.message || 'Could not load the catalog. Check your database connection.', 'danger');
  }
}

document.addEventListener('DOMContentLoaded', init);
