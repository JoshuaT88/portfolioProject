// Smooth scroll for nav and hero button
document.querySelectorAll('nav a[href^="#"], .scroll-down').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href') || this.getAttribute('aria-label');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Slide-in effect for sections
function revealSectionsOnScroll() {
  document.querySelectorAll('.card-section').forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      section.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealSectionsOnScroll);
window.addEventListener('DOMContentLoaded', revealSectionsOnScroll);