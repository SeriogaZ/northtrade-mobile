# NorthTrade Mobile — retail web app (Node.js)

Full-stack storefront-style site: **marketing pages** (Express + EJS), a **shop / catalog** area powered by a **REST API** (`/api/v1`) and a **vanilla JS** client (`fetch`, `FormData`). Built with **Node.js**, **Express**, and **MySQL**.

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
