// ── NAV ──────────────────────────────────────────────────────
const burger = document.getElementById('navBurger');
const mobile = document.getElementById('navMobile');
if (burger && mobile) {
  burger.addEventListener('click', () => {
    mobile.classList.toggle('open');
  });
}

// ── COPY FUNCTIONS ────────────────────────────────────────────
function copyBrew() {
  const el = document.getElementById('brewCmd');
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    showCopyFeedback(document.querySelector('.brew-copy'));
  });
}

function copyCmd(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    const btn = el.nextElementSibling;
    showCopyFeedback(btn);
  });
}

function showCopyFeedback(btn) {
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = '✓';
  btn.style.color = 'var(--acc)';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.color = '';
  }, 1800);
}

// ── PRICING TOGGLE ────────────────────────────────────────────
function showMonthly() {
  const pm = document.getElementById('priceMonthly');
  const py = document.getElementById('priceYearly');
  const pdm = document.getElementById('periodMonthly');
  const pdy = document.getElementById('periodYearly');
  const bm = document.getElementById('btnMonthly');
  const by = document.getElementById('btnYearly');
  if (!pm) return;
  pm.style.display = ''; py.style.display = 'none';
  pdm.style.display = ''; pdy.style.display = 'none';
  bm.classList.add('pt-btn--active');
  by.classList.remove('pt-btn--active');
}

function showYearly() {
  const pm = document.getElementById('priceMonthly');
  const py = document.getElementById('priceYearly');
  const pdm = document.getElementById('periodMonthly');
  const pdy = document.getElementById('periodYearly');
  const bm = document.getElementById('btnMonthly');
  const by = document.getElementById('btnYearly');
  if (!py) return;
  pm.style.display = 'none'; py.style.display = '';
  pdm.style.display = 'none'; pdy.style.display = '';
  bm.classList.remove('pt-btn--active');
  by.classList.add('pt-btn--active');
}

// ── NAV SCROLL (theme-aware) ──────────────────────────────────
let lastY = 0;
const nav = document.getElementById('nav');
function updateNavBg() {
  if (!nav) return;
  const y = window.scrollY;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    nav.style.background = y > 40 ? 'rgba(248,248,250,.95)' : 'rgba(248,248,250,.85)';
  } else {
    nav.style.background = y > 40 ? 'rgba(4,4,10,.92)' : 'rgba(4,4,10,.72)';
  }
}
window.addEventListener('scroll', () => { updateNavBg(); lastY = window.scrollY; }, { passive: true });

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.feat-card, .pricing-card, .retro-card, .faq-item, .cl-entry, .dl-sysreq-item'
);
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeUp .5s ease both';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => {
    el.style.opacity = '0';
    io.observe(el);
  });
}

// ── THEME TOGGLE ──────────────────────────────────────────────
(function () {
  var html = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var toggleMobile = document.getElementById('themeToggleMobile');
  var mobileLabel = document.getElementById('themeToggleMobileLabel');

  function isDark() {
    return html.getAttribute('data-theme') !== 'light';
  }

  function setTheme(mode) {
    if (mode === 'light') {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('relay-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('relay-theme', 'dark');
    }
    if (mobileLabel) {
      mobileLabel.textContent = isDark() ? 'Light Mode' : 'Dark Mode';
    }
    updateNavBg();
  }

  function handleToggle() {
    setTheme(isDark() ? 'light' : 'dark');
  }

  if (toggle) toggle.addEventListener('click', handleToggle);
  if (toggleMobile) toggleMobile.addEventListener('click', handleToggle);

  if (mobileLabel) {
    mobileLabel.textContent = isDark() ? 'Light Mode' : 'Dark Mode';
  }
}());
