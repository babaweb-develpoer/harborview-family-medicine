(() => {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Hero video: respect reduced motion ---------------- */
  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (prefersReducedMotion.matches) {
        heroVideo.pause();
        heroVideo.removeAttribute("autoplay");
      } else {
        heroVideo.setAttribute("autoplay", "");
        heroVideo.play().catch(() => {});
      }
    };
    syncMotionPreference();
    prefersReducedMotion.addEventListener("change", syncMotionPreference);
  }

  /* ---------------- Mobile nav ---------------- */
  const menuToggle = document.getElementById("menuToggle");
  const header = document.getElementById("siteHeader");
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.innerHTML = isOpen
      ? '<i class="ph ph-x" aria-hidden="true"></i>'
      : '<i class="ph ph-list" aria-hidden="true"></i>';
  });
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = '<i class="ph ph-list" aria-hidden="true"></i>';
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------- Testimonial carousel ---------------- */
  const carousel = document.getElementById("carousel");
  const carPrev = document.getElementById("carPrev");
  const carNext = document.getElementById("carNext");
  const dotsWrap = document.getElementById("carDots");
  const slides = Array.from(carousel.children);

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
    dot.addEventListener("click", () => {
      slides[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function setActiveDot(index) {
    dots.forEach((d, i) => {
      if (i === index) {
        d.setAttribute("aria-current", "true");
      } else {
        d.removeAttribute("aria-current");
      }
    });
  }

  const GAP = 20;
  function cardStep() {
    return slides[0].getBoundingClientRect().width + GAP;
  }

  let scrollTicking = false;
  function syncActiveDotFromScroll() {
    const index = Math.round(carousel.scrollLeft / cardStep());
    setActiveDot(Math.max(0, Math.min(index, slides.length - 1)));
  }
  carousel.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        syncActiveDotFromScroll();
        scrollTicking = false;
      });
    },
    { passive: true }
  );
  setActiveDot(0);

  function scrollByCard(direction) {
    carousel.scrollBy({ left: cardStep() * direction, behavior: "smooth" });
  }
  carPrev.addEventListener("click", () => scrollByCard(-1));
  carNext.addEventListener("click", () => scrollByCard(1));

  /* ---------------- Booking form ---------------- */
  const form = document.getElementById("bookingForm");
  const submitBtn = document.getElementById("submitBtn");
  const errorSummary = document.getElementById("formErrorSummary");
  const errorList = document.getElementById("formErrorList");
  const successPanel = document.getElementById("bookingSuccess");
  const successName = document.getElementById("successName");
  const bookAnother = document.getElementById("bookAnother");

  const todayISO = new Date().toISOString().split("T")[0];
  document.getElementById("visitDate").setAttribute("min", todayISO);

  const validators = {
    fullName: (v) => (v.trim().length >= 2 ? "" : "Enter your full name."),
    phone: (v) => (/^[0-9()+\-.\s]{7,20}$/.test(v.trim()) ? "" : "Enter a valid phone number."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."),
    visitDate: (v) => (v ? "" : "Choose a preferred date."),
    visitType: (v) => (v ? "" : "Select a reason for your visit."),
  };

  function fieldEl(name) {
    return document.getElementById(name).closest(".field");
  }

  function setFieldError(name, message) {
    const wrap = fieldEl(name);
    const errorSpan = document.getElementById(`err-${name}`);
    if (message) {
      wrap.classList.add("has-error");
      errorSpan.textContent = message;
    } else {
      wrap.classList.remove("has-error");
      errorSpan.textContent = "";
    }
  }

  function validateField(name) {
    const input = document.getElementById(name);
    const message = validators[name](input.value);
    setFieldError(name, message);
    return message;
  }

  Object.keys(validators).forEach((name) => {
    const input = document.getElementById(name);
    input.addEventListener("blur", () => validateField(name));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const errors = [];
    Object.keys(validators).forEach((name) => {
      const message = validateField(name);
      if (message) {
        errors.push({ name, message });
      }
    });

    if (errors.length > 0) {
      errorList.innerHTML = errors
        .map(
          (err) =>
            `<li><a href="#${err.name}">${document.querySelector(`label[for="${err.name}"]`).textContent.replace("Optional", "").trim()}: ${err.message}</a></li>`
        )
        .join("");
      errorSummary.hidden = false;
      errorSummary.focus();
      return;
    }

    errorSummary.hidden = true;

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    window.setTimeout(() => {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;

      const firstName = document.getElementById("fullName").value.trim().split(" ")[0];
      successName.textContent = firstName || "there";

      form.hidden = true;
      successPanel.hidden = false;
      successPanel.querySelector("h3").focus?.();
    }, 900);
  });

  bookAnother.addEventListener("click", () => {
    form.reset();
    Object.keys(validators).forEach((name) => setFieldError(name, ""));
    successPanel.hidden = true;
    form.hidden = false;
  });
})();
