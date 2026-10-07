const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
  nav?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  menuBtn?.setAttribute('aria-label', 'Open navigation');
}));

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .12});
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('show'));
}

const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, {passive:true});
} else if (glow) {
  glow.style.display = 'none';
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, {rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(section => navObserver.observe(section));
}

// Portfolio category filtering.
const filterButtons = [...document.querySelectorAll('.filter-pills [data-filter]')];
const projectCards = [...document.querySelectorAll('.project-card[data-category]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach(card => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.hidden = !show;
  });
}));

// Contact form sends via WhatsApp directly.
document.querySelector('#contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const msg = `*Portfolio Inquiry*%0A%0A*Name:* ${encodeURIComponent(data.get('name'))}%0A*Email:* ${encodeURIComponent(data.get('email'))}%0A*Subject:* ${encodeURIComponent(data.get('subject') || 'Portfolio Inquiry')}%0A%0A*Message:*%0A${encodeURIComponent(data.get('message'))}`;
  window.open(`https://wa.me/8801825234644?text=${msg}`, '_blank');
});
