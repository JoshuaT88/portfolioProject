// Always scroll to top on page reload (including hard refresh)
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

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

// Toggle mobile nav menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Toggle menu on hamburger click
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Close menu if mouse leaves the nav area (for desktop/mouse users)
  navLinks.addEventListener('mouseleave', () => {
    navLinks.classList.remove('open');
  });
}
