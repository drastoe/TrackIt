
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

function getPasswordStrength(password) {
  if (!password) return { level: 'empty', text: 'At least 8 characters' };

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const score = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  if (password.length >= 12 && score >= 3) {
    return { level: 'strong', text: 'Very strong' };
  }

  if (password.length >= 8 && score >= 2) {
    return { level: 'medium', text: 'Strong' };
  }

  return { level: 'weak', text: 'At least 8 characters' };
}

const form = document.getElementById('signup-form');
const termsCheckbox = document.getElementById('checkbox');
const submitButton = document.getElementById('signup-submit');
const termsError = document.getElementById('terms-error');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirmPassword');
const strengthBar = document.querySelector('.password-meter-bar');
const strengthText = document.getElementById('password-strength-text');
const confirmStatus = document.getElementById('confirm-password-status');

function updatePasswordStrength() {
  if (!passwordField || !strengthBar || !strengthText) return;

  const { level, text } = getPasswordStrength(passwordField.value);
  strengthBar.classList.remove('weak', 'medium', 'strong');
  strengthText.classList.remove('weak', 'medium', 'strong');

  if (!passwordField.value) {
    strengthText.textContent = 'At least 8 characters';
    return;
  }

  strengthBar.classList.add(level);
  strengthText.classList.add(level);
  strengthText.textContent = text;
}

function updateConfirmMatchState() {
  if (!confirmPasswordField || !confirmStatus || !passwordField) return;

  const passwordValue = passwordField.value || '';
  const confirmValue = confirmPasswordField.value || '';

  confirmStatus.classList.remove('matched', 'mismatch');

  if (!confirmValue) {
    confirmStatus.textContent = 'Type your password again';
    return;
  }

  if (confirmValue === passwordValue && passwordValue.length >= 8) {
    confirmStatus.textContent = 'Passwords match';
    confirmStatus.classList.add('matched');
    return;
  }

  confirmStatus.textContent = 'Passwords do not match';
  confirmStatus.classList.add('mismatch');
}

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

if (passwordField) {
  passwordField.addEventListener('input', () => {
    updatePasswordStrength();
    updateConfirmMatchState();
  });
}

if (confirmPasswordField) {
  confirmPasswordField.addEventListener('input', updateConfirmMatchState);
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
    const passwordIsStrong = passwordValue.length >= 8 && /[A-Z]/.test(passwordValue) && /\d/.test(passwordValue) && /[^A-Za-z0-9]/.test(passwordValue);
    if (!passwordIsStrong) { showError(password, true); valid = false; } else showError(password, false);

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