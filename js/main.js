'use strict';

/* ════════════════════════════════════════
   NAV — glass on scroll
════════════════════════════════════════ */
const nav     = document.getElementById('nav');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  backTop.classList.toggle('show', window.scrollY > 320);
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ════════════════════════════════════════
   TYPING EFFECT
════════════════════════════════════════ */
const roles = [
  'Technical AI Product Manager.',
  'GenAI Copilot Architect.',
  'Data Platform Strategist.',
  'Cross-functional Leader.',
  'LLMOps Practitioner.',
  '0→1 Product Builder.',
];
let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const word = roles[rIdx];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(type, 2000); return; }
    setTimeout(type, 72);
  } else {
    typedEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
    setTimeout(type, 42);
  }
}
setTimeout(type, 900);

/* ════════════════════════════════════════
   INTERSECTION OBSERVER — REVEAL
════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .impact-card').forEach(el => revealObs.observe(el));

/* ════════════════════════════════════════
   COUNT-UP ANIMATION
════════════════════════════════════════ */
function animateCount(el) {
  const target   = +el.dataset.target;
  const duration = 1700;
  const start    = performance.now();
  (function step(now) {
    const prog = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.round(ease * target);
    if (prog < 1) requestAnimationFrame(step);
  })(start);
}

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.count-up').forEach(el => countObs.observe(el));

/* ════════════════════════════════════════
   HORIZONTAL TIMELINE
════════════════════════════════════════ */
(function initTimeline() {
  const track    = document.getElementById('tl-track');
  const overflow = document.getElementById('tl-overflow');
  const btnLeft  = document.getElementById('tl-left');
  const btnRight = document.getElementById('tl-right');
  if (!track || !overflow || !btnLeft || !btnRight) return;

  const NODE_W = 216; // px per node (width + gap)
  let pos = 0;

  function clamp(val) {
    const max = Math.max(0, track.scrollWidth - overflow.clientWidth);
    return Math.max(0, Math.min(val, max));
  }

  function render() {
    const max = Math.max(0, track.scrollWidth - overflow.clientWidth);
    track.style.transform = `translateX(${-pos}px)`;
    btnLeft.disabled  = pos <= 0;
    btnRight.disabled = pos >= max;
  }

  btnLeft.addEventListener('click',  () => { pos = clamp(pos - NODE_W); render(); });
  btnRight.addEventListener('click', () => { pos = clamp(pos + NODE_W); render(); });

  // drag / touch scroll
  let startX = 0, startPos = 0, dragging = false;

  overflow.addEventListener('mousedown',  e => { dragging = true; startX = e.clientX; startPos = pos; overflow.style.cursor = 'grabbing'; });
  window.addEventListener('mousemove',    e => { if (!dragging) return; pos = clamp(startPos - (e.clientX - startX)); render(); });
  window.addEventListener('mouseup',      ()  => { dragging = false; overflow.style.cursor = ''; });

  overflow.addEventListener('touchstart', e => { startX = e.touches[0].clientX; startPos = pos; }, { passive: true });
  overflow.addEventListener('touchmove',  e => { pos = clamp(startPos - (e.touches[0].clientX - startX)); render(); }, { passive: true });

  window.addEventListener('resize', render);
  render();
})();

/* ════════════════════════════════════════
   RESUME MODAL
════════════════════════════════════════ */
const modal     = document.getElementById('resume-modal');
const openBtns  = document.querySelectorAll('[data-open-resume]');
const closeBtns = document.querySelectorAll('[data-close-resume]');

function openModal()  { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

openBtns.forEach(b  => b.addEventListener('click', openModal));
closeBtns.forEach(b => b.addEventListener('click', closeModal));
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ════════════════════════════════════════
   SMOOTH ANCHOR LINKS
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ════════════════════════════════════════
   FLOATING PETALS (subtle background)
════════════════════════════════════════ */
(function spawnPetals() {
  const container = document.querySelector('.bg-elements');
  if (!container) return;

  const colors = ['#10b981','#f59e0b','#8b5cf6','#f97316','#14b8a6'];

  function createPetal() {
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      width:${6 + Math.random() * 8}px;
      height:${6 + Math.random() * 8}px;
      border-radius:50% 0 50% 0;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      opacity:0;
      left:${Math.random() * 100}%;
      bottom:${-10 + Math.random() * 20}px;
      transform:rotate(${Math.random() * 360}deg);
      pointer-events:none;
    `;
    container.appendChild(el);

    const dur = 8000 + Math.random() * 12000;
    const delay = Math.random() * 6000;

    setTimeout(() => {
      el.style.transition = `transform ${dur}ms linear, bottom ${dur}ms ease-in, opacity ${dur * 0.15}ms ease`;
      el.style.opacity = String(0.06 + Math.random() * 0.1);
      el.style.bottom = `${80 + Math.random() * 40}vh`;
      el.style.transform = `rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 100}px)`;
      setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 1500); }, dur * 0.7);
    }, delay);
  }

  // Spawn initial batch, then ongoing
  for (let i = 0; i < 8; i++) setTimeout(createPetal, i * 800);
  setInterval(createPetal, 3500);
})();
