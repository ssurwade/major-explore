import { Link } from 'react-router-dom';
import { BackIcon } from './Icons.jsx';

const TOTAL_STEPS = 6;

// Shared phone-width shell: top bar with back link or brand, progress, scrolling body, sticky footer.
export default function Screen({ step, back, title, lede, footer, bleed = false, children }) {
  return (
    <div className="screen">
      <header className="screen__header">
        <div className="screen__bar">
          {back ? (
            <Link to={back} className="screen__back" aria-label="Back">
              <BackIcon />
            </Link>
          ) : (
            <span className="screen__brand">major/explore</span>
          )}
          <span className="screen__step">
            {step} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL_STEPS} aria-valuenow={step}>
          <div className="progress__fill" style={{ width: `${Math.round((step / TOTAL_STEPS) * 100)}%` }} />
        </div>
      </header>
      <main className={`screen__main${bleed ? ' screen__main--bleed' : ''}`}>
        <div className="intro">
          <h1 className="intro__title">{title}</h1>
          {lede && <p className="intro__lede">{lede}</p>}
        </div>
        {children}
      </main>
      {footer && <footer className="screen__footer">{footer}</footer>}
    </div>
  );
}
