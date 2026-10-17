import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Blog from './pages/Blog';
import Join from './pages/Join';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function RequireAuth({ children }) {
  const { member, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="container py-5 text-center text-secondary">Loading…</div>;
  if (!member) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  return children;
}

function NotFound() {
  return (
    <section className="container page text-center">
      <h1 className="display-font display-3">Page not found</h1>
      <p className="text-secondary">That page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </section>
  );
}

export default function App() {
  const { pathname, hash } = useLocation();

  // Scroll to the top on page change, or to a #section when the link has one.
  useEffect(() => {
    const target = hash && document.querySelector(hash);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
