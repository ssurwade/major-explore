import { Navigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { ButtonLink, Intro, ViewTabs } from '../components/ui.jsx';
import { currentOptions } from '../logic/engine.js';
import { useStore } from '../state/store.jsx';

const QUESTIONS = [
  { key: 'classes', q: 'What are the classes like?', src: 'Source' },
  { key: 'workday', q: 'What’s a normal workday like?', sub: 'The job can feel very different from the classes.', src: 'Source: O*NET' },
  { key: 'jobs', q: 'What jobs can it lead to?', src: 'Source' },
  { key: 'school', q: 'Will I need more school after college?', src: 'Source: BLS' },
  { key: 'money', q: 'What about money?', sub: 'These are averages, not what you’ll earn. Money is one thing to think about, not the deciding one.', src: 'Source: College Scorecard' },
];

function Cell({ item, q }) {
  const f = item.major.facts[q.key];
  const isTry = item.slot === 'try';
  const head = (
    <span className="eyebrow">
      {item.major.name}
      {isTry ? ' · worth a try' : ''}
    </span>
  );
  if (q.key === 'money' && f.gap) {
    return (
      <div className="cell cell--gap">
        {head}
        <strong>We don’t have a good number for this</strong>
        <span style={{ fontSize: 15, color: 'var(--muted)' }}>Not enough graduates reported their pay, so we won’t guess.</span>
        <a href="https://collegescorecard.ed.gov/" target="_blank" rel="noreferrer" style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>
          Look it up by college instead
        </a>
      </div>
    );
  }
  return (
    <div className={`cell${isTry ? ' cell--try' : ''}`} style={q.key === 'school' ? { gap: 8 } : undefined}>
      {head}
      {q.key === 'school' ? (
        <>
          <strong style={{ fontSize: 18, color: f.more ? 'var(--accent-strong)' : undefined }}>{f.verdict}</strong>
          <span>{f.text}</span>
        </>
      ) : q.key === 'money' ? (
        <span>
          Typical pay a few years after college: <strong>[KB RANGE]</strong>. Depends a lot on the school and job.
        </span>
      ) : (
        <span>{f}</span>
      )}
      <a href="#" onClick={(e) => e.preventDefault()}>
        {q.src} · [DATE]
      </a>
    </div>
  );
}

export default function Compare() {
  const [state, { set }] = useStore();
  if (!Object.keys(state.answers).length) return <Navigate to="/intake" replace />;
  const items = currentOptions(state);

  return (
    <Screen step={2} gap={22}>
      <Intro title="How are they different?" lede="Five quick questions. The answers come from public data, and each one shows where it’s from." />
      <ViewTabs current="compare" />

      {QUESTIONS.map((q, i) => (
        <section key={q.key} aria-labelledby={`q${i}`} className="card" style={{ padding: 22, gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2 id={`q${i}`} className="h2">
              {q.q}
            </h2>
            {q.sub && <span style={{ fontSize: 15, color: 'var(--subtle)' }}>{q.sub}</span>}
          </div>
          <div className="grid-3">
            {items.map((it) => (
              <Cell key={it.id} item={it} q={q} />
            ))}
          </div>
        </section>
      ))}

      <section style={{ background: 'var(--accent-soft)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label htmlFor="explain" className="h2">
          Quick check: what’s one big difference you noticed?
        </label>
        <span style={{ fontSize: 15, color: 'var(--muted)' }}>One sentence is plenty. No wrong answers.</span>
        <textarea id="explain" rows={2} className="textarea" style={{ borderColor: 'var(--accent-line)' }} value={state.compareNote} onChange={(e) => set({ compareNote: e.target.value })} />
      </section>

      <div className="row-between">
        <ButtonLink to="/shortlist" size="lg" style={{ fontWeight: 500 }}>
          Back to cards
        </ButtonLink>
        <ButtonLink to="/explore" variant="primary" size="lg">
          Next: try something real
        </ButtonLink>
      </div>
    </Screen>
  );
}
