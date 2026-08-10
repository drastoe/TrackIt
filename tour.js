 const track = document.getElementById('slide-track');
  const dots = document.querySelectorAll('.dot');
  const nextBtn = document.getElementById('next-btn');
  const skipBtn = document.getElementById('skip-btn');
  const choiceView = document.getElementById('choice-view');
  const slidesWrapper = document.getElementById('slides-wrapper');
  let current = 0;
  const total = 3;

  function renderSlide() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    nextBtn.textContent = current === total - 1 ? "Get Started" : "Next";
  }

  function nextSlide() {
    if (current < total - 1) {
      current++;
      renderSlide();
    } else {
      goToChoice();
    }
  }

  function goToChoice() {
    skipBtn.classList.add('hidden');
    slidesWrapper.classList.add('hidden');
    document.getElementById('dots-row').classList.add('hidden');
    document.getElementById('bottom-action').classList.add('hidden');
    choiceView.classList.remove('hidden');
  }

  function backToSlides() {
    choiceView.classList.add('hidden');
    skipBtn.classList.remove('hidden');
    slidesWrapper.classList.remove('hidden');
    document.getElementById('dots-row').classList.remove('hidden');
    document.getElementById('bottom-action').classList.remove('hidden');
  }

  // Dot navigation — tap any dot to jump to that slide
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      renderSlide();
    });
    dot.style.cursor = 'pointer';
  });

  // Basic swipe support
  let touchStartX = 0;
  slidesWrapper.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  slidesWrapper.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff < -50 && current < total - 1) { current++; renderSlide(); }
    else if (diff > 50 && current > 0) { current--; renderSlide(); }
  });

  renderSlide();