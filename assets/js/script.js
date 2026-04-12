function boot_sequence() {
  if (!document.querySelector('.hero-status')) return;

  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  const status_text = document.querySelector('.status-text');
  const full_text   = status_text.textContent.trim();
  status_text.textContent = '';
  document.querySelector('.hero-status').style.opacity = '1';

  let i = 0;
  const type_interval = setInterval(() => {
    status_text.textContent += full_text[i++];
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

  const bio_el       = document.querySelector('.hero-bio');
  const bio_length   = bio_el ? bio_el.textContent.trim().length : 0;
  const bio_duration = bio_length * 28;

  reveal('.hero-signal-bg', typing_duration + 200);

  setTimeout(() => {
    if (!bio_el) return;
    const bio_text = bio_el.textContent.trim();
    bio_el.style.minHeight = bio_el.offsetHeight + 'px';
    bio_el.textContent = '';
    bio_el.style.opacity = '1';

    let j = 0;
    const bio_interval = setInterval(() => {
      bio_el.textContent += bio_text[j++];
      if (j >= bio_text.length) clearInterval(bio_interval);
    }, 28);
  }, typing_duration + 500);

  const rest     = typing_duration + 500 + bio_duration + 300;
  const sections = rest + 1300;

  reveal('.hero-name',     rest);
  reveal('.hero-tagline',  rest + 200);
  reveal('.hero-waveform', rest + 400);
  reveal('.label-tag',     rest + 600, true);

  setTimeout(() => { document.body.style.overflow = 'visible'; }, sections - 200);

  reveal('.latest-readings', sections);
  reveal('.about',           sections + 300);
  reveal('.projects',        sections + 600);
  reveal('.contact',         sections + 900);
}


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
    const pts = [];
    for (let i = 0; i < 28; i++) {
      const t = i / 28;
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
      trigger_burst(Math.random() > 0.5 ? queue1 : queue2, 1, 4 + Math.random() * 3);
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

  window.addEventListener('keydown',    on_interaction);
  window.addEventListener('mousedown',  on_interaction);
  window.addEventListener('touchstart', on_interaction, { passive: true });
  window.addEventListener('scroll',     on_interaction, { passive: true });
}


function ecg_waveform() {
  const canvas = document.getElementById('hero-waveform');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const W    = canvas.width;
  const H    = canvas.height;
  const MID  = H / 2;
  const BEAT_INTERVAL = 90;

  let buf        = new Array(W).fill(0);
  let beat_timer = 0;
  let beat_queue = [];

  function pqrst(amplitude) {
    const pts = [];
    for (let i = 0; i < 12; i++)
      pts.push(-amplitude * 0.12 * Math.sin((i / 12) * Math.PI));
    for (let i = 0; i < 8;  i++) pts.push(0);
    for (let i = 0; i < 4;  i++)
      pts.push(amplitude * 0.1 * Math.sin((i / 4) * Math.PI));
    for (let i = 0; i < 6;  i++)
      pts.push(-amplitude * Math.sin((i / 6) * Math.PI));
    for (let i = 0; i < 5;  i++)
      pts.push(amplitude * 0.22 * Math.sin((i / 5) * Math.PI));
    for (let i = 0; i < 8;  i++) pts.push(0);
    for (let i = 0; i < 18; i++)
      pts.push(-amplitude * 0.28 * Math.sin((i / 18) * Math.PI));
    return pts;
  }

  function advance() {
    let v = 0;
    for (let i = beat_queue.length - 1; i >= 0; i--) {
      const e = beat_queue[i];
      if (e.delay <= 0 && e.samples.length > 0) {
        v += e.samples.shift();
        if (!e.samples.length) beat_queue.splice(i, 1);
      } else {
        e.delay--;
      }
    }
    buf.shift();
    buf.push(v);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(93,217,173,1)';
    ctx.lineWidth   = 1.2;
    for (let i = 0; i < W; i++) {
      const y = MID + buf[i];
      i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
    }
    ctx.stroke();
  }

  function tick() {
    if (++beat_timer >= BEAT_INTERVAL) {
      beat_timer = 0;
      beat_queue.push({ delay: 0, samples: pqrst(10) });
    }
    advance();
    draw();
    requestAnimationFrame(tick);
  }

  tick();
}


function scroll_triggers() {
  const rows = document.querySelectorAll('.reading-row');
  if (!rows.length) return;

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


function init_blog_reader() {
  const feed    = document.querySelector('.blog-feed');
  const content = document.getElementById('blog-content');
  if (!feed || !content) return;

  const empty = document.getElementById('blog-empty');

  function show_empty() {
    content.innerHTML = '';
    if (empty) content.appendChild(empty);
    feed.querySelectorAll('.reading-row').forEach(r => r.classList.remove('active'));
    const sidebar = document.querySelector('.blog-sidebar');
    if (sidebar) sidebar.classList.remove('post-open');
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const chosen = btn.dataset.filter;
      feed.querySelectorAll('.reading-row').forEach(row => {
        row.style.display = chosen === 'all' || row.dataset.category === chosen ? '' : 'none';
      });
    });
  });

  feed.addEventListener('click', e => {
    const row = e.target.closest('.reading-row');
    if (!row) return;
    e.preventDefault();

    feed.querySelectorAll('.reading-row').forEach(r => r.classList.remove('active'));
    row.classList.add('active');

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
        const body = new DOMParser()
          .parseFromString(html, 'text/html')
          .querySelector('.post-body');

        if (!body) {
          content.innerHTML = '<p class="post-load-error">could not load this reading.</p>';
          return;
        }

        content.innerHTML = '';
        content.appendChild(body);
        content.scrollTop = 0;
        history.pushState({ url }, '', url);
      })
      .catch(() => {
        content.innerHTML = '<p class="post-load-error">could not load this reading.</p>';
      })
      .finally(() => content.classList.remove('loading'));
  });

  window.addEventListener('popstate', e => {
    if (e.state?.url) {
      const row = feed.querySelector(`[data-url="${e.state.url}"]`);
      if (row) row.click();
    } else {
      show_empty();
    }
  });

  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash.startsWith('/readings/')) {
    const row = feed.querySelector(`[data-url="${hash}"]`);
    if (row) row.click();
  }
}


document.addEventListener('DOMContentLoaded', () => {
  boot_sequence();
  waveform_ambience();
  ecg_waveform();
  scroll_triggers();
  init_blog_reader();
});