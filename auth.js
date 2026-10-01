// ===== Tab switcher =====
function switchTab(tab) {
  const loginWrap  = document.getElementById('loginWrap');
  const signupWrap = document.getElementById('signupWrap');
  const tabLogin   = document.getElementById('tabLogin');
  const tabSignup  = document.getElementById('tabSignup');

  if (tab === 'login') {
    loginWrap.classList.remove('hidden');
    signupWrap.classList.add('hidden');
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    document.getElementById('loginErr').textContent = '';
  } else {
    signupWrap.classList.remove('hidden');
    loginWrap.classList.add('hidden');
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    document.getElementById('signupErr').textContent = '';
  }
}

// ===== Password toggle =====
document.querySelectorAll('.pw-eye').forEach(btn => {
  btn.addEventListener('click', () => {
    const inp = document.getElementById(btn.dataset.t);
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.textContent = inp.type === 'password' ? '👁' : '🙈';
  });
});

// ===== Helpers =====
const isGmail  = v => /^[^\s@]+@gmail\.com$/i.test(v.trim());
const isMobile = v => /^\d{10}$/.test(v.trim());

function getUsers() { return JSON.parse(localStorage.getItem('rap_users') || '[]'); }
function saveUsers(u) { localStorage.setItem('rap_users', JSON.stringify(u)); }
function setSession(u) { localStorage.setItem('rap_session', JSON.stringify(u)); }
function getSession() {
  try { return JSON.parse(localStorage.getItem('rap_session')); } catch { return null; }
}

// Redirect if already logged in
if (getSession()) window.location.href = 'index.html';

// Auto-switch tab from query param (?tab=signup)
if (new URLSearchParams(location.search).get('tab') === 'signup') {
  switchTab('signup');
}

// ===== Signup =====
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const err    = document.getElementById('signupErr');
  const name   = document.getElementById('suName').value.trim();
  const email  = document.getElementById('suEmail').value.trim();
  const mobile = document.getElementById('suMobile').value.trim();
  const pw     = document.getElementById('suPw').value;
  const pw2    = document.getElementById('suPw2').value;

  err.textContent = '';
  if (!name)                      { err.textContent = 'Please enter your full name.'; return; }
  if (!isGmail(email))            { err.textContent = 'Enter a valid Gmail ID (e.g. name@gmail.com).'; return; }
  if (!isMobile(mobile))          { err.textContent = 'Enter a valid 10-digit mobile number.'; return; }
  if (pw.length < 6)              { err.textContent = 'Password must be at least 6 characters.'; return; }
  if (pw !== pw2)                 { err.textContent = 'Passwords do not match.'; return; }

  const users = getUsers();
  if (users.find(u => u.email === email.toLowerCase())) {
    err.textContent = 'This Gmail is already registered. Please login.'; return;
  }
  if (users.find(u => u.mobile === mobile)) {
    err.textContent = 'This mobile number is already registered. Please login.'; return;
  }

  const newUser = { name, email: email.toLowerCase(), mobile, pw };
  users.push(newUser);
  saveUsers(users);
  setSession({ name, email: newUser.email, mobile });
  window.location.href = 'index.html';
});

// ===== Login =====
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const err = document.getElementById('loginErr');
  const id  = document.getElementById('loginId').value.trim();
  const pw  = document.getElementById('loginPw').value;

  err.textContent = '';
  if (!id) { err.textContent = 'Please enter your Gmail or mobile number.'; return; }
  if (!pw) { err.textContent = 'Please enter your password.'; return; }

  if (!isGmail(id) && !isMobile(id)) {
    err.textContent = 'Enter a valid Gmail (name@gmail.com) or 10-digit mobile number.'; return;
  }

  const users = getUsers();
  const user = users.find(u =>
    (u.email === id.toLowerCase() || u.mobile === id) && u.pw === pw
  );

  if (!user) { err.textContent = 'Invalid credentials. Please check and try again.'; return; }

  setSession({ name: user.name, email: user.email, mobile: user.mobile });
  window.location.href = 'index.html';
});
