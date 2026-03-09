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
  // Product Modal Logic
  // ---------------------------------------
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const titleBox = document.getElementById("modal-title");
  const descBox = document.getElementById("modal-description");
  const priceBox = document.getElementById("modal-price");
  const closeBtn = document.querySelector(".modal .close");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentIndex = -1;
  let currentGalleryLinks = [];

  function getGalleryLinksForLink(link) {
    const gallery = link.closest(".product-grid");
    if (!gallery) {
      return [];
    }

    return Array.from(gallery.querySelectorAll(".product-image-link"));
  }

  function openModal(index, galleryLinks) {
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

    currentGalleryLinks = galleryLinks;
    currentIndex = index;
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

    currentIndex = -1;
    currentGalleryLinks = [];
  }

  function showPrev() {
    if (currentIndex > 0) {
      openModal(currentIndex - 1, currentGalleryLinks);
    }
  }

  function showNext() {
    if (currentIndex < currentGalleryLinks.length - 1) {
      openModal(currentIndex + 1, currentGalleryLinks);
    }
  }

  // Event delegation so it works for both static cards and JS-built rim cards
  document.addEventListener("click", function (e) {
    const link = e.target.closest(".product-image-link");

    if (!link) {
      return;
    }

    e.preventDefault();

    const galleryLinks = getGalleryLinksForLink(link);
    const index = galleryLinks.indexOf(link);

    if (index !== -1) {
      openModal(index, galleryLinks);
    }
  });

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
  // Rims: CSV-driven gallery
  // ---------------------------------------
  const rimColourSelect = document.getElementById("rimColour");
  const rimStatus = document.getElementById("rimStatus");
  const rimGallery = document.getElementById("rimGallery");

  // CHANGE THESE PATHS if your CSVs live somewhere else
  const rimCsvFiles = {
    black: "assets/images/products/rims/black/black_rims_image_mapping.csv",
    blue: "assets/images/products/rims/blue/blue_rims_image_mapping.csv",
    gold: "assets/images/products/rims/gold/gold_rims_image_mapping.csv",
    silver: "assets/images/products/rims/silver/silver_rims_image_mapping.csv"
  };

  const rimCache = {};

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

  function looksLikeImagePath(value) {
    if (!value) {
      return false;
    }

    const trimmed = value.trim().toLowerCase();

    return (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("images/") ||
      trimmed.startsWith("assets/") ||
      trimmed.startsWith("./") ||
      trimmed.endsWith(".jpg") ||
      trimmed.endsWith(".jpeg") ||
      trimmed.endsWith(".png") ||
      trimmed.endsWith(".webp") ||
      trimmed.endsWith(".gif")
    );
  }

  function parseCsvLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  function parseCsv(text) {
    const lines = text
      .split(/\r?\n/)
      .map(function (line) {
        return line.trim();
      })
      .filter(function (line) {
        return line !== "";
      });

    return lines.map(parseCsvLine);
  }

  function extractImagesFromCsvText(csvText) {
    const rows = parseCsv(csvText);
    const imageSet = new Set();

    rows.forEach(function (row) {
      row.forEach(function (cell) {
        const value = String(cell || "").trim();

        if (looksLikeImagePath(value)) {
          imageSet.add(value);
        }
      });
    });

    return Array.from(imageSet);
  }

  function makeNiceColourName(colourValue) {
    if (!colourValue) {
      return "";
    }

    return colourValue.charAt(0).toUpperCase() + colourValue.slice(1);
  }

  function buildRimCard(imageSrc, colourName, imageNumber) {
    const card = document.createElement("div");
    card.className = "product-card";

    const link = document.createElement("a");
    link.href = "#";
    link.className = "product-image-link";
    link.dataset.large = imageSrc;
    link.dataset.title = colourName + " Rim";
    link.dataset.description = "Gallery image " + imageNumber;
    link.dataset.price = "";

    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = colourName + " Rim image " + imageNumber;

    const heading = document.createElement("h2");
    heading.textContent = colourName + " Rim";

    const description = document.createElement("p");
    description.textContent = "Gallery image " + imageNumber;

    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(heading);
    card.appendChild(description);

    return card;
  }

  function renderRimGallery(images, colourValue) {
    if (!rimGallery) {
      return;
    }

    clearRimGallery();

    const colourName = makeNiceColourName(colourValue);

    images.forEach(function (imageSrc, index) {
      const card = buildRimCard(imageSrc, colourName, index + 1);
      rimGallery.appendChild(card);
    });
  }

  async function loadRimImagesForColour(colourValue) {
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
    const images = extractImagesFromCsvText(csvText);

    rimCache[colourValue] = images;
    return images;
  }

  async function handleRimColourChange() {
    if (!rimColourSelect) {
      return;
    }

    const selectedColour = rimColourSelect.value;

    clearRimGallery();

    if (!selectedColour) {
      setRimStatus("Select a rim colour to view available images.");
      return;
    }

    setRimStatus("Loading " + selectedColour + " rim images...");

    try {
      const images = await loadRimImagesForColour(selectedColour);

      if (!images.length) {
        setRimStatus("No images found for " + selectedColour + " rims.");
        return;
      }

      renderRimGallery(images, selectedColour);
      setRimStatus(images.length + " image(s) loaded for " + selectedColour + " rims.");
    } catch (error) {
      console.error(error);
      setRimStatus("Could not load rim images. Check your CSV file path in script.js.");
    }
  }

  if (rimColourSelect && rimStatus && rimGallery) {
    rimColourSelect.addEventListener("change", handleRimColourChange);
  }
});