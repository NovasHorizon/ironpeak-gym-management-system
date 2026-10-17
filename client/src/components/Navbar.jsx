import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

export function Logo() {
  return (
    <span className="d-inline-flex align-items-center gap-2 display-font fs-3 lh-1">
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="var(--accent)" />
        <path d="M5 24 13 10l4 7 3-4 7 11z" fill="#0a0a0b" />
      </svg>
      <span>IRON<span className="text-accent">PEAK</span></span>
    </span>
  );
}

export default function Navbar() {
  const { member, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = pathname === '/' && !scrolled && !open;

  return (
    <nav className={`navbar navbar-expand-lg fixed-top site-nav ${transparent ? '' : 'is-solid'}`}>
      <div className="container">
        <Link to="/" className="navbar-brand text-white" aria-label="IronPeak home"><Logo /></Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          aria-controls="mainNav"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div id="mainNav" className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto gap-lg-3">
            <li className="nav-item"><Link className="nav-link" to="/#programs">Programs</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/#plans">Plans</Link></li>
            <li className="nav-item"><NavLink className="nav-link" to="/schedule">Schedule</NavLink></li>
            <li className="nav-item"><Link className="nav-link" to="/#trainers">Trainers</Link></li>
            <li className="nav-item"><NavLink className="nav-link" to="/blog">Blog</NavLink></li>
          </ul>
          <div className="d-flex flex-column flex-lg-row gap-2 py-3 py-lg-0">
            {member ? (
              <>
                <NavLink to="/dashboard" className="btn btn-outline-light btn-sm px-3">My account</NavLink>
                <button type="button" className="btn btn-link btn-sm text-secondary" onClick={logout}>Log out</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-outline-light btn-sm px-3">Log in</NavLink>
                <NavLink to="/join" className="btn btn-primary btn-sm px-3">Join now</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
