import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate, formatTime, rupees, useApi } from '../api';
import { useAuth } from '../auth';

export default function Dashboard() {
  const { member } = useAuth();
  const { data: bookings, error, reload } = useApi('/bookings');
  const [cancelling, setCancelling] = useState(null);
  const [notice, setNotice] = useState(null);

  const cancel = async (booking) => {
    if (!window.confirm(`Cancel ${booking.class_name} on ${formatDate(booking.class_date)}?`)) return;
    setCancelling(booking.id);
    try {
      await api(`/bookings/${booking.id}`, { method: 'DELETE' });
      setNotice({ type: 'success', text: 'Booking cancelled.' });
      reload();
    } catch (err) {
      setNotice({ type: 'danger', text: err.message });
    } finally {
      setCancelling(null);
    }
  };

  return (
    <section className="container page">
      <p className="eyebrow">My account</p>
      <h1 className="section-title mb-5">Hi, <span className="text-accent">{member.name.split(' ')[0]}</span></h1>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card p-4 h-100">
            <p className="small text-secondary mb-1">Your plan</p>
            {member.plan_name ? (
              <>
                <h2 className="display-font fs-1 mb-0">{member.plan_name}</h2>
                <p className="text-accent">{rupees(member.monthly_price)}/month</p>
              </>
            ) : (
              <>
                <h2 className="display-font fs-1 mb-1">No plan yet</h2>
                <Link to="/#plans" className="small">Compare plans →</Link>
              </>
            )}
            <hr />
            <dl className="small mb-0">
              <dt className="text-secondary fw-normal">Email</dt><dd>{member.email}</dd>
              <dt className="text-secondary fw-normal">Mobile</dt><dd>{member.phone}</dd>
              <dt className="text-secondary fw-normal">Member since</dt><dd className="mb-0">{formatDate(member.created_at.slice(0, 10))}</dd>
            </dl>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="display-font fs-2 mb-0">Upcoming classes</h2>
              <Link to="/schedule" className="btn btn-primary btn-sm px-3">Book a class</Link>
            </div>
            {notice && <div className={`alert alert-${notice.type} py-2`} role="status">{notice.text}</div>}
            {error && <div className="alert alert-danger">{error.message}</div>}
            {bookings?.length === 0 && (
              <p className="text-secondary mb-0">No upcoming classes. <Link to="/schedule">See the schedule</Link> and book your first one.</p>
            )}
            <ul className="list-group list-group-flush">
              {bookings?.map((b) => (
                <li key={b.id} className="list-group-item bg-transparent px-0 d-flex justify-content-between align-items-center gap-3">
                  <div>
                    <div className="fw-semibold">{b.class_name}</div>
                    <div className="small text-secondary">
                      {formatDate(b.class_date)} · {formatTime(b.start_time)} · {b.duration_min} min with {b.trainer_name}
                    </div>
                  </div>
                  <button type="button" className="btn btn-outline-danger btn-sm" disabled={cancelling === b.id} onClick={() => cancel(b)}>
                    {cancelling === b.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
