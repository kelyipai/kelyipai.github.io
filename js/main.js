/* ============================================
   main.js — 主邏輯：導航、滾動、打字機、標籤切換
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Nav Scroll Effect ---------- */
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id]');

  var ticking = false;
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Highlight active nav link
    var current = '';
    sections.forEach(function (section) {
      var top = section.offsetTop - nav.offsetHeight - 20;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
  onScroll();

  /* ---------- Smooth Anchor Scroll ---------- */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // Close mobile menu
      var navLinksEl = document.getElementById('navLinks');
      var navToggle = document.getElementById('navToggle');
      if (navLinksEl) navLinksEl.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
    });
  });

  /* ---------- Mobile Nav Toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinksEl = document.getElementById('navLinks');
  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinksEl.classList.toggle('open');
    });
  }

  /* ---------- Scroll Animations ---------- */
  var fadeElements = document.querySelectorAll('.fade-in');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeElements.forEach(function (el) { observer.observe(el); });

  /* ---------- Typewriter Effect ---------- */
  var typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    var phrases = [
      '探索運動與科學的交匯點',
      '馬拉松 · 單車 · 游泳 · 行山 · 匹克球',
      '量子 · 宇宙 · 人工智能',
      '用熱情驅動每一個步伐'
    ];
    var phraseIdx = 0;
    var charIdx = 0;
    var isDeleting = false;

    function typeLoop() {
      var current = phrases[phraseIdx];
      if (isDeleting) {
        charIdx--;
      } else {
        charIdx++;
      }

      typewriterEl.textContent = current.substring(0, charIdx);

      var delay = isDeleting ? 40 : 80;
      if (!isDeleting && charIdx === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 300;
      }

      setTimeout(typeLoop, delay);
    }
    typeLoop();
  }

  /* ---------- Science Tab Switching ---------- */
  var tabs = document.querySelectorAll('.science-tab');
  var panels = document.querySelectorAll('.science-content');
  var animations = {};
  var activeTab = 'quantum';

  function initAnimation(tabName) {
    if (animations[tabName]) return animations[tabName];

    var canvasId = {
      quantum: 'quantumCanvas',
      cosmology: 'cosmosCanvas',
      ai: 'neuralCanvas'
    }[tabName];

    var canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    var AnimClass = {
      quantum: window.ScienceAnimations.QuantumAnimation,
      cosmology: window.ScienceAnimations.CosmosAnimation,
      ai: window.ScienceAnimations.NeuralNetworkAnimation
    }[tabName];

    if (!AnimClass) return null;
    var anim = new AnimClass(canvas);
    animations[tabName] = anim;
    return anim;
  }

  function switchTab(tabName) {
    // Stop previous animation
    if (animations[activeTab]) {
      animations[activeTab].stop();
    }

    // Update tabs
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabName);
    });

    // Update panels
    panels.forEach(function (p) {
      p.classList.toggle('active', p.getAttribute('data-panel') === tabName);
    });

    activeTab = tabName;

    // Start new animation after a small delay for DOM to update
    setTimeout(function () {
      var anim = initAnimation(tabName);
      if (anim) anim.start();
    }, 50);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var tabName = tab.getAttribute('data-tab');
      if (tabName !== activeTab) {
        switchTab(tabName);
      }
    });
  });

  // Start initial animation
  setTimeout(function () {
    switchTab('quantum');
  }, 300);

  /* ---------- Stop animations when not visible (performance) ---------- */
  var scienceSection = document.getElementById('science');
  if (scienceSection) {
    var scienceObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting && animations[activeTab]) {
          animations[activeTab].stop();
        } else if (entry.isIntersecting) {
          var anim = initAnimation(activeTab);
          if (anim && !anim.running) anim.start();
        }
      });
    }, { threshold: 0.1 });
    scienceObserver.observe(scienceSection);
  }

  /* ---------- Back to Top ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Handle Canvas Resize ---------- */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Reinit current animation on resize
      if (animations[activeTab]) {
        animations[activeTab].stop();
        delete animations[activeTab];
        var anim = initAnimation(activeTab);
        if (anim) anim.start();
      }
    }, 300);
  });
});
