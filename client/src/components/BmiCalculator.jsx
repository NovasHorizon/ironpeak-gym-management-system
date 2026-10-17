import { useState } from 'react';

const BANDS = [
  { max: 18.5, label: 'Underweight', color: '#38bdf8', tip: 'Strength training plus a calorie-surplus diet plan will help you build healthy mass.' },
  { max: 25, label: 'Healthy', color: '#c8ff2e', tip: 'Great base! Strength and HIIT will help you build muscle and stay lean.' },
  { max: 30, label: 'Overweight', color: '#fbbf24', tip: 'HIIT plus a coach-built diet plan is the fastest, safest way to bring this down.' },
  { max: Infinity, label: 'Obese', color: '#fb7185', tip: 'Start with guided personal training. Our coaches will build a safe, gradual plan.' },
];

function bmiResult(heightCm, weightKg) {
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  return { bmi, band: BANDS.find((b) => bmi < b.max) };
}

export default function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setResult(bmiResult(Number(height), Number(weight)));
  };

  // The scale bar covers BMI 15 to 40
  const pinLeft = result ? Math.min(Math.max((result.bmi - 15) / 25, 0), 1) * 100 : 0;

  return (
    <form className="card p-4 p-md-5" onSubmit={onSubmit}>
      <h3 className="display-font fs-2 mb-4">BMI calculator</h3>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label className="form-label" htmlFor="bmi-h">Height (cm)</label>
          <input id="bmi-h" className="form-control" type="number" inputMode="decimal" min="100" max="250" step="0.1" placeholder="170" required value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div className="col-sm-6">
          <label className="form-label" htmlFor="bmi-w">Weight (kg)</label>
          <input id="bmi-w" className="form-control" type="number" inputMode="decimal" min="25" max="300" step="0.1" placeholder="70" required value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary w-100" type="submit">Calculate my BMI</button>

      {result && (
        <div className="border-top mt-4 pt-4 rise" aria-live="polite">
          <div className="d-flex align-items-baseline gap-3">
            <strong className="display-font" style={{ fontSize: '4rem', lineHeight: 1 }}>{result.bmi.toFixed(1)}</strong>
            <span className="fw-bold small text-uppercase" style={{ color: result.band.color, letterSpacing: '.1em' }}>{result.band.label}</span>
          </div>
          <div className="bmi-scale"><span className="bmi-pin" style={{ left: `${pinLeft}%` }} /></div>
          <p className="mt-3 mb-1">{result.band.tip}</p>
          <p className="small text-secondary mb-0">BMI is a rough guide. It doesn't account for muscle mass.</p>
        </div>
      )}
    </form>
  );
}
