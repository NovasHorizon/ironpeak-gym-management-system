import { useState } from 'react';
import { Link } from 'react-router-dom';
import { rupees, useApi } from '../api';

export default function PlanCards() {
  const { data: plans, error } = useApi('/plans');
  const [yearly, setYearly] = useState(false);

  if (error) return <div className="alert alert-danger">Couldn't load plans: {error.message}</div>;
  if (!plans) return <div className="text-center text-secondary py-5">Loading plans…</div>;

  return (
    <>
      <div className="d-flex justify-content-center mb-5">
        <div className="btn-group p-1 rounded-pill bg-body-tertiary border" role="group" aria-label="Billing period">
          <button type="button" className={`btn btn-sm px-4 ${yearly ? 'text-secondary' : 'btn-primary'}`} aria-pressed={!yearly} onClick={() => setYearly(false)}>
            Monthly
          </button>
          <button type="button" className={`btn btn-sm px-4 ${yearly ? 'btn-primary' : 'text-secondary'}`} aria-pressed={yearly} onClick={() => setYearly(true)}>
            Yearly <span className="badge rounded-pill text-bg-dark ms-1">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        {plans.map((plan) => {
          const price = yearly ? plan.yearly_price : plan.monthly_price;
          return (
            <div key={plan.id} className={`col-md-6 col-lg-4 ${plan.is_featured ? 'order-first order-lg-0' : ''}`}>
              <div className={`card plan-card h-100 p-4 ${plan.is_featured ? 'featured' : ''}`}>
                {plan.is_featured && <span className="tag plan-badge">Most popular</span>}
                <h3 className="display-font fs-1 mb-1">{plan.name}</h3>
                <p className="text-secondary small">{plan.description}</p>
                <div className="d-flex align-items-baseline gap-1 mt-2">
                  <span className="price">{rupees(price)}</span>
                  <span className="text-secondary small">/month</span>
                </div>
                <p className="small text-accent mb-4">
                  {yearly ? `Billed ${rupees(plan.yearly_price * 12)} yearly` : 'No joining fee this month'}
                </p>
                <ul className="list-unstyled check-list flex-grow-1 mb-4">
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <Link to={`/join?plan=${plan.id}`} className={`btn ${plan.is_featured ? 'btn-primary' : 'btn-outline-light'} w-100`}>
                  Choose {plan.name}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
