/* ============================================================
   script.js — Chezter Vargas Personal Site
   
   What lives here now:
     1. Scroll reveal animation (fade elements in as you scroll)
     2. Nav active state (highlights the right nav link as you scroll)
     3. Blog horizontal scroll (the ← → arrow buttons)
     4. Smooth scrolling for anchor links (e.g. #blog_section)
   
   What was removed:
     Everything that talked to the backend API — fetching posts,
     opening/displaying posts, the admin write/delete forms, image
     uploads, and the toast notification popup. The page content
     now lives directly in index.html instead of being built here.
   ============================================================ */

/* ── SCROLL REVEAL ── */
/* Watches for elements with class="reveal" and adds class="visible"
   when they scroll into view. The actual fade-in animation is
   defined in style.css using those two class names. */
function init_reveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      }),
    { threshold: 0.15 },
    /* threshold: 0.15 means the animation triggers when 15% of the
       element is visible on screen. Raise this (e.g. 0.4) to trigger
       later, lower it (e.g. 0.05) to trigger earlier. */
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ── NAV ACTIVE STATE ── */
/* Highlights the correct nav link based on which section you've
   scrolled to. Looks for elements with id="portfolio_section"
   and id="blog_section" — make sure those IDs exist in index.html. */
function update_nav_active() {
  const sections = ["portfolio_section", "blog_section"];
  const scroll_pos = window.scrollY + 120;
  /* +120 offsets for the fixed nav bar height so the active state
     switches slightly before you actually reach the section. */

  let active = "home";
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scroll_pos) active = id;
  }

  document.querySelectorAll(".nav_link").forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (
      (active === "home" && (href === "index.html" || href === "/")) ||
      (active === "portfolio_section" && href === "#portfolio_section") ||
      (active === "blog_section" && href === "#blog_section")
    ) {
      link.classList.add("active");
    }
  });
}
window.addEventListener("scroll", update_nav_active);

/* ── BLOG HORIZONTAL SCROLL ── */
/* Powers the ← → buttons on the blog section.
   Pass -1 for left, 1 for right.
   Looks for id="blog_feed" in index.html. */
function scroll_blog(dir) {
  const feed = document.getElementById("blog_feed");
  if (!feed) return;
  const card_width =
    (feed.querySelector(".blog_card")?.offsetWidth || 340) + 20;
  /* Grabs the width of the first blog card (plus a 20px gap) to
     know exactly how far to scroll each time. If no card is found,
     defaults to 340px. */
  feed.scrollBy({ left: dir * card_width, behavior: "smooth" });
}

/* ── BLOG TAG FILTER ── */
/* Filters the visible blog cards by category when you click a tag bubble.
   Pass null to show all cards. The active class on the bubble is handled here too.
   Works by showing/hiding cards based on their data-category attribute —
   make sure each .blog_card in index.html has data-category="personal" etc. */
function filter_blog(category, clicked_bubble) {
  document
    .querySelectorAll(".tag_bubble")
    .forEach((b) => b.classList.remove("active"));
  clicked_bubble.classList.add("active");

  document.querySelectorAll(".blog_card").forEach((card) => {
    const match = !category || card.dataset.category === category;
    card.style.display = match ? "block" : "none";
  });
}

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
/* Makes all links like href="#blog_section" scroll smoothly instead
   of jumping. Also cleans the URL (removes the #hash) after scrolling
   so the address bar stays tidy. */
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
/* If someone visits yoursite.com/#blog_section directly (e.g. from
   a shared link), this scrolls them to that section on load.
   The 100ms delay gives the page a moment to finish rendering first. */
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

  /* Kick off the scroll reveal observer once the page is fully loaded. */
  init_reveal();
});
