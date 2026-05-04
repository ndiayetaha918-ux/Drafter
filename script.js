(() => {
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav-links a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal animations ---------- */
  const targets = document.querySelectorAll(
    '.section-head, .pillars li, .practice, .timeline li, .method-steps li, .audience-list li, .hero-title, .hero-lede, .hero-cta, .hero-meta, .founder-portrait, .founder-bio'
  );
  targets.forEach((t) => t.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 50);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
  );
  targets.forEach((t) => io.observe(t));

  /* ---------- Portrait slider ---------- */
  const slider = document.querySelector('.portrait-slider');
  if (slider) {
    const interval = parseInt(slider.dataset.interval, 10) || 3000;
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dots = Array.from(slider.querySelectorAll('.slider-dots li'));
    const progress = slider.querySelector('.slider-progress');

    slider.style.setProperty('--slide-interval', interval + 'ms');

    let idx = 0;
    let timer = null;
    let paused = false;

    const goTo = (next) => {
      slides[idx].classList.remove('is-active');
      if (dots[idx]) dots[idx].classList.remove('is-active');
      idx = (next + slides.length) % slides.length;
      slides[idx].classList.add('is-active');
      if (dots[idx]) dots[idx].classList.add('is-active');
      restartProgress();
    };

    const restartProgress = () => {
      if (!progress) return;
      progress.classList.remove('is-running');
      void progress.offsetWidth; /* force reflow to restart animation */
      if (!paused) progress.classList.add('is-running');
    };

    const start = () => {
      stop();
      timer = setInterval(() => goTo(idx + 1), interval);
      restartProgress();
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    slider.addEventListener('mouseenter', () => {
      paused = true;
      stop();
      if (progress) progress.classList.remove('is-running');
    });
    slider.addEventListener('mouseleave', () => {
      paused = false;
      start();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (!paused) start();
    });

    start();
  }
})();
