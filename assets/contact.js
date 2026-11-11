(() => {
  const form = document.querySelector('#contact-form');
  const booking = document.querySelector('#booking-fields');
  const collaboration = document.querySelector('#collaboration-fields');
  const status = document.querySelector('#draft-status');
  const email = window.ICARUS_CONTACT?.email?.trim();
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
  const descriptions = { booking: 'Tell me about the event, the city, and when you have in mind.', collaboration: 'A track, a verse, a new idea. Tell me what you want to make.', general: 'No pitch needed. Just start a conversation.' };
  function selectReason(reason) {
    if (!descriptions[reason]) reason = 'booking';
    form.elements.reason.value = reason;
    booking.hidden = booking.disabled = reason !== 'booking';
    collaboration.hidden = collaboration.disabled = reason !== 'collaboration';
    document.querySelector('#reason-description').textContent = descriptions[reason];
    status.textContent = '';
  }
  form.addEventListener('change', event => { if (event.target.name === 'reason') selectReason(event.target.value); });
  selectReason(new URLSearchParams(location.search).get('reason'));
  function draft() {
    const data = new FormData(form);
    const reason = data.get('reason');
    const subjects = { booking: 'Booking enquiry: ' + data.get('event'), collaboration: 'Collaboration: ' + data.get('project'), general: 'Hello from ' + data.get('name') };
    const lines = ['Hi ICARUS,', '', data.get('message'), '', 'Name: ' + data.get('name'), 'Reply to: ' + data.get('email')];
    if (reason === 'booking') lines.push('Event: ' + data.get('event'), 'City: ' + data.get('city'), 'Date: ' + data.get('date'));
    if (reason === 'collaboration') { lines.push('Project: ' + data.get('project')); if (data.get('reference')) lines.push('Reference: ' + data.get('reference')); }
    return { subject: subjects[reason], body: lines.join('\n') };
  }
  if (hasEmail) {
    const direct = document.querySelector('#email-direct');
    direct.href = 'mailto:' + email;
    direct.textContent = email + ' ↗';
    direct.hidden = false;
    document.querySelector('#open-draft').disabled = false;
    document.querySelector('#copy-email').disabled = false;
    document.querySelector('#email-note').textContent = 'Bookings, collaborations, and general messages all reach this address.';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!hasEmail || !form.reportValidity()) return;
    const message = draft();
    location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(message.subject) + '&body=' + encodeURIComponent(message.body);
    status.textContent = 'Email draft requested. If your email app did not open, copy your message and email it directly.';
  });
  document.querySelector('#copy-draft').addEventListener('click', async () => {
    if (!form.reportValidity()) return;
    const message = draft();
    try { await navigator.clipboard.writeText('Subject: ' + message.subject + '\n\n' + message.body); status.textContent = 'Message copied. Paste it into your email app when you’re ready.'; }
    catch { status.textContent = 'Clipboard access was unavailable. Select and copy the message from the form.'; }
  });
  document.querySelector('#copy-email').addEventListener('click', async () => {
    if (!hasEmail) return;
    try { await navigator.clipboard.writeText(email); document.querySelector('#email-note').textContent = 'Email address copied.'; }
    catch { document.querySelector('#email-note').textContent = 'Select the email address above to copy it manually.'; }
  });
})();
