const SECTIONS = [
  "hero_section",
  "about_section",
  "edu_section",
  "exp_section",
  "portfolio_section",
  "blog_section",
  "contact_section",
];

function init_reveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function update_nav() {
  const nav = document.querySelector(".top_nav");
  const scroll_pos = window.scrollY + 130;

  nav?.classList.toggle("scrolled", window.scrollY > 80);

  let active = "hero_section";
  for (const id of SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scroll_pos) active = id;
  }

  document.querySelectorAll(".nav_link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${active}`);
  });
}

/* filter_blog: pass null to show all rows */
function filter_blog(category, clicked_bubble) {
  document
    .querySelectorAll(".tag_bubble")
    .forEach((b) => b.classList.remove("active"));
  clicked_bubble.classList.add("active");

  document.querySelectorAll(".blog_row").forEach((row) => {
    row.style.display =
      !category || row.dataset.category === category ? "grid" : "none";
  });
}

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

window.addEventListener("scroll", update_nav, { passive: true });

window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    setTimeout(
      () =>
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
    history.replaceState(null, "", "/");
  }

  init_reveal();
  update_nav();
});
