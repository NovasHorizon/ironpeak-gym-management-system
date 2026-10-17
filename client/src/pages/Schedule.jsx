import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, DAYS, formatDate, formatTime, useApi } from '../api';
import { useAuth } from '../auth';

export default function Schedule() {
  const { member } = useAuth();
  const navigate = useNavigate();
  const { data: slots, error, reload } = useApi('/schedule');
  const [bookings, setBookings] = useState([]);
  const [day, setDay] = useState(((new Date().getDay() + 6) % 7) + 1); // 1 = Mon ... 7 = Sun, starts on today
  const [notice, setNotice] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadBookings = useCallback(() => {
    if (member) api('/bookings').then(setBookings).catch(() => setBookings([]));
    else setBookings([]);
  }, [member]);
  useEffect(loadBookings, [loadBookings]);

  const isBooked = (slot) => bookings.some((b) => b.schedule_id === slot.id && b.class_date === slot.next_date);

  const book = async (slot) => {
    if (!member) {
      navigate('/login?next=/schedule');
      return;
    }
    setBusyId(slot.id);
    try {
      const res = await api('/bookings', { method: 'POST', body: { schedule_id: slot.id } });
      setNotice({ type: 'success', text: `Booked! ${slot.class_name} on ${formatDate(res.class_date)} at ${formatTime(slot.start_time)}.` });
      reload();
      loadBookings();
    } catch (err) {
      setNotice({ type: 'danger', text: err.message });
    } finally {
      setBusyId(null);
    }
  };

  const daySlots = (slots || []).filter((s) => s.day_of_week === day);

  return (
    <section className="container page">
      <p className="eyebrow">Timetable</p>
      <h1 className="section-title mb-3">Weekly class <span className="text-accent">schedule</span></h1>
      <p className="text-secondary mb-4" style={{ maxWidth: '52ch' }}>
        {member ? 'Pick a class and book your spot for its next session.' : 'Log in to book a spot. Spots left are shown for each class\'s next session.'}
      </p>

      {notice && (
        <div className={`alert alert-${notice.type} alert-dismissible`} role="status">
          {notice.text}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setNotice(null)} />
        </div>
      )}

      <ul className="nav nav-pills nav-fill gap-2 mb-3 flex-nowrap day-pills" role="tablist">
        {DAYS.map((label, i) => (
          <li className="nav-item" key={label} role="presentation">
            <button type="button" role="tab" aria-selected={day === i + 1} className={`nav-link border ${day === i + 1 ? 'active' : ''}`} onClick={() => setDay(i + 1)}>
              {label}
            </button>
          </li>
        ))}
      </ul>

      {error && <div className="alert alert-danger">Couldn't load the schedule: {error.message}</div>}
      {!slots && !error && <div className="text-secondary py-5 text-center">Loading schedule…</div>}

      <div className="border-top">
        {daySlots.map((slot, i) => {
          const booked = isBooked(slot);
          const full = slot.spots_left === 0;
          return (
            <div className="class-row" key={slot.id} style={{ animationDelay: `${i * 60}ms` }}>
              <span className="class-time">{formatTime(slot.start_time)}</span>
              <div>
                <div className="fw-semibold">
                  {slot.class_name} <span className="badge text-bg-dark border ms-1 fw-normal">{slot.level}</span>
                </div>
                <div className="small text-secondary">
                  with {slot.trainer_name} · {slot.duration_min} min · next on {formatDate(slot.next_date)} ·{' '}
                  <span className={slot.spots_left <= 3 ? 'text-warning' : ''}>{slot.spots_left} spots left</span>
                </div>
              </div>
              {booked ? (
                <button type="button" className="btn btn-outline-light btn-sm px-3" disabled>Booked ✓</button>
              ) : (
                <button type="button" className="btn btn-primary btn-sm px-3" disabled={full || busyId === slot.id} onClick={() => book(slot)}>
                  {full ? 'Full' : busyId === slot.id ? 'Booking…' : 'Book'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
