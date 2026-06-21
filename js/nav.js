/* ── Navigation ── */
(function() {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.querySelector('.nav-mobile');

  // Scrolled state
  function onScroll() {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      mobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on link click
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile .nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
    if (href.includes('contact') && page.includes('contact')) a.classList.add('active');
    if (href.includes('about')   && page.includes('about'))   a.classList.add('active');
    if (href.includes('screenings') && page.includes('screenings')) a.classList.add('active');
    if (href.includes('services')   && page.includes('services'))   a.classList.add('active');
    if (href.includes('gallery')    && page.includes('gallery'))    a.classList.add('active');
    if (href.includes('portfolio')  && page.includes('portfolio'))  a.classList.add('active');
    if (href.includes('vendors')    && page.includes('vendors'))    a.classList.add('active');
  });
})();
