alert("JS loaded!");

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 JavaScript loaded!");

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
      // Skip delay for last character
      target.textContent = "";
      charIndex = 0;
      typing = true;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 600);
    }
  }
}

typeLoop();



  // ---------------------------------------
  // Product Modal Logic
  // ---------------------------------------
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const captionBox = document.getElementById("modal-caption");
  const titleBox = document.getElementById("modal-title");
  const descBox = document.getElementById("modal-description");
  const priceBox = document.getElementById("modal-price");
  const closeBtn = document.querySelector(".modal .close");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const imageLinks = document.querySelectorAll(".product-image-link");

  let currentIndex = -1;

  function openModal(index) {
    const link = imageLinks[index];
    if (!link) return;

    modal.style.display = "flex";
    modalImg.src = link.dataset.large;
    modalImg.alt = link.querySelector("img").alt;

    titleBox.textContent = link.dataset.title || "";
    descBox.textContent = link.dataset.description || "";
    priceBox.textContent = link.dataset.price || "";

    currentIndex = index;
  }

  function closeModal() {
    modal.style.display = "none";
    modalImg.src = "";
    modalImg.alt = "";
    titleBox.textContent = "";
    descBox.textContent = "";
    priceBox.textContent = "";
    currentIndex = -1;
  }

  // Open modal when product image is clicked
  imageLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(index);
    });
  });

  // Close modal with X button
  closeBtn?.addEventListener("click", closeModal);

  // Close modal when clicking outside the image
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Navigation arrows
  function showPrev() {
    if (currentIndex > 0) openModal(currentIndex - 1);
  }

  function showNext() {
    if (currentIndex < imageLinks.length - 1) openModal(currentIndex + 1);
  }

  prevBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });

  nextBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });

  // Keyboard support for modal
  document.addEventListener("keydown", (e) => {
    if (modal.style.display !== "flex") return;

    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  // ---------------------------------------
  // Hero Panels: Animate on Scroll (IntersectionObserver)
  // ---------------------------------------
  const heroPanels = document.querySelectorAll('.hero-panel');
  console.log("✅ Hero panels found:", heroPanels.length);
  heroPanels.forEach(panel => console.log("➡️ Panel:", panel));


  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px 0px -10% 0px", // trigger slightly before it hits
    threshold: 0.05 // minimal intersection required
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log("🎯 Making visible:", entry.target);
          entry.target.classList.add('visible');
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    heroPanels.forEach(panel => {
      observer.observe(panel);
      console.log("🔍 Observing:", panel);
    });
  } else {
    console.warn("⚠️ IntersectionObserver not supported — applying fallback.");
    heroPanels.forEach(panel => {
      panel.classList.add('visible');
      console.log("🟢 Fallback applied to:", panel);
    });
  }


  // ---------------------------------------
  // Theme Toggle: Dark / Light
  // ---------------------------------------
  const themeToggle = document.getElementById('themeToggle');

  if (themeToggle) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    // Set initial theme on load
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.add('dark-theme');
      themeToggle.checked = true;
    }

    // Toggle theme on user switch
    themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }
}); // <-- Add this to properly close the DOMContentLoaded function!
