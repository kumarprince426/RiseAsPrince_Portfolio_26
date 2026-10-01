// ===== Navbar hamburger =====
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks && navLinks.classList.remove('open'));
});

// ===== Active nav link based on current page =====
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Skill bars animation =====
const skillFills = document.querySelectorAll('.skill-fill');
if (skillFills.length) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.pct + '%';
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(fill => barObserver.observe(fill));
}

// ===== Typed text effect (hero page) =====
const typedEl = document.querySelector('.typed');
if (typedEl) {
  const roles = [
    'Aspiring DevOps Engineer',
    'Cloud Infrastructure Builder',
    'CI/CD Pipeline Architect',
    'Docker & Kubernetes Enthusiast',
    'Infrastructure as Code Practitioner',
    'Site Reliability Explorer'
  ];
  let ri = 0, ci = 0, deleting = false;
  function type() {
    const current = roles[ri];
    typedEl.textContent = deleting ? current.substring(0, ci--) : current.substring(0, ci++);
    let delay = deleting ? 60 : 100;
    if (!deleting && ci > current.length) { delay = 1800; deleting = true; }
    else if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 400; }
    setTimeout(type, delay);
  }
  type();
}

// ===== Contact form handler =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const success = document.getElementById('formSuccess');
    success.classList.add('show');
    contactForm.reset();
    setTimeout(() => success.classList.remove('show'), 4000);
  });
}

// ===== Smooth counter animation (about page) =====
document.querySelectorAll('.stat-num[data-count]').forEach(el => {
  const target = +el.dataset.count;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let count = 0;
      const step = Math.ceil(target / 50);
      const interval = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count + (el.dataset.suffix || '');
        if (count >= target) clearInterval(interval);
      }, 30);
      observer.disconnect();
    }
  });
  observer.observe(el);
});

// ===== Navbar Auth State =====
(function() {
  function getSession() {
    try { return JSON.parse(localStorage.getItem('rap_session')); } catch { return null; }
  }

  const authArea  = document.getElementById('navAuthArea');
  const userArea  = document.getElementById('navUserArea');
  const nameEl    = document.getElementById('navUserName');
  const dotEl     = document.getElementById('navUserDot');
  const logoutBtn = document.getElementById('navLogout');

  if (!authArea) return; // page has no auth area

  const session = getSession();
  if (session) {
    authArea.classList.add('hidden');
    userArea.classList.remove('hidden');
    nameEl.textContent = session.name.split(' ')[0];
    dotEl.textContent  = session.name.charAt(0).toUpperCase();
  } else {
    authArea.classList.remove('hidden');
    userArea.classList.add('hidden');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('rap_session');
      window.location.reload();
    });
  }
})();
