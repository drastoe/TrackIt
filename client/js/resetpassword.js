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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reset-form');
  const requestView = document.getElementById('request-view');
  const confirmView = document.getElementById('confirm-view');

  if (!form) return;

  function showConfirm() {
    if (requestView) requestView.classList.remove('active');
    if (confirmView) confirmView.classList.add('active');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newpassword');
    const confirmPassword = document.getElementById('confirmpassword');

    let valid = true;

    if (!newPassword || !confirmPassword) return;

    const newValue = (newPassword.value || '').trim();
    const confirmValue = (confirmPassword.value || '').trim();

    if (!newValue) {
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
