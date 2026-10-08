(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Header: scrolled state + mobile menu
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const menuBtn = $('.menu-btn'), nav = $('#nav');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('.nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false); });

  // Reveal on scroll (also animates skill rings)
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); }
    }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else { revealEls.forEach(el => el.classList.add('show')); }

  // Active nav link
  const links = $$('.nav > a[href^="#"]');
  const secs = $$('main section[id]').filter(s => links.some(l => l.getAttribute('href') === '#' + s.id));
  if ('IntersectionObserver' in window) {
    const nio = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach(s => nio.observe(s));
  }

  // Cursor glow (mouse only)
  const glow = $('.cursor-glow');
  if (glow && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });
  }

  // Portfolio filter
  const pills = $$('.filter-pills [data-filter]'), cards = $$('.project[data-category]');
  pills.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    pills.forEach(p => { const on = p === btn; p.classList.toggle('active', on); p.setAttribute('aria-pressed', String(on)); });
    cards.forEach(c => { c.hidden = !(f === 'all' || c.dataset.category === f); });
  }));

  // Contact form -> WhatsApp
  $('#contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const text = `*Portfolio Inquiry*\n\n*Name:* ${d.get('name')}\n*Email:* ${d.get('email')}\n*Subject:* ${d.get('subject') || 'Portfolio Inquiry'}\n\n*Message:*\n${d.get('message')}`;
    window.open('https://wa.me/8801825234644?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();

/* CV download: ফাইল না থাকলে সুন্দর বার্তা (শুধু অনলাইনে চলে) */
document.querySelectorAll('a[href$="Tabassum-Nisha-CV.pdf"]').forEach(function(a){
  a.addEventListener('click',function(e){
    if(!/^https?:$/.test(location.protocol)) return;
    e.preventDefault();
    fetch(a.href,{method:'HEAD'}).then(function(r){
      if(r.ok){var l=document.createElement('a');l.href=a.href;l.download='Tabassum-Nisha-CV.pdf';document.body.appendChild(l);l.click();l.remove();}
      else alert('CV শীঘ্রই যোগ করা হবে।');
    }).catch(function(){alert('CV শীঘ্রই যোগ করা হবে।');});
  });
});
