import { Link, useNavigate } from 'react-router-dom';
import { Brand } from '../components/Screen.jsx';
import { ArrowRight } from '../components/Icons.jsx';
import { ButtonLink, Button } from '../components/ui.jsx';
import { useStore } from '../state/store.jsx';

const STEPS = [
  ['Tell us about you', 'Likes, dislikes, experiences, limits. “Not tried” is its own answer.'],
  ['Get three directions', 'Each with reasons it may fit, reasons it may not, and open questions.'],
  ['Compare, then try one thing', 'Sourced facts side by side, plus a small free activity for each direction.'],
  ['Reflect and revise', 'Say what you enjoyed. See what changed in your shortlist, and why.'],
  ['Bring a summary', 'A one-page PDF for your counselor meeting or college research.'],
];

const WONT = [
  ['Pretend to be certain', 'No percentages or “98% match.” Your shortlist is a starting point to test.'],
  ['Steer you toward pay', 'You set your priorities. Money is shown as one factor, never the ranking.'],
  ['Treat “never tried” as “no”', 'If you haven’t seen a field yet, we may suggest it as something worth a try.'],
  ['Make up facts', 'Comparison facts come from public data with a source and date. Gaps are labeled as gaps.'],
];

function resumePath(s) {
  if (s.revision === 'accepted') return '/summary';
  if (Object.keys(s.reflections).length) return '/reflect';
  if (s.released) return '/shortlist';
  if (s.submitted) return '/check';
  return '/intake';
}

export default function Landing() {
  const [state, { reset }] = useStore();
  const navigate = useNavigate();
  const started = Object.keys(state.answers).length > 0 || state.name;
  const display = { fontFamily: 'var(--font-display)' };

  return (
    <div className="page">
      <header className="app-header">
        <div className="app-header__inner" style={{ maxWidth: 1200, padding: '14px 24px' }}>
          <Brand size={17} />
          <nav aria-label="Account" style={{ display: 'flex', gap: 8 }}>
            <Link to="/reviewer" className="btn" style={{ fontSize: 15, color: 'var(--subtle)' }}>
              Reviewer console
            </Link>
            <Link to={resumePath(state)} className="btn" style={{ fontSize: 15 }}>
              {started ? 'Continue' : 'Sign in'}
            </Link>
          </nav>
        </div>
      </header>

      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '72px 24px 56px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(460px, 100%), 1fr))',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p className="eyebrow" style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: '0.06em' }}>
            For high-school juniors starting a college search
          </p>
          <h1 className="title" style={{ fontSize: 'clamp(38px, 5vw, 56px)', lineHeight: 1.04 }}>
            Three directions you understand. One real step to test each.
          </h1>
          <p className="lede" style={{ fontSize: 19, lineHeight: 1.55, maxWidth: 540 }}>
            Tell us what you like, what you don’t, and what you simply haven’t tried. You’ll get a provisional shortlist with
            the reasons behind it, a side-by-side comparison, and something small to go try before you decide anything.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {started ? (
              <>
                <ButtonLink to={resumePath(state)} variant="primary" size="lg">
                  Pick up where you left off <ArrowRight />
                </ButtonLink>
                <Button
                  size="lg"
                  onClick={() => {
                    reset();
                    navigate('/intake');
                  }}
                >
                  Start over
                </Button>
              </>
            ) : (
              <>
                <ButtonLink to="/intake" variant="primary" size="lg">
                  Start exploring <ArrowRight />
                </ButtonLink>
                <a href="#how" className="btn btn--secondary btn--lg">
                  How it works
                </a>
              </>
            )}
          </div>
          <p className="note" style={{ fontSize: 15 }}>
            One sitting. Saved automatically, so you can pick up where you left off.
          </p>
        </div>

        <div aria-label="Example shortlist card">
          <div className="card" style={{ borderRadius: 16, padding: 28, gap: 18, boxShadow: '0 1px 2px rgba(22,24,29,0.04), 0 12px 32px rgba(22,24,29,0.06)' }}>
            <div className="row-between">
              <span className="eyebrow">Example · Direction 1 of 3</span>
              <span className="badge badge--guess">Provisional</span>
            </div>
            <h2 style={{ ...display, margin: 0, fontSize: 30, fontWeight: 600 }}>Biology</h2>
            {[
              ['Why it may fit', 'var(--accent)', 'You said biology is your favorite class, and you enjoyed volunteering with animals.'],
              ['Why it may not', 'var(--try)', 'Most programs include chemistry and statistics, and you said timed math tests aren’t for you.'],
              ['Still to find out', 'var(--muted)', 'Do you like lab work, or mainly learning about living things?'],
            ].map(([h, c, t]) => (
              <div key={h} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: c }}>{h}</span>
                <span style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink-2)' }}>{t}</span>
              </div>
            ))}
          </div>
          <p className="note" style={{ margin: '14px 4px 0' }}>
            No match scores. Every direction shows its reasons, its reservations and what’s still unknown.
          </p>
        </div>
      </section>

      <section id="how" style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
            <h2 className="title" style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.01em' }}>
              Not a quiz. A loop you can learn from.
            </h2>
            <p className="lede" style={{ lineHeight: 1.55 }}>
              Your shortlist changes as you try things, so it ends up reflecting real experience, not just a first guess.
            </p>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 16 }}>
            {STEPS.map(([h, t], i) => (
              <li key={h} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 22, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--surface-soft)' }}>
                <span style={{ ...display, fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                <strong style={{ fontSize: 17 }}>{h}</strong>
                <span style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--muted)' }}>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <h2 className="title" style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.01em' }}>
          What we won’t do
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 24 }}>
          {WONT.map(([h, t]) => (
            <div key={h} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <strong style={{ fontSize: 18 }}>{h}</strong>
              <span style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--muted)' }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 72px' }}>
        <div className="panel-dark" style={{ borderRadius: 20, padding: 48, gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 620 }}>
            <h2 style={{ ...display, margin: 0, fontSize: 32, fontWeight: 600 }}>Walk into your counselor meeting with something to talk about.</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: 'var(--line-strong)' }}>
              Built for students: no ad trackers, you choose what you share, and you can delete your data anytime.
            </p>
          </div>
          <ButtonLink to={started ? resumePath(state) : '/intake'} variant="inverse" size="lg">
            {started ? 'Continue' : 'Start exploring'}
          </ButtonLink>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--line)' }}>
        <div className="row-between" style={{ maxWidth: 1200, margin: '0 auto', padding: 24, fontSize: 14, color: 'var(--subtle)', gap: 16 }}>
          <span>Facts drawn from public data: NCES, O*NET, BLS Occupational Outlook Handbook, College Scorecard.</span>
          <nav aria-label="Footer" style={{ display: 'flex', gap: 20 }}>
            <a href="#how">Privacy</a>
            <Link to="/reviewer">For counselors</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
