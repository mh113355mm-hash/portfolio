// Main JS: update year, handle contact form, small UX enhancements, and SCROLL REVEAL

document.addEventListener('DOMContentLoaded', () => {
  // --- Footer year ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Contact form ---
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (form.name.value || '').trim();
      const email = (form.email.value || '').trim();
      const message = (form.message.value || '').trim();
      if (!name || !email || !message) {
        feedback.textContent = 'Please fill in all required fields.';
        feedback.style.color = '#ff6b6b';
        return;
      }
      feedback.textContent = 'Message sent — thank you';
      feedback.style.color = 'var(--accent)';
      form.reset();
    });
  }

  // --- Keyboard focus improvements ---
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.documentElement.classList.add('show-focus');
  });

  // --- Navigation toggle for small screens ---
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('main-navigation-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.style.display = expanded ? 'none' : 'flex';
      navToggle.setAttribute('aria-label', !expanded ? 'Close menu' : 'Open menu');
    });
    // close when clicking a link
    navList.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navList.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Smooth scroll for internal links ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1 && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // close mobile nav if open
          if (navList && window.getComputedStyle(navList).display === 'flex' && navToggle) {
            navList.style.display = 'none';
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });

  // --- Typewriter / rotating roles ---
  const roles = ['Programmer', 'Designer'];
  const typedEl = document.getElementById('typed-role');
  const cursor = document.querySelector('.cursor');
  let roleIndex = 0;
  let charIndex = 0;
  let typing = true;

  function typeRole() {
    if (!typedEl) return;
    const current = roles[roleIndex];
    if (typing) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        typing = false;
        setTimeout(typeRole, 900);
      } else {
        setTimeout(typeRole, 80);
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        typing = true;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 300);
      } else {
        setTimeout(typeRole, 40);
      }
    }
  }
  typeRole();

  // blink cursor
  if (cursor) setInterval(() => cursor.style.opacity = (cursor.style.opacity === '0' ? '1' : '0'), 500);

  // --- Reveal on scroll using IntersectionObserver ---
  const revealTargets = document.querySelectorAll('[data-anim], .reveal, .section');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // If it's a one-time reveal, unobserve afterwards
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => {
    // add base reveal class to elements so CSS handles transition
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    io.observe(el);
  });

  // --- GSAP hero entrance (if GSAP loaded) ---
  if (window.gsap) {
    try {
      gsap.registerPlugin(ScrollTrigger);
      const tl = gsap.timeline();
      tl.from('.hero-left', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from('.hero-right', { x: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .from('.hero-ctas .btn', { y: 10, opacity: 0, stagger: 0.08, duration: 0.4 }, '-=0.4');

      // Add subtle parallax for profile image on scroll
      gsap.to('.profile-image', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', scrub: 0.8 }
      });
    } catch (e) {
      // ignore if GSAP fails
      console.warn('GSAP init failed', e);
    }
  }

  // --- Counters: animate numbers when in view ---
  const counters = document.querySelectorAll('.number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 50));
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(interval);
          } else {
            el.textContent = current;
          }
        }, 20);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  // --- Header background on scroll ---
  const header = document.querySelector('.site-header');
  function checkHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  }
  checkHeader();
  window.addEventListener('scroll', checkHeader);

  // --- Site loader hide after window load ---
  window.addEventListener('load', () => {
    const loader = document.getElementById('site-loader');
    if (loader) {
      loader.style.transition = 'opacity 0.6s ease';
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 700);
    }
  });

  // --- Usability survey optional submission (Formspree/endpoint) ---
  const survey = document.getElementById('usability-survey');
  const surveyFeedback = document.getElementById('survey-feedback');
  if (survey) {
    survey.addEventListener('submit', (e) => {
      e.preventDefault();
      const endpoint = survey.getAttribute('data-endpoint');
      const formData = new FormData(survey);
      if (endpoint) {
        // POST JSON to configured endpoint (Formspree or custom)
        fetch(endpoint, { method: 'POST', body: formData })
          .then(r => {
            surveyFeedback.textContent = 'Thanks — feedback submitted.';
            survey.reset();
          }).catch(err => {
            surveyFeedback.textContent = 'Could not submit feedback — try later.';
          });
      } else {
        // demo local handling: show message and log
        surveyFeedback.textContent = 'Thanks for your feedback (demo).';
        console.log('Survey (demo):', Object.fromEntries(formData.entries()));
        survey.reset();
      }
    });
  }

});