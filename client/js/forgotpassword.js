function showError(input, show) {
  if (!input) return;
  const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
  input.classList.toggle('error', show);
  if (errorEl) errorEl.classList.toggle('show', show);
}

document.addEventListener('DOMContentLoaded', () => {
  const requestView = document.getElementById('request-view');
  const confirmView = document.getElementById('confirm-view');
  const form = document.getElementById('reset-form');

  if (!form) return;

  function showConfirm(email) {
    const toEmailEl = document.getElementById('sent-to-email');
    if (toEmailEl) toEmailEl.textContent = (email || '').trim() || 'you@example.com';
    if (requestView) requestView.classList.remove('active');
    if (confirmView) confirmView.classList.add('active');
  }

  // Show confirmation if URL indicates a sent/email or token param (useful when user clicks link)
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('sent')) showConfirm(params.get('sent'));
    else if (params.has('email')) showConfirm(params.get('email'));
    else if (params.has('token') || params.has('reset')) showConfirm(params.get('email') || params.get('sent') || '');
  } catch (e) {
    // ignore URL parsing errors
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('reset-email');
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email.value || '').trim());

    if (!emailValid) { showError(email, true); return; }
    showError(email, false);

    // Simulate server action: show confirmation state with email
    showConfirm((email.value || '').trim());
  });

  // Resend cooldown — 60 seconds
  const resendBtn = document.getElementById('resend-btn');
  if (resendBtn) {
    resendBtn.addEventListener('click', () => {
      let seconds = 60;
      resendBtn.disabled = true;
      resendBtn.textContent = `Resend in ${seconds}s`;
      const timer = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(timer);
          resendBtn.disabled = false;
          resendBtn.textContent = 'Resend email';
        } else {
          resendBtn.textContent = `Resend in ${seconds}s`;
        }
      }, 1000);
    });
  }
});
