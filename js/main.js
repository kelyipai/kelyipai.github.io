/* ============================================
   個人主頁 — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll Animations via IntersectionObserver ---------- */
  const animateElements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after animation to save resources
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animateElements.forEach((el) => observer.observe(el));

  /* ---------- Nav Scroll Effect ---------- */
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  let isScrolling = false;

  const onScroll = () => {
    // Toggle nav background
    if (window.scrollY > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Highlight active nav link
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - nav.offsetHeight - 20;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  // Throttled scroll handler for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Run once on load
  onScroll();

  /* ---------- Smooth anchor scroll (fallback for older browsers) ---------- */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Contact Form Handler ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather form data
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('請填寫所有欄位');  // "Please fill in all fields"
        return;
      }

      // Demo submission feedback
      const btn = form.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = '已送出 ✓';  // "Sent"
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        form.reset();
        alert('感謝您的訊息！我會盡快回覆。');  // "Thank you! I'll get back to you soon."
      }, 1000);
    });
  }

  /* ---------- Back to Top ---------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
