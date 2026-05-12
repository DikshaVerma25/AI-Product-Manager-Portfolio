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
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('.count-up').forEach(el => countObs.observe(el));

/* ════════════════════════════════════════
   HORIZONTAL TIMELINE
════════════════════════════════════════ */
(function initTimeline() {
  const track    = document.getElementById('tl-track');
  const viewport = document.getElementById('tl-viewport');
  const btnLeft  = document.getElementById('tl-left');
  const btnRight = document.getElementById('tl-right');
  if (!track || !viewport || !btnLeft || !btnRight) return;

  const NODE_W = 230;
  let pos = 0;

  function getMax() {
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  }
  function render() {
    const max = getMax();
    pos = Math.max(0, Math.min(pos, max));
    track.style.transform = `translateX(${-pos}px)`;
    btnLeft.disabled  = pos <= 0;
    btnRight.disabled = pos >= max;
  }

  btnLeft.addEventListener('click',  () => { pos -= NODE_W; render(); });
  btnRight.addEventListener('click', () => { pos += NODE_W; render(); });

  // Touch / mouse drag
  let startX = 0, startPos = 0, dragging = false;
  viewport.addEventListener('mousedown', e => {
    dragging = true; startX = e.clientX; startPos = pos;
    viewport.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    pos = startPos - (e.clientX - startX);
    render();
  });
  window.addEventListener('mouseup', () => { dragging = false; viewport.style.cursor = ''; });

  viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; startPos = pos; }, { passive: true });
  viewport.addEventListener('touchmove',  e => { pos = startPos - (e.touches[0].clientX - startX); render(); }, { passive: true });

  window.addEventListener('resize', render);
  render();
})();

/* ════════════════════════════════════════
   RESUME MODAL
════════════════════════════════════════ */
const modal    = document.getElementById('resume-modal');
const openBtns = document.querySelectorAll('[data-open-resume]');
const closeBtns= document.querySelectorAll('[data-close-resume]');

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
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ════════════════════════════════════════
   FLOATING BACKGROUND ICONS
════════════════════════════════════════ */
(function initBgIcons() {
  const container = document.getElementById('bg-icons');
  if (!container) return;

  // x/y in vw/vh, size in px, opacity on white bg
  const icons = [
    { i:'fa-robot',         c:'#7c3aed', s:62, x:3,  y:10, a:'floatA', d:8,   dl:0    },
    { i:'fa-brain',         c:'#d97706', s:50, x:88, y:8,  a:'floatB', d:10,  dl:-1.5 },
    { i:'fa-microchip',     c:'#047857', s:54, x:20, y:72, a:'floatC', d:9,   dl:-3   },
    { i:'fa-database',      c:'#0369a1', s:46, x:80, y:62, a:'floatA', d:12,  dl:-0.5 },
    { i:'fa-code-branch',   c:'#b91c1c', s:56, x:47, y:4,  a:'floatD', d:7,   dl:-2   },
    { i:'fa-chart-line',    c:'#7c3aed', s:42, x:14, y:38, a:'floatB', d:11,  dl:-4   },
    { i:'fa-leaf',          c:'#047857', s:66, x:85, y:42, a:'floatA', d:9,   dl:-1   },
    { i:'fa-lightbulb',     c:'#d97706', s:50, x:62, y:82, a:'floatC', d:8,   dl:-6   },
    { i:'fa-rocket',        c:'#7c3aed', s:54, x:35, y:88, a:'floatB', d:13,  dl:-2.5 },
    { i:'fa-cog',           c:'#94a3b8', s:44, x:72, y:18, a:'floatD', d:15,  dl:-3.5 },
    { i:'fa-layer-group',   c:'#0369a1', s:42, x:8,  y:55, a:'floatA', d:10,  dl:-5   },
    { i:'fa-seedling',      c:'#047857', s:56, x:52, y:50, a:'floatC', d:7.5, dl:-0.5 },
    { i:'fa-star',          c:'#d97706', s:38, x:93, y:78, a:'floatB', d:9,   dl:-7   },
    { i:'fa-infinity',      c:'#7c3aed', s:62, x:28, y:22, a:'floatA', d:11,  dl:-1.5 },
    { i:'fa-network-wired', c:'#0369a1', s:46, x:60, y:28, a:'floatD', d:8,   dl:-4.5 },
    { i:'fa-bolt',          c:'#b91c1c', s:40, x:2,  y:84, a:'floatC', d:12,  dl:-2   },
  ];

  icons.forEach(def => {
    const el = document.createElement('div');
    el.innerHTML = `<i class="fas ${def.i}"></i>`;
    Object.assign(el.style, {
      position:       'fixed',
      left:           `${def.x}vw`,
      top:            `${def.y}vh`,
      fontSize:       `${def.s}px`,
      color:          def.c,
      opacity:        '0.032',
      pointerEvents:  'none',
      zIndex:         '0',
      animation:      `${def.a} ${def.d}s ease-in-out infinite`,
      animationDelay: `${def.dl}s`,
      lineHeight:     '1',
    });
    container.appendChild(el);
  });
})();

