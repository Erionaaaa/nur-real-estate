import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// ============================
// OFFLINE FALLBACK (when DB unavailable)
// ============================
let offlineMode = false;
let offlineContacts = [];
let offlineProperties = [
  {
    id: 1,
    title: "Shtëpi për Shitje në Novobërdë",
    location: "Novobërdë",
    type: "sale",
    category: "shtepi",
    badge: "Në shitje",
    price_text: "115,000 €",
    cover_image: "/nur/Shtepia  ne shitje.png",
    description:
      "Shtëpi e rehatshme në Novobërdë, e përshtatshme për familje, me sipërfaqe të bollshme dhe oborr.",
  },
  {
    id: 2,
    title: "Lëshohet me qira hapësira",
    location: "Prishtinë, Dardani",
    type: "rent",
    category: "lokal",
    badge: "Me qira",
    price_text: "700€/muaj",
    cover_image: "/nur/lokali.png",
    description:
      "Hapësirë biznesi në një nga lagjet më të kërkuara të Prishtinës, ideale për zyre apo lokale shërbimi.",
  },
  {
    id: 3,
    title: "Shitet toka në Orllan",
    location: "Orllan, Batllavë",
    type: "sale",
    category: "troje",
    badge: "Në shitje",
    price_text: "3,500 €/ari",
    cover_image: "/nur/15 ari.png",
    description:
      "Parcella me pozicion shumë të mirë pranë Liqenit të Batllavës, e përshtatshme për investime turistike.",
  },
];

// ====== paths for ES modules ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== serve frontend static files ======
app.use(
  express.static(path.join(__dirname, "public"), {
    etag: true,
    maxAge: "30d",
    setHeaders: (res, filePath) => {
      // HTML should not be aggressively cached
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
        return;
      }

      // Long cache for static assets
      if (/\.(css|js|png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
      }
    },
  })
);

// Root -> index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Optional explicit route (jo e domosdoshme, por ok)
app.get("/product-details.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "product-details.html"));
});

// ============================
// GET ALL PROPERTIES (GRID)
// ============================
app.get("/api/properties", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, title, location, type, category, badge, price_text, cover_image
      FROM properties
      ORDER BY id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching properties:", err);
    // Fallback to mock data if database unavailable
    const mockProperties = [
      {
        id: 1,
        title: "Shtëpi për Shitje në Novobërdë",
        location: "Novobërdë",
        type: "sale",
        category: "shtepi",
        badge: "Në shitje",
        price_text: "115,000 €",
        cover_image: "/nur/Shtepia  ne shitje.png"
      },
      {
        id: 2,
        title: "Lëshohet me qira hapësira",
        location: "Prishtinë, Dardani",
        type: "rent",
        category: "lokal",
        badge: "Me qira",
        price_text: "700€/muaj",
        cover_image: "/nur/lokali.png"
      },
      {
        id: 3,
        title: "Shitet toka në Orllan",
        location: "Orllan, Batllavë",
        type: "sale",
        category: "troje",
        badge: "Në shitje",
        price_text: "3,500 €/ari",
        cover_image: "/nur/15 ari.png"
      }
    ];
    res.json(mockProperties);
  }
});

// ============================
// GET PROPERTY DETAILS
// ============================
app.get("/api/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [[property]] = await db.query(
      "SELECT * FROM properties WHERE id = ?",
      [id]
    );
    if (!property) return res.status(404).json({ message: "Not found" });

    const [images] = await db.query(
      "SELECT image_url FROM property_images WHERE property_id = ? ORDER BY sort_order",
      [id]
    );

    const [meta] = await db.query(
      "SELECT meta_text FROM property_meta WHERE property_id = ? ORDER BY sort_order",
      [id]
    );

    res.json({
      ...property,
      images: images.map(i => i.image_url),
      meta: meta.map(m => m.meta_text),
    });
  } catch (err) {
    console.error("Error fetching property details:", err);
    // Fallback to mock data
    const mockProperties = {
      "1": {
        id: 1,
        title: "Shtëpi për Shitje në Novobërdë",
        location: "Novobërdë",
        type: "sale",
        category: "shtepi",
        badge: "Në shitje",
        price_text: "115,000 €",
        cover_image: "/nur/Shtepia  ne shitje.png",
        description: "Shtëpi e rehatshme në Novobërdë, e përshtatshme për familje, me sipërfaqe të bollshme dhe oborr.",
        images: ["/nur/Shtepia  ne shitje.png"],
        meta: ["4.8 ari", "Sallon", "3 dhoma gjumi", "2 banjo", "Paradhome"]
      },
      "2": {
        id: 2,
        title: "Lëshohet me qira hapësira",
        location: "Prishtinë, Dardani",
        type: "rent",
        category: "lokal",
        badge: "Me qira",
        price_text: "700€/muaj",
        cover_image: "/nur/lokali.png",
        description: "Hapësirë biznesi në një nga lagjet më të kërkuara të Prishtinës, ideale për zyre apo lokale shërbimi.",
        images: ["/nur/lokali.png"],
        meta: ["100 m² open space", "Ngrohje qendrore", "Rreth 115 m² neto"]
      },
      "3": {
        id: 3,
        title: "Shitet toka në Orllan",
        location: "Orllan, Batllavë",
        type: "sale",
        category: "troje",
        badge: "Në shitje",
        price_text: "3,500 €/ari",
        cover_image: "/nur/15 ari.png",
        description: "Parcella me pozicion shumë të mirë pranë Liqenit të Batllavës, e përshtatshme për investime turistike.",
        images: ["/nur/15 ari.png"],
        meta: ["Parcelë afër liqenit", "Potencial për vila / turizëm", "15 ari"]
      }
    };
    const property = mockProperties[id];
    if (!property) return res.status(404).json({ message: "Not found" });
    res.json(property);
  }
});

