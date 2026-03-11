# NUR Real Estate Admin Panel Setup

## Qasja në Admin Panel

### Kredenciale (Logjike të Thjeshtë - Vetëm për Testim!)
- **Username:** `admin`
- **Password:** `admin123`

### Si të Qasni Admin Panel

#### Mënyra 1: Drejtpërdrejtë (Shfaqja e Linkut)
1. Kliko **3 herë** në logon në faqen kryesore
2. Një link "[Admin]" do të shfaqet në këndin e poshtëm djathtë
3. Kliko mbi të dhe hyj me kredencialet e mësipërm

#### Mënyra 2: Drejtpërdrejtë në URL
```
http://localhost:5000/admin-login.html
```

---

## Funksionalitetet e Admin Panel-it

### 📊 Menaxhimi i Pronave
- ✅ Shiko të gjitha pronatet në një tabelë
- ✅ Shto pronë të re (form modal)
- ✅ Edito pronë ekzistuese
- ✅ Fshi pronë

### 📧 Menaxhimi i Mesazheve
- ✅ Shiko të gjitha mesazhet e kontaktit
- ✅ Fshi mesazhe të vjetra
- ✅ Shiko detajet e plotë

### ⚙️ Cilësimet (të ardhshme)
- Rregullime të sistemit dhe konfiguracionit

---

## Struktura e API-ve Admin

### GET - Merr të gjitha pronate
```bash
GET /api/admin/properties
```
**Përgjigja:**
```json
[
  {
    "id": 1,
    "title": "Shtëpi në Novobërdë",
    "location": "Novobërdë",
    "type": "sale",
    "category": "shtepi",
    "price_text": "115,000 €",
    "cover_image": "nur/image.png",
    "description": "..."
  }
]
```

### POST - Shto pronë të re
```bash
POST /api/admin/properties
Content-Type: application/json

{
  "title": "Pronë e re",
  "location": "Lokacioni",
  "category": "shtepi|banese|lokal|troje|villa",
  "type": "sale|rent",
  "price_text": "100,000 €",
  "cover_image": "nur/image.png",
  "description": "Përshkrimi..."
}
```

### PUT - Redakto pronë
```bash
PUT /api/admin/properties/:id
Content-Type: application/json

{
  "title": "Titull i ndryshuar",
  "location": "Lokacioni i ri",
  ...
}
```

### DELETE - Fshi pronë
```bash
DELETE /api/admin/properties/:id
```

### GET - Merr të gjitha mesazhet
```bash
GET /api/admin/contacts
```

### DELETE - Fshi mesazh
```bash
DELETE /api/admin/contacts/:id
```

---

## Ficheri e Admin Panel-it

| Fichier | Përshkrim |
|---------|-----------|
| `admin-login.html` | Faqja e hyrjes me kredenciale |
| `admin-dashboard.html` | Panel kryesor i administrimit |
| `admin-dashboard.js` | Logjika e dashboard-it (CRUD) |
| `admin-styles.css` | Styling i admin panel-it |
| `backend/server.js` | API endpoints për admin |

---

## Shënime të Rëndësishme

⚠️ **SIGURIA:**
- Kredencialet admin janë të ngurtëzuara në kodin frontend (vetëm për testim!)
- Në prodhim, duhet të përdorni:
  - Backend authentication me token JWT
  - Password hashing (bcrypt)
  - Roli/permissions sistem
  - Rate limiting

---

## Testim i Funksionaliteteve

### Shtim Prona:
1. Hyj në admin panel
2. Kliko "Shtim Prona"
3. Plotëso formën
4. Kliko "Ruaj Pronën"

### Editim Prona:
1. Në tabelën e pronave, kliko ikonën e "Editi" (✏️)
2. Ndrysho fushat
3. Kliko "Ruaj Pronën"

### Fshirje Prona:
1. Në tabelën e pronave, kliko ikonën e "Fshi" (🗑️)
2. Konfirmo fshirjen

---

## Bugs/Issues

Nëse hasin problem me admin panel-in:
1. Kontrolloje konsolën e browser-it (F12)
2. Kontrolloje nëse backend-i funksionon (http://localhost:5000)
3. Kontrolloje localStorage për token

Për të hequr token (logout):
```javascript
localStorage.clear();
```

---

**Kreiruar: 18 Dhjetor 2025**
