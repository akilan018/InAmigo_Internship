/* ─────────────────────────────────────────────────────────
   InAmigos Foundation – script.js
   Interactions: navbar scroll, smooth counters, reveal
   animations, particles, mobile menu, back-to-top
───────────────────────────────────────────────────────── */

'use strict';

/* ── NAVBAR SCROLL ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── MOBILE MENU ───────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger lines
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── SCROLL REVEAL ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ── ANIMATED COUNTER ──────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step     = target / (duration / 16);
  let   current  = 0;

  const tick = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current).toLocaleString('en-IN');
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString('en-IN');
    }
  };
  tick();
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter-num, .stat-num').forEach(num => {
        if (!num.dataset.animated) {
          num.dataset.animated = 'true';
          animateCounter(num);
        }
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.counter-strip, .hero-stats').forEach(el => {
  counterObserver.observe(el);
});

/* ── FLOATING PARTICLES ────────────────────────────────── */
const particlesContainer = document.getElementById('particles');

function createParticle() {
  const p   = document.createElement('div');
  const size = Math.random() * 6 + 2;
  const hue  = Math.random() > 0.5 ? '25' : '174'; // orange or teal
  const dur  = Math.random() * 12 + 8;
  const delay = Math.random() * 6;

  p.classList.add('particle');
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    background: hsl(${hue}, 100%, 65%);
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
  `;
  particlesContainer.appendChild(p);
}

for (let i = 0; i < 28; i++) createParticle();

/* ── BACK TO TOP ───────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── SMOOTH SECTION HIGHLIGHT (active nav) ─────────────── */
const sections = document.querySelectorAll('section[id], header[id]');
const navItems = document.querySelectorAll('.nav-link:not(.nav-cta)');

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navItems.forEach(link => {
    link.style.color = '';
    link.style.background = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--orange)';
      link.style.background = 'rgba(255,107,53,0.08)';
    }
  });
}

window.addEventListener('scroll', highlightNav);
highlightNav();

/* ── GALLERY LIGHTBOX (simple zoom overlay) ────────────── */
function buildLightbox() {
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.93); display: none;
    align-items: center; justify-content: center;
    backdrop-filter: blur(6px); cursor: pointer;
  `;
  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 90vw; max-height: 88vh;
    border-radius: 12px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.8);
    transform: scale(0.85); opacity: 0;
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.4s ease;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position: fixed; top: 24px; right: 28px;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
    color: #fff; font-size: 2rem; line-height:1;
    border-radius: 50%; width: 48px; height: 48px;
    cursor: pointer; backdrop-filter: blur(8px);
    transition: background 0.25s;
  `;
  closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = 'rgba(255,107,53,0.4)'; });
  closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = 'rgba(255,255,255,0.12)'; });

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    overlay.style.display = 'flex';
    img.src = src;
    img.alt = alt;
    setTimeout(() => {
      img.style.transform = 'scale(1)';
      img.style.opacity   = '1';
    }, 10);
  }

  function closeLightbox() {
    img.style.transform = 'scale(0.85)';
    img.style.opacity   = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 350);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Bind gallery items
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const imgEl = item.querySelector('img');
      openLightbox(imgEl.src, imgEl.alt);
    });
  });
}

buildLightbox();

/* ── HERO TYPEWRITER EFFECT ────────────────────────────── */
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  heroSub.style.opacity = '0';
  setTimeout(() => {
    heroSub.style.transition = 'opacity 1s ease';
    heroSub.style.opacity    = '1';
  }, 800);
}

/* ── TILT EFFECT ON PROJECT CARDS ──────────────────────── */
document.querySelectorAll('.project-card, .join-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-10px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s cubic-bezier(0.23,1,0.32,1)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease, border-color 0.4s ease';
  });
});

/* ── CONTACT FORM HANDLER ──────────────────────────────────── */
function handleContactForm(e) {
  e.preventDefault();
  const btn     = document.getElementById('submitContactForm');
  const success = document.getElementById('formSuccess');

  // Simulate sending — show spinner
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled  = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#06d6a0,#00b894)';
    success.classList.add('show');

    // Reset after 4 s
    setTimeout(() => {
      document.getElementById('contactForm').reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled  = false;
      success.classList.remove('show');
    }, 4000);
  }, 1500);
}

/* ── PAGE LOAD ANIMATION ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);

  // Trigger hero reveals immediately
  setTimeout(() => {
    document.querySelectorAll('.hero-content .reveal-up').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 150);
    });
  }, 300);
});
