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


  // Live Work slider (manual scroll/swipe + arrows + dots; optional auto-slide that stops on any interaction)
  (() => {
    const root = $('#liveSlider'); if (!root) return;
    const track = $('.slider-track', root), slides = [...track.children];
    const prev = $('.s-prev', root), next = $('.s-next', root), play = $('.s-play', root), dots = $('.s-dots', root);
    let timer = null, userPaused = false, inView = false;
    const perView = () => { const w = slides[0].getBoundingClientRect().width; return Math.max(1, Math.round(track.clientWidth / (w + 14))); };
    const pages = () => Math.max(1, slides.length - perView() + 1);
    const idx = () => Math.round(track.scrollLeft / (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : 1));
    const go = (i) => { const n = pages(); i = Math.max(0, Math.min(n - 1, i)); track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: 'smooth' }); };
    const buildDots = () => {
      dots.innerHTML = '';
      for (let i = 0; i < pages(); i++) { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Go to project ' + (i + 1)); b.addEventListener('click', () => { stop(true); go(i); }); dots.appendChild(b); }
      sync();
    };
    const sync = () => {
      const i = Math.min(idx(), pages() - 1);
      [...dots.children].forEach((d, k) => { d.classList.toggle('on', k === i); d.setAttribute('aria-selected', String(k === i)); });
      prev.disabled = i <= 0; next.disabled = i >= pages() - 1;
    };
    const tick = () => { const i = idx(); go(i >= pages() - 1 ? 0 : i + 1); };
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = () => { if (timer || userPaused || reduce || !inView) return; timer = setInterval(tick, 6000); };
    const halt = () => { clearInterval(timer); timer = null; };
    const stop = (permanent) => { halt(); if (permanent) { userPaused = true; setPlay(); } };
    const setPlay = () => { play.textContent = userPaused ? 'Play' : 'Pause'; play.setAttribute('aria-label', userPaused ? 'Start auto-slide' : 'Pause auto-slide'); play.setAttribute('aria-pressed', String(userPaused)); };
    prev.addEventListener('click', () => { stop(true); go(idx() - 1); });
    next.addEventListener('click', () => { stop(true); go(idx() + 1); });
    play.addEventListener('click', () => { userPaused = !userPaused; setPlay(); userPaused ? halt() : start(); });
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); stop(true); go(idx() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); stop(true); go(idx() - 1); } });
    ['pointerdown', 'touchstart', 'wheel'].forEach(ev => track.addEventListener(ev, () => stop(true), { passive: true }));
    root.addEventListener('mouseenter', halt); root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', halt); root.addEventListener('focusout', start);
    if ('IntersectionObserver' in window) new IntersectionObserver(en => { inView = en[0].isIntersecting; inView ? start() : halt(); }, { threshold: .35 }).observe(root);
    window.addEventListener('resize', buildDots);
    if (reduce) { userPaused = true; }
    setPlay(); buildDots();
  })();

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
