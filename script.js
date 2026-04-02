document.addEventListener('DOMContentLoaded', async () => {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, { initialView: 'dayGridMonth', events: [] });
  calendar.render();

  // Fetch existing bookings
  const resp = await fetch('https://<YOUR_VERCEL_PROJECT>/api/bookings');
  const bookings = await resp.json();

  bookings.forEach(b => {
    calendar.addEvent({
      title: `${b.name} (${b.status})`,
      start: b.start,
      end: new Date(new Date(b.end).getTime() + 24*60*60*1000),
      color: b.status === 'confirmed' ? 'red' : b.status === 'tentative' ? 'yellow' : 'green'
    });
  });

  const form = document.getElementById('bookingForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = {
      name: form.name.value,
      email: form.email.value,
      start: form.start.value,
      end: form.end.value,
      status: form.status.value
    };

    await fetch('https://<YOUR_VERCEL_PROJECT>/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    alert('Booking request sent! Check your email for the approval link.');
    form.reset();
  });
});
