let activeFilter = null;
let composeType = "note";
const isAdmin = new URLSearchParams(window.location.search).has("admin");

/* ── SCROLL REVEAL ── */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ── VIEWS ── */
let heroRendered = false;

async function showHome() {
  activeFilter = null;

  if (!heroRendered) {
    const res = await fetch("/api/entries");
    const list = await res.json();
    setRoot(homeTpl(list));
    updateFooter(list.length);
    heroRendered = true;
    loadBlogTeaser();
    setTimeout(initReveal, 50);
  }

  document
    .querySelectorAll(".fpill")
    .forEach((p, i) => p.classList.toggle("active", i === 0));
  await refreshNotes();
}

function scrollToNotes() {
  showHome();
  setTimeout(() => {
    const el = document.getElementById("notes-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, 80);
}

async function refreshNotes() {
  const url = activeFilter
    ? `/api/entries?type=${activeFilter}`
    : "/api/entries";
  const res = await fetch(url);
  const list = await res.json();
  const label = activeFilter ? activeFilter + "s" : "everything";

  const section = document.getElementById("notes-anchor");
  if (!section) return;

  section.querySelector(".section-sub").textContent =
    `${list.length} entr${list.length === 1 ? "y" : "ies"} · ${label}`;

  let cards = "";
  if (!list.length) {
    cards = `<div class="empty">
      <div class="empty-glyph">✦</div>
      <h3>Nothing here yet</h3>
      <p>Your first entry is waiting to be written.</p>
      ${isAdmin ? `<button class="btn btn-primary" onclick="showCompose()">write something</button>` : ""}
    </div>`;
  } else {
    list.forEach((e, i) => {
      const isL = e.type === "letter";
      cards += `<div class="sticky is-${e.type} sticky-${e.type}" onclick="openEntry(${e.id})" style="animation-delay:${i * 0.05}s">
        <div class="sticky-tag">
          <span>${e.type}</span>
          <span class="sticky-date">${e.date}</span>
        </div>
        ${isL && e.title ? `<div class="sticky-title">${e.title}</div>` : ""}
        <div class="sticky-body">${isL ? clip(e.body, 220) : e.body}</div>
        ${isL ? `<span class="sticky-more">read more →</span>` : ""}
      </div>`;
    });
  }
  section.querySelector(".masonry").innerHTML = cards;
  updateFooter(list.length);
}

/* ── HOME TEMPLATE ── */
function homeTpl(list) {
  const label = activeFilter ? activeFilter + "s" : "everything";

  let cards = "";
  if (!list.length) {
    cards = `<div class="empty">
    <div class="empty-glyph">✦</div>
    <h3>Nothing here yet</h3>
    <p>Your first entry is waiting to be written.</p>
    ${isAdmin ? `<button class="btn btn-primary" onclick="showCompose()">write something</button>` : ""}
    </div>`;
  } else {
    list.forEach((e, i) => {
      const isL = e.type === "letter";
      cards += `<div class="sticky is-${e.type} sticky-${e.type}" onclick="openEntry(${e.id})" style="animation-delay:${i * 0.05}s">
        <div class="sticky-tag">
        <span>${e.type}</span>
        <span class="sticky-date">${e.date}</span>
        </div>
        ${isL && e.title ? `<div class="sticky-title">${e.title}</div>` : ""}
        <div class="sticky-body">${isL ? clip(e.body, 220) : e.body}</div>
        ${isL ? `<span class="sticky-more">read more →</span>` : ""}
    </div>`;
    });
  }

  return `
    <!-- HERO -->
    <section class="hero">
    <div class="hero-photo">
        <img src="assets/homepage.JPG" style="width:100%;height:100%;object-fit:cover;display:block;"/>
        </div>
    </div>
    <div class="hero-text">
        <p class="hero-eyebrow reveal">welcome to my personal space</p>
        <h1 class="hero-heading reveal reveal-delay-1">Hi, I'm <em>Chezter Vargas</em></h1>
        <p class="hero-body reveal reveal-delay-2">This is my digital footprint on the internet and a place where I can showcase my skills, achievements, and the projects that I am working on.<br>I also have a blog and some notes to share from time to time so stay tuned!</p>
        <div class="social-links reveal reveal-delay-3">
        <a href="https://www.youtube.com/@LeCaseus" target="_blank" class="social-btn"><i class="fa-brands fa-youtube"></i></a>
        <a href="https://github.com/LeCaseus" target="_blank" class="social-btn"><i class="fa-brands fa-github"></i></a>
        <a href="https://www.linkedin.com/in/lecaseus" target="_blank" class="social-btn"><i class="fa-brands fa-linkedin"></i></a>
        <a href="https://www.instagram.com/cheeshire_/" target="_blank" class="social-btn"><i class="fa-brands fa-instagram"></i></a>
        </div>
        <div class="hero-actions reveal reveal-delay-4">
        <button class="btn-hero-primary" onclick="scrollToNotes()">read my notes</button>
        <a href="portfolio.html" class="btn-hero-ghost" style="text-decoration: none;">view my work</a>
        </div>
        <div class="scroll-hint reveal reveal-delay-4">
        <span class="scroll-arrow">↓</span>
        <span>scroll to notes</span>
        </div>
    </div>
    </section>

    <!-- PORTFOLIO TEASER -->
    <section class="teaser-section">
        <div class="teaser-header">
        <div>
            <p class="teaser-eyebrow">selected work</p>
            <h2 class="section-heading">My <em>Projects</em></h2>
        </div>
        <a href="portfolio.html" class="teaser-link">see all work →</a>
        </div>
        <div class="teaser-grid">
        <div class="teaser-card">
            <div class="teaser-cover">🦾</div>
            <div class="teaser-body">
            <div class="teaser-cat teaser-cat-biomed">biomedical</div>
            <div class="teaser-name">eM-Brace</div>
            <p class="teaser-desc">Autonomous wrist splint with integrated massage system for Carpal Tunnel Syndrome.</p>
            </div>
        </div>
        <div class="teaser-card">
            <div class="teaser-cover">🐱</div>
            <div class="teaser-body">
            <div class="teaser-cat teaser-cat-ai">AI / Python</div>
            <div class="teaser-name">CH3SH1RE</div>
            <p class="teaser-desc">A personal AI assistant exploring local LLMs, memory, and tool use through a custom Python interface.</p>
            </div>
        </div>
        </div>
    </section>

    <!-- BLOG TEASER -->
    <section class="teaser-section teaser-section-alt">
        <div class="teaser-header">
        <div>
            <p class="teaser-eyebrow">latest writing</p>
            <h2 class="section-heading">From the <em>Blog</em></h2>
        </div>
        <a href="blog.html" class="teaser-link">read all posts →</a>
        </div>
        <div id="blog-teaser-grid" class="teaser-grid"></div>
    </section>

    <!-- NOTES FEED -->
    <section class="notes-section" id="notes-anchor">
    <div class="section-header">
        <div>
        <h2 class="section-heading">My <em>notes</em></h2>
        <p class="section-sub">${list.length} entr${list.length === 1 ? "y" : "ies"} · ${label}</p>
        </div>
        <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">
        <div class="filter-bar">
            <div class="fpill ${!activeFilter ? "active" : ""}" onclick="setFilter(null,this)">all</div>
            <div class="fpill ${activeFilter === "note" ? "active" : ""}" onclick="setFilter('note',this)">notes</div>
            <div class="fpill ${activeFilter === "letter" ? "active" : ""}" onclick="setFilter('letter',this)">letters</div>
            <div class="fpill ${activeFilter === "thought" ? "active" : ""}" onclick="setFilter('thought',this)">thoughts</div>
        </div>
        ${isAdmin ? `<button class="write-fab" onclick="showCompose()">+ write</button>` : ""}
        </div>
    </div>
    <div class="masonry">${cards}</div>
    </section>`;
}

async function loadBlogTeaser() {
  const res = await fetch("/api/posts");
  const list = await res.json();
  const el = document.getElementById("blog-teaser-grid");
  if (!el) return;

  if (!list.length) {
    el.innerHTML = `<p style="color:var(--faint);font-style:italic;font-size:0.9rem">No posts yet — check back soon.</p>`;
    return;
  }

  el.innerHTML = list
    .slice(0, 3)
    .map(
      (p) => `
    <a href="blog.html" class="teaser-card teaser-card-link">
      <div class="teaser-cover">
        ${
          p.cover_url
            ? `<img src="${p.cover_url}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;display:block;"/>`
            : p.emoji || "✦"
        }
      </div>
      <div class="teaser-body">
        <div class="teaser-cat teaser-cat-${p.category}">${p.category}</div>
        <div class="teaser-name">${p.title}</div>
        <p class="teaser-desc">${p.excerpt}</p>
        <span class="teaser-meta">${p.date} · ${p.read_time}</span>
      </div>
    </a>
  `,
    )
    .join("");
}

async function setFilter(filter, el) {
  activeFilter = filter;
  document
    .querySelectorAll(".fpill")
    .forEach((p) => p.classList.remove("active"));
  el.classList.add("active");
  await refreshNotes();
  // re-render just the masonry
  const section = document.getElementById("notes-anchor");
  if (!section) {
    await showHome();
    return;
  }
  const url = filter ? `/api/entries?type=${filter}` : "/api/entries";
  const res = await fetch(url);
  const list = await res.json();
  const label = filter ? filter + "s" : "everything";

  section.querySelector(".section-sub").textContent =
    `${list.length} entr${list.length === 1 ? "y" : "ies"} · ${label}`;

  let cards = "";
  if (!list.length) {
    cards = `<div class="empty">
        <div class="empty-glyph">✦</div>
        <h3>Nothing here yet</h3>
        <p>No ${filter || ""}s written yet.</p>
        ${isAdmin ? `<button class="btn btn-primary" onclick="showCompose()">write one</button>` : ""}        </div>`;
  } else {
    list.forEach((e, i) => {
      const isL = e.type === "letter";
      cards += `<div class="sticky is-${e.type} sticky-${e.type}" onclick="openEntry(${e.id})" style="animation-delay:${i * 0.05}s">
            <div class="sticky-tag">
            <span>${e.type}</span>
            <span class="sticky-date">${e.date}</span>
            </div>
            ${isL && e.title ? `<div class="sticky-title">${e.title}</div>` : ""}
            <div class="sticky-body">${isL ? clip(e.body, 220) : e.body}</div>
            ${isL ? `<span class="sticky-more">read more →</span>` : ""}
        </div>`;
    });
  }
  section.querySelector(".masonry").innerHTML = cards;
}

/* ── SINGLE ENTRY ── */
async function openEntry(id) {
  const res = await fetch(`/api/entries/${id}`);
  const e = await res.json();

  if (!e) return;
  const isL = e.type === "letter";
  const bodyHtml = e.body
    .split("\n\n")
    .map((p) => `<p>${p}</p>`)
    .join("");
  setRoot(`<div class="post-page">
        <span class="post-back" id="back-top">← back to notes</span>
        <div class="post-tag-row">
        <span class="post-tag post-tag-${e.type}">${e.type}</span>
        <span class="post-date">${e.date}</span>
        </div>
        ${isL && e.title ? `<h1 class="post-title">${e.title}</h1>` : ""}
        <div class="${isL ? "post-body-letter" : "post-body-note"}">${bodyHtml}</div>
        <div class="post-rule"></div>
        <div class="post-foot">
        <span class="post-back" id="back-bottom">← back</span>
        <button class="btn btn-del" id="btn-del">delete</button>
        </div>
    </div>`);

  document.getElementById("back-top").addEventListener("click", () => {
    heroRendered = false;
    showHome();
  });
  document.getElementById("back-bottom").addEventListener("click", () => {
    heroRendered = false;
    showHome();
  });
  document
    .getElementById("btn-del")
    .addEventListener("click", () => confirmDelete(e.id));

  window.scrollTo(0, 0);
}

async function confirmDelete(id) {
  if (!confirm("Delete this entry?")) return;
  await fetch(`/api/entries/${id}`, { method: "DELETE" });
  toast("Deleted.");
  heroRendered = false; // to re-render hero with new entry
  showHome();
}

/* ── COMPOSE ── */
function showCompose() {
  composeType = "note";
  renderCompose();
  window.scrollTo(0, 0);
}

function renderCompose() {
  const isL = composeType === "letter";
  setRoot(`<div class="compose-page">
    <h2>New entry</h2>
    <p class="sub">What's on your mind?</p>
    <div class="type-row">
    <div class="tchip ${composeType === "note" ? "on-note" : ""}"    onclick="setType('note')">📌 note</div>
    <div class="tchip ${composeType === "letter" ? "on-letter" : ""}"  onclick="setType('letter')">✉️ letter</div>
    <div class="tchip ${composeType === "thought" ? "on-thought" : ""}" onclick="setType('thought')">💭 thought</div>
    </div>
    ${isL ? `<div class="cfield"><label>title</label><input id="f-title" type="text" placeholder="Give it a title…" autocomplete="off"/></div>` : ""}
    <div class="cfield">
    <label>${isL ? "body" : composeType === "note" ? "what's on your mind?" : "the thought"}</label>
    <textarea id="f-body" class="${composeType !== "letter" ? "short-ta" : ""}"
        placeholder="${isL ? "Write something longer…" : composeType === "note" ? "Just start writing…" : "One sharp observation…"}"
        oninput="updateChar()"></textarea>
    ${composeType !== "letter" ? `<div class="char-hint" id="char-hint">0 chars</div>` : ""}
    </div>
    <div class="cactions">
    <button class="btn btn-primary" onclick="publish()">publish</button>
    <button class="btn btn-outline" onclick="showHome()">cancel</button>
    </div>
</div>`);
}

function setType(t) {
  composeType = t;
  renderCompose();
}

function updateChar() {
  const el = document.getElementById("char-hint"),
    b = document.getElementById("f-body");
  if (!el || !b) return;
  const n = b.value.length;
  el.textContent = n + " chars";
  el.className = "char-hint" + (n > 300 ? " over" : "");
}

async function publish() {
  const body = document.getElementById("f-body")?.value?.trim();
  const title = document.getElementById("f-title")?.value?.trim() || "";
  if (!body) {
    toast("write something first ✏️");
    return;
  }
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: composeType, title, body, date }),
  });
  toast("published ✓");
  heroRendered = false; // to re-render hero with new entry
  showHome();
}

function toggleMenu() {
  const btn = document.getElementById("nav-hamburger");
  const menu = document.getElementById("nav-mobile");
  const open = menu.classList.toggle("open");
  btn.classList.toggle("open", open);
}

document.querySelectorAll(".nav-mobile a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("nav-mobile").classList.remove("open");
    document.getElementById("nav-hamburger").classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("nav") && !e.target.closest(".nav-mobile")) {
    document.getElementById("nav-mobile").classList.remove("open");
    document.getElementById("nav-hamburger").classList.remove("open");
  }
});

/* ── UTILS ── */
const clip = (s, n) => (s.length > n ? s.slice(0, n) + "…" : s);
const setRoot = (html) => {
  document.getElementById("root").innerHTML = html;
};

function updateFooter(n) {
  document.getElementById("footer-count").textContent =
    `${n} entr${n === 1 ? "y" : "ies"}`;
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

/* ── INIT ── */
showHome();
document.getElementById("copyright").textContent =
  `Chezter Vargas © ${new Date().getFullYear()}`;
