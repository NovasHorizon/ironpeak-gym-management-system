import { Link } from 'react-router-dom';
import { useApi } from '../api';
import PlanCards from '../components/PlanCards';
import BmiCalculator from '../components/BmiCalculator';
import TrialForm from '../components/TrialForm';

const img = (id, w = 700, h = 930) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

const PROGRAMS = [
  { title: 'Strength Training', tag: 'Build muscle', text: 'Progressive barbell and machine programs that make every week stronger than the last.', meta: '60 min · All levels', image: '1541534741688-6078c6bfb5c5', alt: 'Woman pressing a barbell overhead in a squat rack' },
  { title: 'HIIT Burn', tag: 'Burn fat', text: 'Short, savage intervals with ropes, sleds and bikes. Maximum calories, minimum time.', meta: '45 min · Intermediate', image: '1599058917212-d750089bc07e', alt: 'Athlete training with battle ropes' },
  { title: 'Kickboxing', tag: 'Fight fit', text: 'Pad work, footwork and conditioning that builds confidence along with cardio.', meta: '60 min · All levels', image: '1599552683573-9dc48255fe85', alt: 'Woman throwing a high kick' },
  { title: 'Yoga & Mobility', tag: 'Recover', text: 'Open up tight hips and shoulders, breathe better and move without pain.', meta: '60 min · All levels', image: '1544367567-0f2fcb009e0b', alt: 'Yoga pose silhouetted against a sunset' },
  { title: 'Group Classes', tag: 'Stay motivated', text: 'Zumba, circuits and bootcamps with music, energy and people who show up.', meta: '45 min · All levels', image: '1518310383802-640c2de311b2', alt: 'Group fitness class lifting dumbbells together' },
  { title: 'Personal Training', tag: '1-on-1', text: 'A coach, a plan and real accountability built around your body and goals.', meta: 'Your schedule', image: '1584466977773-e625c37cdd50', alt: 'Coach spotting a member on the bench press' },
];

const STATS = [['2,500+', 'Active members'], ['15', 'Expert coaches'], ['60+', 'Classes a week'], ['24/7', 'Gym access']];

function SectionHead({ eyebrow, title, accent, text, center }) {
  return (
    <div className={`mb-5 ${center ? 'text-center' : 'd-lg-flex justify-content-between align-items-end gap-5'}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title mb-0">{title} <span className="text-accent">{accent}</span></h2>
      </div>
      {text && <p className={`text-secondary mb-0 mt-3 mt-lg-0 ${center ? 'mx-auto' : ''}`} style={{ maxWidth: '42ch' }}>{text}</p>}
    </div>
  );
}

function Trainers() {
  const { data: trainers, error } = useApi('/trainers');
  if (error) return <div className="alert alert-danger">Couldn't load trainers: {error.message}</div>;
  if (!trainers) return <div className="text-center text-secondary py-5">Loading coaches…</div>;
  return (
    <div className="row g-4 row-cols-2 row-cols-lg-4">
      {trainers.map((t) => (
        <div className="col trainer" key={t.id}>
          <div className="position-relative">
            <img className="trainer-img" src={t.photo_url} alt={`Coach ${t.name}`} loading="lazy" />
            <span className="badge rounded-pill bg-black bg-opacity-75 position-absolute top-0 start-0 m-3">{t.experience_years} yrs</span>
          </div>
          <h3 className="display-font fs-3 mt-3 mb-1">{t.name}</h3>
          <p className="small fw-semibold text-accent mb-0">{t.specialty}</p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <img className="hero-bg" src={img('1605296867304-46d5465a13f1', 1800, 1200)} alt="" fetchpriority="high" />
        <div className="container">
          <div className="rise">
            <span className="badge rounded-pill border border-secondary-subtle bg-dark bg-opacity-50 px-3 py-2 text-uppercase fw-semibold" style={{ letterSpacing: '.14em' }}>
              <span className="text-accent me-2">●</span>Pune's premium fitness club
            </span>
            <h1 className="hero-title my-4">Forge your<br /><span className="text-accent">strongest</span><br />self</h1>
            <p className="lead text-light-emphasis" style={{ maxWidth: '46ch' }}>
              World-class equipment, expert coaches and a community that pushes you further. Your first workout is on us.
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link to="/join" className="btn btn-primary btn-lg">Join IronPeak →</Link>
              <Link to="/schedule" className="btn btn-outline-light btn-lg">View class schedule</Link>
            </div>
          </div>
          <div className="row row-cols-2 row-cols-md-4 g-3 hero-stats mt-5 pt-3 rise" style={{ animationDelay: '.3s' }}>
            {STATS.map(([n, label]) => (
              <div className="col" key={label}><strong>{n}</strong><span className="small text-secondary">{label}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="programs">
        <div className="container">
          <SectionHead eyebrow="Programs" title="Train the way you" accent="want" text="Six programs designed by our coaches for every goal, from your first push-up to your first competition." />
          <div className="row g-4 swipe-row">
            {PROGRAMS.map((p) => (
              <div className="col-lg-4" key={p.title}>
                <article className="program-card">
                  <img src={img(p.image)} alt={p.alt} loading="lazy" />
                  <div className="p-4">
                    <span className="tag mb-3">{p.tag}</span>
                    <h3 className="display-font fs-1 lh-1 mb-2">{p.title}</h3>
                    <p className="small text-light-emphasis mb-2">{p.text}</p>
                    <span className="small text-secondary">{p.meta}</span>
                  </div>
                </article>
              </div>
            ))}
          </div>
          <p className="small text-secondary d-lg-none mt-2 mb-0">Swipe to see more →</p>
        </div>
      </section>

      <section className="section" id="plans">
        <div className="container">
          <SectionHead center eyebrow="Membership" title="Pick your" accent="plan" />
          <PlanCards />
        </div>
      </section>

      <section className="section section-alt" id="bmi">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <p className="eyebrow">Free tool</p>
              <h2 className="section-title">Know your <span className="text-accent">numbers</span></h2>
              <p className="text-secondary mt-3" style={{ maxWidth: '46ch' }}>
                Check your Body Mass Index in seconds, then let our coaches build a plan around it.
              </p>
            </div>
            <div className="col-lg-6"><BmiCalculator /></div>
          </div>
        </div>
      </section>

      <section className="section" id="trainers">
        <div className="container">
          <SectionHead eyebrow="Our coaches" title="Meet the" accent="team" text="Certified, experienced and genuinely invested in your progress." />
          <Trainers />
        </div>
      </section>

      <section className="section section-alt" id="trial">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <p className="eyebrow">Free trial</p>
              <h2 className="section-title">Your first workout is <span className="text-accent">on us</span></h2>
              <p className="text-secondary mt-3" style={{ maxWidth: '46ch' }}>
                Tell us a little about yourself and our team will call to fix a time. A coach will give you a tour, a fitness assessment and a guided workout.
              </p>
              <ul className="list-unstyled check-list mt-4 mb-0">
                <li>Mon to Sat: 5 am to 11 pm, Sunday: 7 am to 1 pm</li>
                <li>Free parking for bikes and cars</li>
                <li>No payment, no pressure</li>
              </ul>
            </div>
            <div className="col-lg-6"><TrialForm /></div>
          </div>
        </div>
      </section>
    </>
  );
}
