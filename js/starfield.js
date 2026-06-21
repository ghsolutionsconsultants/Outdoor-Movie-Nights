/* ── Starfield Canvas Particle System ── */
(function() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  if (window.innerWidth < 768) { canvas.style.display = 'none'; return; }
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], shootingStars = [];
  const STAR_COUNT = window.innerWidth < 768 ? 80 : 220;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Star() {
    this.reset();
  }
  Star.prototype.reset = function() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.4 + 0.2;
    this.base = this.r;
    this.a    = Math.random() * 0.7 + 0.2;
    this.da   = (Math.random() - 0.5) * 0.006;
    this.hue  = Math.random() < 0.15 ? 30 : 220; // warm or cool
    this.speed= Math.random() * 0.015 + 0.003;
    this.drift= (Math.random() - 0.5) * 0.04;
  };
  Star.prototype.update = function() {
    this.a += this.da;
    if (this.a > 0.9 || this.a < 0.1) this.da *= -1;
    this.y -= this.speed;
    this.x += this.drift;
    if (this.y < -5) { this.y = H + 5; this.x = Math.random() * W; }
  };
  Star.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.shadowColor = `hsl(${this.hue},80%,90%)`;
    ctx.shadowBlur  = this.r * 4;
    ctx.fillStyle   = `hsl(${this.hue},60%,95%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function ShootingStar() {
    this.reset();
  }
  ShootingStar.prototype.reset = function() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H * 0.4;
    this.len  = Math.random() * 120 + 60;
    this.speed= Math.random() * 8 + 4;
    this.a    = 1;
    this.angle= Math.PI / 6 + (Math.random() - 0.5) * 0.3;
    this.alive= true;
  };
  ShootingStar.prototype.update = function() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.a -= 0.018;
    if (this.a <= 0) this.alive = false;
  };
  ShootingStar.prototype.draw = function() {
    const tail = { x: this.x - Math.cos(this.angle)*this.len, y: this.y - Math.sin(this.angle)*this.len };
    const grad = ctx.createLinearGradient(tail.x, tail.y, this.x, this.y);
    grad.addColorStop(0, `rgba(255,255,255,0)`);
    grad.addColorStop(0.6, `rgba(245,166,35,${this.a * 0.4})`);
    grad.addColorStop(1, `rgba(255,255,255,${this.a})`);
    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = this.a;
    ctx.beginPath();
    ctx.moveTo(tail.x, tail.y);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.restore();
  };

  function init() {
    resize();
    stars = Array.from({length: STAR_COUNT}, () => new Star());
  }

  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, W, H);

    // Subtle background gradient
    const bg = ctx.createRadialGradient(W/2, H*0.3, 0, W/2, H*0.3, H*0.8);
    bg.addColorStop(0, 'rgba(20,30,60,0.25)');
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    stars.forEach(s => { s.update(); s.draw(); });

    // Random shooting star
    if (frame % 240 === 0 && Math.random() < 0.6) {
      shootingStars.push(new ShootingStar());
    }
    shootingStars = shootingStars.filter(s => s.alive);
    shootingStars.forEach(s => { s.update(); s.draw(); });

    frame++;
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  tick();
})();
