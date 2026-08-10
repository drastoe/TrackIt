
function togglePassword(fieldId, el) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const isHidden = field.type === 'password';
  try {
    field.type = isHidden ? 'text' : 'password';
  } catch (e) {
    // ignore if the browser doesn't allow type switching
  }
  if (el && typeof el.textContent !== 'undefined') el.textContent = isHidden ? 'Hide' : 'Show';
}

function showError(input, show) {
  if (!input) return;
  const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
  input.classList.toggle('error', show);
  if (errorEl) errorEl.classList.toggle('show', show);
}

const form = document.getElementById('signup-form');
const termsCheckbox = document.getElementById('checkbox');
const submitButton = document.getElementById('signup-submit');
const termsError = document.getElementById('terms-error');

function updateSubmitState() {
  if (!termsCheckbox || !submitButton) return;
  const agreed = termsCheckbox.checked;
  submitButton.classList.toggle('opacity-50', !agreed);
  submitButton.classList.toggle('cursor-not-allowed', !agreed);
  submitButton.setAttribute('aria-disabled', String(!agreed));
  if (termsError && agreed) {
    termsError.style.display = 'none';
  }
}

if (termsCheckbox && submitButton) {
  updateSubmitState();
  termsCheckbox.addEventListener('change', () => {
    updateSubmitState();
    if (termsError) termsError.style.display = 'none';
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const firstName = document.getElementById('firstName');
    const surname = document.getElementById('surname');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if (!firstName || !surname || !phone || !email || !password || !confirmPassword) {
      console.warn('Signup form fields are missing');
      return;
    }

    if (!firstName.value.trim()) { showError(firstName, true); valid = false; } else showError(firstName, false);
    if (!surname.value.trim()) { showError(surname, true); valid = false; } else showError(surname, false);

    const phoneDigits = String(phone.value || '').replace(/\D/g, '');
    if (phoneDigits.length < 10) { showError(phone, true); valid = false; } else showError(phone, false);

    const emailValue = String(email.value || '');
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.trim());
    if (!emailValid) { showError(email, true); valid = false; } else showError(email, false);

    const passwordValue = String(password.value || '');
    if (passwordValue.length < 8) { showError(password, true); valid = false; } else showError(password, false);

    const confirmValue = String(confirmPassword.value || '');
    if (confirmValue !== passwordValue || !confirmValue) {
      showError(confirmPassword, true); valid = false;
    } else showError(confirmPassword, false);

    if (!termsCheckbox || !termsCheckbox.checked) {
      valid = false;
      if (termsError) {
        termsError.style.display = 'block';
      }
      if (termsCheckbox) termsCheckbox.focus();
    }

    if (!valid) return;

    // No backend yet — this is where account creation would be sent to the server.
    window.location.href = "../onboarding/setup.html";
  });
} else {
  console.warn('No signup form found (id=signup-form)');
}