/* ============================================================
   InfoData — main.js  |  Limpio, sin gimmicks
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll progress bar ─────────────────────────────────── */
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (window.scrollY / max * 100).toFixed(1) + '%';
    }, { passive: true });
  }

  /* ── Navbar ──────────────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu= document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 48);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  mobileMenu?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu.classList.remove('open');
    })
  );

  /* ── Scroll reveal ───────────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-clip').forEach(el => io.observe(el));

  /* ── Counters ────────────────────────────────────────────── */
  function runCounter(el) {
    const target   = parseFloat(el.dataset.target || '0');
    const suffix   = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0');
    const dur      = 1800;
    const t0       = performance.now();
    const ease     = t => 1 - Math.pow(1 - t, 3);

    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = (target * ease(p)).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    })(t0);
  }

  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.ran) {
        e.target.dataset.ran = '1';
        runCounter(e.target);
        cio.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => cio.observe(el));

  /* ── Marquee clone ───────────────────────────────────────── */
  document.querySelectorAll('.marquee-inner').forEach(el => {
    el.innerHTML += el.innerHTML;
  });

  /* ── Formulario ──────────────────────────────────────────── */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      form.style.display = 'none';
      success?.classList.add('visible');
    }, 1400);
  });

  /* ── Smooth scroll ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 72,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ── Año dinámico ────────────────────────────────────────── */
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();
