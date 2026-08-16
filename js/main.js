/* ============================================================
   InfoData — main.js
   GSAP 3 + ScrollTrigger · Canvas gradient · Text scramble
   Custom cursor · Magnetic buttons · Ambient particles
   ============================================================ */

(function () {
  'use strict';

  /* ── Registrar plugins de GSAP ───────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Native browser scroll — no hijacking */


  /* ══════════════════════════════════════════════════════════
     1. CANVAS MESH GRADIENT — hero background vivo
     Blob orgánico que respira, estilo Stripe/Linear
  ══════════════════════════════════════════════════════════ */
  function initMeshGradient() {
    const canvas = document.getElementById('hero-gradient');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, time = 0, raf;

    /* Paleta — tonos sutiles del azul corporativo */
    const blobs = [
      { x: 0.3, y: 0.35, r: 0.38, color: [29, 75, 137, 0.12] },   /* azul logo */
      { x: 0.7, y: 0.55, r: 0.35, color: [221, 232, 243, 0.40] },  /* celeste muted */
      { x: 0.5, y: 0.75, r: 0.30, color: [12, 23, 40, 0.06] },     /* navy sombra */
      { x: 0.2, y: 0.65, r: 0.25, color: [29, 75, 137, 0.08] },    /* azul difuso */
    ];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function draw() {
      time += 0.003;
      ctx.clearRect(0, 0, w, h);

      blobs.forEach((b, i) => {
        const ox = Math.sin(time * 0.7 + i * 1.8) * 0.05;
        const oy = Math.cos(time * 0.5 + i * 2.2) * 0.04;
        const or = Math.sin(time * 0.4 + i) * 0.03;

        const cx = (b.x + ox) * w;
        const cy = (b.y + oy) * h;
        const r  = (b.r + or) * Math.min(w, h);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${b.color[3]})`);
        grad.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    /* Pausar cuando sale del viewport */
    ScrollTrigger.create({
      trigger: '#inicio',
      start: 'top bottom',
      end: 'bottom top',
      onLeave: ()      => cancelAnimationFrame(raf),
      onEnterBack: ()  => draw(),
    });
  }


  /* ══════════════════════════════════════════════════════════
     2. AMBIENT FLOATING PARTICLES — puntos que flotan en secciones claras
  ══════════════════════════════════════════════════════════ */
  function initParticles() {
    const canvas = document.getElementById('ambient-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, raf;

    const PARTICLE_COUNT = 35;
    const particles = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* Inicializar partículas */
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * 1,
        y: Math.random() * 1,
        r: Math.random() * 1.8 + 0.5,
        dx: (Math.random() - 0.5) * 0.0003,
        dy: (Math.random() - 0.5) * 0.0002,
        alpha: Math.random() * 0.15 + 0.04,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    function draw() {
      time += 0.01;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05)  p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05)  p.y = -0.05;

        const flicker = Math.sin(time + p.phase) * 0.03;
        const alpha = Math.max(0, p.alpha + flicker);

        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(29,75,137,${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();
  }


  /* ══════════════════════════════════════════════════════════
     3. TEXT SCRAMBLE — letras se decodifican al entrar en viewport
  ══════════════════════════════════════════════════════════ */
  function textScramble(el) {
    const original = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const len = original.length;
    let frame = 0;
    const totalFrames = 28;

    function update() {
      let result = '';
      for (let i = 0; i < len; i++) {
        if (original[i] === ' ') {
          result += ' ';
        } else if (frame / totalFrames > i / len) {
          result += original[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = result;
      frame++;
      if (frame <= totalFrames) requestAnimationFrame(update);
    }
    update();
  }

  function initTextScramble() {
    document.querySelectorAll('.section-label').forEach(el => {
      if (el.dataset.scrambled) return;
      el.dataset.scrambled = '1';
      const original = el.textContent;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => textScramble(el),
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     4. PAGE LOADER — desaparece tras 900ms
  ══════════════════════════════════════════════════════════ */
  const loader = document.getElementById('page-loader');

  function dismissLoader() {
    if (!loader) return;
    loader.classList.add('loaded');
    setTimeout(initHero, reduceMotion ? 0 : 100);
  }

  if (loader) {
    const minWait    = new Promise(r => setTimeout(r, reduceMotion ? 0 : 350));
    const fontLoaded = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([minWait, fontLoaded]).then(dismissLoader);
  } else {
    initHero();
  }


  /* ══════════════════════════════════════════════════════════
     5. CUSTOM CURSOR
  ══════════════════════════════════════════════════════════ */
  const dot  = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  const canHover = !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (dot && ring && canHover) {
    document.body.classList.add('has-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      gsap.set(dot, { x: mx, y: my });
    });

    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      gsap.set(ring, { x: rx, y: ry });
    });

    function addHover(els) {
      els.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
      });
    }
    addHover(document.querySelectorAll(
      'a, button, .service-row, .sample-card, .plan, .manifesto-pill, .why-item, .testi-card, select, textarea, input, .gallery-img, .process-step'
    ));

    document.querySelectorAll('.plan').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('c-gold'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('c-gold'));
    });

    document.querySelectorAll('.manifesto, .cta-section, .footer, .marquee-strip').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('c-dark'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('c-dark'));
    });

    document.addEventListener('mousedown', () => document.body.classList.add('c-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('c-click'));

    document.addEventListener('mouseleave', () =>
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
    );
    document.addEventListener('mouseenter', () =>
      gsap.to([dot, ring], { opacity: 1, duration: 0.4 })
    );
  }


  /* ══════════════════════════════════════════════════════════
     6. SPLIT TEXT — TreeWalker safe
  ══════════════════════════════════════════════════════════ */
  function splitWords(el) {
    if (!el || el.dataset.split) {
      return el ? el.querySelectorAll('.split-inner') : [];
    }
    el.dataset.split = '1';

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(textNode => {
      const raw   = textNode.textContent;
      const parts = raw.split(/(\s+)/);
      const frag  = document.createDocumentFragment();

      parts.forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const wrap  = document.createElement('span');
          wrap.className = 'split-wrap';
          const inner = document.createElement('span');
          inner.className = 'split-inner';
          inner.textContent = part;
          wrap.appendChild(inner);
          frag.appendChild(wrap);
        }
      });

      textNode.parentNode.replaceChild(frag, textNode);
    });

    return el.querySelectorAll('.split-inner');
  }


  /* ══════════════════════════════════════════════════════════
     7. HERO — animación de entrada (GSAP timeline)
  ══════════════════════════════════════════════════════════ */
  function initHero() {
    if (reduceMotion) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('#hero-eyebrow', { opacity: 0, y: 12, duration: 0.8 });

    document.querySelectorAll('.headline-word, .headline-word-serif').forEach((span, i) => {
      const words = splitWords(span);
      tl.from(words, {
        y: '110%',
        duration: 1.15,
        stagger: 0.055,
        ease: 'power4.out',
      }, i === 0 ? '-=0.4' : '-=0.75');
    });

    tl.from('.hero-divider', {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
    }, '-=0.55');

    tl.from('.hero-desc', { opacity: 0, y: 22, duration: 0.9 }, '-=0.8');
    tl.from('.hero-actions .btn', {
      opacity: 0, y: 16,
      stagger: 0.12,
      duration: 0.75,
    }, '-=0.7');

    /* Fade out hero content as user scrolls down */
    gsap.to('.hero-body', {
      scrollTrigger: {
        trigger: '#inicio',
        start: '60% top',
        end: 'bottom top',
        scrub: true,
      },
      opacity: 0,
      y: -40,
      ease: 'none',
    });
  }


  /* ══════════════════════════════════════════════════════════
     8. SCROLL ANIMATIONS — ScrollTrigger
  ══════════════════════════════════════════════════════════ */
  function initScroll() {

    function fadeUp(selector, extra = {}) {
      gsap.utils.toArray(selector).forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: 'power3.out',
          ...extra,
        });
      });
    }

    /* ── Section labels — scramble ─────────────────────────── */
    initTextScramble();

    /* ── Manifesto statement — palabra a palabra ─────────────── */
    const manifesto = document.querySelector('.manifesto-statement');
    if (manifesto) {
      const words = splitWords(manifesto);
      gsap.from(words, {
        scrollTrigger: { trigger: manifesto, start: 'top 78%', once: true },
        y: '110%',
        duration: 1.3,
        stagger: 0.038,
        ease: 'power4.out',
      });
    }

    fadeUp('.manifesto-text', { delay: 0.1 });

    gsap.from('.manifesto-pill', {
      scrollTrigger: { trigger: '.manifesto-pills', start: 'top 82%', once: true },
      x: 36,
      opacity: 0,
      stagger: 0.1,
      duration: 0.85,
      ease: 'power3.out',
    });

    /* ── Services header ───────────────────────────────── */
    const svcH2 = document.querySelector('.services-title');
    if (svcH2) {
      const words = splitWords(svcH2);
      gsap.from(words, {
        scrollTrigger: { trigger: svcH2, start: 'top 82%', once: true },
        y: '110%',
        duration: 1.15,
        stagger: 0.06,
        ease: 'power4.out',
      });
    }
    fadeUp('.services-header-right p');

    /* ── Service rows — stagger con clip reveal ──────────── */
    gsap.from('.service-row', {
      scrollTrigger: { trigger: '.services-list', start: 'top 80%', once: true },
      x: -30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
    });

    /* ── Horizontal divider lines grow on scroll ──────────── */
    gsap.utils.toArray('.hr-grow').forEach(line => {
      gsap.from(line, {
        scrollTrigger: { trigger: line, start: 'top 90%', once: true },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.4,
        ease: 'power4.out',
      });
    });

    /* ── Gallery — clip-path image reveal ─────────────────── */
    gsap.utils.toArray('.img-reveal').forEach((img, i) => {
      gsap.from(img, {
        scrollTrigger: { trigger: img, start: 'top 85%', once: true },
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.3,
        delay: i * 0.12,
        ease: 'power4.out',
      });
    });

    /* ── Gallery title ──────────────────────────────────── */
    const galleryTitle = document.querySelector('.gallery-title');
    if (galleryTitle) {
      const words = splitWords(galleryTitle);
      gsap.from(words, {
        scrollTrigger: { trigger: galleryTitle, start: 'top 82%', once: true },
        y: '110%',
        duration: 1.15,
        stagger: 0.06,
        ease: 'power4.out',
      });
    }

    /* ── Process — stagger reveal ───────────────────────── */
    const processTitle = document.querySelector('.process-title');
    if (processTitle) {
      const words = splitWords(processTitle);
      gsap.from(words, {
        scrollTrigger: { trigger: processTitle, start: 'top 82%', once: true },
        y: '110%',
        duration: 1.15,
        stagger: 0.06,
        ease: 'power4.out',
      });
    }

    gsap.utils.toArray('.process-step').forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: { trigger: step, start: 'top 85%', once: true },
        y: 48,
        opacity: 0,
        scale: 0.96,
        duration: 1.0,
        delay: i * 0.15,
        ease: 'power3.out',
      });
    });

    /* ── Why — claim ────────────────────────────────────────── */
    const whyClaim = document.querySelector('.why-claim');
    if (whyClaim) {
      const words = splitWords(whyClaim);
      gsap.from(words, {
        scrollTrigger: { trigger: whyClaim, start: 'top 82%', once: true },
        y: '110%',
        duration: 1.15,
        stagger: 0.05,
        ease: 'power4.out',
      });
    }

    const whyDiv = document.querySelector('.why-divider');
    if (whyDiv) {
      gsap.from(whyDiv, {
        scrollTrigger: { trigger: whyDiv, start: 'top 88%', once: true },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.4,
        ease: 'power4.out',
      });
    }

    fadeUp('.why-text');

    /* Why items — rotate in slightly */
    gsap.utils.toArray('.why-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        opacity: 0,
        y: 32,
        rotateX: 8,
        duration: 0.9,
        delay: i * 0.08,
        ease: 'power3.out',
      });
    });

    /* ── Metrics — count up ─────────────────────────────────── */
    document.querySelectorAll('[data-target]').forEach(el => {
      const target   = parseFloat(el.dataset.target ?? '0');
      const suffix   = el.dataset.suffix ?? '';
      const decimals = parseInt(el.dataset.decimals ?? '0');
      const obj      = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate() { el.textContent = obj.val.toFixed(decimals) + suffix; },
        onComplete() { el.textContent = target.toFixed(decimals) + suffix; },
      });
    });

    /* ── Testimonials — horizontal scroll ───────────────────── */
    const testiTrack = document.querySelector('.testi-track');
    const testiWrap  = document.querySelector('.testi-scroll');
    if (testiTrack && testiWrap) {
      const totalScroll = testiTrack.scrollWidth - testiWrap.offsetWidth;
      if (totalScroll > 0) {
        gsap.to(testiTrack, {
          x: -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: testiWrap,
            start: 'top 65%',
            end: () => `+=${totalScroll}`,
            scrub: 1.2,
            pin: false,
          },
        });
      }
    }

    /* ── Testimonial cards — scale-in ─────────────────── */
    gsap.utils.toArray('.testi-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        scale: 0.88,
        opacity: 0,
        duration: 0.9,
        delay: i * 0.08,
        ease: 'power3.out',
      });
    });

    /* ── Pricing header ─────────────────────────────────────── */
    const priceHead = document.querySelector('.pricing-headline');
    if (priceHead) {
      const words = splitWords(priceHead);
      gsap.from(words, {
        scrollTrigger: { trigger: priceHead, start: 'top 82%', once: true },
        y: '110%',
        duration: 1.1,
        stagger: 0.06,
        ease: 'power4.out',
      });
    }

    /* Plans — scale + fade */
    gsap.utils.toArray('.plan').forEach((plan, i) => {
      gsap.from(plan, {
        scrollTrigger: { trigger: plan, start: 'top 85%', once: true },
        y: 48,
        opacity: 0,
        scale: 0.96,
        duration: 1.0,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    });

    /* ── CTA section — parallax text ───────────────────────── */
    const ctaHead = document.querySelector('.cta-headline');
    if (ctaHead) {
      const words = splitWords(ctaHead);
      gsap.from(words, {
        scrollTrigger: { trigger: ctaHead, start: 'top 80%', once: true },
        y: '110%',
        duration: 1.3,
        stagger: 0.05,
        ease: 'power4.out',
      });
    }
    fadeUp('.cta-body');
    fadeUp('.cta-actions .btn', { stagger: 0.1 });

    /* CTA background slow parallax */
    gsap.to('.cta-section', {
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      backgroundPositionY: '30%',
      ease: 'none',
    });

    /* ── Contact ────────────────────────────────────────────── */
    const contactTitle = document.querySelector('.contact-title');
    if (contactTitle) {
      const words = splitWords(contactTitle);
      gsap.from(words, {
        scrollTrigger: { trigger: contactTitle, start: 'top 82%', once: true },
        y: '110%',
        duration: 1.1,
        stagger: 0.07,
        ease: 'power4.out',
      });
    }
    fadeUp('.contact-intro');
    fadeUp('.contact-data');
    fadeUp('.contact-socials');

    gsap.from('.field', {
      scrollTrigger: { trigger: '#contact-form', start: 'top 82%', once: true },
      opacity: 0,
      y: 18,
      stagger: 0.08,
      duration: 0.75,
      ease: 'power3.out',
    });

    /* ── Generic reveals ──────────────────────────────────── */
    gsap.utils.toArray('.reveal').forEach(el => {
      if (ScrollTrigger.getAll().some(st => st.trigger === el)) return;
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        opacity: 0,
        y: 26,
        duration: 0.9,
        ease: 'power3.out',
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     9. MAGNETIC BUTTONS
  ══════════════════════════════════════════════════════════ */
  function initMagnetic() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.22;
        const y = (e.clientY - r.top  - r.height / 2) * 0.22;
        gsap.to(btn, { x, y, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' });
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     10. PARALLAX HERO
  ══════════════════════════════════════════════════════════ */
  function initParallax() {
    gsap.to('.hero-headline', {
      scrollTrigger: {
        trigger: '#inicio',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
      y: -60,
      ease: 'none',
    });

    gsap.to('#hero-eyebrow, .hero-desc, .hero-actions', {
      scrollTrigger: {
        trigger: '#inicio',
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      },
      y: -30,
      ease: 'none',
    });
  }

  function initServiceTilt() {
    document.querySelectorAll('.service-row').forEach(row => {
      row.addEventListener('mousemove', e => {
        const r = row.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        gsap.to(row, {
          rotateY: x * 4,
          rotateX: -y * 3,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
      row.addEventListener('mouseleave', () => {
        gsap.to(row, {
          rotateY: 0, rotateX: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.6)',
          overwrite: 'auto',
        });
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     12. NAVBAR
  ══════════════════════════════════════════════════════════ */
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


  /* ══════════════════════════════════════════════════════════
     13. SCROLL PROGRESS BAR
  ══════════════════════════════════════════════════════════ */
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (window.scrollY / max * 100).toFixed(2) + '%';
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════════════════
     14. MARQUEE — velocidad vinculada al scroll
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.marquee-inner').forEach(el => {
    el.innerHTML += el.innerHTML;
  });

  /* Marquee speed boost on scroll */
  const marqueeInner = document.querySelector('.marquee-inner');
  if (marqueeInner) {
    let scrollSpeed = 0;
    let lastScroll = window.scrollY;

    window.addEventListener('scroll', () => {
      scrollSpeed = Math.abs(window.scrollY - lastScroll);
      lastScroll  = window.scrollY;
    }, { passive: true });

    gsap.ticker.add(() => {
      const base  = 55;
      const boost = Math.min(scrollSpeed * 0.8, 30);
      scrollSpeed *= 0.92; /* decay */
      const dur = Math.max(10, base - boost);
      marqueeInner.style.animationDuration = dur + 's';
    });
  }


  /* ══════════════════════════════════════════════════════════
     15. FORMULARIO
  ══════════════════════════════════════════════════════════ */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      gsap.to(form, { opacity: 0, y: -10, duration: 0.5, onComplete: () => {
        form.style.display = 'none';
        success?.classList.add('visible');
        gsap.from(success, { opacity: 0, y: 10, duration: 0.6, ease: 'power3.out' });
      }});
    }, 1200);
  });


  /* ══════════════════════════════════════════════════════════
     16. SMOOTH SCROLL (anchor links)
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 72,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    });
  });


  /* ══════════════════════════════════════════════════════════
     17. AÑO DINÁMICO
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });


  /* ── Iniciar todo ────────────────────────────────────────── */
  if (!reduceMotion) {
    initMeshGradient();
    initParticles();
    initScroll();
    initParallax();

    if (canHover) {
      initMagnetic();
      initServiceTilt();
    }
  }

  window.dispatchEvent(new Event('scroll'));

})();
