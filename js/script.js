document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-btn');
  const menu = document.querySelector('.nav-links');

  if (menuButton && menu) {
    menuButton.setAttribute('aria-expanded', 'false');
    if (!menu.id) menu.id = 'site-navigation';
    menuButton.setAttribute('aria-controls', menu.id);
    menuButton.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); } });
  }

  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(contactForm);
      const subject = form.get('subject') || 'Kontakt z webu';
      const body = [
        `Jméno / Firma: ${form.get('name') || ''}`,
        `E-mail: ${form.get('email') || ''}`,
        `Téma: ${form.get('topic') || ''}`,
        '',
        form.get('message') || ''
      ].join('\n');

      window.location.href = `mailto:Rendys1989@seznam.cz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});
