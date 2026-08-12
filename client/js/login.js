function togglePassword(fieldId, el) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const isHidden = field.type === 'password';
  try {
    field.type = isHidden ? 'text' : 'password';
  } catch (e) {
    // some browsers may throw if type change is disallowed; ignore
  }
  if (el && typeof el.textContent !== 'undefined') el.textContent = isHidden ? 'Hide' : 'Show';
}

function showError(input, show) {
  if (!input) return;
  const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
  input.classList.toggle('error', show);
  if (errorEl) errorEl.classList.toggle('show', show);
}

const form = document.getElementById('login-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (!email || !password) {
      console.warn('Login form fields missing');
      return;
    }

    const emailValue = String(email.value || '');
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.trim());
    if (!emailValid) { showError(email, true); valid = false; } else showError(email, false);

    if (!String(password.value || '').trim()) { showError(password, true); valid = false; } else showError(password, false);

    if (!valid) return;

    // No backend yet — this is where credentials would be verified against the server.
    alert('Login details look good. Backend connection needed to actually authenticate.');
  });
} else {
  console.warn('No login form found (id=login-form)');
}