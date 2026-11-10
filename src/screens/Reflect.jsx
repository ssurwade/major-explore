import { Link, Navigate, useNavigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { ButtonLink, Field, Intro, Toggle } from '../components/ui.jsx';
import { CONFIDENCE } from '../data/catalog.js';
import { chosenActivity, currentOptions } from '../logic/engine.js';
import { useStore } from '../state/store.jsx';

const FEELS = [
  ['love', 'Loved it'],
  ['ok', 'It was OK'],
  ['no', 'Not for me'],
];

export default function Reflect() {
  const [state, { set }] = useStore();
  const navigate = useNavigate();
  if (!Object.keys(state.answers).length) return <Navigate to="/intake" replace />;
  const items = currentOptions(state);
  const r = (id) => state.reflections[id] || {};
  const upd = (id, patch) => set({ reflections: { ...state.reflections, [id]: { ...r(id), ...patch } } });
  const anyTried = items.some((it) => state.tried[it.id]);

  return (
    <Screen step={3} width={820} gap={22}>
      <Intro eyebrow={`Welcome back${state.name ? ', ' + state.name : ''}`} title="How did it go?" lede="Tap how it felt. Add a few words if you want. That’s it." />

      {!anyTried && (
        <p className="callout-try">
          You haven’t marked anything as tried yet. <Link to="/explore">Go back and pick one</Link>, or tell us what you’ve noticed anyway.
        </p>
      )}

      {items.map((it) => {
        const isTry = it.slot === 'try';
        const tried = state.tried[it.id];
        const act = chosenActivity(state, it.major);
        const cls = `card${isTry ? ' card--try' : ''}`;
        const kicker = (
          <span style={{ fontSize: 14, fontWeight: 700, color: isTry ? 'var(--try-strong)' : 'var(--subtle)' }}>
            {it.major.name}
            {isTry ? ' · worth a try' : ''}
          </span>
        );
        if (!tried) {
          return (
            <section key={it.id} aria-labelledby={`r-${it.id}`} className={cls} style={{ gap: 12 }}>
              <div className="row-between" style={{ gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {kicker}
                  <h2 id={`r-${it.id}`} className="h2">
                    Not tried yet, and that’s fine
                  </h2>
                </div>
                <Link to="/explore" className="btn" style={{ minHeight: 44, fontWeight: 600, color: 'var(--accent)', padding: 0 }}>
                  Try it later
                </Link>
              </div>
              <Field id={`n-${it.id}`} label="Anything you’ve noticed about it anyway? (optional)" value={r(it.id).note || ''} onChange={(e) => upd(it.id, { note: e.target.value })} />
            </section>
          );
        }
        return (
          <section key={it.id} aria-labelledby={`r-${it.id}`} className={cls}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {kicker}
              <h2 id={`r-${it.id}`} className="h2">
                {act.title}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {FEELS.map(([k, label]) => (
                <Toggle key={k} tone="soft" pressed={r(it.id).feel === k} onClick={() => upd(it.id, { feel: k })} style={{ minHeight: 52, fontSize: 16 }}>
                  {label}
                </Toggle>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 12 }}>
              <Field id={`b-${it.id}`} label="Best part" value={r(it.id).best || ''} onChange={(e) => upd(it.id, { best: e.target.value })} />
              <Field id={`w-${it.id}`} label="Worst part" value={r(it.id).worst || ''} onChange={(e) => upd(it.id, { worst: e.target.value })} />
              <Field id={`s-${it.id}`} label="Still wondering" value={r(it.id).wondering || ''} onChange={(e) => upd(it.id, { wondering: e.target.value })} />
            </div>
          </section>
        );
      })}

      <fieldset className="card fieldset" style={{ border: '1px solid var(--line)', padding: '22px 24px', gap: 12 }}>
        <legend style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>How sure do you feel about your options now?</legend>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(120px, 100%), 1fr))', gap: 8, clear: 'both' }}>
          {CONFIDENCE.map((c) => (
            <Toggle key={c.id} tone="soft" pressed={state.confidenceNow === c.id} onClick={() => set({ confidenceNow: c.id })} style={{ minHeight: 52 }}>
              {c.label}
            </Toggle>
          ))}
        </div>
      </fieldset>

      <div className="row-between">
        <ButtonLink to="/explore" size="lg" style={{ fontWeight: 500 }}>
          Back
        </ButtonLink>
        <button
          type="button"
          className="btn btn--primary btn--xl"
          onClick={() => {
            set({ revision: 'pending', broughtBack: [] });
            navigate('/revised');
          }}
        >
          Update my options
        </button>
      </div>
    </Screen>
  );
}
