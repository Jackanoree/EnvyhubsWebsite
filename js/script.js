document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 JavaScript loaded!");

  // Set footer year
  const yearSpan = document.getElementById("footerYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Back to Top button logic
  window.addEventListener("scroll", function () {
    const button = document.getElementById("backToTop");
    if (button) {
      button.style.display = window.scrollY > 300 ? "block" : "none";
    }
  });

  // Modal logic
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const caption = document.getElementById("modal-caption");
  const closeBtn = document.querySelector(".modal .close");
  const imageLinks = document.querySelectorAll(".product-image-link");

  if (modal && modalImg && closeBtn && caption) {
    let currentIndex = -1;

    function openModal(index) {
      const link = imageLinks[index];
      const largeSrc = link.dataset.large;
      const altText = link.querySelector("img").alt;

      modalImg.src = largeSrc;
      caption.textContent = altText;
      modal.style.display = "flex";
      currentIndex = index;
    }

    imageLinks.forEach((link, index) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(index);
        console.log("Image shown:", link.dataset.large);
      });
    });


    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      modalImg.src = "";
      caption.textContent = "";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        modalImg.src = "";
        caption.textContent = "";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (modal.style.display === "flex") {
        if (e.key === "Escape") {
          modal.style.display = "none";
          modalImg.src = "";
          caption.textContent = "";
          currentIndex = -1;
        }
        if (e.key === "ArrowRight" && currentIndex < imageLinks.length - 1) {
          openModal(currentIndex + 1);
        }
        if (e.key === "ArrowLeft" && currentIndex > 0) {
          openModal(currentIndex - 1);
        }
      }
    });
  }
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-theme');
    themeToggle.checked = true;
  }

  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  });
});