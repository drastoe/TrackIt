function togglePassword(fieldId, el) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const isHidden = field.type === 'password';
  try {
    field.type = isHidden ? 'text' : 'password';
  } catch (e) {
    // some browsers may throw if type change is disallowed; ignore
  }
  if (el && typeof el.textContent !== 'undefined') {
    el.textContent = isHidden ? 'Hide' : 'Show';
  }
}

function showError(input, show) {
  if (!input) return;
  const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
  input.classList.toggle('error', show);
  if (errorEl) errorEl.classList.toggle('show', show);
}

function getPasswordStrength(password) {
  if (!password) return { level: 'empty', text: 'At least 8 characters' };
  if (password.length < 8) return { level: 'weak', text: 'At least 8 characters' };
  if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    return { level: 'strong', text: 'Strong' };
  }
  if (password.length >= 8) {
    return { level: 'medium', text: 'Good' };
  }
  return { level: 'weak', text: 'At least 8 characters' };
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reset-form');
  const requestView = document.getElementById('request-view');
  const confirmView = document.getElementById('confirm-view');
  const newPassword = document.getElementById('newpassword');
  const confirmPassword = document.getElementById('confirmpassword');
  const strengthBar = document.querySelector('.password-meter-bar');
  const strengthText = document.getElementById('password-strength-text');
  const confirmStatus = document.getElementById('confirm-password-status');

  function setStrengthState(value) {
    const strength = getPasswordStrength(value);
    if (!strengthBar || !strengthText) return;

    strengthBar.classList.remove('weak', 'medium', 'strong');
    strengthText.classList.remove('weak', 'medium', 'strong');

    if (!value) {
      strengthText.textContent = 'At least 8 characters';
      return;
    }

    strengthBar.classList.add(strength.level);
    strengthText.classList.add(strength.level);
    strengthText.textContent = strength.text;
  }

  function setConfirmState() {
    if (!confirmPassword || !confirmStatus || !newPassword) return;

    const newValue = (newPassword.value || '').trim();
    const confirmValue = (confirmPassword.value || '').trim();

    confirmStatus.classList.remove('matched', 'mismatch');

    if (!confirmValue) {
      confirmStatus.textContent = 'Type your password again';
      return;
    }

    if (confirmValue === newValue && newValue.length >= 8) {
      confirmStatus.textContent = 'Passwords match';
      confirmStatus.classList.add('matched');
      return;
    }

    confirmStatus.textContent = 'Passwords do not match';
    confirmStatus.classList.add('mismatch');
  }

  if (newPassword) {
    newPassword.addEventListener('input', () => {
      setStrengthState(newPassword.value);
      setConfirmState();
    });
  }

  if (confirmPassword) {
    confirmPassword.addEventListener('input', setConfirmState);
  }

  if (!form) return;

  function showConfirm() {
    if (requestView) requestView.classList.remove('active');
    if (confirmView) confirmView.classList.add('active');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) return;

    const newValue = (newPassword.value || '').trim();
    const confirmValue = (confirmPassword.value || '').trim();

    let valid = true;

    if (!newValue || newValue.length < 8) {
      showError(newPassword, true);
      valid = false;
    } else {
      showError(newPassword, false);
    }

    if (!confirmValue || confirmValue !== newValue) {
      showError(confirmPassword, true);
      valid = false;
    } else {
      showError(confirmPassword, false);
    }

    if (!valid) return;

    showConfirm();
  });
});
