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
  const canvas = document.getElementById('hero-signal-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const W = () => canvas.width;
  const H = () => canvas.height;

  let buf1 = [], buf2 = [];
  let queue1 = [], queue2 = [];
  let spont_timer = 0;
  const SPONT_INTERVAL = 200;

  function noise() { return (Math.random() - 0.5) * 1.4; }

  function muap(amplitude) {
    const dur = 28;
    const pts = [];
    for (let i = 0; i < dur; i++) {
      const t = i / dur;
      let v = 0;
      if      (t < 0.15) v = -amplitude * 0.4  * Math.sin(t / 0.15 * Math.PI);
      else if (t < 0.45) v =  amplitude         * Math.sin((t - 0.15) / 0.3 * Math.PI);
      else if (t < 0.75) v = -amplitude * 0.35  * Math.sin((t - 0.45) / 0.3 * Math.PI);
      else               v =  amplitude * 0.08  * Math.sin((t - 0.75) / 0.25 * Math.PI);
      pts.push(v + (Math.random() - 0.5) * amplitude * 0.08);
    }
    return pts;
  }

  function trigger_burst(queue, units, base_amp) {
    for (let u = 0; u < units; u++) {
      queue.push({
        delay:   Math.floor(u * (8 + Math.random() * 16)),
        samples: muap(base_amp * (0.6 + Math.random() * 0.8))
      });
    }
  }

  function init_buffers() {
    buf1 = new Array(W()).fill(0);
    buf2 = new Array(W()).fill(0);
  }
  init_buffers();
  window.addEventListener('resize', init_buffers);

  function advance(buf, queue) {
    let v = noise();
    for (let i = queue.length - 1; i >= 0; i--) {
      const e = queue[i];
      if (e.delay <= 0 && e.samples.length > 0) {
        v += e.samples.shift();
        if (!e.samples.length) queue.splice(i, 1);
      } else {
        e.delay--;
      }
    }
    buf.shift();
    buf.push(v);
  }

  function draw_trace(buf, mid_y, alpha, lw) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(93,217,173,${alpha})`;
    ctx.lineWidth = lw;
    const len = buf.length;
    for (let i = 0; i < len; i++) {
      const x = (i / len) * W();
      const y = mid_y + buf[i];
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function tick() {
    spont_timer++;
    if (spont_timer >= SPONT_INTERVAL) {
      spont_timer = 0;
      const q = Math.random() > 0.5 ? queue1 : queue2;
      trigger_burst(q, 1, 4 + Math.random() * 3);
    }

    advance(buf1, queue1);
    advance(buf2, queue2);

    ctx.clearRect(0, 0, W(), H());
    draw_trace(buf1, H() * 0.35, 0.85, 1.4);
    draw_trace(buf2, H() * 0.72, 0.45, 0.9);

    requestAnimationFrame(tick);
  }

  tick();

  function on_interaction() {
    trigger_burst(queue1, 3 + Math.floor(Math.random() * 3), 12 + Math.random() * 6);
    trigger_burst(queue2, 2 + Math.floor(Math.random() * 3),  7 + Math.random() * 5);
  }

  window.addEventListener('keydown',   on_interaction);
  window.addEventListener('mousedown', on_interaction);
  window.addEventListener('touchstart', on_interaction, { passive: true });
  window.addEventListener('scroll',     on_interaction, { passive: true });
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