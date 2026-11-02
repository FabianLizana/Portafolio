/* =========================================================
   EMBERWOOD — main.js
   JavaScript vanilla, sin dependencias.
   Módulos:
     1. Header sticky + navegación mobile
     2. Reveal al scroll (IntersectionObserver)
     3. Catálogo de productos + filtros (tienda.html)
     4. Newsletter (validación simple)
     5. Formulario de contacto (validación completa)
     6. FAQ acordeón
     7. Utilidades varias (año en el footer)
   ========================================================= */
(function () {
  "use strict";

  /* =======================================================
     CATÁLOGO — fuente única de datos de producto
     ======================================================= */
  var PRODUCTS = [
    {
      id: "ember-001",
      name: "Ceniza de Cedro",
      collection: "amaderados",
      collectionLabel: "Amaderados",
      notes: "Cedro del Atlas · Vetiver · Humo seco",
      image: "img/p1.jpg",
      tag: "Icónico",
      basePrice: 46,
      sizes: [
        { label: "220 g", delta: 0 },
        { label: "400 g", delta: 22 },
      ],
      scents: ["Intenso", "Suave"],
    },
    {
      id: "ember-002",
      name: "Musgo Nocturno",
      collection: "verdes",
      collectionLabel: "Verdes",
      notes: "Musgo de roble · Higuera · Tierra húmeda",
      image: "img/p2.jpg",
      basePrice: 44,
      sizes: [
        { label: "220 g", delta: 0 },
        { label: "400 g", delta: 20 },
      ],
      scents: ["Intenso", "Suave"],
    },
    {
      id: "ember-003",
      name: "Ámbar Difuso",
      collection: "ambar",
      collectionLabel: "Ámbar",
      notes: "Ámbar gris · Benjuí · Haba tonka",
      image: "img/p3.jpg",
      tag: "Difusor",
      basePrice: 58,
      sizes: [
        { label: "200 ml", delta: 0 },
        { label: "500 ml", delta: 34 },
      ],
      scents: [],
    },
    {
      id: "ember-004",
      name: "Bruma de Sala 07",
      collection: "ambar",
      collectionLabel: "Ámbar",
      notes: "Bergamota negra · Incienso · Cuero suave",
      image: "img/p4.jpg",
      basePrice: 39,
      sizes: [{ label: "100 ml", delta: 0 }],
      scents: ["Cálido", "Cítrico"],
    },
    {
      id: "ember-005",
      name: "Vino de Invierno",
      collection: "especiados",
      collectionLabel: "Especiados",
      notes: "Ciruela negra · Clavo · Madera de brandy",
      image: "img/p5.jpg",
      tag: "Edición",
      basePrice: 52,
      sizes: [
        { label: "220 g", delta: 0 },
        { label: "400 g", delta: 24 },
      ],
      scents: ["Intenso", "Suave"],
    },
    {
      id: "ember-006",
      name: "Trío de Viaje",
      collection: "amaderados",
      collectionLabel: "Amaderados",
      notes: "Tres miniaturas · 3 × 70 g",
      image: "img/p6.jpg",
      tag: "Set",
      basePrice: 42,
      sizes: [{ label: "3 × 70 g", delta: 0 }],
      scents: ["Descubrimiento", "Amaderado"],
    },
    {
      id: "ember-007",
      name: "Incienso Ritual",
      collection: "especiados",
      collectionLabel: "Especiados",
      notes: "Sándalo · Mirra · Pimienta rosa",
      image: "img/p7.jpg",
      basePrice: 28,
      sizes: [
        { label: "30 varillas", delta: 0 },
        { label: "60 varillas", delta: 16 },
      ],
      scents: [],
    },
    {
      id: "ember-008",
      name: "Recarga Botánica",
      collection: "verdes",
      collectionLabel: "Verdes",
      notes: "Aceite concentrado · Eucalipto · Salvia",
      image: "img/p8.jpg",
      tag: "Refill",
      basePrice: 32,
      sizes: [
        { label: "100 ml", delta: 0 },
        { label: "250 ml", delta: 18 },
      ],
      scents: [],
    },
    {
      id: "ember-009",
      name: "Humo de Alcoba",
      collection: "amaderados",
      collectionLabel: "Amaderados",
      notes: "Abedul quemado · Papiro · Vainilla negra",
      image: "img/p1.jpg",
      basePrice: 48,
      sizes: [
        { label: "220 g", delta: 0 },
        { label: "400 g", delta: 22 },
      ],
      scents: ["Intenso", "Suave"],
    },
    {
      id: "ember-010",
      name: "Resina de Otoño",
      collection: "ambar",
      collectionLabel: "Ámbar",
      notes: "Labdanum · Mirra dulce · Castaña",
      image: "img/p5.jpg",
      basePrice: 50,
      sizes: [
        { label: "220 g", delta: 0 },
        { label: "400 g", delta: 24 },
      ],
      scents: ["Cálido", "Intenso"],
    },
  ];

  var FILTERS = [
    { id: "todos", label: "Todo el catálogo" },
    { id: "amaderados", label: "Amaderados" },
    { id: "verdes", label: "Verdes" },
    { id: "ambar", label: "Ámbar" },
    { id: "especiados", label: "Especiados" },
  ];

  /* =======================================================
     1. HEADER STICKY + NAV MOBILE
     ======================================================= */
  function initHeader() {
    var header = document.querySelector(".site-header");
    var burger = document.querySelector(".burger");
    var mobileNav = document.getElementById("nav-mobile");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (burger && mobileNav) {
      burger.addEventListener("click", function () {
        var open = burger.classList.toggle("is-open");
        mobileNav.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("is-locked", open);
      });

      mobileNav.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          burger.classList.remove("is-open");
          mobileNav.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
          document.body.classList.remove("is-locked");
        }
      });
    }
  }

  /* =======================================================
     2. REVEAL AL SCROLL
     ======================================================= */
  function initReveal(scope) {
    var nodes = (scope || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach(function (n) {
      observer.observe(n);
    });
  }

  /* =======================================================
     3. TIENDA — render, variantes y filtros
     ======================================================= */
  function priceOf(product, sizeIndex) {
    return product.basePrice + (product.sizes[sizeIndex] ? product.sizes[sizeIndex].delta : 0);
  }

  function productMarkup(p, i) {
    var sizeChips = p.sizes
      .map(function (s, idx) {
        return (
          '<button type="button" class="chip' + (idx === 0 ? " is-selected" : "") +
          '" data-size="' + idx + '">' + s.label + "</button>"
        );
      })
      .join("");

    var scentChips = p.scents.length
      ? '<div class="variant-row" data-group="scent">' +
        p.scents
          .map(function (s, idx) {
            return (
              '<button type="button" class="chip' + (idx === 0 ? " is-selected" : "") +
              '" data-scent="' + s + '">' + s + "</button>"
            );
          })
          .join("") +
        "</div>"
      : "";

    return (
      '<article class="product reveal" style="--delay:' + (i % 4) * 0.06 + 's" data-product="' + p.id +
      '" data-collection="' + p.collection + '">' +
      '<div class="product-media">' +
      (p.tag ? '<span class="product-tag">' + p.tag + "</span>" : "") +
      '<img src="' + p.image + '" alt="' + p.name + ' — vela artesanal Emberwood" loading="lazy" width="900" height="1100">' +
      "</div>" +
      '<div class="product-top"><h3>' + p.name + '</h3>' +
      '<span class="product-price" data-price>' + window.EmberCart.formatPrice(priceOf(p, 0)) + "</span></div>" +
      '<p class="product-notes">' + p.notes + "</p>" +
      '<div class="variants">' +
      '<div class="variant-row" data-group="size">' + sizeChips + "</div>" +
      scentChips +
      "</div>" +
      '<button type="button" class="btn" data-add>Agregar al carrito</button>' +
      "</article>"
    );
  }

  function initShop() {
    var grid = document.getElementById("product-grid");
    if (!grid) return;

    var filterBar = document.getElementById("filter-bar");
    var counter = document.getElementById("filter-count");

    // Filtros
    filterBar.innerHTML =
      FILTERS.map(function (f) {
        return '<button type="button" class="filter-btn" data-filter="' + f.id + '">' + f.label + "</button>";
      }).join("") + '<span class="filter-count" id="filter-count"></span>';
    counter = document.getElementById("filter-count");

    // Productos
    grid.innerHTML = PRODUCTS.map(productMarkup).join("");
    grid.insertAdjacentHTML(
      "beforeend",
      '<p class="empty-results" id="empty-results" hidden>No hay piezas en esta colección todavía.</p>'
    );

    var emptyMsg = document.getElementById("empty-results");

    function applyFilter(id) {
      var visible = 0;
      grid.querySelectorAll(".product").forEach(function (card) {
        var match = id === "todos" || card.dataset.collection === id;
        card.hidden = !match;
        if (match) visible++;
      });
      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.toggle("is-active", b.dataset.filter === id);
      });
      emptyMsg.hidden = visible > 0;
      counter.textContent = visible + (visible === 1 ? " pieza" : " piezas");
      initReveal(grid);
    }

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      applyFilter(btn.dataset.filter);
      history.replaceState(null, "", btn.dataset.filter === "todos" ? "tienda.html" : "?coleccion=" + btn.dataset.filter);
    });

    // Interacción dentro de cada tarjeta: variantes y añadir al carrito
    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".product");
      if (!card) return;
      var product = PRODUCTS.filter(function (p) {
        return p.id === card.dataset.product;
      })[0];
      if (!product) return;

      var chip = e.target.closest(".chip");
      if (chip) {
        var row = chip.parentElement;
        row.querySelectorAll(".chip").forEach(function (c) {
          c.classList.remove("is-selected");
        });
        chip.classList.add("is-selected");
        if (row.dataset.group === "size") {
          card.querySelector("[data-price]").textContent = window.EmberCart.formatPrice(
            priceOf(product, Number(chip.dataset.size))
          );
        }
        return;
      }

      var addBtn = e.target.closest("[data-add]");
      if (!addBtn) return;

      var sizeChip = card.querySelector('[data-group="size"] .chip.is-selected');
      var scentChip = card.querySelector('[data-group="scent"] .chip.is-selected');
      var sizeIndex = sizeChip ? Number(sizeChip.dataset.size) : 0;
      var variantParts = [];
      if (sizeChip) variantParts.push(sizeChip.textContent);
      if (scentChip) variantParts.push(scentChip.textContent);

      window.EmberCart.add({
        id: product.id,
        name: product.name,
        variant: variantParts.join(" · "),
        price: priceOf(product, sizeIndex),
        image: product.image,
      });

      addBtn.textContent = "Añadido ✓";
      addBtn.classList.add("btn-added");
      setTimeout(function () {
        addBtn.textContent = "Agregar al carrito";
        addBtn.classList.remove("btn-added");
      }, 1400);
    });

    // Filtro inicial desde la URL (?coleccion=verdes)
    var param = new URLSearchParams(window.location.search).get("coleccion");
    var valid = FILTERS.some(function (f) {
      return f.id === param;
    });
    applyFilter(valid ? param : "todos");
  }

  /* =======================================================
     4. NEWSLETTER
     ======================================================= */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function initNewsletter() {
    var form = document.getElementById("newsletter-form");
    if (!form) return;
    var note = form.parentElement.querySelector(".form-note");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.elements.email.value.trim();
      if (!EMAIL_RE.test(email) || email.length > 255) {
        note.textContent = "Introduce un correo electrónico válido.";
        note.className = "form-note is-error";
        return;
      }
      note.textContent = "Gracias. Te escribiremos cuando encendamos algo nuevo.";
      note.className = "form-note is-ok";
      form.reset();
    });
  }

  /* =======================================================
     5. FORMULARIO DE CONTACTO
     ======================================================= */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("form-status");

    var rules = {
      nombre: function (v) {
        if (!v) return "Necesitamos tu nombre.";
        if (v.length < 2) return "El nombre es demasiado corto.";
        if (v.length > 100) return "Máximo 100 caracteres.";
        return "";
      },
      email: function (v) {
        if (!v) return "Necesitamos un correo para responderte.";
        if (!EMAIL_RE.test(v)) return "El formato del correo no es válido.";
        if (v.length > 255) return "Máximo 255 caracteres.";
        return "";
      },
      asunto: function (v) {
        return v ? "" : "Selecciona un motivo de contacto.";
      },
      mensaje: function (v) {
        if (!v) return "Cuéntanos en qué podemos ayudarte.";
        if (v.length < 12) return "Escribe al menos 12 caracteres.";
        if (v.length > 1000) return "Máximo 1000 caracteres.";
        return "";
      },
    };

    function validateField(name) {
      var input = form.elements[name];
      var field = input.closest(".field");
      var msg = rules[name](input.value.trim());
      field.classList.toggle("has-error", Boolean(msg));
      field.querySelector(".field-error").textContent = msg;
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    }

    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener("blur", function () {
        validateField(name);
      });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("has-error")) validateField(name);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = Object.keys(rules)
        .map(validateField)
        .every(Boolean);

      if (!ok) {
        status.className = "form-status is-visible";
        status.style.borderLeftColor = "var(--color-error)";
        status.textContent = "Revisa los campos marcados antes de enviar.";
        var firstError = form.querySelector(".field.has-error input, .field.has-error select, .field.has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      status.className = "form-status is-visible";
      status.style.borderLeftColor = "var(--color-success)";
      status.textContent =
        "Mensaje enviado. Gracias, " + form.elements.nombre.value.trim() + ". Respondemos en un plazo de 24-48 h laborables.";
      form.reset();
    });
  }

  /* =======================================================
     6. FAQ ACORDEÓN
     ======================================================= */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var panel = item.querySelector(".faq-a");

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        // Comportamiento acordeón: cierra el resto
        items.forEach(function (other) {
          if (other === item) return;
          other.classList.remove("is-open");
          other.querySelector(".faq-a").style.height = "0px";
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });

        item.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.style.height = isOpen ? "0px" : panel.scrollHeight + "px";
      });
    });
  }

  /* =======================================================
     7. UTILIDADES
     ======================================================= */
  function initMisc() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Arranque ---------- */
  function init() {
    initHeader();
    initShop();
    initReveal(document);
    initNewsletter();
    initContactForm();
    initFaq();
    initMisc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
