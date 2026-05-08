function openLightbox(img) {
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Sidebar active state via Intersection Observer
(function() {
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sectionIds = Array.from(navItems).map(a => a.dataset.section);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function setActive(id) {
    navItems.forEach(a => a.classList.toggle('active', a.dataset.section === id));
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
  if (sections.length) setActive(sections[0].id);
})();
