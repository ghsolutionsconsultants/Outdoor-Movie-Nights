/* ── Back to Top Button ── */
(function() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Scroll Reveal + Counters + Parallax ── */
(function() {
  // Intersection observer for reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Counter animation
  function animateCounter(el, target, suffix='', duration=1800) {
    const start = performance.now();
    const isDecimal = target % 1 !== 0;
    function update(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
      const val = target * ease;
      el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(update);
      else el.textContent = (isDecimal ? target.toFixed(1) : target).toLocaleString() + suffix;
    }
    requestAnimationFrame(update);
  }

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterIO.observe(el));

  // Parallax on hero elements
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${sy * speed}px)`;
      });
    }, { passive: true });
  }

  // Tab system
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const group  = btn.closest('[data-tab-group]');
      if (!group) return;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = group.querySelector(`[data-tab-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  // Accordion
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item    = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen  = content.classList.contains('open');
      // Close all in same group
      const group = trigger.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
        group.querySelectorAll('.accordion-trigger').forEach(t => t.classList.remove('open'));
      }
      if (!isOpen) {
        content.classList.add('open');
        trigger.classList.add('open');
      }
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        lightboxImg.src = el.dataset.lightbox || el.src || el.dataset.src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
})();

// Hero lines: animate only after fonts are ready
(function() {
  function animateHero() {
    document.querySelectorAll('.hero-line').forEach(el => el.classList.add('animate'));
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(animateHero);
  } else {
    window.addEventListener('load', animateHero);
  }
})();
