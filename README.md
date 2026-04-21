Full-stack storefront-style site: **marketing pages** (Express + EJS), a **shop / catalog** area powered by a **REST API** (`/api/v1`) and a **vanilla JS** client (`fetch`, `FormData`). Built with **Node.js**, **Express**, and **MySQL**.

## Preview (screenshots)

These images show what the app looks like in the browser so you can get a feel for the product **without installing or running** the project.

### Storefront home

The landing page introduces **NorthTrade Mobile** with a dark hero, primary navigation (Home, Shop, About, Contact), and secondary links (Browse catalog, Support). The hero headline and supporting copy describe curated phones from major brands, with calls to action such as **Shop the catalog** and **Why NorthTrade**. A compact row highlights dispatch, secure checkout, and support. The **Featured** card can show weekly picks; when the database is not connected, it explains that content is static until live products load. Below the hero, a light section presents three trust pillars (delivery, warranty-friendly listings, responsive support), then a **Shop by brand family** grid (iPhone, Samsung Galaxy, Google Pixel, and other brands) with a link into the catalog.

<img width="1686" height="1018" alt="image" src="https://github.com/user-attachments/assets/43febf4d-f015-47fe-89f6-f0b255eca4d9" />


### Catalog admin (shop back office)

The shop area includes tools to **find products** (category filter and keyword search), an empty **Product grid** that fills when items exist or match the search, a form to **add a product** (category, name, price in €, optional photo upload), and a **Categories** panel to add new category labels—removal is allowed only when no products use that category.

<img width="1410" height="988" alt="image" src="https://github.com/user-attachments/assets/0d451490-463e-4a68-8eb6-ffd04b2fc66e" />


### Footer and closing CTA

Near the bottom of the site, a dark **Ready to upgrade?** band invites visitors to use the catalog and mentions expanding the store with their own listings, with a **Start shopping** button. The footer repeats the brand, short positioning text, and columns for **Shop**, **Company**, and a **Stay in the loop** newsletter field. The bottom bar shows copyright and contact details.

<img width="1615" height="501" alt="image" src="https://github.com/user-attachments/assets/c8e08139-26d8-43f0-bf25-064080d8e8fe" />


## Run locally

### Requirements

- Node.js (LTS recommended)
- MySQL (or MariaDB)

### 1) Database

Create and seed the database by running:

- [`db/schema.sql`](db/schema.sql)

### 2) Environment

Copy [`.env.example`](.env.example) to `.env` and set:

- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `PORT` (optional, default `3000`)

### 3) Start

```bash
npm install
npm run dev
```

Open:

- Home: `http://localhost:3000/`
- Shop / catalog: `http://localhost:3000/shop`  
  (legacy URL `/projects/phone-shop` redirects here)

Branding defaults to **NorthTrade Mobile** (`app.locals.siteName` in [`src/app.js`](src/app.js)).

## Project layout

| Path | Purpose |
|------|---------|
| [`src/app.js`](src/app.js) | Express app: static files, API, site routes |
| [`src/routes/site.js`](src/routes/site.js) | Home, About, Contact, Shop shell |
| [`src/routes/api.js`](src/routes/api.js) | REST API (`/api/v1`) |
| [`src/views/`](src/views/) | EJS templates (`pages/`, `shop/`, partials) |
| [`public/js/phone-shop.js`](public/js/phone-shop.js) | Catalog SPA client |
| [`public/js/home-featured.js`](public/js/home-featured.js) | Home page featured products |
| [`public/css/site.css`](public/css/site.css) | Site styling |
| [`db/schema.sql`](db/schema.sql) | MySQL schema + seed data |
| [`image_uploads/`](image_uploads/) | Product images (`/image_uploads/...`) |

## REST API (`/api/v1`)

All JSON responses use `{ "error": "message" }` on failure unless noted.

### Health

```http
GET /api/v1/health
```

Example:

```bash
curl -s http://localhost:3000/api/v1/health
```

### Categories

```http
GET /api/v1/categories
POST /api/v1/categories
Content-Type: application/json

{ "categoryName": "New category" }
```

```http
DELETE /api/v1/categories/:categoryId
```

### Records

```http
GET /api/v1/records?categoryId=1
GET /api/v1/records/:recordId
GET /api/v1/records/search?q=iphone
```

Create (multipart; `image` optional):

```bash
curl -s -X POST http://localhost:3000/api/v1/records \
  -F "category_id=1" \
  -F "name=Test Phone" \
  -F "price=99.99" \
  -F "image=@./path/to/photo.jpg"
```

Update (multipart; `image` optional—omit to keep existing file):

```bash
curl -s -X PUT http://localhost:3000/api/v1/records/123 \
  -F "category_id=1" \
  -F "name=Updated" \
  -F "price=120"
```

```http
DELETE /api/v1/records/:recordId
```

## Contact

**sergejzapivalovs@gmail.com**
