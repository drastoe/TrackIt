const header = document.getElementById('site-header');
const fadeEls = document.querySelectorAll('.fade-up');
const waitlistForm = document.getElementById('waitlist-form');
const waitlistConfirm = document.getElementById('waitlist-confirm');
const periodBtns = document.querySelectorAll('.period-btn');
const labelEl = document.getElementById('period-label');
const amountEl = document.getElementById('period-amount');
const insightEl = document.getElementById('period-insight');

const periodData = {
  day:   { label: 'Spent today',      amount: '₦78,000',  insight: '45% of your money went into Groceries' },
  week:  { label: 'Spent this week',  amount: '₦23,500',  insight: '5.7% of your money went into Transportation' },
  month: { label: 'Spent this month', amount: '₦56,000',  insight: '12.5% of your money went into Personal Income Tax (PIT)' },
};

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  });
}

if (fadeEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach((el) => io.observe(el));
}

if (waitlistForm && waitlistConfirm) {
  waitlistForm.addEventListener('submit', (event) => {
    event.preventDefault();
    waitlistForm.classList.add('hidden');
    waitlistConfirm.classList.remove('hidden');
  });
}

if (periodBtns.length && labelEl && amountEl && insightEl) {
  periodBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      periodBtns.forEach((button) => button.classList.remove('active-period'));
      btn.classList.add('active-period');

      const data = periodData[btn.dataset.period];
      if (!data) return;

      labelEl.textContent = data.label;
      amountEl.textContent = data.amount;
      insightEl.textContent = data.insight;
    });
  });
}