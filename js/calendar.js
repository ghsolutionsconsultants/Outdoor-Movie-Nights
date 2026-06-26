/* ── Screenings Calendar ── */
(function() {
  const EVENTS = [
    {
      date: '2026-07-19',
      name: 'FIFA World Cup Final Screening',
      type: 'fanpark',
      status: 'confirmed',
      venue: 'Pretoria, Tshwane',
      details: 'Watch the FIFA World Cup Final LIVE on a massive outdoor screen. A historic fan park experience in the heart of Pretoria. Gates open at 17:00. Venue details and ticketing coming soon.',
      icon: '🏆'
    },
    {
      date: '2026-10-17',
      name: 'Outdoor Movie Night',
      type: 'cinema',
      status: 'planning',
      venue: 'Johannesburg',
      details: 'Details to be confirmed. Stay tuned for movie title, exact venue, and ticketing information.',
      icon: '🎬'
    },
    {
      date: '2026-12-19',
      name: 'Year End Screening',
      type: 'cinema',
      status: 'planning',
      venue: 'Johannesburg',
      details: 'Our signature year-end celebration under the stars. Details and venue to be announced.',
      icon: '✨'
    },
    {
      date: '2027-02-14',
      name: "Valentine's Night Under the Stars",
      type: 'cinema',
      status: 'planning',
      venue: 'Johannesburg',
      details: "A romantic outdoor cinema experience for Valentine's Day. Details coming soon.",
      icon: '❤️'
    }
  ];

  // Parse event dates
  const eventMap = {};
  EVENTS.forEach(ev => { eventMap[ev.date] = ev; });

  // Countdown to first event
  const countdownTarget = new Date('2026-07-19T17:00:00');

  function updateCountdown() {
    const now  = new Date();
    const diff = countdownTarget - now;
    if (diff <= 0) {
      document.getElementById('cd-days')?.innerText && (document.getElementById('cd-days').textContent = '0');
      return;
    }
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);
    const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = String(v).padStart(2,'0'); };
    el('cd-days', d); el('cd-hours', h); el('cd-mins', m); el('cd-secs', s);
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Calendar state
  let currentYear  = 2026;
  let currentMonth = 6; // July (0-indexed)

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function renderCalendar() {
    const title = document.getElementById('cal-month-title');
    if (title) title.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const grid = document.getElementById('cal-grid');
    if (!grid) return;

    const today = new Date();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrev  = new Date(currentYear, currentMonth, 0).getDate();

    let html = dayNames.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

    // Prev month fill
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="calendar-day other-month"><span class="day-num">${daysInPrev - i}</span></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const ev = eventMap[dateStr];
      const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === d;
      let cls = 'calendar-day';
      if (ev) cls += ' has-event';
      if (isToday) cls += ' today';

      let inner = `<span class="day-num">${d}</span>`;
      if (ev) inner += `<span class="event-dot ${ev.status}"></span>`;

      const onclick = ev ? `onclick="showEventDetail('${dateStr}')"` : '';
      html += `<div class="${cls}" ${onclick}>${inner}</div>`;
    }

    // Next month fill
    const total = firstDay + daysInMonth;
    const remaining = Math.ceil(total / 7) * 7 - total;
    for (let d = 1; d <= remaining; d++) {
      html += `<div class="calendar-day other-month"><span class="day-num">${d}</span></div>`;
    }

    grid.innerHTML = html;
  }

  window.showEventDetail = function(dateStr) {
    const ev = eventMap[dateStr];
    if (!ev) return;
    const panel = document.getElementById('event-detail-panel');
    if (!panel) return;

    const date = new Date(dateStr + 'T12:00:00');
    const fmtDate = date.toLocaleDateString('en-ZA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

    const statusBadge = ev.status === 'confirmed'
      ? `<span class="badge badge-confirmed">Confirmed</span>`
      : `<span class="badge badge-planning">In Planning</span>`;

    const ctaBtn = ev.status === 'confirmed'
      ? `<a href="contact.html" class="btn btn-primary" style="width:100%;justify-content:center">🎟️ Book Tickets</a>`
      : `<a href="contact.html?event=${encodeURIComponent(ev.name)}" class="btn btn-amber" style="width:100%;justify-content:center">🔔 Notify Me</a>`;

    panel.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
        <span style="font-size:2rem">${ev.icon}</span>
        <div>
          <div style="font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--c-muted);margin-bottom:4px">${ev.type}</div>
          ${statusBadge}
        </div>
      </div>
      <h3 style="font-family:var(--font-display);font-size:1.3rem;font-weight:600;margin-bottom:10px">${ev.name}</h3>
      <p style="font-size:0.85rem;color:var(--c-amber);margin-bottom:6px">📅 ${fmtDate}</p>
      <p style="font-size:0.85rem;color:var(--c-muted);margin-bottom:20px">📍 ${ev.venue}</p>
      <p style="font-size:0.875rem;color:rgba(240,240,245,0.75);line-height:1.7;margin-bottom:28px">${ev.details}</p>
      ${ctaBtn}
    `;

    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.classList.add('visible');

    const emptyPanel = document.getElementById('empty-panel');
    if (emptyPanel) emptyPanel.style.display = 'none';
  };

  // Nav buttons
  document.getElementById('cal-prev')?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  document.getElementById('cal-next')?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  // View toggle
  document.getElementById('view-calendar')?.addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('view-list')?.classList.remove('active');
    document.getElementById('calendar-view')?.style && (document.getElementById('calendar-view').style.display = 'block');
    document.getElementById('list-view')?.style && (document.getElementById('list-view').style.display = 'none');
  });

  document.getElementById('view-list')?.addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('view-calendar')?.classList.remove('active');
    document.getElementById('list-view')?.style && (document.getElementById('list-view').style.display = 'block');
    document.getElementById('calendar-view')?.style && (document.getElementById('calendar-view').style.display = 'none');
  });

  renderCalendar();
})();
