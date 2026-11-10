import { Link } from 'react-router-dom';
import { Check, LogoMark } from './Icons.jsx';
import { useStore } from '../state/store.jsx';

const STEPS = [
  { n: 1, label: 'About you', to: '/intake' },
  { n: 2, label: 'Your options', to: '/shortlist' },
  { n: 3, label: 'Try it', to: '/explore' },
  { n: 4, label: 'Share', to: '/summary' },
];

export function Brand({ size = 16 }) {
  return (
    <Link to="/" aria-label="Home" className="brand" style={{ fontSize: size }}>
      <LogoMark size={size + 10} />
      <span>College Major Exploration</span>
    </Link>
  );
}

// Student-facing shell: brand, the four-step progress nav, and the signed-in initial.
export default function Screen({ step, width = 1100, gap = 24, children }) {
  const [state] = useStore();
  const name = state.name || 'you';
  const optionsTo = state.revision === 'accepted' ? '/revised' : '/shortlist';
  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header__inner">
          <Brand />
          <nav aria-label="Your progress" className="steps">
            <ol>
              {STEPS.map((s) => {
                const current = s.n === step;
                const done = s.n < step;
                return (
                  <li key={s.n}>
                    <Link
                      to={s.n === 2 ? optionsTo : s.to}
                      aria-current={current ? 'step' : undefined}
                      className={`step${done ? ' step--done' : ''}`}
                    >
                      <span className="step__num" aria-label={done ? 'done' : undefined}>
                        {done ? <Check /> : s.n}
                      </span>
                      {s.label}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
          <span className="avatar" role="img" aria-label={`Signed in as ${name}`}>
            {(state.name || '?').charAt(0).toUpperCase()}
          </span>
        </div>
      </header>
      <main className="container" style={{ maxWidth: width + 40, gap }}>
        {children}
      </main>
    </div>
  );
}
