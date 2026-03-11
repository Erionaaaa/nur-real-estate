-- NUR Real Estate Database
-- Krijo database
CREATE DATABASE IF NOT EXISTS kimidb;
USE kimidb;

-- TABELA: properties
CREATE TABLE IF NOT EXISTS properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type ENUM('sale', 'rent') NOT NULL DEFAULT 'sale',
  category VARCHAR(100) NOT NULL,
  badge VARCHAR(50),
  price_text VARCHAR(100) NOT NULL,
  cover_image VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_category (category)
);

-- TABELA: property_images
CREATE TABLE IF NOT EXISTS property_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property (property_id)
);

-- TABELA: property_meta
CREATE TABLE IF NOT EXISTS property_meta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  meta_text VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property (property_id)
);

-- TABELA: contacts
CREATE TABLE IF NOT EXISTS contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (created_at)
);

-- ========== INSERTO PRONAVE ==========
-- 1. Shtëpia në Novobërdë
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('Shtëpi për Shitje në Novobërdë', 'Novobërdë', 'sale', 'shtepi', 'Në shitje', '115,000 €', '/nur/Shtepia  ne shitje.png', 'Shtëpi e rehatshme në Novobërdë, e përshtatshme për familje, me sipërfaqe të bollshme dhe oborr.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (1, '4.8 ari', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (1, 'Sallon', 2);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (1, '3 dhoma gjumi', 3);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (1, '2 banjo', 4);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (1, 'Paradhome', 5);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (1, '/nur/Shtepia  ne shitje.png', 1);

-- 2. Lokali me qira në Dardani
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('Lëshohet me qira hapësira', 'Prishtinë, Dardani', 'rent', 'lokal', 'Me qira', '700€/muaj', '/nur/lokali.png', 'Hapësirë biznesi në një nga lagjet më të kërkuara të Prishtinës, ideale për zyre apo lokale shërbimi.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (2, '100 m² open space', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (2, 'Ngrohje qendrore', 2);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (2, 'Rreth 115 m² neto', 3);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (2, '/nur/lokali.png', 1);

-- 3. Tokë në Orllan
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('Shitet toka në Orllan', 'Orllan, Batllavë', 'sale', 'troje', 'Në shitje', '3,500 €/ari', '/nur/15 ari.png', 'Parcella me pozicion shumë të mirë pranë Liqenit të Batllavës, e përshtatshme për investime turistike.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (3, 'Parcelë afër liqenit', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (3, 'Potencial për vila / turizëm', 2);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (3, '15 ari', 3);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (3, '/nur/15 ari.png', 1);

-- 4. Banesë me qira
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('Banesë me qira', 'Prishtinë, Rr. Fehmi Agani', 'rent', 'banese', 'Me qira', '650€/muaj', '/nur/Banese.png', 'Banesë e adaptuar për zyre në një prej rrugëve më të njohura të Prishtinës, ideale për kompani dhe profesionistë.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (4, '4 zyre', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (4, '1 banjo', 2);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (4, '1 depo të vogël', 3);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (4, 'parking për 1 veturë', 4);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (4, '/nur/Banese.png', 1);

-- 5. Tokë në Mramor
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('Tokë për Shitje në Mramor', 'Mramor, Prishtinë', 'sale', 'troje', 'Në shitje', '1,900€/ari', '/nur/toka.png', 'Parcelë e madhe toke në Mramor me infrastrukturë bazë të përfshirë, e përshtatshme për projekte afatgjata.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (5, '120 ari', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (5, 'Furnizim me ujë', 2);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (5, 'Rrymë elektrike', 3);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (5, 'Dokumentacion i rregullt', 4);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (5, '/nur/toka.png', 1);

-- 6. Dy villa në Makresh
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('Ofrohen për shitje dy villa', 'Makresh, Artanë', 'sale', 'villa', 'Në shitje', '225,000€', '/nur/villa.png', 'Dy villa të pozicionuara në një zonë të qetë malore, ideale për pushim dhe jetesë larg zhurmës së qytetit.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (6, '5 ari truall', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (6, '150 m²', 2);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (6, 'Lartësi mbidetare 1000 m', 3);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (6, '/nur/villa.png', 1);

-- 7. Tokë në Kushevicë
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('Tokë në shitje', 'Kushevicë', 'sale', 'troje', 'Në shitje', '800€/ari', '/nur/225ari.png', 'Sipërfaqe e madhe toke me lokacion shumë atraktiv pranë Batllavës, e përshtatshme për projekte të ndryshme investive.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (7, '225 ari truall', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (7, '3 min nga Liqeni i Batllavës', 2);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (7, '/nur/225ari.png', 1);

-- 8. 3 shtëpi në Veternik
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('3 shtëpi në shitje', 'Veternik, Prishtinë', 'sale', 'shtepi', 'Në shitje', 'Çmimi me marrëveshje', '/nur/3 shtepi.png', 'Kompleks prej tre shtëpish pranë Spitalit Otrila, me kushte shumë të mira për banim familjar.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (8, 'Sallon dhe kuzhinë', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (8, '4 dhoma gjumi', 2);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (8, 'Garazhë me 2 depo dhe 1 tualet', 3);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (8, '/nur/3 shtepi.png', 1);

-- 9. 2 banesa në Rrugën A
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('2 banesa në shitje', 'Rruga A, Prishtinë', 'sale', 'banese', 'Në shitje', '1,100€/m²', '/nur/dybanesa.png', 'Dy banesa në një ndërtesë të re përgjatë Rrugës A, me organizim funksional dhe ndriçim të bollshëm natyral.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (9, '90 m²', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (9, '2 banesa', 2);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (9, 'Ndriçim i mjaftueshëm', 3);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (9, '/nur/dybanesa.png', 1);

-- 10. Tokë në Koliq
INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
VALUES ('Tokë në Shitje - Koliq', 'Koliq, Prishtinë', 'sale', 'troje', 'Në shitje', '2500€/ari', '/nur/Tokë në Shitje - Koliq.png', 'Shitet tokë bujqësore me sipërfaqe 3–10 ari në fshatin Koliq, e përshtatshme për ndërtim ose kultivim.');

INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (10, 'Zonë e qetë', 1);
INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (10, '3-10 ari', 2);

INSERT INTO property_images (property_id, image_url, sort_order) VALUES (10, '/nur/Tokë në Shitje - Koliq.png', 1);
