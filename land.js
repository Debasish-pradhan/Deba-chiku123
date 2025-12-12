// script.js — interactivity: mobile menu, sticky header, scrollspy, reveal, counters

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > section[id], main > section');
  const revealEls = document.querySelectorAll('.section-reveal');
  const counterEls = document.querySelectorAll('.stat-number');

  // Mobile menu toggle
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('open');
    });

    // close menu on link click (mobile)
    mainNav.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        mainNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Sticky header shadow toggle
  const handleSticky = () => {
    if (window.scrollY > 10) header.classList.add('sticky');
    else header.classList.remove('sticky');
  };
  handleSticky();
  window.addEventListener('scroll', handleSticky);

  // Smooth scroll for anchor links (supports keyboard too)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // update history without page jump
          history.pushState(null, '', href);
        }
      }
    });
  });

  // Scrollspy (IntersectionObserver)
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (!id) return;
      const link = document.querySelector(`.main-nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  document.querySelectorAll('main section[id]').forEach(sec => spyObserver.observe(sec));

  // Reveal-on-scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // Counters: count up when visible
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = +el.getAttribute('data-target') || 0;
    const duration = 1100;
    const startTime = performance.now();
    const start = 0;

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * (target - start) + start);
      el.textContent = value + (target >= 50 ? '+' : (target > 0 ? '' : ''));
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + (target >= 50 ? '+' : '');
    }
    requestAnimationFrame(step);
  }

  // keyboard: close menu with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      mainNav.classList.remove('open');
      menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
});
