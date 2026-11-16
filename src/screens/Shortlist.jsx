import { Navigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { TryIcon } from '../components/Icons.jsx';
import { ActionBar, Badge, Button, ButtonLink, Intro, Toggle, ViewTabs } from '../components/ui.jsx';
import { computeShortlist } from '../logic/engine.js';
import { useStore } from '../state/store.jsx';

const TAKES = [
  ['interested', 'Into it'],
  ['unsure', 'Maybe'],
  ['no', 'Not for me'],
];
const CRED = [
  ['yes', 'Yes'],
  ['mostly', 'Kind of'],
  ['no', 'Not really'],
];
const h2 = { margin: 0, fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700 };

function Take({ item }) {
  const [state, { merge }] = useStore();
  const cur = state.takes[item.id];
  return (
    <fieldset className="fieldset" style={{ marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${item.slot === 'try' ? '#f1dcc8' : 'var(--line-soft)'}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <legend style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Your take?</legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, clear: 'both' }}>
        {TAKES.map(([k, label]) => (
          <Toggle key={k} pressed={cur === k} onClick={() => merge('takes', { [item.id]: cur === k ? null : k })}>
            {label}
          </Toggle>
        ))}
      </div>
    </fieldset>
  );
}

function OptionCard({ item, n }) {
  const [, { merge }] = useStore();
  if (item.slot === 'try') {
    return (
      <article className="card card--try" style={{ gap: 18 }}>
        <div className="row-between" style={{ gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'var(--try-strong)' }}>
            <TryIcon /> Option {n} · Worth a try
          </span>
          <button type="button" className="btn btn--sm" onClick={() => merge('dismissed', { [item.id]: true })} aria-label={`Remove ${item.major.name}`} style={{ border: '1px solid var(--try-line-soft)', background: '#fff', color: 'var(--try-strong)', fontSize: 14, fontWeight: 600, padding: '0 12px' }}>
            Remove
          </button>
        </div>
        <h2 style={h2}>{item.major.name}</h2>
        <p className="body" style={{ padding: 14, borderRadius: 14, background: 'var(--try-soft)', color: 'var(--try-deep)' }}>{item.tryReason}</p>
        <p className="body">
          <strong style={{ color: 'var(--try)' }}>Heads-up:</strong> {item.headsUp}
        </p>
        <p className="body">
          <strong style={{ color: 'var(--muted)' }}>Find out:</strong> {item.findOut}
        </p>
        <Take item={item} />
      </article>
    );
  }
  return (
    <article className="card" style={{ gap: 18 }}>
      <div className="row-between" style={{ gap: 8 }}>
        <span className="label">Option {n}</span>
        <Badge tone="guess">First guess</Badge>
      </div>
      <h2 style={h2}>{item.major.name}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-strong)' }}>Because you said…</span>
        {item.fitEdited ? (
          <p className="quote">{item.fitText}</p>
        ) : (
          item.reasons.map((r) => (
            <p key={r} className="quote">
              “{r}”
            </p>
          ))
        )}
      </div>
      <p className="body">
        <strong style={{ color: 'var(--try)' }}>Heads-up:</strong> {item.headsUp}
      </p>
      <p className="body">
        <strong style={{ color: 'var(--muted)' }}>Find out:</strong> {item.findOut}
      </p>
      <Take item={item} />
    </article>
  );
}

export default function Shortlist() {
  const [state, { set, merge }] = useStore();
  if (!Object.keys(state.answers).length) return <Navigate to="/intake" replace />;
  const items = computeShortlist(state);

  const reroll = () => {
    set({ excluded: [...state.excluded, ...items.map((i) => i.id)], rerollsLeft: state.rerollsLeft - 1, takes: {}, dismissed: {}, review: {} });
  };

  return (
    <Screen step={2}>
      <Intro
        title={`${state.name || 'Hey'}, here are ${items.length} options to check out`}
        lede="These are first guesses, not final answers. You’ll test them next."
      />
      <ViewTabs current="cards" />

      {items.length === 0 ? (
        <div className="card">
          <strong style={{ fontSize: 18 }}>We need a bit more to go on</strong>
          <span className="body">Mark at least one subject as “Like it” or “Haven’t tried it.”</span>
          <ButtonLink to="/intake" variant="primary">
            Back to your answers
          </ButtonLink>
        </div>
      ) : (
        <div className="grid-cards">
          {items.map((it, i) =>
            state.dismissed[it.id] ? (
              <div key={it.id} className="card" style={{ border: '2px dashed var(--line-strong)', justifyContent: 'center', alignItems: 'flex-start', gap: 12 }}>
                <strong style={{ fontSize: 18 }}>{it.major.name} removed</strong>
                <span className="body" style={{ color: 'var(--muted)' }}>
                  No problem. Your other {items.length - 1 === 1 ? 'option stays' : `${items.length - 1} options stay`} the same.
                </span>
                <Button size="sm" style={{ fontWeight: 600 }} onClick={() => merge('dismissed', { [it.id]: false })}>
                  Undo
                </Button>
              </div>
            ) : (
              <OptionCard key={it.id} item={it} n={i + 1} />
            )
          )}
        </div>
      )}

      <div className="row-between" style={{ gap: 16 }}>
        <fieldset className="fieldset" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <legend style={{ fontSize: 16, fontWeight: 600, marginRight: 6 }}>Do these make sense for you?</legend>
          <div style={{ display: 'flex', gap: 6 }}>
            {CRED.map(([k, label]) => (
              <Toggle key={k} pill tone="solid" pressed={state.credibility === k} onClick={() => set({ credibility: k })}>
                {label}
              </Toggle>
            ))}
          </div>
        </fieldset>
        <Button variant="ghost" disabled={state.rerollsLeft <= 0} onClick={reroll} style={{ fontSize: 15, padding: '0 4px', background: 'transparent' }}>
          None of these? Show me different ones ({state.rerollsLeft} left)
        </Button>
      </div>
      <ActionBar title="Next: see how they compare" text="Classes, jobs, extra school and money, side by side." next={{ to: '/compare', label: 'Compare them' }} />
    </Screen>
  );
}
