document.addEventListener("DOMContentLoaded", function () {
  // ---------------------------------------
  // Set dynamic footer year
  // ---------------------------------------
  const yearSpan = document.getElementById("footerYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ---------------------------------------
  // Back to Top button show/hide on scroll
  // ---------------------------------------
  window.addEventListener("scroll", function () {
    const button = document.getElementById("backToTop");
    if (button) {
      button.style.display = window.scrollY > 300 ? "block" : "none";
    }
  });

  // ---------------------------------------
  // Modal Logic
  // ---------------------------------------
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const titleBox = document.getElementById("modal-title");
  const descBox = document.getElementById("modal-description");
  const priceBox = document.getElementById("modal-price");
  const closeBtn = document.querySelector(".modal .close");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentStaticLinks = [];
  let currentStaticIndex = -1;

  let currentDynamicImages = [];
  let currentDynamicIndex = -1;
  let currentDynamicTitle = "";
  let currentDynamicDescription = "";
  let currentDynamicPrice = "";
  let currentModalMode = "";

  function openStaticModal(index, galleryLinks) {
    if (!galleryLinks || !galleryLinks[index]) {
      return;
    }

    const link = galleryLinks[index];
    const img = link.querySelector("img");

    if (!modal || !modalImg || !img) {
      return;
    }

    modal.style.display = "flex";
    modalImg.src = link.dataset.large || img.src;
    modalImg.alt = img.alt || "";

    if (titleBox) {
      titleBox.textContent = link.dataset.title || "";
    }

    if (descBox) {
      descBox.textContent = link.dataset.description || "";
    }

    if (priceBox) {
      priceBox.textContent = link.dataset.price || "";
    }

    currentModalMode = "static";
    currentStaticLinks = galleryLinks;
    currentStaticIndex = index;
    currentDynamicImages = [];
    currentDynamicIndex = -1;
  }

  function openDynamicModal(imageIndex, images, title, description, priceText) {
    if (!images || !images[imageIndex]) {
      return;
    }

    if (!modal || !modalImg) {
      return;
    }

    const imageObj = images[imageIndex];

    modal.style.display = "flex";
    modalImg.src = imageObj.url;
    modalImg.alt = title || "";

    if (titleBox) {
      titleBox.textContent = title || "";
    }

    if (descBox) {
      let typeLabel = imageObj.type ? "Image type: " + imageObj.type : "";
      descBox.textContent = description || typeLabel;
    }

    if (priceBox) {
      priceBox.textContent = priceText || "";
    }

    currentModalMode = "dynamic";
    currentDynamicImages = images;
    currentDynamicIndex = imageIndex;
    currentDynamicTitle = title || "";
    currentDynamicDescription = description || "";
    currentDynamicPrice = priceText || "";
    currentStaticLinks = [];
    currentStaticIndex = -1;
  }

  function closeModal() {
    if (!modal || !modalImg) {
      return;
    }

    modal.style.display = "none";
    modalImg.src = "";
    modalImg.alt = "";

    if (titleBox) {
      titleBox.textContent = "";
    }

    if (descBox) {
      descBox.textContent = "";
    }

    if (priceBox) {
      priceBox.textContent = "";
    }

    currentStaticLinks = [];
    currentStaticIndex = -1;
    currentDynamicImages = [];
    currentDynamicIndex = -1;
    currentDynamicTitle = "";
    currentDynamicDescription = "";
    currentDynamicPrice = "";
    currentModalMode = "";
  }

  function showPrev() {
    if (currentModalMode === "static") {
      if (currentStaticIndex > 0) {
        openStaticModal(currentStaticIndex - 1, currentStaticLinks);
      }
      return;
    }

    if (currentModalMode === "dynamic") {
      if (currentDynamicIndex > 0) {
        openDynamicModal(
          currentDynamicIndex - 1,
          currentDynamicImages,
          currentDynamicTitle,
          currentDynamicDescription,
          currentDynamicPrice
        );
      }
    }
  }

  function showNext() {
    if (currentModalMode === "static") {
      if (currentStaticIndex < currentStaticLinks.length - 1) {
        openStaticModal(currentStaticIndex + 1, currentStaticLinks);
      }
      return;
    }

    if (currentModalMode === "dynamic") {
      if (currentDynamicIndex < currentDynamicImages.length - 1) {
        openDynamicModal(
          currentDynamicIndex + 1,
          currentDynamicImages,
          currentDynamicTitle,
          currentDynamicDescription,
          currentDynamicPrice
        );
      }
    }
  }

  function getGalleryLinksForLink(link) {
    const gallery = link.closest(".product-grid");
    if (!gallery) {
      return [];
    }

    return Array.from(gallery.querySelectorAll(".product-image-link")).filter(function (item) {
      return !item.dataset.sku;
    });
  }

  closeBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  prevBtn?.addEventListener("click", function (e) {
    e.stopPropagation();
    showPrev();
  });

  nextBtn?.addEventListener("click", function (e) {
    e.stopPropagation();
    showNext();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (modal && modal.style.display === "flex") {
        closeModal();
      }
      closeBasketDrawer();
      return;
    }

    if (!modal || modal.style.display !== "flex") {
      return;
    }

    if (e.key === "ArrowLeft") {
      showPrev();
    }

    if (e.key === "ArrowRight") {
      showNext();
    }
  });

  // ---------------------------------------
  // Hero Panels: Animate on Scroll
  // ---------------------------------------
  const heroPanels = document.querySelectorAll(".hero-panel");

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.05
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries, observerInstance) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    heroPanels.forEach(function (panel) {
      observer.observe(panel);
    });
  } else {
    heroPanels.forEach(function (panel) {
      panel.classList.add("visible");
    });
  }

  // ---------------------------------------
  // Theme Toggle: Dark / Light
  // ---------------------------------------
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.body.classList.add("dark-theme");
      themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", function () {
      if (themeToggle.checked) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
      }
    });
  }

  const galleryCarouselImage = document.getElementById("galleryCarouselImage");
  const galleryCaption = document.getElementById("galleryCaption");
  const galleryPrevBtn = document.getElementById("galleryPrevBtn");
  const galleryNextBtn = document.getElementById("galleryNextBtn");
  const galleryThumbButtons = Array.from(document.querySelectorAll("[data-gallery-slide]"));

  // ---------------------------------------
  // Gallery carousel
  // ---------------------------------------
  if (galleryCarouselImage && galleryThumbButtons.length) {
    let gallerySlideIndex = Math.max(
      0,
      galleryThumbButtons.findIndex(function (button) {
        return button.classList.contains("is-active");
      })
    );
    let galleryAutoTimer = null;

    function showGallerySlide(nextIndex) {
      if (!galleryThumbButtons.length) {
        return;
      }

      if (nextIndex < 0) {
        gallerySlideIndex = galleryThumbButtons.length - 1;
      } else if (nextIndex >= galleryThumbButtons.length) {
        gallerySlideIndex = 0;
      } else {
        gallerySlideIndex = nextIndex;
      }

      const activeButton = galleryThumbButtons[gallerySlideIndex];
      const src = activeButton.dataset.src || "";
      const alt = activeButton.dataset.alt || "Gallery image";

      if (src) {
        galleryCarouselImage.src = src;
      }
      galleryCarouselImage.alt = alt;

      if (galleryCaption) {
        galleryCaption.textContent = alt;
      }

      galleryThumbButtons.forEach(function (button, idx) {
        const isActive = idx === gallerySlideIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function restartGalleryAutoplay() {
      if (galleryAutoTimer) {
        window.clearInterval(galleryAutoTimer);
      }

      galleryAutoTimer = window.setInterval(function () {
        showGallerySlide(gallerySlideIndex + 1);
      }, 4500);
    }

    galleryPrevBtn?.addEventListener("click", function () {
      showGallerySlide(gallerySlideIndex - 1);
      restartGalleryAutoplay();
    });

    galleryNextBtn?.addEventListener("click", function () {
      showGallerySlide(gallerySlideIndex + 1);
      restartGalleryAutoplay();
    });

    galleryThumbButtons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        showGallerySlide(index);
        restartGalleryAutoplay();
      });
    });

    showGallerySlide(gallerySlideIndex);
    restartGalleryAutoplay();
  }

  // ---------------------------------------
  // Rims: CSV-driven product cards grouped by image set
  // ---------------------------------------
  const rimColourSelect = document.getElementById("rimColour");
  const rimHubFilter = document.getElementById("rimHubFilter");
  const rimSpokeFilter = document.getElementById("rimSpokeFilter");
  const rimStatus = document.getElementById("rimStatus");
  const rimGallery = document.getElementById("rimGallery");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartEmptyState = document.getElementById("cartEmptyState");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const basketCountBadge = document.getElementById("basketCountBadge");
  const basketDrawer = document.getElementById("basketDrawer");
  const basketOverlay = document.getElementById("basketOverlay");
  const closeBasketBtn = document.getElementById("closeBasketBtn");
  const openBasketButtons = document.querySelectorAll("[data-open-basket]");
  const orderSummaryItems = document.getElementById("orderSummaryItems");
  const orderSummaryEmpty = document.getElementById("orderSummaryEmpty");
  const orderSummaryCount = document.getElementById("orderSummaryCount");
  const orderSummaryTotal = document.getElementById("orderSummaryTotal");
  const cartStorageKey = "envy_cart_v1";
  let basketToastTimer = null;

  const rimCsvFiles = {
    black: "data/products/sorted/black_rims_image_mapping.csv",
    blue: "data/products/sorted/blue_rims_image_mapping.csv",
    gold: "data/products/sorted/gold_rims_image_mapping.csv",
    silver: "data/products/sorted/silver_rims_image_mapping.csv"
  };

  const rimImageFolders = {
    black: "assets/images/rims/black-did-mx-sets",
    blue: "assets/images/rims/blue-did-mx-sets",
    gold: "assets/images/rims/gold-did-mx-sets",
    silver: "assets/images/rims/silver-did-mx-sets"
  };

  const rimCache = {};
  let currentRimProducts = {};
  let cartState = {};

  function setRimStatus(message) {
    if (rimStatus) {
      rimStatus.textContent = message;
    }
  }

  function clearRimGallery() {
    if (rimGallery) {
      rimGallery.innerHTML = "";
    }
  }

  function splitCsvLine(line) {
    const out = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }

      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }

      if (ch === "," && !inQuotes) {
        out.push(cur.trim());
        cur = "";
        continue;
      }

      cur += ch;
    }

    out.push(cur.trim());
    return out;
  }

  function parseCsvToRows(text) {
    const lines = text
      .split(/\r?\n/)
      .filter(function (line) {
        return line.trim() !== "";
      });

    if (lines.length < 2) {
      return [];
    }

    const headers = splitCsvLine(lines[0]).map(function (header) {
      return String(header || "").replace(/^\uFEFF/, "").trim();
    });

    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = splitCsvLine(lines[i]);

      if (values.length < headers.length) {
        continue;
      }

      const row = {};

      for (let h = 0; h < headers.length; h++) {
        row[headers[h]] = values[h] || "";
      }

      rows.push(row);
    }

    return rows;
  }

  function getImageTypeFromFilename(filename) {
    const upper = String(filename || "").toUpperCase();

    if (upper.includes("PAIR")) return "PAIR";
    if (upper.includes("HERO")) return "HERO";
    if (upper.includes("FRONT")) return "FRONT";
    if (upper.includes("REAR")) return "REAR";

    return "OTHER";
  }

  function getImageSortWeight(type) {
    if (type === "PAIR") return 1;
    if (type === "HERO") return 2;
    if (type === "FRONT") return 3;
    if (type === "REAR") return 4;
    return 5;
  }

  function normaliseImageUrl(row, colourValue) {
    const localFilename = String(row["Local Filename"] || "").trim();
    const folder = rimImageFolders[colourValue] || "";

    if (!localFilename || !folder) {
      return "";
    }

    return folder + "/" + localFilename;
  }

  function getComboKeyFromFilename(filename, colourValue) {
    const name = String(filename || "").trim();

    if (!name) {
      return "";
    }

    let cleaned = name
      .replace(/\.(jpg|jpeg|png|webp|gif)$/i, "")
      .replace(/^ENVY[-_]/i, "")
      .replace(/^Envy[-_]/i, "")
      .replace(/^DID[-_]/i, "")
      .replace(/^DID/i, "")
      .replace(/^[-_]+/, "")
      .replace(/[-_](PAIR|FRONT|REAR|HERO).*$/i, "")
      .replace(/[()]/g, "")
      .replace(/\s+/g, "_");

    cleaned = cleaned.replace(/__+/g, "_");

    const upper = cleaned.toUpperCase();
    const colourUpper = String(colourValue || "").toUpperCase();

    if (upper.includes(colourUpper + "_")) {
      return upper.substring(upper.indexOf(colourUpper + "_"));
    }

    if (upper.startsWith(colourUpper)) {
      return upper;
    }

    return upper;
  }

  function makeNiceLabelFromComboKey(comboKey) {
    if (!comboKey) {
      return "Rim Set";
    }

    return comboKey
      .split(/[-_]+/)
      .filter(function (part) {
        return part.trim() !== "";
      })
      .map(function (part) {
        const lower = part.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(" / ");
  }

  function formatPriceLabel(raw) {
    const s = String(raw || "").trim();
    if (!s) {
      return "";
    }

    const n = Number(s);
    if (!Number.isNaN(n) && Number.isFinite(n)) {
      return "£" + n.toFixed(2);
    }

    return s;
  }

  function parsePriceToNumber(raw) {
    const clean = String(raw || "").replace(/[^\d.]+/g, "");
    const value = Number(clean);
    return Number.isFinite(value) ? value : 0;
  }

  function getCartItemCount(state) {
    return Object.keys(state).reduce(function (sum, id) {
      const item = state[id];
      return sum + (item && item.qty ? item.qty : 0);
    }, 0);
  }

  function updateGlobalBasketBadge() {
    if (!basketCountBadge) {
      return;
    }

    basketCountBadge.textContent = String(getCartItemCount(cartState));
  }

  function getBasketToastElement() {
    let toast = document.getElementById("basketToast");
    if (toast) {
      return toast;
    }

    toast = document.createElement("div");
    toast.id = "basketToast";
    toast.className = "basket-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    return toast;
  }

  function showAddedToBasketFeedback(sourceButton, itemTitle) {
    if (basketCountBadge) {
      basketCountBadge.classList.remove("basket-badge-pop");
      void basketCountBadge.offsetWidth;
      basketCountBadge.classList.add("basket-badge-pop");
    }

    if (sourceButton) {
      sourceButton.classList.remove("is-added");
      void sourceButton.offsetWidth;
      sourceButton.classList.add("is-added");
      window.setTimeout(function () {
        sourceButton.classList.remove("is-added");
      }, 450);
    }

    const toast = getBasketToastElement();
    const title = String(itemTitle || "Item");
    toast.textContent = title + " added to basket";
    toast.classList.add("is-visible");

    if (basketToastTimer) {
      window.clearTimeout(basketToastTimer);
    }

    basketToastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1500);
  }

  function openBasketDrawer() {
    if (!basketDrawer || !basketOverlay) {
      return;
    }

    basketDrawer.classList.add("is-open");
    basketOverlay.classList.add("is-open");
    basketDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("basket-open");
  }

  function closeBasketDrawer() {
    if (!basketDrawer || !basketOverlay) {
      return;
    }

    basketDrawer.classList.remove("is-open");
    basketOverlay.classList.remove("is-open");
    basketDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("basket-open");
  }

  function saveCartState() {
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(cartState));
    } catch (error) {
      console.warn("Could not save basket state.", error);
    }
  }

  function loadCartState() {
    try {
      const raw = window.localStorage.getItem(cartStorageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        cartState = parsed;
      }
    } catch (error) {
      console.warn("Could not load basket state.", error);
      cartState = {};
    }
  }

  function buildCartItemElement(id, item) {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.dataset.cartId = id;

    const title = document.createElement("p");
    title.className = "cart-item-title";
    title.textContent = item.title || "Product";

    const meta = document.createElement("p");
    meta.className = "cart-item-meta";
    meta.textContent = (item.priceLabel || "£0.00") + " each";

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";

    const decBtn = document.createElement("button");
    decBtn.type = "button";
    decBtn.className = "cart-qty-btn";
    decBtn.dataset.cartAction = "decrease";
    decBtn.dataset.cartId = id;
    decBtn.textContent = "-";

    const qty = document.createElement("span");
    qty.className = "cart-qty";
    qty.textContent = String(item.qty || 1);

    const incBtn = document.createElement("button");
    incBtn.type = "button";
    incBtn.className = "cart-qty-btn";
    incBtn.dataset.cartAction = "increase";
    incBtn.dataset.cartId = id;
    incBtn.textContent = "+";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "cart-remove-btn";
    removeBtn.dataset.cartAction = "remove";
    removeBtn.dataset.cartId = id;
    removeBtn.textContent = "Remove";

    controls.appendChild(decBtn);
    controls.appendChild(qty);
    controls.appendChild(incBtn);
    controls.appendChild(removeBtn);

    row.appendChild(title);
    row.appendChild(meta);
    row.appendChild(controls);
    return row;
  }

  function renderCart() {
    updateGlobalBasketBadge();

    if (!cartItemsContainer || !cartCount || !cartTotal || !cartEmptyState) {
      renderOrderSummary();
      return;
    }

    cartItemsContainer.innerHTML = "";

    const ids = Object.keys(cartState);
    let totalQty = 0;
    let totalPrice = 0;

    ids.forEach(function (id) {
      const item = cartState[id];
      if (!item || !item.qty) {
        return;
      }

      totalQty += item.qty;
      totalPrice += item.qty * (item.price || 0);
      cartItemsContainer.appendChild(buildCartItemElement(id, item));
    });

    cartCount.textContent = String(totalQty);
    cartTotal.textContent = "£" + totalPrice.toFixed(2);
    cartEmptyState.style.display = totalQty ? "none" : "block";
    renderOrderSummary();
  }

  function renderOrderSummary() {
    if (!orderSummaryItems || !orderSummaryEmpty || !orderSummaryCount || !orderSummaryTotal) {
      return;
    }

    orderSummaryItems.innerHTML = "";

    const ids = Object.keys(cartState);
    let totalQty = 0;
    let totalPrice = 0;

    ids.forEach(function (id) {
      const item = cartState[id];
      if (!item || !item.qty) {
        return;
      }

      totalQty += item.qty;
      totalPrice += item.qty * (item.price || 0);
      orderSummaryItems.appendChild(buildCartItemElement(id, item));
    });

    orderSummaryCount.textContent = String(totalQty);
    orderSummaryTotal.textContent = "£" + totalPrice.toFixed(2);
    orderSummaryEmpty.style.display = totalQty ? "none" : "block";
  }

  function addToCart(item, sourceButton) {
    const id = String(item.id || "").trim();
    if (!id) {
      return;
    }

    if (!cartState[id]) {
      cartState[id] = {
        title: item.title || "Product",
        price: item.price || 0,
        priceLabel: item.priceLabel || "£0.00",
        qty: 0
      };
    }

    cartState[id].qty += 1;
    saveCartState();
    renderCart();
    showAddedToBasketFeedback(sourceButton, item.title);
  }

  function updateCartQuantity(id, nextQty) {
    if (!cartState[id]) {
      return;
    }

    if (nextQty <= 0) {
      delete cartState[id];
    } else {
      cartState[id].qty = nextQty;
    }

    saveCartState();
    renderCart();
  }

  function clearCart() {
    cartState = {};
    saveCartState();
    renderCart();
  }

  function buildCartItemFromButton(button) {
    const rawTitle = button.dataset.title || "";
    const title = rawTitle.replace(/&amp;/g, "&") || "Product";
    const rawPrice = button.dataset.price || "";
    const priceLabel = formatPriceLabel(rawPrice) || "£0.00";
    const price = parsePriceToNumber(rawPrice);

    return {
      id: button.dataset.cartId || title.toLowerCase().replace(/\s+/g, "-"),
      title: title,
      price: price,
      priceLabel: priceLabel
    };
  }

  function buildProductsByCombo(rows, colourValue) {
    const productsByCombo = {};

    rows.forEach(function (row) {
      const localFilename = String(row["Local Filename"] || "").trim();
      const imageUrl = normaliseImageUrl(row, colourValue);

      if (!localFilename || !imageUrl) {
        return;
      }

      const comboKey = getComboKeyFromFilename(localFilename, colourValue);

      if (!comboKey) {
        return;
      }

      if (!productsByCombo[comboKey]) {
        productsByCombo[comboKey] = {
          sku: comboKey,
          title: makeNiceLabelFromComboKey(comboKey),
          images: [],
          hubColour: String(row["Hub colour"] || "").trim(),
          spokeColour: String(row["Spoke colour"] || "").trim(),
          rimColourLabel: String(row["Rim colour"] || "").trim(),
          priceRaw: String(row["Price"] || "").trim()
        };
      }

      const alreadyExists = productsByCombo[comboKey].images.some(function (image) {
        return image.url === imageUrl;
      });

      if (alreadyExists) {
        return;
      }

      productsByCombo[comboKey].images.push({
        url: imageUrl,
        filename: localFilename,
        type: getImageTypeFromFilename(localFilename)
      });
    });

    Object.keys(productsByCombo).forEach(function (key) {
      productsByCombo[key].images.sort(function (a, b) {
        const typeDifference = getImageSortWeight(a.type) - getImageSortWeight(b.type);

        if (typeDifference !== 0) {
          return typeDifference;
        }

        return a.filename.localeCompare(b.filename);
      });
    });

    return productsByCombo;
  }

  function getThumbnailImage(product) {
    if (!product || !product.images || !product.images.length) {
      return null;
    }

    return product.images[0];
  }

  function makeCardDescription(product) {
    if (!product || !product.images) {
      return "";
    }

    let line =
      product.images.length === 1 ? "1 image available" : product.images.length + " images available";

    const parts = [];

    if (product.hubColour) {
      parts.push("Hub: " + product.hubColour);
    }

    if (product.spokeColour) {
      parts.push("Spokes: " + product.spokeColour);
    }

    const priceLabel = formatPriceLabel(product.priceRaw);

    if (priceLabel) {
      parts.push(priceLabel);
    }

    if (parts.length) {
      line += " · " + parts.join(" · ");
    }

    return line;
  }

  function buildRimCard(product) {
    const thumbnail = getThumbnailImage(product);

    if (!thumbnail) {
      return null;
    }

    const card = document.createElement("div");
    card.className = "product-card";

    const link = document.createElement("a");
    link.href = "#";
    link.className = "product-image-link";
    link.dataset.sku = product.sku;
    link.dataset.title = product.title;
    link.dataset.description = makeCardDescription(product);
    link.dataset.price = formatPriceLabel(product.priceRaw);

    const img = document.createElement("img");
    img.src = thumbnail.url;
    img.alt = product.title;

    const heading = document.createElement("h2");
    heading.textContent = product.title;

    const description = document.createElement("p");
    description.textContent = makeCardDescription(product);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "add-to-cart-btn";
    addBtn.dataset.cartId = "rim-" + product.sku;
    addBtn.dataset.title = product.title;
    addBtn.dataset.price = formatPriceLabel(product.priceRaw);
    addBtn.textContent = "Add to basket";

    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(heading);
    card.appendChild(description);
    card.appendChild(addBtn);

    return card;
  }

  function renderRimGallery(productsByCombo) {
    if (!rimGallery) {
      return;
    }

    clearRimGallery();

    const productList = Object.values(productsByCombo).sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });

    productList.forEach(function (product) {
      const card = buildRimCard(product);

      if (card) {
        rimGallery.appendChild(card);
      }
    });
  }

  function collectUniqueFacetValues(productsByCombo, field) {
    const seen = {};

    Object.keys(productsByCombo).forEach(function (key) {
      const value = String(productsByCombo[key][field] || "").trim();

      if (value) {
        seen[value] = true;
      }
    });

    return Object.keys(seen).sort(function (a, b) {
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
  }

  function resetFacetSelect(selectEl, placeholderText) {
    if (!selectEl) {
      return;
    }

    selectEl.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholderText;
    selectEl.appendChild(opt);
  }

  function populateRimFacetSelects(productsByCombo) {
    if (!rimHubFilter || !rimSpokeFilter) {
      return;
    }

    const hubs = collectUniqueFacetValues(productsByCombo, "hubColour");
    const spokes = collectUniqueFacetValues(productsByCombo, "spokeColour");

    resetFacetSelect(rimHubFilter, "All hub colours");
    hubs.forEach(function (value) {
      const o = document.createElement("option");
      o.value = value;
      o.textContent = value;
      rimHubFilter.appendChild(o);
    });

    resetFacetSelect(rimSpokeFilter, "All spoke colours");
    spokes.forEach(function (value) {
      const o = document.createElement("option");
      o.value = value;
      o.textContent = value;
      rimSpokeFilter.appendChild(o);
    });

    rimHubFilter.disabled = hubs.length === 0;
    rimSpokeFilter.disabled = spokes.length === 0;
    rimHubFilter.setAttribute("aria-disabled", rimHubFilter.disabled ? "true" : "false");
    rimSpokeFilter.setAttribute("aria-disabled", rimSpokeFilter.disabled ? "true" : "false");
  }

  function filterRimProductsByFacets(productsByCombo, hubValue, spokeValue) {
    const filtered = {};

    Object.keys(productsByCombo).forEach(function (key) {
      const product = productsByCombo[key];

      if (hubValue && product.hubColour !== hubValue) {
        return;
      }

      if (spokeValue && product.spokeColour !== spokeValue) {
        return;
      }

      filtered[key] = product;
    });

    return filtered;
  }

  function updateRimGalleryView() {
    const colourValue = rimColourSelect ? rimColourSelect.value : "";
    const total = Object.keys(currentRimProducts).length;

    if (!total || !colourValue) {
      return;
    }

    const hubValue = rimHubFilter ? rimHubFilter.value : "";
    const spokeValue = rimSpokeFilter ? rimSpokeFilter.value : "";
    const filtered = filterRimProductsByFacets(currentRimProducts, hubValue, spokeValue);
    const shown = Object.keys(filtered).length;

    renderRimGallery(filtered);

    if (!shown) {
      setRimStatus("No products match the selected filters.");
      return;
    }

    if (shown === total && !hubValue && !spokeValue) {
      if (shown === 1) {
        setRimStatus("1 product loaded for " + colourValue + " rims.");
      } else {
        setRimStatus(shown + " products loaded for " + colourValue + " rims.");
      }
    } else {
      setRimStatus("Showing " + shown + " of " + total + " products.");
    }
  }

  function disableRimSubfilters() {
    if (rimHubFilter) {
      resetFacetSelect(rimHubFilter, "All hub colours");
      rimHubFilter.disabled = true;
      rimHubFilter.setAttribute("aria-disabled", "true");
    }

    if (rimSpokeFilter) {
      resetFacetSelect(rimSpokeFilter, "All spoke colours");
      rimSpokeFilter.disabled = true;
      rimSpokeFilter.setAttribute("aria-disabled", "true");
    }
  }

  async function loadRimProductsForColour(colourValue) {
    if (rimCache[colourValue]) {
      return rimCache[colourValue];
    }

    const filePath = rimCsvFiles[colourValue];

    if (!filePath) {
      throw new Error("No CSV file configured for colour: " + colourValue);
    }

    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error("Could not load CSV file: " + filePath);
    }

    const csvText = await response.text();
    const rows = parseCsvToRows(csvText);
    const productsByCombo = buildProductsByCombo(rows, colourValue);

    rimCache[colourValue] = productsByCombo;
    return productsByCombo;
  }

  async function handleRimColourChange() {
    if (!rimColourSelect) {
      return;
    }

    const selectedColour = rimColourSelect.value;

    clearRimGallery();
    currentRimProducts = {};
    disableRimSubfilters();

    if (!selectedColour) {
      setRimStatus("Select a rim colour to view available products.");
      return;
    }

    setRimStatus("Loading " + selectedColour + " rim products...");

    try {
      const productsByCombo = await loadRimProductsForColour(selectedColour);
      const productCount = Object.keys(productsByCombo).length;

      if (!productCount) {
        setRimStatus("No products found for " + selectedColour + " rims.");
        return;
      }

      currentRimProducts = productsByCombo;
      populateRimFacetSelects(productsByCombo);
      updateRimGalleryView();
    } catch (error) {
      console.error(error);
      if (window.location.protocol === "file:") {
        setRimStatus(
          "Rim CSVs can't load when you open this page as a file (file://). Run a local server from the project folder, e.g. PowerShell: python -m http.server 8000 — then open http://localhost:8000/products.html"
        );
      } else {
        setRimStatus("Could not load rim products. Check the CSV and image paths in script.js.");
      }
    }
  }

  if (rimColourSelect && rimStatus && rimGallery) {
    rimColourSelect.addEventListener("change", handleRimColourChange);

    if (rimHubFilter) {
      rimHubFilter.addEventListener("change", updateRimGalleryView);
    }

    if (rimSpokeFilter) {
      rimSpokeFilter.addEventListener("change", updateRimGalleryView);
    }
  }

  // ---------------------------------------
  // Basket UI
  // ---------------------------------------
  loadCartState();
  renderCart();
  updateGlobalBasketBadge();

  clearCartBtn?.addEventListener("click", clearCart);
  closeBasketBtn?.addEventListener("click", closeBasketDrawer);
  basketOverlay?.addEventListener("click", closeBasketDrawer);
  openBasketButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      openBasketDrawer();
    });
  });

  window.addEventListener("storage", function (event) {
    if (event.key !== cartStorageKey) {
      return;
    }

    loadCartState();
    renderCart();
  });

  // ---------------------------------------
  // Shared click handling
  // ---------------------------------------
  document.addEventListener("click", function (e) {
    const cartActionBtn = e.target.closest("[data-cart-action]");
    if (cartActionBtn) {
      const id = cartActionBtn.dataset.cartId || "";
      const action = cartActionBtn.dataset.cartAction || "";
      const existing = cartState[id];

      if (existing) {
        if (action === "increase") {
          updateCartQuantity(id, existing.qty + 1);
        } else if (action === "decrease") {
          updateCartQuantity(id, existing.qty - 1);
        } else if (action === "remove") {
          updateCartQuantity(id, 0);
        }
      }
      return;
    }

    const addToCartBtn = e.target.closest(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCart(buildCartItemFromButton(addToCartBtn), addToCartBtn);
      return;
    }

    const link = e.target.closest(".product-image-link");

    if (!link) {
      return;
    }

    e.preventDefault();

    const sku = link.dataset.sku;

    if (sku) {
      const product = currentRimProducts[sku];

      if (!product || !product.images || !product.images.length) {
        return;
      }

      openDynamicModal(
        0,
        product.images,
        product.title,
        makeCardDescription(product),
        formatPriceLabel(product.priceRaw)
      );
      return;
    }

    const galleryLinks = getGalleryLinksForLink(link);
    const index = galleryLinks.indexOf(link);

    if (index !== -1) {
      openStaticModal(index, galleryLinks);
    }
  });
});