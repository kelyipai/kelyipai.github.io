/* ============================================
   science-canvas.js — 3 個科學主題 Canvas 動畫
   量子波動 · 星系旋轉 · 神經網絡
   ============================================ */

(function () {
  'use strict';

  /* ---------- Helper: setup canvas with DPR ---------- */
  function setupCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* ============================================
     1. QuantumAnimation — 量子粒子波動 + 糾纏連線
     ============================================ */
  function QuantumAnimation(canvas) {
    this.canvas = canvas;
    this.running = false;
    this.particles = [];
  }

  QuantumAnimation.prototype.init = function () {
    var setup = setupCanvas(this.canvas);
    this.ctx = setup.ctx;
    this.w = setup.w;
    this.h = setup.h;
    this.particles = [];

    var count = this.w < 500 ? 30 : 50;
    for (var i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.w,
        baseY: Math.random() * this.h,
        y: 0,
        amplitude: 20 + Math.random() * 40,
        frequency: 0.005 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        radius: 1.5 + Math.random() * 2,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.4 + Math.random() * 0.4
      });
    }
  };

  QuantumAnimation.prototype.draw = function (t) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // Background grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (var x = 0; x < this.w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.h);
      ctx.stroke();
    }

    // Update particles
    var self = this;
    this.particles.forEach(function (p) {
      p.x += p.speed;
      if (p.x > self.w + 10) p.x = -10;
      p.y = p.baseY + Math.sin(t * p.frequency + p.phase) * p.amplitude;
    });

    // Draw connections (quantum entanglement)
    for (var i = 0; i < this.particles.length; i++) {
      for (var j = i + 1; j < this.particles.length; j++) {
        var dx = this.particles[i].x - this.particles[j].x;
        var dy = this.particles[i].y - this.particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          var flicker = Math.random() > 0.7;
          var opacity = (1 - dist / 80) * (flicker ? 0.6 : 0.15);
          ctx.beginPath();
          ctx.moveTo(this.particles[i].x, this.particles[i].y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.strokeStyle = 'rgba(0, 240, 255, ' + opacity + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    this.particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, ' + p.opacity + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  };

  QuantumAnimation.prototype.start = function () {
    this.init();
    this.running = true;
    var self = this;
    function loop(t) {
      if (!self.running) return;
      self.draw(t);
      self.rafId = requestAnimationFrame(loop);
    }
    loop(0);
  };

  QuantumAnimation.prototype.stop = function () {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  };

  /* ============================================
     2. CosmosAnimation — 螺旋星系旋轉
     ============================================ */
  function CosmosAnimation(canvas) {
    this.canvas = canvas;
    this.running = false;
    this.stars = [];
  }

  CosmosAnimation.prototype.init = function () {
    var setup = setupCanvas(this.canvas);
    this.ctx = setup.ctx;
    this.w = setup.w;
    this.h = setup.h;
    this.cx = this.w / 2;
    this.cy = this.h / 2;
    this.stars = [];

    var count = this.w < 500 ? 150 : 300;
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var radius = Math.random() * Math.min(this.w, this.h) * 0.45;
      this.stars.push({
        angle: angle,
        radius: radius,
        speed: 0.0003 + (1 - radius / 200) * 0.003,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        color: Math.random() > 0.8 ? 'rgba(123, 47, 247, ' : 'rgba(255, 255, 255, '
      });
    }
  };

  CosmosAnimation.prototype.draw = function (t) {
    var ctx = this.ctx;
    // Fade trail
    ctx.fillStyle = 'rgba(5, 5, 16, 0.15)';
    ctx.fillRect(0, 0, this.w, this.h);

    // Central glow (black hole / galactic core)
    var gradient = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, 40);
    gradient.addColorStop(0, 'rgba(123, 47, 247, 0.6)');
    gradient.addColorStop(0.5, 'rgba(123, 47, 247, 0.2)');
    gradient.addColorStop(1, 'rgba(123, 47, 247, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 40, 0, Math.PI * 2);
    ctx.fill();

    // Draw stars
    var self = this;
    this.stars.forEach(function (s) {
      s.angle += s.speed;
      var x = self.cx + Math.cos(s.angle) * s.radius;
      var y = self.cy + Math.sin(s.angle) * s.radius * 0.6; // Elliptical
      var twinkle = 0.7 + Math.sin(t * 0.003 + s.angle * 10) * 0.3;

      ctx.beginPath();
      ctx.arc(x, y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color + (s.opacity * twinkle) + ')';
      ctx.fill();
    });
  };

  CosmosAnimation.prototype.start = function () {
    this.init();
    this.running = true;
    var self = this;
    function loop(t) {
      if (!self.running) return;
      self.draw(t);
      self.rafId = requestAnimationFrame(loop);
    }
    loop(0);
  };

  CosmosAnimation.prototype.stop = function () {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  };

  /* ============================================
     3. NeuralNetworkAnimation — 神經網絡脈衝
     ============================================ */
  function NeuralNetworkAnimation(canvas) {
    this.canvas = canvas;
    this.running = false;
    this.nodes = [];
    this.connections = [];
    this.pulses = [];
  }

  NeuralNetworkAnimation.prototype.init = function () {
    var setup = setupCanvas(this.canvas);
    this.ctx = setup.ctx;
    this.w = setup.w;
    this.h = setup.h;
    this.nodes = [];
    this.connections = [];
    this.pulses = [];

    // Create layers
    var layers = [4, 6, 6, 3];
    var layerSpacing = this.w / (layers.length + 1);
    var self = this;

    layers.forEach(function (nodeCount, layerIdx) {
      var x = layerSpacing * (layerIdx + 1);
      var vertSpacing = self.h / (nodeCount + 1);
      for (var i = 0; i < nodeCount; i++) {
        var y = vertSpacing * (i + 1);
        self.nodes.push({
          x: x,
          y: y,
          layer: layerIdx,
          radius: 6,
          activation: 0,
          id: self.nodes.length
        });
      }
    });

    // Create connections between adjacent layers
    this.nodes.forEach(function (node) {
      if (node.layer < layers.length - 1) {
        self.nodes.forEach(function (other) {
          if (other.layer === node.layer + 1) {
            self.connections.push({
              from: node,
              to: other,
              weight: Math.random()
            });
          }
        });
      }
    });
  };

  NeuralNetworkAnimation.prototype.draw = function (t) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // Draw connections
    this.connections.forEach(function (c) {
      ctx.beginPath();
      ctx.moveTo(c.from.x, c.from.y);
      ctx.lineTo(c.to.x, c.to.y);
      ctx.strokeStyle = 'rgba(255, 0, 255, ' + (0.05 + c.weight * 0.1) + ')';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Spawn pulses periodically
    if (Math.random() < 0.04 && this.pulses.length < 15) {
      var inputNodes = this.nodes.filter(function (n) { return n.layer === 0; });
      var startNode = inputNodes[Math.floor(Math.random() * inputNodes.length)];
      if (startNode) {
        var outConns = this.connections.filter(function (c) { return c.from === startNode; });
        if (outConns.length > 0) {
          var conn = outConns[Math.floor(Math.random() * outConns.length)];
          this.pulses.push({
            conn: conn,
            progress: 0,
            speed: 0.015 + Math.random() * 0.01
          });
          startNode.activation = 1;
        }
      }
    }

    // Update and draw pulses
    var self = this;
    this.pulses = this.pulses.filter(function (pulse) {
      pulse.progress += pulse.speed;
      if (pulse.progress >= 1) {
        // Activate target node
        pulse.conn.to.activation = 1;
        // Spawn new pulses from target
        var nextConns = self.connections.filter(function (c) { return c.from === pulse.conn.to; });
        if (nextConns.length > 0 && Math.random() > 0.3) {
          var nextConn = nextConns[Math.floor(Math.random() * nextConns.length)];
          self.pulses.push({
            conn: nextConn,
            progress: 0,
            speed: 0.015 + Math.random() * 0.01
          });
        }
        return false;
      }

      var px = pulse.conn.from.x + (pulse.conn.to.x - pulse.conn.from.x) * pulse.progress;
      var py = pulse.conn.from.y + (pulse.conn.to.y - pulse.conn.from.y) * pulse.progress;

      // Glow trail
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 0, 255, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;

      return true;
    });

    // Draw nodes
    this.nodes.forEach(function (node) {
      // Fade activation
      node.activation *= 0.95;

      // Outer glow when activated
      if (node.activation > 0.1) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 0, 255, ' + (node.activation * 0.2) + ')';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 0, 255, ' + (0.3 + node.activation * 0.7) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner dot when activated
      if (node.activation > 0.3) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 0, 255, ' + node.activation + ')';
        ctx.fill();
      }
    });

    // Floating math symbols
    if (!this.symbols) {
      this.symbols = [];
      var symbolChars = ['∂', '∑', '∫', 'σ', '∇', 'λ', 'θ', 'w', 'b', 'f(x)', '∇f', 'P(y|x)'];
      for (var i = 0; i < 8; i++) {
        this.symbols.push({
          char: symbolChars[Math.floor(Math.random() * symbolChars.length)],
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: 0.05 + Math.random() * 0.1,
          size: 10 + Math.random() * 8
        });
      }
    }

    var self2 = this;
    this.symbols.forEach(function (s) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = self2.w;
      if (s.x > self2.w) s.x = 0;
      if (s.y < 0) s.y = self2.h;
      if (s.y > self2.h) s.y = 0;

      ctx.font = s.size + 'px JetBrains Mono';
      ctx.fillStyle = 'rgba(255, 0, 255, ' + s.opacity + ')';
      ctx.fillText(s.char, s.x, s.y);
    });
  };

  NeuralNetworkAnimation.prototype.start = function () {
    this.init();
    this.running = true;
    var self = this;
    function loop(t) {
      if (!self.running) return;
      self.draw(t);
      self.rafId = requestAnimationFrame(loop);
    }
    loop(0);
  };

  NeuralNetworkAnimation.prototype.stop = function () {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  };

  /* ---------- Export for main.js ---------- */
  window.ScienceAnimations = {
    QuantumAnimation: QuantumAnimation,
    CosmosAnimation: CosmosAnimation,
    NeuralNetworkAnimation: NeuralNetworkAnimation
  };
})();
