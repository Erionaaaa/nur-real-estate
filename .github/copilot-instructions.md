# NUR Real Estate - AI Coding Agent Instructions

## Project Overview
Full-stack real estate property listing platform with Albanian language content. Frontend serves property grid and details; backend manages MySQL database with property listings, images, and contact submissions.

## Architecture

### Backend (`/backend`)
- **Framework**: Express.js (ES modules, `type: "module"`)
- **Database**: MySQL (`kimidb` database) via `mysql2/promise` with connection pooling
- **Key Pattern**: Async/await with prepared statements for SQL injection prevention
- **Entry Point**: `server.js` runs on `http://localhost:5000`

**Critical Files**:
- [backend/server.js](backend/server.js) - Three main API endpoints + static file serving
- [backend/db.js](backend/db.js) - MySQL connection pool export (`db`)

### Frontend (`/frontend` - served from backend/public at runtime)
- **Architecture**: Vanilla JavaScript, no frameworks
- **Static Files**: Served via Express static middleware from `path.join(__dirname, "public")`
- **Entry**: [index.html](index.html) (properties grid), [product-details.html](product-details.html) (single property view)
- **Script**: [script.js](script.js) handles filtering, navigation, and form submission

### Data Flow
1. Frontend requests `/api/properties` → Backend queries `properties` table
2. Click "Shiko Detajet" → Navigates to `product-details.html?id=X`
3. Product page loads property via `/api/properties/:id` → joins `property_images` & `property_meta`
4. Contact form submits to `/api/contacts` → inserts into `contacts` table → redirects to WhatsApp

## Database Schema (Inferred)
**Tables**:
- `properties` (id, title, location, type, category, badge, price_text, cover_image, ...)
- `property_images` (property_id, image_url, sort_order)
- `property_meta` (property_id, meta_text, sort_order)
- `contacts` (name, email, phone, message)

**Query Pattern**: Always use prepared statements with `?` placeholders; destructure arrays from promises: `const [rows] = await db.query(...)`

## Key Conventions & Patterns

### Frontend Filtering
- Properties have `data-type` (for status filter: "all", custom values) and `data-category` attributes
- Active filters tracked in state variables (`currentStatus`, `currentCategory`)
- Underline indicator animates under active category button (`moveUnderline()` function)

### Form Integration
Contact form message construction appends field values with Albanian formatting prefix. WhatsApp redirect uses `https://wa.me/38349992400` (hardcoded number).

### Module System Mismatch
- **Backend**: ES modules (`"type": "module"` in package.json)
- **Frontend**: CommonJS (`"type": "commonjs"` in root package.json)
- ⚠️ **Critical**: Use `import` in backend, `require()` for frontend-side Node scripts if needed

## Development Workflow

### Start Backend
```bash
cd backend
npm install
node server.js
```
Backend serves frontend static files from `backend/public/` directory.

### No Build Process
- Frontend is plain HTML/CSS/JS served directly—no bundler
- Static files must be placed in `backend/public/` folder (currently set up to serve from `__dirname`)

### Database Setup
- Host: `localhost`, User: `root`, Password: `Kosova.123` (hardcoded in [backend/db.js](backend/db.js))
- Database: `kimidb`
- ⚠️ **To Do**: Move credentials to `.env` (template exists at [backend/.env](backend/.env) but currently empty)

## Common Tasks

### Add a New API Endpoint
1. Add route in [backend/server.js](backend/server.js) following the async/await pattern
2. Use parameterized queries: `db.query("SELECT * FROM table WHERE id = ?", [id])`
3. Always wrap in try/catch with `res.status(500).json({ message: "Server error" })`

### Update Frontend Pages
- Edit [index.html](index.html) or [product-details.html](product-details.html)
- Add event listeners in [script.js](script.js) within `DOMContentLoaded`
- Use `data-*` attributes for element configuration (filter values, property IDs, etc.)

### Add Property Images
- Insert into `property_images` table with `property_id` and `sort_order`
- Gallery slider reads via `/api/properties/:id` response; thumbnail click updates main image

## Integration Points
- **MySQL** ← Backend queries via `db` pool
- **WhatsApp** ← Frontend form redirects to `wa.me/{number}` with URL-encoded message
- **Static Files** ← Express serves from `backend/public/` (path configuration in server.js L16)

## Language Note
Project uses Albanian language in copy and comments. Preserve existing text patterns when editing forms/UI.
