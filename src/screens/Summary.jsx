import { Navigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { DownloadIcon } from '../components/Icons.jsx';
import { Toggle } from '../components/ui.jsx';
import { summary } from '../logic/engine.js';
import { useStore } from '../state/store.jsx';

const OPTS = [
  ['dir', 'My options and why'],
  ['cmp', 'Big differences'],
  ['exp', 'What I tried'],
  ['q', 'Questions for my counselor'],
  ['next', 'What I’ll try next'],
];
const USES = [
  ['counselor', 'Counselor meeting'],
  ['research', 'Looking at colleges'],
  ['other', 'Somewhere else'],
];

const h3 = { margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)' };
const ul = { margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)' };

function Section({ title, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h3 style={h3}>{title}</h3>
      {children}
    </section>
  );
}

export default function Summary() {
  const [state, { merge, set }] = useStore();
  if (!Object.keys(state.answers).length) return <Navigate to="/intake" replace />;
  const s = summary(state);
  const inc = state.include;
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Screen step={4} gap={28}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
        <div className="no-print" style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="intro">
            <h1 className="title" style={{ fontSize: 38 }}>
              Your one-pager
            </h1>
            <p className="lede" style={{ fontSize: 17 }}>
              Bring it to your counselor or use it while you look at colleges. You decide what’s on it.
            </p>
          </div>

          <button type="button" className="btn btn--primary btn--xl" onClick={() => window.print()}>
            <DownloadIcon /> Download PDF
          </button>

          <fieldset className="card fieldset" style={{ border: '1px solid var(--line)', borderRadius: 18, padding: '18px 20px', gap: 2 }}>
            <legend style={{ fontSize: 16, fontWeight: 700, paddingBottom: 8 }}>What to include</legend>
            <div style={{ clear: 'both' }}>
              {OPTS.map(([k, label]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, fontSize: 16, cursor: 'pointer' }}>
                  <input type="checkbox" checked={inc[k]} onChange={() => merge('include', { [k]: !inc[k] })} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="fieldset" style={{ borderRadius: 18, background: 'var(--accent-soft)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <legend style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-strong)', paddingBottom: 6 }}>Already used it? Where?</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, clear: 'both' }}>
              {USES.map(([k, label]) => (
                <Toggle key={k} pill tone="solid" pressed={state.use === k} onClick={() => set({ use: state.use === k ? null : k })} style={{ minHeight: 48, padding: '0 16px', borderColor: 'var(--accent-line)', color: state.use === k ? undefined : 'var(--accent-strong)' }}>
                  {label}
                </Toggle>
              ))}
            </div>
          </fieldset>
        </div>

        <div style={{ flex: '999 1 540px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="no-print" style={{ fontSize: 15, fontWeight: 600, color: 'var(--subtle)' }}>
            This is exactly what your PDF will look like
          </span>
          <article aria-label="One-pager preview" className="one-pager" style={{ background: 'var(--surface)', borderRadius: 8, boxShadow: '0 1px 2px rgba(22,24,29,0.06), 0 16px 40px rgba(22,24,29,0.10)', padding: '44px 48px', display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 700 }}>
            <div className="row-between" style={{ alignItems: 'flex-end', borderBottom: '2px solid var(--ink)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--subtle)' }}>What I might study</span>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>
                  {state.name || 'Me'} · Grade {state.grade}
                </h2>
              </div>
              <span style={{ fontSize: 13, color: 'var(--subtle)' }}>{today}</span>
            </div>

            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--muted)' }}>
              These are options I’m still exploring, not a final choice.
              {s.priorities.length ? ` What matters most to me: ${s.priorities.join(', ')}.` : ''}
            </p>

            {inc.dir && (
              <Section title={`My ${s.lines.length} options`}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))', gap: 14 }}>
                  {s.lines.map((l) => (
                    <div key={l.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <strong style={{ fontSize: 16 }}>{l.name}</strong>
                      <span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--muted)' }}>{l.text}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
            {inc.cmp && s.diffs.length > 0 && (
              <Section title="Big differences">
                <ul style={ul}>
                  {s.diffs.map((d) => (
                    <li key={d.text}>
                      {d.text} {d.src && <span style={{ color: 'var(--subtle)' }}>({d.src})</span>}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {inc.exp && s.tried.length > 0 && (
              <Section title="What I tried">
                <ul style={ul}>
                  {s.tried.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </Section>
            )}
            {inc.q && (
              <Section title="Questions for my counselor">
                <ul style={ul}>
                  {s.qs.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </Section>
            )}
            {inc.next && (
              <Section title="What I’ll try next">
                <ul style={ul}>
                  {s.next.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </Section>
            )}

            <p style={{ margin: 0, paddingTop: 12, borderTop: '1px solid var(--line)', fontSize: 11, lineHeight: 1.5, color: 'var(--subtle)' }}>
              Facts are national averages from public data (O*NET, BLS, College Scorecard), as of [DATE]. They don’t predict what will happen for one person.
            </p>
          </article>
        </div>
      </div>
    </Screen>
  );
}
