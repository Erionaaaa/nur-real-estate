// Always use backend port (avoid Live Server / file://)
(() => {
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const isFile = location.protocol === "file:";
  const wrongPort = isLocal && location.port && location.port !== "5000";

  if (isFile || wrongPort) {
    const target = `http://localhost:5000${location.pathname.endsWith("/") ? "/admin-dashboard.html" : location.pathname}${location.search}${location.hash}`;
    location.replace(target);
  }
})();

// Kontroll i authentication
function checkAuth() {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    window.location.href = "admin-login.html";
    return false;
  }
  return true;
}

// Nëse nuk ka token, ridrejtoj në login
if (!checkAuth()) {
  throw new Error("Not authenticated");
}

// Të dhënat globale
let allProperties = [];
let allContacts = [];
let currentEditId = null;

const API_BASE =
  window.location.origin.includes("localhost:5000") ||
  window.location.origin.includes("127.0.0.1:5000")
    ? ""
    : "http://localhost:5000";

function getAdminHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { "x-admin-token": token } : {};
}

// Elements
const propertyModal = document.getElementById("propertyModal");
const propertyForm = document.getElementById("propertyForm");
const closeBtn = document.querySelector(".close-btn");
const addPropertyBtn = document.getElementById("addPropertyBtn");
const cancelBtn = document.getElementById("cancelBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminUser = document.getElementById("adminUser");
const pageTitle = document.getElementById("pageTitle");
const propertiesTable = document.getElementById("propertiesTable");
const contactsTable = document.getElementById("contactsTable");

// Navigation
const navItems = document.querySelectorAll(".nav-item");
const contentSections = document.querySelectorAll(".content-section");

// =====================================
// AUTHENTICATION
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("adminUser");
  if (user) {
    adminUser.textContent = user;
  }

  loadProperties();
  loadContacts();
});

// =====================================
// LOGOUT
// =====================================
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  window.location.href = "admin-login.html";
});

// =====================================
// NAVIGATION
// =====================================
navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    contentSections.forEach(section => section.classList.remove("active"));
    
    const section = item.dataset.section;
    const sectionEl = document.getElementById(section + "-section");
    if (sectionEl) {
      sectionEl.classList.add("active");
    }

    // Përditëso titullin
    const titles = {
      properties: "Menaxhimi i Pronave",
      contacts: "Mesazhe Kontakti",
      settings: "Cilësimet"
    };
    pageTitle.textContent = titles[section] || "Admin Panel";
  });
});

// =====================================
// LOAD PROPERTIES
// =====================================
async function loadProperties() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/properties`, {
      headers: { ...getAdminHeaders() }
    });
    if (!response.ok) throw new Error("Network error");
    allProperties = await response.json();
    renderPropertiesTable();
  } catch (err) {
    console.error("Error loading properties:", err);
    propertiesTable.innerHTML = `<tr><td colspan="6">Gabim në ngarkimin e të dhënave</td></tr>`;
  }
}

function renderPropertiesTable() {
  if (allProperties.length === 0) {
    propertiesTable.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px;">Nuk ka prona të regjistruara</td></tr>`;
    return;
  }

  propertiesTable.innerHTML = allProperties.map(prop => `
    <tr>
      <td>#${prop.id}</td>
      <td>${prop.title}</td>
      <td>${prop.location}</td>
      <td>${prop.price_text}</td>
      <td>
        <span class="badge ${prop.type === 'sale' ? 'badge-sale' : 'badge-rent'}">
          ${prop.type === 'sale' ? 'Në shitje' : 'Me qira'}
        </span>
      </td>
      <td class="actions">
        <button class="btn-icon btn-edit" onclick="editProperty(${prop.id})">
          <i class="fa-solid fa-edit"></i>
        </button>
        <button class="btn-icon btn-delete" onclick="deleteProperty(${prop.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

// =====================================
// LOAD CONTACTS
// =====================================
async function loadContacts() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/contacts`, {
      headers: { ...getAdminHeaders() }
    });
    if (!response.ok) throw new Error("Network error");
    allContacts = await response.json();
    renderContactsTable();
  } catch (err) {
    console.error("Error loading contacts:", err);
    contactsTable.innerHTML = `<tr><td colspan="6">Gabim në ngarkimin e të dhënave</td></tr>`;
  }
}

