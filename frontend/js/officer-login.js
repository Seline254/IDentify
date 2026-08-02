/**
 * officerLogin.js - handles the officer sign-in form
 * Wires to API.officerLogin() in api.js, which POSTs to /officer/login
 */

function showToast(message, tone = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMsg');
  icon.innerHTML = tone === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-triangle-exclamation"></i>';
  msg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

async function handleOfficerLogin(event) {
  event.preventDefault();

  const form = document.getElementById('officerLoginForm');
  const submitBtn = document.getElementById('officerLoginSubmit');
  const workId = form.workId.value.trim();
  const phoneNumber = form.phoneNumber.value.trim();

  if (!workId || !phoneNumber) {
    showToast('Enter both your Work ID and phone number.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in…';

  try {
    // TODO (backend): /officer/login.php is currently a stub. Expected contract:
    // request  { workId, phoneNumber }
    // response { success: true, data: { token, officer: { workId, firstName, lastName } } }
    const res = await API.officerLogin({ workId, phoneNumber });

    Auth.setToken(res.data.token);
    Auth.setUser(res.data.officer);

    showToast('Signed in. Redirecting…', 'success');
    setTimeout(() => { window.location.href = 'officer.html'; }, 600);
  } catch (error) {
    showToast(error.message || 'Sign in failed. Check your details and try again.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
  }
}

function initTheme() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('identify-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  const themeButton = document.getElementById('themeToggle');
  themeButton.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  themeButton.addEventListener('click', () => {
    const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('identify-theme', nextTheme);
    themeButton.innerHTML = nextTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });
}

function init() {
  initTheme();

  // If already signed in, skip the login form entirely
  if (Auth.isLoggedIn()) {
    window.location.href = 'officer.html';
    return;
  }

  document.getElementById('officerLoginForm').addEventListener('submit', handleOfficerLogin);
}

init();