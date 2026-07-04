/* ============================================
   particles.js — Hero 粒子星座系統 + 滑鼠光暈
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, animationId;
  const mouse = { x: -9999, y: -9999, radius: 120 };
  const NEON_COLORS = [
    'rgba(0, 240, 255, ',
    'rgba(255, 0, 255, ',
    'rgba(0, 255, 136, ',
    'rgba(123, 47, 247, ',
    'rgba(0, 170, 255, '
  ];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getParticleCount() {
    const area = window.innerWidth * window.innerHeight;
    if (window.innerWidth < 768) return Math.min(60, Math.floor(area / 18000));
    return Math.min(150, Math.floor(area / 9000));
  }

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x += (dx / dist) * force * 2;
        this.y += (dy / dist) * force * 2;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color + '0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function connectParticles() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    const count = getParticleCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
    if (animationId) cancelAnimationFrame(animationId);
    animate();
  }

  // Mouse tracking
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Parallax effect
  let parallaxOffset = 0;
  window.addEventListener('scroll', () => {
    parallaxOffset = window.scrollY * 0.3;
    canvas.style.transform = `translateY(${parallaxOffset}px)`;
  });

  // Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });

  // Start
  init();

  /* ---------- Cursor Glow ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorGlow.style.opacity = '1';
    });
  }
})();
