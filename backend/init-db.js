// Database initialization script
// Run this after MySQL is set up, or execute database.sql manually

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Kosova.123",
  database: "kimidb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeDatabase() {
  const connection = await pool.getConnection();

  try {
    // Create tables
    console.log("Creating tables...");

    await connection.query(`
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
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        property_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        INDEX idx_property (property_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS property_meta (
        id INT PRIMARY KEY AUTO_INCREMENT,
        property_id INT NOT NULL,
        meta_text VARCHAR(255) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        INDEX idx_property (property_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created (created_at)
      )
    `);

    console.log("Tables created successfully!");

    // Insert sample properties
    console.log("Inserting sample properties...");

    const properties = [
      {
        title: "Shtëpi për Shitje në Novobërdë",
        location: "Novobërdë",
        type: "sale",
        category: "shtepi",
        badge: "Në shitje",
        price_text: "115,000 €",
        cover_image: "/nur/Shtepia  ne shitje.png",
        description:
          "Shtëpi e rehatshme në Novobërdë, e përshtatshme për familje, me sipërfaqe të bollshme dhe oborr.",
        meta: ["4.8 ari", "Sallon", "3 dhoma gjumi", "2 banjo", "Paradhome"],
        images: ["/nur/Shtepia  ne shitje.png"],
      },
      {
        title: "Lëshohet me qira hapësira",
        location: "Prishtinë, Dardani",
        type: "rent",
        category: "lokal",
        badge: "Me qira",
        price_text: "700€/muaj",
        cover_image: "/nur/lokali.png",
        description:
          "Hapësirë biznesi në një nga lagjet më të kërkuara të Prishtinës, ideale për zyre apo lokale shërbimi.",
        meta: ["100 m² open space", "Ngrohje qendrore", "Rreth 115 m² neto"],
        images: ["/nur/lokali.png"],
      },
      {
        title: "Shitet toka në Orllan",
        location: "Orllan, Batllavë",
        type: "sale",
        category: "troje",
        badge: "Në shitje",
        price_text: "3,500 €/ari",
        cover_image: "/nur/15 ari.png",
        description:
          "Parcella me pozicion shumë të mirë pranë Liqenit të Batllavës, e përshtatshme për investime turistike.",
        meta: ["Parcelë afër liqenit", "Potencial për vila / turizëm", "15 ari"],
        images: ["/nur/15 ari.png"],
      },
      {
        title: "Banesë me qira",
        location: "Prishtinë, Rr. Fehmi Agani",
        type: "rent",
        category: "banese",
        badge: "Me qira",
        price_text: "650€/muaj",
        cover_image: "/nur/Banese.png",
        description:
          "Banesë e adaptuar për zyre në një prej rrugëve më të njohura të Prishtinës, ideale për kompani dhe profesionistë.",
        meta: ["4 zyre", "1 banjo", "1 depo të vogël", "parking për 1 veturë"],
        images: ["/nur/Banese.png"],
      },
      {
        title: "Tokë për Shitje në Mramor",
        location: "Mramor, Prishtinë",
        type: "sale",
        category: "troje",
        badge: "Në shitje",
        price_text: "1,900€/ari",
        cover_image: "/nur/toka.png",
        description:
          "Parcelë e madhe toke në Mramor me infrastrukturë bazë të përfshirë, e përshtatshme për projekte afatgjata.",
        meta: [
          "120 ari",
          "Furnizim me ujë",
          "Rrymë elektrike",
          "Dokumentacion i rregullt",
        ],
        images: ["/nur/toka.png"],
      },
    ];

    for (const prop of properties) {
      const result = await connection.query(
        `INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prop.title,
          prop.location,
          prop.type,
          prop.category,
          prop.badge,
          prop.price_text,
          prop.cover_image,
          prop.description,
        ]
      );

      const propertyId = result[0].insertId;

      // Insert meta
      for (let i = 0; i < prop.meta.length; i++) {
        await connection.query(
          `INSERT INTO property_meta (property_id, meta_text, sort_order) VALUES (?, ?, ?)`,
          [propertyId, prop.meta[i], i + 1]
        );
      }

      // Insert images
      for (let i = 0; i < prop.images.length; i++) {
        await connection.query(
          `INSERT INTO property_images (property_id, image_url, sort_order) VALUES (?, ?, ?)`,
          [propertyId, prop.images[i], i + 1]
        );
      }

      console.log(`✓ Property ID ${propertyId}: ${prop.title}`);
    }

    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    connection.release();
    await pool.end();
  }
}

// Run initialization
initializeDatabase().catch(console.error);
