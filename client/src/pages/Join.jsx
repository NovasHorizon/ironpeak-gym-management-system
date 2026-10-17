import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { api, rupees, useApi } from '../api';
import { useAuth } from '../auth';

export default function Join() {
  const { member, saveSession } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: plans } = useApi('/plans');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', plan_id: params.get('plan') || '' });
  const [status, setStatus] = useState({ sending: false, error: null });

  if (member) return <Navigate to="/dashboard" replace />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: null });
    try {
      saveSession(await api('/auth/register', { method: 'POST', body: form }));
      navigate('/dashboard');
    } catch (err) {
      setStatus({ sending: false, error: err.message });
    }
  };

  return (
    <section className="container page">
      <div className="mx-auto" style={{ maxWidth: 520 }}>
        <p className="eyebrow">Membership</p>
        <h1 className="section-title mb-4">Join <span className="text-accent">IronPeak</span></h1>
        <form className="card p-4 p-md-5" onSubmit={onSubmit}>
          {status.error && <div className="alert alert-danger" role="alert">{status.error}</div>}
          <div className="mb-3">
            <label className="form-label" htmlFor="j-name">Full name</label>
            <input id="j-name" className="form-control" required maxLength={100} autoComplete="name" value={form.name} onChange={update('name')} />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="j-email">Email</label>
            <input id="j-email" className="form-control" type="email" required autoComplete="email" value={form.email} onChange={update('email')} />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="j-phone">Mobile number</label>
            <input id="j-phone" className="form-control" type="tel" required inputMode="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="j-password">Password</label>
            <input id="j-password" className="form-control" type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={update('password')} />
            <div className="form-text">At least 8 characters.</div>
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="j-plan">Plan</label>
            <select id="j-plan" className="form-select" value={form.plan_id} onChange={update('plan_id')}>
              <option value="">Decide later</option>
              {plans?.map((p) => <option key={p.id} value={p.id}>{p.name} · {rupees(p.monthly_price)}/month</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-lg w-100" type="submit" disabled={status.sending}>
            {status.sending ? 'Creating your account…' : 'Create account'}
          </button>
          <p className="small text-secondary text-center mt-3 mb-0">
            Already a member? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
