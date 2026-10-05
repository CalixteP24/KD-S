document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll(
    '.section-head, .service-card, .team-card, .feature-item, .industry-card, .testimonial-grid blockquote, .faq-list details, .about-copy, .about-panel, .contact-copy, .contact-form, .site-footer'
  );

  if (revealItems.length) {
    revealItems.forEach((item, index) => {
      item.classList.add('reveal');
      item.style.transitionDelay = `${index * 80}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  const form = document.getElementById('contact-form');

  if (!form) return;

  const statusBox = document.getElementById('form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  const setStatus = (message, type) => {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = `form-status ${type}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    setStatus('Envoi de votre demande en cours...', 'success');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        form.reset();
        setStatus('Votre demande a bien été envoyée. Nous vous répondrons très prochainement.', 'success');
        return;
      }

      const data = await response.json().catch(() => ({}));
      const message = data?.errors?.[0]?.message || 'Une erreur est survenue lors de l’envoi. Veuillez réessayer.';
      setStatus(message, 'error');
    } catch (error) {
      setStatus('Impossible d’envoyer votre demande pour le moment. Vérifiez votre connexion ou réessayez plus tard.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
});
