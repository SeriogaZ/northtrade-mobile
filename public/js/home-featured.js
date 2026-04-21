const API = '/api/v1';

async function loadFeatured() {
  const root = document.getElementById('home-featured');
  if (!root) return;

  try {
    const categories = await fetch(`${API}/categories`).then((r) => {
      if (!r.ok) throw new Error('Catalog unavailable');
      return r.json();
    });

    const firstId = categories[0]?.categoryID;
    if (!firstId) {
      root.innerHTML = '<p class="small text-white-50 mb-0 col-12">Catalog is empty — add categories in the shop.</p>';
      return;
    }

    const products = await fetch(`${API}/records?categoryId=${firstId}`).then((r) => {
      if (!r.ok) throw new Error('Products unavailable');
      return r.json();
    });

    const slice = products.slice(0, 4);
    if (!slice.length) {
      root.innerHTML = '<p class="small text-white-50 mb-0 col-12">No listings yet — open the catalog to add products.</p>';
      return;
    }

    root.innerHTML = '';
    slice.forEach((p) => {
      const col = document.createElement('div');
      col.className = 'col-6';
      const img = p.image
        ? `<img class="featured-thumb mb-2" src="/image_uploads/${escapeAttr(p.image)}" alt="" width="400" height="400" />`
        : '<div class="featured-thumb mb-2 d-flex align-items-center justify-content-center small text-white-50">No photo</div>';
      col.innerHTML = `
        ${img}
        <div class="small text-white fw-semibold text-truncate">${escapeHtml(p.name)}</div>
        <div class="small text-white-50">€${escapeHtml(String(p.price))}</div>
      `;
      root.appendChild(col);
    });
  } catch {
    root.innerHTML =
      '<p class="small text-white-50 mb-0 col-12">Showing static content — connect the database to load live products.</p>';
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', loadFeatured);