// ============================
// CONTACT FORM
// ============================
app.post("/api/contacts", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    await db.query(
      "INSERT INTO contacts (name,email,phone,message) VALUES (?,?,?,?)",
      [name, email, phone, message]
    );

    res.json({ success: true, message: "Mesazhi u dërgua me sukses!" });
  } catch (err) {
    console.error("Error saving contact:", err);
    // Fallback success even if database unavailable
    offlineMode = true;
    console.log("Contact (fallback):", { name, email, phone, message });
    const id = offlineContacts.length
      ? Math.max(...offlineContacts.map(c => c.id)) + 1
      : 1;
    offlineContacts.unshift({
      id,
      name,
      email,
      phone,
      message,
      created_at: new Date().toISOString(),
    });
    res.json({ success: true, message: "Mesazhi u pranua (offline mode)" });
  }
});

// ============================
// ADMIN API - BASIC AUTH GUARD (TESTING ONLY)
// ============================
app.use("/api/admin", (req, res, next) => {
  const token = req.header("x-admin-token");
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  next();
});

// ============================
// ADMIN API - GET ALL PROPERTIES
// ============================
app.get("/api/admin/properties", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, title, location, type, category, price_text, cover_image, description
      FROM properties
      ORDER BY id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching properties:", err);
    offlineMode = true;
    res.json([...offlineProperties].sort((a, b) => b.id - a.id));
  }
});

// ============================
// ADMIN API - ADD PROPERTY
// ============================
app.post("/api/admin/properties", async (req, res) => {
  try {
    const { title, location, type, category, price_text, cover_image, description } = req.body;

    if (!title || !location || !type || !category || !price_text) {
      return res.status(400).json({ message: "Të dhëna të detyrueshme mungojnë" });
    }

    const [result] = await db.query(
      "INSERT INTO properties (title, location, type, category, badge, price_text, cover_image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        location,
        type,
        category,
        type === "sale" ? "Në shitje" : "Me qira",
        price_text,
        cover_image || "nur/default.png",
        description || ""
      ]
    );

    res.json({ success: true, id: result.insertId, message: "Prona u shtua me sukses" });
  } catch (err) {
    console.error("Error adding property:", err);
    offlineMode = true;
    const id = offlineProperties.length
      ? Math.max(...offlineProperties.map(p => p.id)) + 1
      : 1;
    offlineProperties.push({
      id,
      title,
      location,
      type,
      category,
      badge: type === "sale" ? "Në shitje" : "Me qira",
      price_text,
      cover_image: cover_image || "nur/default.png",
      description: description || "",
    });
    res.json({ success: true, id, message: "Prona u shtua me sukses (offline mode)" });
  }
});

// ============================
// ADMIN API - UPDATE PROPERTY
// ============================
app.put("/api/admin/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, type, category, price_text, cover_image, description } = req.body;

    if (!title || !location || !type || !category || !price_text) {
      return res.status(400).json({ message: "Të dhëna të detyrueshme mungojnë" });
    }

    await db.query(
      "UPDATE properties SET title=?, location=?, type=?, category=?, badge=?, price_text=?, cover_image=?, description=? WHERE id=?",
      [
        title,
        location,
        type,
        category,
        type === "sale" ? "Në shitje" : "Me qira",
        price_text,
        cover_image || "nur/default.png",
        description || "",
        id
      ]
    );

    res.json({ success: true, message: "Prona u përditësua me sukses" });
  } catch (err) {
    console.error("Error updating property:", err);
    offlineMode = true;
    const numericId = Number(req.params.id);
    const idx = offlineProperties.findIndex(p => p.id === numericId);
    if (idx === -1) return res.status(404).json({ message: "Not found" });
    offlineProperties[idx] = {
      ...offlineProperties[idx],
      title,
      location,
      type,
      category,
      badge: type === "sale" ? "Në shitje" : "Me qira",
      price_text,
      cover_image: cover_image || "nur/default.png",
      description: description || "",
    };
    res.json({ success: true, message: "Prona u përditësua me sukses (offline mode)" });
  }
});

// ============================
// ADMIN API - DELETE PROPERTY
// ============================
app.delete("/api/admin/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM property_images WHERE property_id = ?", [id]);
    await db.query("DELETE FROM property_meta WHERE property_id = ?", [id]);
    await db.query("DELETE FROM properties WHERE id = ?", [id]);

    res.json({ success: true, message: "Prona u fshi me sukses" });
  } catch (err) {
    console.error("Error deleting property:", err);
    offlineMode = true;
    const numericId = Number(req.params.id);
    offlineProperties = offlineProperties.filter(p => p.id !== numericId);
    res.json({ success: true, message: "Prona u fshi me sukses (offline mode)" });
  }
});

// ============================
// ADMIN API - GET ALL CONTACTS
// ============================
app.get("/api/admin/contacts", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, email, phone, message, created_at
      FROM contacts
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    offlineMode = true;
    res.json(offlineContacts);
  }
});

// ============================
// ADMIN API - DELETE CONTACT
// ============================
app.delete("/api/admin/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM contacts WHERE id = ?", [id]);

    res.json({ success: true, message: "Mesazhi u fshi me sukses" });
  } catch (err) {
    console.error("Error deleting contact:", err);
    offlineMode = true;
    const numericId = Number(req.params.id);
    offlineContacts = offlineContacts.filter(c => c.id !== numericId);
    res.json({ success: true, message: "Mesazhi u fshi me sukses (offline mode)" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
