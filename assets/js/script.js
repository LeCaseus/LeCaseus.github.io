/* Reveal on scroll */
function init_reveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* Blogs filter */
function init_blog_filter() {
  const filter_btns = document.querySelectorAll('.filter-btn');
  if (!filter_btns.length) return;

  filter_btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filter_btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.blog-feed .reading-row').forEach(row => {
        const match = filter === 'all' || row.dataset.category === filter;
        row.style.display = match ? 'flex' : 'none';
      });
    });
  });
}

/* Boot sequence */
function boot_sequence() {
  const status_text = document.querySelector('.status-text');
  const full_text = status_text.textContent.trim();
  status_text.textContent = '';

  const status_row = document.querySelector('.hero-status');
  status_row.style.opacity = '1';

  let i = 0;
  const type_interval = setInterval(() => {
    status_text.textContent += full_text[i];
    i++;
    if (i >= full_text.length) clearInterval(type_interval);
  }, 35);

  function reveal(selector, delay, all = false) {
    const els = all
      ? document.querySelectorAll(selector)
      : [document.querySelector(selector)];
    els.forEach((el, idx) => {
      if (!el) return;
      setTimeout(() => el.classList.add('boot-visible'), delay + idx * 120);
    });
  }

  reveal('.hero-name',      900);
  reveal('.hero-tagline',  1100);
  reveal('.hero-waveform', 1300);
  reveal('.hero-bio',      1600);
  reveal('.label-tag',     1800, true);
  reveal('.readings-label',2100);
  reveal('.reading-row',   2300, true);
}

document.addEventListener('DOMContentLoaded', boot_sequence);