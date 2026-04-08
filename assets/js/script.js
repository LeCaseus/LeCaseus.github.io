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
  if (!document.querySelector('.hero-status')) return;
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

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

  const typing_duration = full_text.length * 35;

  /* read bio length before wiping it */
  const bio_el = document.querySelector('.hero-bio');
  const bio_length = bio_el ? bio_el.textContent.trim().length : 0;
  const bio_duration = bio_length * 28;

  /* step 1 — signal bg */
  reveal('.hero-signal-bg', typing_duration + 200);

  /* step 2 — bio types in */
  setTimeout(() => {
    if (!bio_el) return;
    const bio_text = bio_el.textContent.trim();
    bio_el.textContent = '';
    bio_el.style.opacity = '1';

    let j = 0;
    const bio_interval = setInterval(() => {
      bio_el.textContent += bio_text[j];
      j++;
      if (j >= bio_text.length) clearInterval(bio_interval);
    }, 28);
  }, typing_duration + 500);

  /* step 3 — rest of hero after bio finishes + 5s reading time */
  const rest = typing_duration + 500 + bio_duration + 300;

  reveal('.hero-name',    rest);
  reveal('.hero-tagline', rest + 200);
  reveal('.hero-waveform', rest + 400);
  reveal('.label-tag',    rest + 600, true);

  /* step 4 — sections slide in after hero completes */
  const sections = rest + 800 + 500;

  setTimeout(() => { document.body.style.overflow = 'visible'; }, sections - 200);

  reveal('.latest-readings', sections);
  reveal('.about',           sections + 300);
  reveal('.projects',        sections + 600);
  reveal('.contact',         sections + 900);
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

function init_blog_reader() {
  const feed    = document.querySelector('.blog-feed');
  const content = document.getElementById('blog-content');

  if (!feed || !content) return;

  /* Filter buttons */
  const filter_btns = document.querySelectorAll('.filter-btn');

  filter_btns.forEach(btn => {
    btn.addEventListener('click', () => {
      filter_btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const chosen = btn.dataset.filter;
      document.querySelectorAll('.blog-feed .reading-row').forEach(row => {
        const match = chosen === 'all' || row.dataset.category === chosen;
        row.style.display = match ? '' : 'none';
      });
    });
  });

  /* Click-to-load */
  feed.addEventListener('click', e => {
    const row = e.target.closest('.reading-row');
    if (!row) return;

    e.preventDefault();

    /* Mark active row */
    document.querySelectorAll('.blog-feed .reading-row').forEach(r => r.classList.remove('active'));
    row.classList.add('active');

    /* On mobile, hide sidebar once a post is opened */
    const sidebar = document.querySelector('.blog-sidebar');
    if (sidebar) sidebar.classList.add('post-open');

    const url = row.dataset.url;
    if (!url) return;

    content.classList.add('loading');

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('fetch failed');
        return res.text();
      })
      .then(html => {
        /* Parse the response and extract the rendered post body */
        const parser  = new DOMParser();
        const doc     = parser.parseFromString(html, 'text/html');
        const body    = doc.querySelector('.post-body');

        if (!body) {
          content.innerHTML = '<p class="post-load-error">Could not load this reading.</p>';
          return;
        }

        /* Replace content pane — keep the scroll position at top */
        content.innerHTML = '';
        content.appendChild(body);
        content.scrollTop = 0;

        /* Update browser URL so back/forward work as expected */
        history.pushState({ url }, '', url);
      })
      .catch(() => {
        content.innerHTML = '<p class="post-load-error">Could not load this reading.</p>';
      })
      .finally(() => {
        content.classList.remove('loading');
      });
  });

  /* Handle browser back/forward */
  window.addEventListener('popstate', e => {
    if (e.state?.url) {
      /* Re-fetch the previous post */
      const matching_row = feed.querySelector(`[data-url="${e.state.url}"]`);
      if (matching_row) matching_row.click();
    } else {
      /* Back to bare /blog — restore empty state */
      content.innerHTML = `
        <div class="blog-content-empty">
          <svg width="200" height="18" viewBox="0 0 200 18" xmlns="http://www.w3.org/2000/svg">
            <polyline points="0,9 14,9 20,2 26,16 34,9 56,9 62,5 68,13 76,9 100,9 106,5 112,13 120,9 144,9 150,3 158,15 166,9 186,9 192,7 198,11 200,9" fill="none" stroke="#4ecba0" stroke-width="1.1"/>
          </svg>
          <p class="empty-label">SELECT A READING</p>
        </div>`;
      document.querySelectorAll('.blog-feed .reading-row').forEach(r => r.classList.remove('active'));
      const sidebar = document.querySelector('.blog-sidebar');
      if (sidebar) sidebar.classList.remove('post-open');
    }
  });

  /* Auto-load post from URL hash (e.g. arriving from homepage) */
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash.startsWith('/readings/')) {
    const matching_row = feed.querySelector(`[data-url="${hash}"]`);
    if (matching_row) matching_row.click();
  }
}

document.addEventListener('DOMContentLoaded', init_blog_reader);