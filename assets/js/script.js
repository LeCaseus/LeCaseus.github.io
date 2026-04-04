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

function waveform_ambience() {
  const primary = document.querySelector('.hero-signal-bg polyline:first-child');
  const secondary = document.querySelector('.hero-signal-bg polyline:last-child');

  const base = [300,220,380,300,300,260,160,340,420,300,300,280,200,400,300,300,270,230,330,300,300,290,240,350,300,300,270,180,380,300,300,310,300];
  const alt  = [300,200,400,300,300,240,140,360,440,300,300,260,180,420,300,300,250,210,350,300,300,270,220,370,300,300,250,160,400,300,300,330,300];

  const x_coords = [0,60,80,100,120,180,200,210,220,240,260,320,340,360,370,390,450,470,490,500,520,580,600,610,620,640,700,720,730,750,770,830,860,900];

  let progress = 0;
  let direction = 1;

  function build_points(y_vals) {
    return x_coords.map((x, i) => `${x},${y_vals[i] ?? 300}`).join(' ');
  }

  function tick() {
    progress += 0.003 * direction;
    if (progress >= 1 || progress <= 0) direction *= -1;

    const interpolated = base.map((b, i) => b + (alt[i] - b) * progress);
    primary.setAttribute('points', build_points(interpolated));
    requestAnimationFrame(tick);
  }

  tick();
}

document.addEventListener('DOMContentLoaded', waveform_ambience);

function scroll_triggers() {
  const rows = document.querySelectorAll('.reading-row');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  rows.forEach((row, i) => {
    row.style.transitionDelay = `${i * 80}ms`;
    observer.observe(row);
  });
}

document.addEventListener('DOMContentLoaded', scroll_triggers);