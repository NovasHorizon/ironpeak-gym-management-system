import { useState } from 'react';
import { api } from '../api';

// Options must match the lists in backend/api/handlers.php
const GOALS = ['Lose weight', 'Build muscle', 'Get fit and active', 'Train for a sport'];
const PLANS = ['Not sure yet', 'Basic', 'Pro', 'Elite'];
const TIMES = ['Morning (6 to 10 am)', 'Afternoon (12 to 4 pm)', 'Evening (5 to 10 pm)'];

const EMPTY = { name: '', phone: '', goal: GOALS[0], plan: PLANS[0], preferred_time: TIMES[0] };

export default function TrialForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ sending: false, error: null, success: null });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: null, success: null });
    try {
      const res = await api('/enquiries', { method: 'POST', body: form });
      setStatus({ sending: false, error: null, success: res.message });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ sending: false, error: err.message, success: null });
    }
  };

  return (
    <form className="card p-4 p-md-5" onSubmit={onSubmit}>
      <h3 className="display-font fs-2 mb-4">Book your free session</h3>
      {status.success && <div className="alert alert-success" role="status">{status.success}</div>}
      {status.error && <div className="alert alert-danger" role="alert">{status.error}</div>}

      <div className="mb-3">
        <label className="form-label" htmlFor="t-name">Full name</label>
        <input id="t-name" className="form-control" required maxLength={100} autoComplete="name" value={form.name} onChange={update('name')} />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="t-phone">Mobile number</label>
        <input id="t-phone" className="form-control" type="tel" required inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" value={form.phone} onChange={update('phone')} />
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label className="form-label" htmlFor="t-goal">Your goal</label>
          <select id="t-goal" className="form-select" value={form.goal} onChange={update('goal')}>
            {GOALS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="col-sm-6">
          <label className="form-label" htmlFor="t-plan">Plan</label>
          <select id="t-plan" className="form-select" value={form.plan} onChange={update('plan')}>
            {PLANS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="t-time">Preferred time</label>
        <select id="t-time" className="form-select" value={form.preferred_time} onChange={update('preferred_time')}>
          {TIMES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <button className="btn btn-primary btn-lg w-100" type="submit" disabled={status.sending}>
        {status.sending ? 'Sending…' : 'Claim my free session'}
      </button>
      <p className="small text-secondary text-center mt-3 mb-0">No spam. We only call to confirm your session.</p>
    </form>
  );
}
