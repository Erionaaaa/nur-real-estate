document.addEventListener("DOMContentLoaded", async () => {

  // =====================================
  // FOOTER YEAR
  // =====================================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =====================================
  // LOAD PROPERTIES FROM API
  // =====================================
  async function loadProperties() {
    try {
      const response = await fetch("/api/properties");
      if (!response.ok) throw new Error("Failed to fetch properties");
      const properties = await response.json();
      
      const gridContainer = document.querySelector(".properties-grid");
      if (!gridContainer) return; // Not on properties page
      
      gridContainer.innerHTML = "";
      
      properties.forEach(prop => {
        const badgeClass = prop.type === "sale" ? "badge-sale" : "badge-rent";
        const badgeText = prop.type === "sale" ? "Në shitje" : "Me qira";
        
        const card = document.createElement("article");
        card.className = "property-card";
        card.dataset.type = prop.type;
        card.dataset.category = prop.category;
        
        card.innerHTML = `
          <div class="property-image">
            <img src="${prop.cover_image}" alt="${prop.title}" />
            <span class="property-badge ${badgeClass}">${badgeText}</span>
            <span class="property-id">#${prop.id}</span>
          </div>
          <div class="property-body">
            <h3 class="property-title">${prop.title}</h3>
            <p class="property-location">
              <i class="fa-solid fa-location-dot"></i> ${prop.location}
            </p>
            <div class="property-meta">
              <span>${prop.category}</span>
            </div>
            <div class="property-footer">
              <span class="property-price">${prop.price_text}</span>
              <button class="property-details-btn" data-id="${prop.id}">Shiko detajet</button>
            </div>
          </div>
        `;
        
        gridContainer.appendChild(card);
      });
      
      // Re-attach event listeners after loading
      attachPropertyListeners();
    } catch (err) {
      console.error("Error loading properties:", err);
    }
  }

  // =====================================
  // PROPERTY FILTERS (STATUS + CATEGORY)
  // =====================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const catItems = document.querySelectorAll(".cat-item");
  const underline = document.querySelector(".cat-underline");
  
  function getPropertyCards() {
    return document.querySelectorAll(".property-card");
  }

  let currentStatus = "all";
  let currentCategory = "all";

  function filterProperties() {
    const propertyCards = getPropertyCards();
    propertyCards.forEach(card => {
      const cardStatus = card.dataset.type;
      const cardCategory = card.dataset.category;

      const matchStatus = currentStatus === "all" || cardStatus === currentStatus;
      const matchCategory = currentCategory === "all" || cardCategory === currentCategory;

      card.style.display = matchStatus && matchCategory ? "" : "none";
    });
  }

  // STATUS FILTER
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentStatus = btn.dataset.filter;

      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      filterProperties();
    });
  });

  // CATEGORY FILTER + UNDERLINE
  function moveUnderline(el) {
    if (!underline) return;
    const box = el.getBoundingClientRect();
    const parentLeft = el.parentElement.getBoundingClientRect().left;

    underline.style.width = box.width + "px";
    underline.style.left = (box.left - parentLeft) + "px";
  }

  catItems.forEach(btn => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;

      catItems.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      moveUnderline(btn);
      filterProperties();
    });
  });

  // Set initial underline
  const defaultCat = document.querySelector(".cat-item.active");
  if (defaultCat) {
    moveUnderline(defaultCat);
    currentCategory = defaultCat.dataset.category;
  }

  filterProperties();

  // =====================================
  // ATTACH PROPERTY LISTENERS
  // =====================================
  function attachPropertyListeners() {
    const detailButtons = document.querySelectorAll(".property-details-btn");
    detailButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (id) {
          window.location.href = `product-details.html?id=${encodeURIComponent(id)}`;
        }
      });
    });
  }

  // =====================================
  // REDIRECT "SHIKO DETAJET"
  // =====================================
  attachPropertyListeners();


  // =====================================
  // CONTACT FORM → WHATSAPP
  // =====================================
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = contactForm.elements["name"].value.trim();
      const email = contactForm.elements["email"].value.trim();
      const phone = contactForm.elements["phone"].value.trim();
      const message = contactForm.elements["message"].value.trim();

      const text =
        `Pershendetje NUR Real Estate,\n\n` +
        `Emri: ${name}\n` +
        (phone ? `Tel: ${phone}\n` : "") +
        (email ? `Email: ${email}\n` : "") +
        `Mesazhi: ${message || "Jam i interesuar per nje prone."}`;

      const waUrl = `https://wa.me/38349992400?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank");
    });
  }


  // =====================================
  // LOAD PROPERTY DETAILS
  // =====================================
  async function loadPropertyDetails() {
    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get("id");
    
    if (!propertyId) {
      console.warn("No property ID in URL");
      return;
    }
    
    const container = document.getElementById("details-content");
    
    try {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) throw new Error("Property not found");
      const property = await response.json();
      
      const badgeClass = property.type === "sale" ? "badge-sale" : "badge-rent";
      const badgeText = property.type === "sale" ? "Në shitje" : "Me qira";
      
      const images = property.images && property.images.length > 0 ? property.images : [property.cover_image];
      const thumbsHtml = images.map((img, idx) => 
        `<img src="${img}" alt="Foto ${idx + 1}" class="property-thumb ${idx === 0 ? 'active' : ''}" data-full="${img}" />`
      ).join("");
      
      const metaHtml = property.meta && property.meta.length > 0 
        ? property.meta.map(m => `<li>${m}</li>`).join("")
        : "<li>Nuk ka informata shtesë</li>";
      
      container.innerHTML = `
        <div class="property-details-header">
          <p><a href="index.html#properties">⬅ Kthehu te lista e pronave</a></p>
          <div class="property-header-top">
            <span class="property-badge ${badgeClass}">${badgeText}</span>
            <span class="property-id-header">#${property.id}</span>
          </div>
          <h1 class="property-detail-title">${property.title}</h1>
          <p class="property-detail-location"><i class="fa-solid fa-location-dot"></i> ${property.location}</p>
        </div>

        <div class="property-details-layout">
          <div class="property-details-gallery">
            <div class="property-details-image">
              <button class="gallery-nav prev" type="button">‹</button>
              <img id="property-main-image" src="${images[0]}" alt="${property.title}" />
              <button class="gallery-nav next" type="button">›</button>
            </div>
            <div class="property-gallery-thumbs">
              ${thumbsHtml}
            </div>
          </div>

          <div class="property-details-info">
            <div class="property-detail-price">
              <span>${property.price_text}</span>
            </div>
            <p class="property-detail-description">
              ${property.description || "Asnjë përshkrim disponibël"}
            </p>
            <h3>Karakteristikat kryesore</h3>
            <ul class="property-detail-meta">
              ${metaHtml}
            </ul>
            
            <div class="property-details-contact">
              <h3>Interesohuni për këtë pronë</h3>
              <p>Na kontaktoni për më shumë informata, shikim nga afër apo ofertë konkrete.</p>
              <ul class="contact-list">
                <li>📍 Prishtinë, Kosovë</li>
                <li>📞 +383 49-992-400</li>
                <li>✉️ info@nur-realestate.com</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // Re-initialize gallery after rendering
      initializeGallery();
    } catch (err) {
      console.error("Error loading property details:", err);
      container.innerHTML = `
        <h1>Prona nuk u gjet</h1>
        <p>Prona që po kërkoni nuk ekziston ose është hequr nga lista.</p>
        <p><a href="index.html#properties">⬅ Kthehu te lista e pronave</a></p>
      `;
    }
  }

  // =====================================
  // GALLERY / SLIDER në product-details.html
  // =====================================
  function initializeGallery() {
    const mainImage = document.getElementById("property-main-image");
    const thumbs = document.querySelectorAll(".property-thumb");
    const prevBtn = document.querySelector(".gallery-nav.prev");
    const nextBtn = document.querySelector(".gallery-nav.next");

    if (mainImage && thumbs.length > 0) {
      let currentIndex = 0;

      function setActiveImage(index) {
        const thumb = thumbs[index];
        if (!thumb) return;

        mainImage.src = thumb.dataset.full || thumb.src;
        if (thumb.alt) mainImage.alt = thumb.alt;

        thumbs.forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");

        currentIndex = index;
      }

      thumbs.forEach((thumb, i) => {
        thumb.addEventListener("click", () => setActiveImage(i));
      });

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          setActiveImage((currentIndex - 1 + thumbs.length) % thumbs.length);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          setActiveImage((currentIndex + 1) % thumbs.length);
        });
      }

      setActiveImage(0);
    }
  }

  // Load properties and details
  loadProperties();
  loadPropertyDetails();
  initializeGallery();

});
