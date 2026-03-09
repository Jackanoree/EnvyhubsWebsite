document.addEventListener("DOMContentLoaded", function () {
  console.log("JavaScript loaded");

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
  // Hero typewriter effect
  // ---------------------------------------
  const phrases = [
    '"I literally tell everyone they are the raddest parts on my bike."',
    '"Built for the ride of your life."'
  ];

  const target = document.getElementById("typewriter");

  if (target) {
    let phraseIndex = 0;
    let charIndex = 0;
    let typing = true;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (typing) {
        if (charIndex <= currentPhrase.length) {
          target.textContent = currentPhrase.slice(0, charIndex);
          charIndex++;
          setTimeout(typeLoop, 20);
        } else {
          typing = false;
          setTimeout(typeLoop, 1500);
        }
      } else {
        if (charIndex > 1) {
          target.textContent = currentPhrase.slice(0, charIndex);
          charIndex--;
          setTimeout(typeLoop, 20);
        } else {
          target.textContent = "";
          charIndex = 0;
          typing = true;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, 600);
        }
      }
    }

    typeLoop();
  }

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

  function openDynamicModal(imageIndex, images, title, description) {
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
      priceBox.textContent = "";
    }

    currentModalMode = "dynamic";
    currentDynamicImages = images;
    currentDynamicIndex = imageIndex;
    currentDynamicTitle = title || "";
    currentDynamicDescription = description || "";
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
          currentDynamicDescription
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
          currentDynamicDescription
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
    if (!modal || modal.style.display !== "flex") {
      return;
    }

    if (e.key === "Escape") {
      closeModal();
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

  // ---------------------------------------
  // Rims: CSV-driven product cards grouped by image set
  // ---------------------------------------
  const rimColourSelect = document.getElementById("rimColour");
  const rimStatus = document.getElementById("rimStatus");
  const rimGallery = document.getElementById("rimGallery");

  const rimCsvFiles = {
    black: "data/products/black_rims_image_mapping.csv",
    blue: "data/products/blue_rims_image_mapping.csv",
    gold: "data/products/gold_rims_image_mapping.csv",
    silver: "data/products/silver_rims_image_mapping.csv"
  };

  const rimImageFolders = {
    black: "assets/images/rims/black-did-mx-sets",
    blue: "assets/images/rims/blue-did-mx-sets",
    gold: "assets/images/rims/gold-did-mx-sets",
    silver: "assets/images/rims/silver-did-mx-sets"
  };

  const rimCache = {};
  let currentRimProducts = {};

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
          images: []
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

    if (product.images.length === 1) {
      return "1 image available";
    }

    return product.images.length + " images available";
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

    const img = document.createElement("img");
    img.src = thumbnail.url;
    img.alt = product.title;

    const heading = document.createElement("h2");
    heading.textContent = product.title;

    const description = document.createElement("p");
    description.textContent = makeCardDescription(product);

    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(heading);
    card.appendChild(description);

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
      renderRimGallery(productsByCombo);

      if (productCount === 1) {
        setRimStatus("1 product loaded for " + selectedColour + " rims.");
      } else {
        setRimStatus(productCount + " products loaded for " + selectedColour + " rims.");
      }
    } catch (error) {
      console.error(error);
      setRimStatus("Could not load rim products. Check the CSV and image paths in script.js.");
    }
  }

  if (rimColourSelect && rimStatus && rimGallery) {
    rimColourSelect.addEventListener("change", handleRimColourChange);
  }

  // ---------------------------------------
  // Shared click handling
  // ---------------------------------------
  document.addEventListener("click", function (e) {
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

      openDynamicModal(0, product.images, product.title, makeCardDescription(product));
      return;
    }

    const galleryLinks = getGalleryLinksForLink(link);
    const index = galleryLinks.indexOf(link);

    if (index !== -1) {
      openStaticModal(index, galleryLinks);
    }
  });
});