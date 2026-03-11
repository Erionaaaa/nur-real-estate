# NUR Real Estate - Database Setup Guide

## Database Schema

Secila pronë ka një **ID unik** në database për t'u dallosur:

```
properties (id=1,2,3,...)
├── property_images (linkedby property_id)
└── property_meta (linkedby property_id)
```

## Setup Instructions

### Option 1: Me MySQL instaluar lokalisht

1. **Krijo database**:
```bash
mysql -u root -p"Kosova.123"
```

2. **Ekzekuto SQL script**:
```bash
source database.sql
```

Ose nëse nuk punon, copy-paste `database.sql` në MySQL console.

### Option 2: Automatic setup (Node.js)

```bash
cd backend
node init-db.js
```

Ky script do të:
- Krijo tabela automatikisht
- Inserto 5 sample properties me IDs unike
- Setup foreign keys dhe indexa

## Database Schema Details

### Properties Table
```sql
CREATE TABLE properties (
  id INT PRIMARY KEY AUTO_INCREMENT,  -- ID unik për çdo pronë
  title VARCHAR(255),                 -- Emri i pronës
  location VARCHAR(255),              -- Lokacioni
  type ENUM('sale', 'rent'),          -- Lloji (Shitje ose Qira)
  category VARCHAR(100),              -- Kategoria (shtepi, banese, lokal, troje, villa)
  badge VARCHAR(50),                  -- Shenja (Në shitje / Me qira)
  price_text VARCHAR(100),            -- Çmimi
  cover_image VARCHAR(500),           -- Foto kryesore
  description TEXT,                   -- Përshkrimi
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Property Images Table
```sql
CREATE TABLE property_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT FOREIGN KEY,        -- Lidhet me properties(id)
  image_url VARCHAR(500),             -- URL e fotove
  sort_order INT                      -- Radhitja e fotove
);
```

### Property Meta Table
```sql
CREATE TABLE property_meta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT FOREIGN KEY,        -- Lidhet me properties(id)
  meta_text VARCHAR(255),             -- Detaje (4.8 ari, 3 dhoma, etj.)
  sort_order INT                      -- Radhitja
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),                  -- Emri
  email VARCHAR(255),                 -- Email
  phone VARCHAR(20),                  -- Telefoni
  message TEXT,                       -- Mesazhi
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Properties with Unique IDs

Aktualisht në database:

| ID | Title | Category | Type |
|---|---|---|---|
| 1 | Shtëpi për Shitje në Novobërdë | shtepi | sale |
| 2 | Lëshohet me qira hapësira | lokal | rent |
| 3 | Shitet toka në Orllan | troje | sale |
| 4 | Banesë me qira | banese | rent |
| 5 | Tokë për Shitje në Mramor | troje | sale |

## Shtim i Pronës të Re

```sql
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description)
VALUES ('Emri Pronës', 'Lokacioni', 'sale', 'kategoria', 'Në shitje', 'Çmimi', '/nur/foto.png', 'Përshkrimi');

-- Merr ID e re
SELECT LAST_INSERT_ID();

-- Inserto meta
INSERT INTO property_meta (property_id, meta_text, sort_order) 
VALUES (ID_MERR_LART, 'Detaji', 1);

-- Inserto foto
INSERT INTO property_images (property_id, image_url, sort_order) 
VALUES (ID_MERR_LART, '/nur/foto.png', 1);
```

## API Endpoints

- `GET /api/properties` - Merr të gjitha pronat
- `GET /api/properties/:id` - Merr pronën me ID specifik (p.sh., /api/properties/1)
- `POST /api/contacts` - Dërgon mesazh kontakti

## Environment Variables

Krijo `.env` në `backend/` folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Kosova.123
DB_NAME=kimidb
NODE_ENV=development
PORT=5000
```

## Troubleshooting

- **MySQL nuk lidhet**: Kontrollo nëse servisi MySQL funksionon
- **Table not found**: Ekzekuto `database.sql` ose `node init-db.js`
- **ID nuk shfaqet saktë**: Kontrollo sort_order në property_meta
