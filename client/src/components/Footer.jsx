import { Link } from 'react-router-dom';
import { Logo } from './Navbar';

export default function Footer() {
  return (
    <footer className="site-footer py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <Logo />
            <p className="text-secondary mt-3 mb-0 small" style={{ maxWidth: '34ch' }}>
              Strength and conditioning gym in Pune. Built for people who show up.
            </p>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="footer-heading">Explore</h6>
            <ul className="list-unstyled small d-grid gap-2">
              <li><Link to="/#programs">Programs</Link></li>
              <li><Link to="/#plans">Membership</Link></li>
              <li><Link to="/schedule">Class schedule</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="footer-heading">Members</h6>
            <ul className="list-unstyled small d-grid gap-2">
              <li><Link to="/join">Join now</Link></li>
              <li><Link to="/login">Log in</Link></li>
              <li><Link to="/dashboard">My bookings</Link></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h6 className="footer-heading">Hours</h6>
            <p className="small text-secondary mb-1">Mon to Sat: 5 am to 11 pm</p>
            <p className="small text-secondary mb-0">Sunday: 7 am to 1 pm</p>
          </div>
        </div>
        <hr className="my-4" />
        <p className="small text-secondary mb-0">
          © {new Date().getFullYear()} IronPeak Fitness. Demo project: React, Bootstrap, Laravel and MySQL.
        </p>
      </div>
    </footer>
  );
}
