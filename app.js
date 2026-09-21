/* ==============================================
   DEBINSPIRE LLC — app.js
   Complete Overhaul: Particles, Tilt, Magnetic,
   Reveal, Counter, Cursor, Navbar, Form
   ============================================== */

'use strict';

/* ================================================
   1. PARTICLE CANVAS — hero background
   ================================================ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse = { x: -1000, y: -1000 };
  const COUNT = window.innerWidth < 768 ? 50 : 110;
  const COLORS = ['#9b4fd4','#c084fc','#34d399','#10b981','#7c3aed'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(156,78,212,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      // Mouse repulsion
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 120) {
        const force = (120 - mdist) / 120 * 0.6;
        p.vx += (mdx / mdist) * force;
        p.vy += (mdy / mdist) * force;
      }

      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  init();
  draw();
})();


/* ================================================
   2. SECONDARY CANVAS — tax banner
   ================================================ */
(function initTaxCanvas() {
  const canvas = document.getElementById('tax-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.005;
    const cx = W * 0.7, cy = H * 0.5;

    // Concentric glowing rings
    for (let i = 0; i < 5; i++) {
      const r = 80 + i * 60 + Math.sin(t + i) * 15;
      const alpha = 0.08 - i * 0.012;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0
        ? `rgba(124,58,237,${alpha})`
        : `rgba(52,211,153,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Floating dollar nodes
    const nodes = 8;
    for (let i = 0; i < nodes; i++) {
      const angle = (i / nodes) * Math.PI * 2 + t * 0.3;
      const rad = 130 + Math.sin(t * 0.7 + i) * 20;
      const nx = cx + Math.cos(angle) * rad;
      const ny = cy + Math.sin(angle) * rad;
      ctx.beginPath();
      ctx.arc(nx, ny, 3, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(196,132,252,0.4)' : 'rgba(52,211,153,0.4)';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = 'rgba(124,58,237,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
})();


/* ================================================
   3. CUSTOM CURSOR
   ================================================ */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer:coarse)').matches) {
    dot.remove(); ring.remove(); return;
  }

  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  const hovers = document.querySelectorAll('a,button,.pillar-card,.serve-card,.diff-card,.svc-item,.photo-frame');
  hovers.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();


/* ================================================
   4. NAVBAR — scroll glass + mobile
   ================================================ */
(function initNavbar() {
  const header = document.getElementById('site-header');
  const ham    = document.getElementById('hamburger');
  const menu   = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  if (ham && menu) {
    ham.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      ham.classList.toggle('active', open);
      ham.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        ham.classList.remove('active');
        ham.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-item[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));
})();


/* ================================================
   5. SCROLL REVEAL
   ================================================ */
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = `${i * 0.04}s`;
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();


/* ================================================
   6. HERO TEXT LINE REVEAL (staggered)
   ================================================ */
(function initHeroLines() {
  const lineTexts = document.querySelectorAll('.line-text');
  lineTexts.forEach((el, i) => {
    el.style.transform = 'translateY(100%)';
    el.style.opacity = '0';
    el.style.transition = `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.12}s, opacity 0.6s ease ${0.15 + i * 0.12}s`;
    requestAnimationFrame(() => {
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    });
  });

  // Hero reveals stagger
  const heroReveals = document.querySelectorAll('.hero [data-reveal]');
  heroReveals.forEach((el, i) => {
    el.style.transitionDelay = `${0.5 + i * 0.15}s`;
    setTimeout(() => el.classList.add('visible'), 100);
  });
})();


/* ================================================
   7. ANIMATED COUNTERS
   ================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(el) {
    const target  = parseInt(el.dataset.count, 10);
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const duration = 2000;
    const start   = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value    = Math.round(target * easeOut(progress));
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => io.observe(el));
})();


/* ================================================
   8. DEDUCTION BARS REVEAL
   ================================================ */
(function initDedBars() {
  const items = document.querySelectorAll('.ded-item');
  if (!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        items.forEach(item => item.classList.add('visible'));
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (items[0]) io.observe(items[0]);
})();


/* ================================================
   9. MAGNETIC BUTTONS
   ================================================ */
(function initMagnetic() {
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.35;
      const dy     = (e.clientY - cy) * 0.35;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();


/* ================================================
   10. 3D TILT — CEO photo
   ================================================ */
(function initTilt() {
  const frames = document.querySelectorAll('[data-tilt]');
  frames.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)';
      el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    });
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s linear';
    });
  });
})();


/* ================================================
   11. SMOOTH SCROLL with offset
   ================================================ */
(function initSmoothScroll() {
  const NAV_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const tgt = document.getElementById(id);
      if (!tgt) return;
      e.preventDefault();
      const top = tgt.getBoundingClientRect().top + window.scrollY - NAV_H - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ================================================
   12. CONTACT FORM
   ================================================ */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();
    const svc   = form.querySelector('#cf-service').value;
    const msg   = form.querySelector('#cf-msg').value.trim();

    if (!name || !email || !svc || !msg) { shake(form); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      pulse(form.querySelector('#cf-email')); return;
    }

    const btn = form.querySelector('#cf-submit');
    const inner = btn.querySelector('.btn-inner');
    inner.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      inner.textContent = 'Send Message';
      btn.disabled = false;
      success.removeAttribute('hidden');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => success.setAttribute('hidden', ''), 6000);
    }, 1400);
  });

  function shake(el) {
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' },
    ], { duration: 360, easing: 'ease-out' });
  }

  function pulse(el) {
    el.style.borderColor = 'rgba(239,68,68,0.7)';
    el.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
    el.focus();
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
    }, 2500);
  }
})();


/* ================================================
   13. PILLAR CARD ENTRANCE — stagger within grid
   ================================================ */
(function initPillarStagger() {
  const cards = document.querySelectorAll('.pillar-card');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = [...cards].indexOf(e.target);
        e.target.style.transitionDelay = `${idx * 0.06}s`;
        e.target.classList.add('visible');
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(24px)';
    c.style.transition = 'opacity .7s cubic-bezier(0.16,1,0.3,1), transform .7s cubic-bezier(0.16,1,0.3,1)';
    io.observe(c);
  });
})();


/* ================================================
   14. CARD SPOTLIGHT & MOUSE TRACKING
   ================================================ */
(function initSpotlight() {
  const cards = document.querySelectorAll('.pillar-card, .serve-card, .diff-card, .svc-item, .cred-item, .service-feature');
  cards.forEach(card => {
    card.classList.add('spotlight-card');
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-1000px');
      card.style.setProperty('--mouse-y', '-1000px');
    }, { passive: true });
  });
})();


/* ================================================
   15. PAGE LOAD FADE-IN
   ================================================ */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.4s ease';
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
