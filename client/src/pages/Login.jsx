import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Login() {
  const { member, saveSession } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ sending: false, error: null });

  // Only follow same-site paths after login (blocks redirects to other websites)
  const next = params.get('next');
  const target = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  if (member) return <Navigate to={target} replace />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: null });
    try {
      saveSession(await api('/auth/login', { method: 'POST', body: form }));
      navigate(target);
    } catch (err) {
      setStatus({ sending: false, error: err.message });
    }
  };

  return (
    <section className="container page">
      <div className="mx-auto" style={{ maxWidth: 460 }}>
        <p className="eyebrow">Members</p>
        <h1 className="section-title mb-4">Welcome <span className="text-accent">back</span></h1>
        <form className="card p-4 p-md-5" onSubmit={onSubmit}>
          {status.error && <div className="alert alert-danger" role="alert">{status.error}</div>}
          <div className="mb-3">
            <label className="form-label" htmlFor="l-email">Email</label>
            <input id="l-email" className="form-control" type="email" required autoComplete="email" value={form.email} onChange={update('email')} />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="l-password">Password</label>
            <input id="l-password" className="form-control" type="password" required autoComplete="current-password" value={form.password} onChange={update('password')} />
          </div>
          <button className="btn btn-primary btn-lg w-100" type="submit" disabled={status.sending}>
            {status.sending ? 'Logging in…' : 'Log in'}
          </button>
          <p className="small text-secondary text-center mt-3 mb-0">
            New here? <Link to="/join">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
