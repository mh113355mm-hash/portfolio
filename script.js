// Main JS: update year, handle contact form, small UX enhancements

document.addEventListener('DOMContentLoaded', () => {
  // Update footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form handling (client-side only)
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (form.name.value || '').trim();
      const email = (form.email.value || '').trim();
      const message = (form.message.value || '').trim();

      // Simple validation
      if (!name || !email || !message) {
        feedback.textContent = 'Please fill in all required fields.';
        feedback.style.color = '#b91c1c';
        feedback.setAttribute('aria-live', 'polite');
        return;
      }

      // Here you can integrate a real backend or Formspree/Netlify
      // Simulate success response
      feedback.textContent = 'Message sent — thank you!';
      feedback.style.color = '#0b74de';
      form.reset();
    });
  }

  // Small improvement: focus outline visible for keyboard users
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.documentElement.classList.add('show-focus');
  });
});
