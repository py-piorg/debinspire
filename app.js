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
   15. SCROLL PROGRESS INDICATOR & QUICK ACTION DOCK
   ================================================ */
(function initScrollProgressAndDock() {
  const bar = document.getElementById('scroll-progress');
  const dock = document.getElementById('quick-action-dock');
  const toTop = document.getElementById('dock-to-top');

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (bar && docHeight > 0) {
      const pct = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
      bar.style.width = pct + '%';
    }
    if (dock) {
      dock.classList.toggle('visible', scrollTop > 480);
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();


/* ================================================
   16. HERO CARD STACK 3D PARALLAX TILT
   ================================================ */
(function initHeroTilt() {
  const hero = document.querySelector('.hero');
  const stack = document.querySelector('.hero-card-stack');
  if (!hero || !stack) return;
  if (window.matchMedia('(pointer:coarse)').matches) return;

  const main = stack.querySelector('.hcard-main');
  const top = stack.querySelector('.hcard-top');
  const bot = stack.querySelector('.hcard-bot');

  hero.addEventListener('mousemove', e => {
    const rect = stack.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (window.innerWidth / 2);
    const dy = (e.clientY - cy) / (window.innerHeight / 2);

    stack.style.transform = `perspective(1000px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg)`;
    if (main) main.style.transform = `translateX(-50%) translateZ(24px) translate(${dx * 8}px, ${dy * 8}px)`;
    if (top) top.style.transform = `translateZ(44px) translate(${dx * -12}px, ${dy * -12}px)`;
    if (bot) bot.style.transform = `translateZ(34px) translate(${dx * -10}px, ${dy * -10}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    stack.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    stack.style.transition = 'transform 0.7s var(--ease-out)';
    if (main) {
      main.style.transform = 'translateX(-50%)';
      main.style.transition = 'transform 0.7s var(--ease-out)';
    }
    if (top) {
      top.style.transform = '';
      top.style.transition = 'transform 0.7s var(--ease-out)';
    }
    if (bot) {
      bot.style.transform = '';
      bot.style.transition = 'transform 0.7s var(--ease-out)';
    }
  });

  hero.addEventListener('mouseenter', () => {
    stack.style.transition = 'none';
    if (main) main.style.transition = 'none';
    if (top) top.style.transition = 'none';
    if (bot) bot.style.transition = 'none';
  });
})();


/* ================================================
   17. INTERACTIVE TAX SAVINGS & DEDUCTION CALCULATOR
   ================================================ */
(function initTaxCalculator() {
  const incomeSlider = document.getElementById('calc-income-slider');
  const incomeVal = document.getElementById('calc-income-val');
  const totalDisplay = document.getElementById('calc-total-display');
  const monthlyDisplay = document.getElementById('calc-monthly-display');
  const dedTotal = document.getElementById('calc-ded-total');
  const checkboxes = document.querySelectorAll('.calc-checkbox');
  const selectAllBtn = document.getElementById('calc-select-all');
  const sendBtn = document.getElementById('calc-send-blueprint-btn');
  const familyToggles = document.querySelectorAll('.family-toggle');
  const familyCounts = document.querySelectorAll('.family-count');
  const incomeContext = document.getElementById('calc-income-context');
  const childCheckbox = document.getElementById('opt-child');

  if (!incomeSlider || !totalDisplay) return;

  let currentSavings = 12800;
  let animFrameId = null;

  function getSelectedChildCount() {
    const active = document.querySelector('.family-count.active');
    if (!active) return 0;
    const value = parseInt(active.dataset.count, 10);
    return Number.isFinite(value) ? value : 0;
  }

  function getHasChildren() {
    const active = document.querySelector('.family-toggle.active');
    if (!active) return true;
    return active.dataset.hasChildren === 'true';
  }

  function updateFamilyUi() {
    const hasChildren = getHasChildren();
    const childCount = getSelectedChildCount();
    const countGroup = document.querySelector('.family-count-group');

    familyToggles.forEach(btn => {
      const isActive = btn.dataset.hasChildren === String(hasChildren);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    familyCounts.forEach(btn => {
      const isActive = Number(btn.dataset.count) === childCount;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    if (countGroup) countGroup.classList.toggle('is-hidden', !hasChildren);

    if (childCheckbox) {
      childCheckbox.disabled = !hasChildren;
      if (!hasChildren) childCheckbox.checked = false;
    }

    if (incomeContext) {
      const income = parseInt(incomeSlider.value, 10);
      const familyText = hasChildren ? `${childCount} child${childCount === 1 ? '' : 'ren'} in the home` : 'no children in the home';

      let story = 'At this income level, the opportunity is meaningful — especially if you are running a legitimate home business and documenting everyday deductions.';
      if (income <= 60000) {
        story = 'At this income level, a clean home-business structure can still produce a noticeable cash-flow lift.';
      } else if (income <= 100000) {
        story = 'At this income level, the deduction opportunity is strong — especially when your household is balancing business and family expenses.';
      } else if (income <= 160000) {
        story = 'At this income level, the tax strategy opportunity becomes more powerful, and household planning can widen your annual savings window.';
      } else if (income > 160000) {
        story = 'At this income level, the savings opportunity is substantial — the combination of higher income, family support, and business write-offs can create a meaningful annual return.';
      }

      incomeContext.textContent = `${story} Household snapshot: ${familyText}.`;
    }
  }

  function calculate() {
    const income = parseInt(incomeSlider.value, 10);
    const hasChildren = getHasChildren();
    const childCount = getSelectedChildCount();
    incomeVal.textContent = '$' + income.toLocaleString();

    let taxRate = 0.28;
    let scaleMultiplier = 1.0;

    if (income <= 60000) {
      taxRate = 0.22;
      scaleMultiplier = 0.85;
    } else if (income <= 100000) {
      taxRate = 0.28;
      scaleMultiplier = 1.0;
    } else if (income <= 160000) {
      taxRate = 0.32;
      scaleMultiplier = 1.18;
    } else {
      taxRate = 0.37;
      scaleMultiplier = 1.35;
    }

    let sumDeductions = 0;

    checkboxes.forEach(cb => {
      const parent = cb.closest('.calc-option');
      if (!parent) return;

      let baseVal = parseInt(cb.dataset.val, 10);
      if (cb.id === 'opt-child' && !hasChildren) {
        baseVal = 0;
      }

      if (cb.id === 'opt-child' && hasChildren && childCount > 0) {
        baseVal = 2600 + ((childCount - 1) * 1100);
      }

      const scaledVal = Math.round(baseVal * scaleMultiplier);
      const amountEl = parent.querySelector('.calc-opt-amount');
      const barFill = parent.querySelector('.calc-opt-bar-fill');

      if (amountEl) amountEl.textContent = '$' + scaledVal.toLocaleString();
      if (barFill) {
        const pct = Math.min(Math.round((scaledVal / 5600) * 100), 100);
        barFill.style.width = pct + '%';
      }

      if (cb.checked) {
        parent.classList.add('active');
        sumDeductions += scaledVal;
      } else {
        parent.classList.remove('active');
      }
    });

    const calculatedSavings = Math.round(sumDeductions * taxRate);
    const calculatedMonthly = Math.round(calculatedSavings / 12);

    if (dedTotal) dedTotal.textContent = '$' + sumDeductions.toLocaleString();
    if (monthlyDisplay) monthlyDisplay.textContent = '+$' + calculatedMonthly.toLocaleString() + '/mo';

    animateSavingsNumber(currentSavings, calculatedSavings);
    currentSavings = calculatedSavings;

    if (selectAllBtn) {
      const allChecked = Array.from(checkboxes).every(c => c.checked || c.disabled);
      selectAllBtn.textContent = allChecked ? 'Deselect All' : 'Select All';
    }

    updateFamilyUi();
  }

  function animateSavingsNumber(start, target) {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    const duration = 280;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(start + (target - start) * ease);
      totalDisplay.innerHTML = '$' + val.toLocaleString() + '<span class="cs-suffix">/yr</span>';
      if (progress < 1) {
        animFrameId = requestAnimationFrame(tick);
      }
    }
    animFrameId = requestAnimationFrame(tick);
  }

  familyToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.hasChildren === 'true';
      if (value) {
        document.querySelectorAll('.family-toggle').forEach(toggle => {
          toggle.classList.toggle('active', toggle === btn);
          toggle.setAttribute('aria-pressed', String(toggle === btn));
        });
      } else {
        document.querySelectorAll('.family-toggle').forEach(toggle => {
          toggle.classList.toggle('active', toggle === btn);
          toggle.setAttribute('aria-pressed', String(toggle === btn));
        });
      }
      calculate();
    });
  });

  familyCounts.forEach(btn => {
    btn.addEventListener('click', () => {
      familyCounts.forEach(item => {
        const selected = item === btn;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      calculate();
    });
  });

  incomeSlider.addEventListener('input', calculate);
  checkboxes.forEach(cb => cb.addEventListener('change', calculate));

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const allChecked = Array.from(checkboxes).every(c => c.checked || c.disabled);
      checkboxes.forEach(cb => { if (!cb.disabled) cb.checked = !allChecked; });
      calculate();
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      const serviceSelect = document.getElementById('cf-service');
      const msgArea = document.getElementById('cf-msg');
      const nameInput = document.getElementById('cf-name');

      if (serviceSelect) serviceSelect.value = 'workshop';

      const incomeStr = incomeVal.textContent;
      const savingsStr = '$' + currentSavings.toLocaleString();
      const monthlyStr = monthlyDisplay ? monthlyDisplay.textContent : '';
      const childCount = getSelectedChildCount();
      const householdText = childCount > 0 ? `${childCount} child${childCount === 1 ? '' : 'ren'}` : 'no children';

      const checkedTitles = Array.from(checkboxes)
        .filter(c => c.checked)
        .map(c => {
          const t = c.closest('.calc-option')?.querySelector('.calc-opt-title');
          return t ? t.textContent.replace(/^[^\w\s]+/, '').trim() : '';
        })
        .filter(Boolean);

      if (msgArea) {
        msgArea.value = `Hi Debra,\n\nI ran my numbers on your interactive tax calculator with an estimated annual household income of ${incomeStr}.\n\nMy estimated tax savings: ${savingsStr}/year (${monthlyStr})\nFamily snapshot: ${householdText}\nStrategies I selected:\n• ${checkedTitles.join('\n• ')}\n\nI would like to review my numbers and discuss the right next step for my household and tax strategy.`;
      }

      if (contactSection) {
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        const top = contactSection.getBoundingClientRect().top + window.scrollY - navH - 12;
        window.scrollTo({ top, behavior: 'smooth' });

        setTimeout(() => {
          if (nameInput) nameInput.focus();
          const form = document.getElementById('contact-form');
          if (form) {
            form.animate([
              { boxShadow: '0 0 0 0 rgba(52,211,153,0)' },
              { boxShadow: '0 0 0 4px rgba(52,211,153,0.5), 0 20px 50px rgba(124,58,237,0.35)' },
              { boxShadow: '0 0 0 0 rgba(52,211,153,0)' }
            ], { duration: 1800, easing: 'ease-out' });
          }
        }, 600);
      }
    });
  }

  calculate();
})();


/* ================================================
   18. FAQ ACCORDION
   ================================================ */
(function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
   const btn = item.querySelector('.faq-question');
   const answer = item.querySelector('.faq-answer');
   if (!btn || !answer) return;

   btn.addEventListener('click', () => {
     const isOpen = item.classList.contains('active');
     items.forEach(other => {
       other.classList.remove('active');
       const otherBtn = other.querySelector('.faq-question');
       const otherAnswer = other.querySelector('.faq-answer');
       if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
       if (otherAnswer) otherAnswer.style.maxHeight = null;
     });

     if (!isOpen) {
       item.classList.add('active');
       btn.setAttribute('aria-expanded', 'true');
       answer.style.maxHeight = answer.scrollHeight + 'px';
     }
   });

   if (item.classList.contains('active')) {
     answer.style.maxHeight = answer.scrollHeight + 'px';
   }
  });
})();


/* ================================================
   19. PAGE LOAD FADE-IN
   ================================================ */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.4s ease';
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
