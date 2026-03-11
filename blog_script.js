let activeFilter = null;
const isAdmin = new URLSearchParams(window.location.search).has("admin");

async function setFilter(filter, el) {
  activeFilter = filter;
  document
    .querySelectorAll(".fpill")
    .forEach((p) => p.classList.remove("active"));
  el.classList.add("active");
  await renderFeed();
}

async function renderFeed() {
  const url = activeFilter
    ? `/api/posts?category=${activeFilter}`
    : "/api/posts";
  const res = await fetch(url);
  const list = await res.json();

  if (!list.length) {
    setPage(`<div class="empty">
      <div class="empty-glyph">✦</div>
      <h3>No posts yet</h3>
      <p>No ${activeFilter || ""} posts written yet.</p>
      ${isAdmin ? `<button class="btn btn-primary" onclick="showCompose()">write one</button>` : ""}
    </div>`);
    return;
  }

  const [featured, ...rest] = list;
  let html = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:1.5rem;">
      ${isAdmin ? `<button class="write-fab" onclick="showCompose()">+ write</button>` : ""}
    </div>
    <div class="featured" onclick="openPost(${featured.id})">
      <div class="featured-image">${featured.emoji || "✦"}</div>
      <div class="featured-body">
        <div class="featured-label">featured</div>
        <h2 class="featured-title">${featured.title}</h2>
        <p class="featured-excerpt">${featured.excerpt}</p>
        <div class="post-meta">
          <span class="cat-tag cat-${featured.category}">${featured.category}</span>
          <span class="post-meta-dot"></span>
          <span>${featured.date}</span>
          <span class="post-meta-dot"></span>
          <span>${featured.read_time}</span>
        </div>
      </div>
    </div>`;

  if (rest.length) {
    html += `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
      <div class="section-label" style="margin-bottom:0;flex:1">more posts</div>
      ${isAdmin ? `<button class="write-fab" onclick="showCompose()">+ write</button>` : ""}
    </div><div class="posts-grid">`;
    rest.forEach((p, i) => {
      html += `<div class="post-card" onclick="openPost(${p.id})" style="animation-delay:${i * 0.06}s">
        <div class="post-card-image">${p.emoji || "✦"}</div>
        <div class="post-card-body">
          <div class="post-meta" style="margin-bottom:0.6rem">
            <span class="cat-tag cat-${p.category}">${p.category}</span>
            <span class="post-meta-dot"></span>
            <span>${p.read_time}</span>
          </div>
          <h3 class="post-card-title">${p.title}</h3>
          <p class="post-card-excerpt">${p.excerpt}</p>
          <div class="post-meta"><span>${p.date}</span></div>
        </div>
      </div>`;
    });
    html += `</div>`;
  }
  setPage(html);
}

async function openPost(id) {
  const res = await fetch(`/api/posts/${id}`);
  const p = await res.json();
  if (!p) return;
  const bodyHtml = p.body
    .split("\n\n")
    .map((para) => `<p>${para}</p>`)
    .join("");
  setPage(`<div class="single-wrap">
    <span class="post-back" onclick="renderFeed()">← back to blog</span>
    <div class="single-cover">${p.emoji || "✦"}</div>
    <div class="post-meta" style="margin-bottom:1rem">
      <span class="cat-tag cat-${p.category}">${p.category}</span>
      <span class="post-meta-dot"></span>
      <span>${p.date}</span>
      <span class="post-meta-dot"></span>
      <span>${p.read_time}</span>
    </div>
    <h1 class="single-title">${p.title}</h1>
    <div class="single-body">${bodyHtml}</div>
    <div class="post-rule"></div>
    <div class="post-foot">
      <span class="post-back" onclick="renderFeed()">← back</span>
      <button class="btn btn-del" onclick="confirmDelete(${p.id})">delete</button>
    </div>
  </div>`);
  window.scrollTo(0, 0);
}

async function confirmDelete(id) {
  if (!confirm("Delete this post?")) return;
  await fetch(`/api/posts/${id}`, { method: "DELETE" });
  toast("Deleted.");
  renderFeed();
}

function showCompose() {
  setPage(`<div class="compose-wrap">
    <h2>New post</h2>
    <p class="sub">Write something worth reading.</p>
    <div class="cfield-row">
      <div class="cfield">
        <label>category</label>
        <select id="f-cat">
          <option value="personal">Personal</option>
          <option value="gaming">Gaming</option>
          <option value="career">Career</option>
          <option value="fitness">Fitness</option>
        </select>
      </div>
      <div class="cfield">
        <label>emoji cover</label>
        <input id="f-emoji" type="text" placeholder="e.g. 🎮"/>
      </div>
    </div>
    <div class="cfield">
      <label>title</label>
      <input id="f-title" type="text" placeholder="Give it a great title…" autocomplete="off"/>
    </div>
    <div class="cfield">
      <label>excerpt</label>
      <input id="f-excerpt" type="text" placeholder="One sentence summary…" autocomplete="off"/>
    </div>
    <div class="cfield">
      <label>body</label>
      <textarea id="f-body" placeholder="Write your post… (separate paragraphs with a blank line)"></textarea>
    </div>
    <div class="cactions">
      <button class="btn btn-primary" onclick="publish()">publish</button>
      <button class="btn btn-outline" onclick="renderFeed()">cancel</button>
    </div>
  </div>`);
  window.scrollTo(0, 0);
}

async function publish() {
  const title = document.getElementById("f-title")?.value?.trim();
  const body = document.getElementById("f-body")?.value?.trim();
  const excerpt = document.getElementById("f-excerpt")?.value?.trim();
  const cat = document.getElementById("f-cat")?.value;
  const emoji = document.getElementById("f-emoji")?.value?.trim() || "✦";
  if (!title || !body) {
    toast("title and body are required ✏️");
    return;
  }
  const words = body.split(/\s+/).length;
  const read_time = `${Math.max(1, Math.ceil(words / 200))} min read`;
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: cat,
      emoji,
      title,
      excerpt: excerpt || body.slice(0, 120) + "…",
      body,
      date,
      read_time,
    }),
  });
  toast("published ✓");
  renderFeed();
}

const setPage = (html) => {
  document.getElementById("page").innerHTML = html;
};

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
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

document.getElementById("copyright").textContent =
  `Chezter Vargas © ${new Date().getFullYear()}`;
renderFeed();
