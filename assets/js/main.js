// Fallback: si GSAP n'est pas dispo, on affiche quand même le contenu
if (typeof window.gsap === "undefined") {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
  });
}

(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ======= Drawer menu (no bug, locks scroll) =======
  const burger = document.querySelector(".burger");
  const drawer = document.querySelector(".drawer");
  const closeBtn = document.querySelector(".drawer__close");

  const lockScroll = (on) => {
    document.documentElement.style.overflow = on ? "hidden" : "";
    document.body.style.overflow = on ? "hidden" : "";
  };

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add("is-open");
    lockScroll(true);
    burger?.setAttribute("aria-expanded", "true");
  };

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    lockScroll(false);
    burger?.setAttribute("aria-expanded", "false");
  };

  burger?.addEventListener("click", () => {
    const isOpen = drawer?.classList.contains("is-open");
    isOpen ? closeDrawer() : openDrawer();
  });

  closeBtn?.addEventListener("click", closeDrawer);

  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) closeDrawer();
  });

  drawer?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => (e.key === "Escape" ? closeDrawer() : null));

  // ======= Smooth anchor offset (sticky header) =======
  const header = document.querySelector(".topbar");
  const offset = () => (header ? header.offsetHeight + 12 : 72);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - offset();
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // ======= GSAP animations =======
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }

  if (typeof window.gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  // subtle hero image zoom
  const heroImg = document.querySelector(".glasscard img");
  if (heroImg) gsap.to(heroImg, { scale: 1.0, duration: 1.2, ease: "power2.out" });

  // floating dots
  gsap.to(".floatdot.d1", { y: 18, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".floatdot.d2", { y: -14, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });

  // reveal
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });

  // stagger groups
  const groups = [".cards .card", ".logos .logo", ".reviews .review", ".areas .pill", ".hero__trust .trustcard"];
  groups.forEach((sel) => {
    const els = document.querySelectorAll(sel);
    if (!els.length) return;
    gsap.fromTo(
      els,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: els[0], start: "top 86%" },
      }
    );
  });
})();
(function () {
  const initCarousel = (root) => {
    const track = root.querySelector(".carousel__track");
    const slides = Array.from(root.querySelectorAll(".carousel__slide"));
    const prevBtn = root.querySelector(".carousel__btn--prev");
    const nextBtn = root.querySelector(".carousel__btn--next");
    const dotsWrap = root.querySelector(".carousel__dots");

    if (!track || slides.length <= 1) return;

    let index = 0;
    let timer = null;
    const interval = Math.max(1500, Number(root.dataset.interval || 3000));

    // Dots
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot";
      b.setAttribute("aria-label", `Aller à l'image ${i + 1}`);
      b.addEventListener("click", () => go(i, true));
      dotsWrap && dotsWrap.appendChild(b);
      return b;
    });

    const paint = () => {
      track.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    };

    const go = (i, user = false) => {
      index = (i + slides.length) % slides.length;
      paint();
      if (user) restart();
    };

    const next = (user = false) => go(index + 1, user);
    const prev = (user = false) => go(index - 1, user);

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const start = () => {
      stop();
      timer = setInterval(() => next(false), interval);
    };

    const restart = () => start();

    nextBtn && nextBtn.addEventListener("click", () => next(true));
    prevBtn && prevBtn.addEventListener("click", () => prev(true));

    // Pause au survol / focus
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    paint();
    start();
  };

  const carousels = document.querySelectorAll(".carousel");
  carousels.forEach(initCarousel);
})();
