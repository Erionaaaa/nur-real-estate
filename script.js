document.addEventListener("DOMContentLoaded", () => {

  // =====================================
  // FOOTER YEAR
  // =====================================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // =====================================
  // PROPERTY FILTERS (STATUS + CATEGORY)
  // =====================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const catItems = document.querySelectorAll(".cat-item");
  const propertyCards = document.querySelectorAll(".property-card");
  const underline = document.querySelector(".cat-underline");

  let currentStatus = "all";
  let currentCategory = "all";

  function filterProperties() {
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
  // REDIRECT "SHIKO DETAJET"
  // =====================================
  const detailButtons = document.querySelectorAll(".property-details-btn");

  detailButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (id) {
        window.location.href = `product-details.html?id=${encodeURIComponent(id)}`;
      }
    });
  });


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
  // GALLERY / SLIDER në product-details.html
  // =====================================
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

});
