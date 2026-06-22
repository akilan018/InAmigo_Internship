/* ============================================================
   InAmigos Foundation – project.js
   Shared JavaScript for all individual project pages
   Located: projects/js/project.js
============================================================ */
'use strict';

/* ── MOBILE MENU ────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right')
  .forEach(el => observer.observe(el));

/* ── ANIMATED COUNTERS ──────────────────────────────────────── */
function animateCounter(el) {
  const raw    = el.dataset.target;
  const isPlus = raw.endsWith('+');
  const target = parseInt(raw.replace(/\D/g, ''), 10);
  const dur    = 2200;
  const step   = target / (dur / 16);
  let current  = 0;
  const tick = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current).toLocaleString('en-IN') + (isPlus ? '+' : '');
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString('en-IN') + (isPlus ? '+' : '');
    }
  };
  tick();
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.metric-num, .hero-stat-num').forEach(num => {
        if (!num.dataset.animated) {
          num.dataset.animated = 'true';
          animateCounter(num);
        }
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.metrics-section, .project-hero').forEach(el => {
  counterObs.observe(el);
});

/* ── BACK TO TOP ────────────────────────────────────────────── */
const btt = document.getElementById('backToTop');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 350);
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── GOAL CARD TILT ─────────────────────────────────────────── */
document.querySelectorAll('.goal-card, .help-card, .other-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s cubic-bezier(0.23,1,0.32,1)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease, border-color 0.4s ease';
  });
});

/* ── PAGE FADE IN ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 40);

  // Stagger-reveal hero content
  setTimeout(() => {
    document.querySelectorAll('.project-hero-content .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 130);
    });
  }, 250);
});

/* ── PROGRESS BAR ON SCROLL ─────────────────────────────────── */
const bar = document.createElement('div');
bar.style.cssText = `
  position: fixed; top: 0; left: 0; z-index: 2000;
  height: 3px; width: 0%;
  background: linear-gradient(90deg, var(--accent, #FF6B35), #FFD166);
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.prepend(bar);

window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  bar.style.width = Math.min(pct, 100) + '%';
});
