document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-btn');
  const menu = document.querySelector('.nav-links');

  if (menuButton && menu) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
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
