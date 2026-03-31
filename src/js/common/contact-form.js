const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const data = new FormData(form);
    const body = new URLSearchParams(data);

    try {
      const res = await fetch('/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      const result = await res.json();

      if (result.success) {
        form.reset();
        submitBtn.textContent = 'Message Sent!';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 4000);
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert('Sorry, there was a problem sending your message. Please try again.');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      alert('Sorry, there was a problem sending your message. Please try again.');
    }
  });
}
