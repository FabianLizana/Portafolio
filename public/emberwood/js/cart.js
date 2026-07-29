/* =========================================================
   EMBERWOOD — cart.js
   Carrito de compras en JavaScript vanilla.
   - Estado persistido en localStorage
   - Drawer lateral, contador en vivo, cantidades, totales
   - Se auto-inicializa en cualquier página que incluya el markup
   Expuesto como window.EmberCart para reutilizarlo desde otros scripts.
   ========================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "emberwood_cart_v1";
  var SHIPPING_FREE_FROM = 60; // envío gratis a partir de 60 €
  var SHIPPING_COST = 4.9;

  /** @type {Array<{id:string,name:string,variant:string,price:number,image:string,qty:number}>} */
  var items = [];

  /* ---------- Persistencia ---------- */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      items = Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
    } catch (err) {
      items = [];
    }
  }

  function isValidItem(it) {
    return it && typeof it.id === "string" && typeof it.price === "number" && it.qty > 0;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      /* modo privado / cuota llena: el carrito sigue funcionando en memoria */
    }
  }

  /* ---------- Utilidades ---------- */
  function formatPrice(value) {
    return value.toFixed(2).replace(".", ",") + " €";
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function subtotal() {
    return items.reduce(function (sum, it) {
      return sum + it.price * it.qty;
    }, 0);
  }

  function totalUnits() {
    return items.reduce(function (sum, it) {
      return sum + it.qty;
    }, 0);
  }

  function shipping() {
    if (items.length === 0) return 0;
    return subtotal() >= SHIPPING_FREE_FROM ? 0 : SHIPPING_COST;
  }

  /* ---------- Referencias DOM ---------- */
  var els = {};

  function cacheEls() {
    els.counts = document.querySelectorAll("[data-cart-count]");
    els.openers = document.querySelectorAll("[data-cart-open]");
    els.drawer = document.getElementById("cart-drawer");
    els.overlay = document.getElementById("cart-overlay");
    els.body = document.getElementById("cart-body");
    els.foot = document.getElementById("cart-foot");
    els.toast = document.getElementById("toast");
  }

  /* ---------- Render ---------- */
  function renderCount() {
    var n = totalUnits();
    els.counts.forEach(function (el) {
      var changed = el.textContent !== String(n);
      el.textContent = String(n);
      el.hidden = false;
      if (changed) {
        el.classList.add("is-bump");
        setTimeout(function () {
          el.classList.remove("is-bump");
        }, 220);
      }
    });
  }

  function emptyMarkup() {
    return (
      '<div class="cart-empty">' +
      '<div class="flame" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.2">' +
      '<path d="M12 3c1 3.2 4.5 4.4 4.5 8.4A4.5 4.5 0 0 1 12 16a4.5 4.5 0 0 1-4.5-4.6C7.5 8.6 10 7.6 12 3Z"/>' +
      '<path d="M8 20h8"/></svg></div>' +
      "<h3>Tu carrito está en silencio</h3>" +
      "<p>Aún no has elegido ninguna fragancia. Empieza por nuestras colecciones.</p>" +
      '<a class="btn" href="tienda.html">Explorar la tienda <span class="arrow">&#8594;</span></a>' +
      "</div>"
    );
  }

  function itemMarkup(it, index) {
    return (
      '<article class="cart-item" style="animation-delay:' + index * 0.04 + 's">' +
      '<img src="' + escapeHtml(it.image) + '" alt="' + escapeHtml(it.name) + '" loading="lazy" width="78" height="98">' +
      "<div>" +
      "<h4>" + escapeHtml(it.name) + "</h4>" +
      '<p class="ci-variant">' + escapeHtml(it.variant || "Estándar") + "</p>" +
      '<div class="ci-foot">' +
      '<div class="qty">' +
      '<button type="button" data-cart-dec="' + it.id + '" aria-label="Quitar una unidad de ' + escapeHtml(it.name) + '">&minus;</button>' +
      "<span>" + it.qty + "</span>" +
      '<button type="button" data-cart-inc="' + it.id + '" aria-label="Añadir una unidad de ' + escapeHtml(it.name) + '">+</button>' +
      "</div>" +
      '<span class="ci-price">' + formatPrice(it.price * it.qty) + "</span>" +
      "</div>" +
      '<button type="button" class="ci-remove" data-cart-remove="' + it.id + '">Eliminar</button>' +
      "</div></article>"
    );
  }

  function render() {
    renderCount();
    if (!els.body || !els.foot) return;

    if (items.length === 0) {
      els.body.innerHTML = emptyMarkup();
      els.foot.innerHTML = "";
      els.foot.hidden = true;
      return;
    }

    els.body.innerHTML = items.map(itemMarkup).join("");
    els.foot.hidden = false;

    var ship = shipping();
    var remaining = Math.max(0, SHIPPING_FREE_FROM - subtotal());

    els.foot.innerHTML =
      '<div class="cart-line"><span>Subtotal</span><span>' + formatPrice(subtotal()) + "</span></div>" +
      '<div class="cart-line"><span>Envío</span><span>' + (ship === 0 ? "Gratis" : formatPrice(ship)) + "</span></div>" +
      '<div class="cart-total"><span>Total</span><strong>' + formatPrice(subtotal() + ship) + "</strong></div>" +
      '<button type="button" class="btn btn-block" data-cart-checkout>Finalizar compra <span class="arrow">&#8594;</span></button>' +
      '<p class="cart-note">' +
      (remaining > 0
        ? "Te faltan " + formatPrice(remaining) + " para el envío gratuito."
        : "Envío gratuito incluido. Gracias por elegirnos.") +
      "</p>";
  }

  /* ---------- Acciones públicas ---------- */
  function add(product) {
    var id = product.id + (product.variant ? "::" + product.variant : "");
    var existing = items.filter(function (it) {
      return it.id === id;
    })[0];

    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      items.push({
        id: id,
        name: product.name,
        variant: product.variant || "",
        price: product.price,
        image: product.image,
        qty: product.qty || 1,
      });
    }
    save();
    render();
    toast(product.name + " añadido al carrito");
  }

  function changeQty(id, delta) {
    items = items
      .map(function (it) {
        if (it.id === id) it.qty += delta;
        return it;
      })
      .filter(function (it) {
        return it.qty > 0;
      });
    save();
    render();
  }

  function remove(id) {
    items = items.filter(function (it) {
      return it.id !== id;
    });
    save();
    render();
  }

  function clear() {
    items = [];
    save();
    render();
  }

  /* ---------- Drawer ---------- */
  var lastFocused = null;

  function openDrawer() {
    if (!els.drawer) return;
    lastFocused = document.activeElement;
    els.drawer.classList.add("is-open");
    els.overlay.classList.add("is-open");
    els.drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    var closeBtn = els.drawer.querySelector("[data-cart-close]");
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    if (!els.drawer) return;
    els.drawer.classList.remove("is-open");
    els.overlay.classList.remove("is-open");
    els.drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function toast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.classList.remove("is-visible");
    }, 2600);
  }

  /* ---------- Checkout simulado ---------- */
  function checkout() {
    if (items.length === 0) return;
    var total = formatPrice(subtotal() + shipping());
    els.body.innerHTML =
      '<div class="checkout-done">' +
      '<div class="tick" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.2"><path d="m5 12.5 4.5 4.5L19 7"/></svg></div>' +
      "<h3>Pedido confirmado</h3>" +
      "<p>Hemos reservado tu pedido de <strong>" + total + "</strong>. Recibirás un correo con el seguimiento en las próximas 24 horas.</p>" +
      '<p style="margin-top:1.5rem"><a class="link-underline amber" href="tienda.html">Seguir explorando</a></p>' +
      "</div>";
    els.foot.hidden = true;
    els.foot.innerHTML = "";
    items = [];
    save();
    renderCount();
  }

  /* ---------- Eventos ---------- */
  function bind() {
    els.openers.forEach(function (btn) {
      btn.addEventListener("click", openDrawer);
    });

    if (els.overlay) els.overlay.addEventListener("click", closeDrawer);

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-cart-close],[data-cart-inc],[data-cart-dec],[data-cart-remove],[data-cart-checkout]");
      if (!t) return;
      if (t.hasAttribute("data-cart-close")) closeDrawer();
      else if (t.hasAttribute("data-cart-inc")) changeQty(t.getAttribute("data-cart-inc"), 1);
      else if (t.hasAttribute("data-cart-dec")) changeQty(t.getAttribute("data-cart-dec"), -1);
      else if (t.hasAttribute("data-cart-remove")) remove(t.getAttribute("data-cart-remove"));
      else if (t.hasAttribute("data-cart-checkout")) checkout();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });

    // Sincroniza el carrito entre pestañas abiertas
    window.addEventListener("storage", function (e) {
      if (e.key === STORAGE_KEY) {
        load();
        render();
      }
    });
  }

  function init() {
    cacheEls();
    load();
    bind();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.EmberCart = {
    add: add,
    remove: remove,
    clear: clear,
    open: openDrawer,
    close: closeDrawer,
    formatPrice: formatPrice,
    getItems: function () {
      return items.slice();
    },
  };
})();
