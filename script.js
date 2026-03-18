/* ============================================================
   script.js — Chezter Vargas Personal Site

   What lives here:
     1. Scroll reveal animation
     2. Nav active state + scrolled class
     3. Blog horizontal scroll (← → arrow buttons)
     4. Blog tag filter
     5. Smooth scrolling for anchor links

   ============================================================ */

/* ── SCROLL REVEAL ── */
/* Watches for elements with class="reveal" and adds class="visible"
   when they scroll into view. The actual fade-in is in style.css. */
function init_reveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      }),
    { threshold: 0.12 },
    /* 0.12 = trigger when 12% of the element is visible */
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ── NAV ACTIVE STATE + SCROLLED CLASS ── */
/* Highlights the correct nav link based on which section is in view.
   Also adds class="scrolled" to .top_nav so it gets a background
   when you scroll past the hero — the style is in style.css. */
function update_nav() {
  const nav = document.querySelector(".top_nav");
  const scroll_pos = window.scrollY + 130;

  /* Toggle background on nav once you scroll past 80px */
  if (window.scrollY > 80) {
    nav?.classList.add("scrolled");
  } else {
    nav?.classList.remove("scrolled");
  }

  /* Section IDs in order — update this list if you add new sections */
  const sections = [
    "hero_section",
    "about_section",
    "edu_section",
    "exp_section",
    "portfolio_section",
    "blog_section",
    "contact_section",
  ];

  let active = "hero_section";
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scroll_pos) active = id;
  }

  document.querySelectorAll(".nav_link").forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === `#${active}`) link.classList.add("active");
  });
}
window.addEventListener("scroll", update_nav, { passive: true });

/* ── BLOG HORIZONTAL SCROLL ── */
/* Powers the ← → buttons on the blog section.
   Pass -1 for left, 1 for right. */
function scroll_blog(dir) {
  const feed = document.getElementById("blog_feed");
  if (!feed) return;
  const card_width = (feed.querySelector(".blog_card")?.offsetWidth || 340) + 1;
  /* +1 for the 1px gap we use as a border between cards */
  feed.scrollBy({ left: dir * card_width, behavior: "smooth" });
}

/* ── BLOG TAG FILTER ── */
/* Shows/hides blog cards by their data-category attribute.
   Pass null to show all cards. Active class on bubble is handled here. */
function filter_blog(category, clicked_bubble) {
  document
    .querySelectorAll(".tag_bubble")
    .forEach((b) => b.classList.remove("active"));
  clicked_bubble.classList.add("active");

  document.querySelectorAll(".blog_row").forEach((row) => {
    const match = !category || row.dataset.category === category;
    row.style.display = match ? "grid" : "none";
  });
}

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
/* Makes all href="#section_id" links scroll smoothly.
   Also cleans the URL hash after scrolling so it stays tidy. */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target_id = link.getAttribute("href").slice(1);
    if (target_id) {
      document
        .getElementById(target_id)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    history.replaceState(null, "", "/");
  });
});

/* ── SCROLL TO HASH ON PAGE LOAD ── */
/* If someone visits yoursite.com/#blog_section directly,
   this scrolls them there. 100ms delay for render to finish first. */
window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    const target_id = hash.slice(1);
    setTimeout(
      () =>
        document
          .getElementById(target_id)
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
    history.replaceState(null, "", "/");
  }

  init_reveal();
  update_nav(); /* run once on load so the nav state is correct immediately */
});