function renderContactsTable() {
  if (allContacts.length === 0) {
    contactsTable.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px;">Nuk ka mesazhe</td></tr>`;
    return;
  }

  contactsTable.innerHTML = allContacts.map(contact => `
    <tr>
      <td>${contact.name}</td>
      <td>${contact.email}</td>
      <td>${contact.phone || '-'}</td>
      <td>${contact.message.substring(0, 50)}...</td>
      <td>${new Date(contact.created_at).toLocaleDateString('sq-AL')}</td>
      <td class="actions">
        <button class="btn-icon btn-delete" onclick="deleteContact(${contact.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

// =====================================
// ADD PROPERTY BUTTON
// =====================================
addPropertyBtn.addEventListener("click", () => {
  currentEditId = null;
  document.getElementById("modalTitle").textContent = "Shtim Prona";
  propertyForm.reset();
  document.getElementById("propId").value = "Automatik";
  propertyModal.style.display = "block";
});

// =====================================
// EDIT PROPERTY
// =====================================
function editProperty(id) {
  const prop = allProperties.find(p => p.id === id);
  if (!prop) return;

  currentEditId = id;
  document.getElementById("modalTitle").textContent = "Editim Prona";
  
  document.getElementById("propId").value = id;
  document.getElementById("propTitle").value = prop.title;
  document.getElementById("propLocation").value = prop.location;
  document.getElementById("propCategory").value = prop.category;
  document.getElementById("propType").value = prop.type;
  document.getElementById("propPrice").value = prop.price_text;
  document.getElementById("propImage").value = prop.cover_image || "";
  document.getElementById("propDescription").value = prop.description || "";

  propertyModal.style.display = "block";
}

// =====================================
// DELETE PROPERTY
// =====================================
async function deleteProperty(id) {
  if (!confirm("A jeni i sigurt që doni të fshini këtë pronë?")) return;

  try {
    const response = await fetch(`${API_BASE}/api/admin/properties/${id}`, {
      method: "DELETE",
      headers: { ...getAdminHeaders() }
    });
    if (!response.ok) throw new Error("Network error");

    await loadProperties();
    alert("Prona u fshi me sukses");
  } catch (err) {
    console.error("Error deleting property:", err);
    alert("Gabim në fshirjen e pronës");
  }
}

// =====================================
// DELETE CONTACT
// =====================================
async function deleteContact(id) {
  if (!confirm("A jeni i sigurt që doni të fshini këtë mesazh?")) return;

  try {
    const response = await fetch(`${API_BASE}/api/admin/contacts/${id}`, {
      method: "DELETE",
      headers: { ...getAdminHeaders() }
    });
    if (!response.ok) throw new Error("Network error");

    await loadContacts();
    alert("Mesazhi u fshi me sukses");
  } catch (err) {
    console.error("Error deleting contact:", err);
    alert("Gabim në fshirjen e mesazhit");
  }
}

// =====================================
// MODAL HANDLERS
// =====================================
closeBtn.addEventListener("click", () => {
  propertyModal.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  propertyModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === propertyModal) {
    propertyModal.style.display = "none";
  }
});

// =====================================
// FORM SUBMIT
// =====================================
propertyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const propData = {
    title: document.getElementById("propTitle").value.trim(),
    location: document.getElementById("propLocation").value.trim(),
    category: document.getElementById("propCategory").value,
    type: document.getElementById("propType").value,
    price_text: document.getElementById("propPrice").value.trim(),
    cover_image: document.getElementById("propImage").value.trim(),
    description: document.getElementById("propDescription").value.trim()
  };

  if (!propData.title || !propData.location || !propData.category || !propData.type || !propData.price_text) {
    alert("Të gjithë fushat e detyrueshëm duhet të plotësohen!");
    return;
  }

  try {
    let response;
    if (currentEditId) {
      // UPDATE
      response = await fetch(`${API_BASE}/api/admin/properties/${currentEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAdminHeaders() },
        body: JSON.stringify(propData)
      });
    } else {
      // CREATE
      response = await fetch(`${API_BASE}/api/admin/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAdminHeaders() },
        body: JSON.stringify(propData)
      });
    }

    if (!response.ok) throw new Error("Network error");
    const result = await response.json();

    if (result.success) {
      alert(result.message);
      propertyModal.style.display = "none";
      propertyForm.reset();
      currentEditId = null;
      await loadProperties();
    } else {
      alert(result.message || "Gabim");
    }
  } catch (err) {
    console.error("Error saving property:", err);
    alert("Gabim në ruajtjen e pronës");
  }
});
