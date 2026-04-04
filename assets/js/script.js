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

window.addEventListener('load', () => {
  init_reveal();
  init_blog_filter();
});