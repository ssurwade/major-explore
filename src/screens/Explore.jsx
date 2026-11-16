import { Navigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { Badge, Button, ButtonLink, DarkPanel } from '../components/ui.jsx';
import { chosenActivity, currentOptions } from '../logic/engine.js';
import { useStore } from '../state/store.jsx';

function ActivityCard({ item }) {
  const [state, { merge }] = useStore();
  const isTry = item.slot === 'try';
  const act = chosenActivity(state, item.major);
  const done = !!state.tried[item.id];
  const reminded = !!state.reminders[item.id];
  const tag = isTry ? { background: 'var(--try-chip)', color: '#5c2a00' } : undefined;

  return (
    <article className={`card${isTry ? ' card--try' : ''}`}>
      <div className="row-between" style={{ gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: isTry ? 'var(--try-strong)' : 'var(--subtle)' }}>
          {item.major.name}
          {isTry ? ' · worth a try' : ''}
        </span>
        <Badge tone={done ? 'ink' : undefined}>{done ? 'Tried it' : 'To do'}</Badge>
      </div>
      <h2 className="h2" style={{ fontSize: 24, lineHeight: 1.2 }}>
        {act.title}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {act.tags.map((t) => (
          <span key={t} className="pill pill--sm" style={tag}>
            {t}
          </span>
        ))}
      </div>
      {act.questions ? (
        <ol style={{ margin: 0, padding: '14px 14px 14px 34px', borderRadius: 14, background: 'var(--surface-sunk)', fontSize: 16, lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {act.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      ) : (
        <p className="body">
          <strong>Pay attention to:</strong> {act.watch}
        </p>
      )}
      <p className="note" style={isTry ? { color: 'var(--try-text)' } : undefined}>
        {act.caveat}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
        <button
          type="button"
          aria-pressed={done ? 'true' : 'false'}
          className="btn btn--lg"
          style={{ border: `1px solid ${done ? 'var(--ink)' : 'var(--accent)'}`, background: done ? 'var(--ink)' : 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 16 }}
          onClick={() => merge('tried', { [item.id]: !done })}
        >
          {done ? 'Done! (tap to undo)' : 'I did it'}
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
          <Button
            size="sm"
            aria-pressed={reminded ? 'true' : 'false'}
            onClick={() => merge('reminders', { [item.id]: !reminded })}
            style={reminded ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)', color: 'var(--accent-strong)', fontWeight: 600 } : undefined}
          >
            {reminded ? 'Reminder: Saturday' : 'Remind me'}
          </Button>
          <Button size="sm" disabled={done} onClick={() => merge('activityIdx', { [item.id]: (state.activityIdx[item.id] || 0) + 1 })}>
            Another idea
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function Explore() {
  const [state] = useStore();
  if (!Object.keys(state.answers).length) return <Navigate to="/intake" replace />;
  const items = currentOptions(state);
  const n = items.filter((it) => state.tried[it.id]).length;

  return (
    <Screen step={3}>
      <div className="row-between" style={{ alignItems: 'flex-end', gap: 20 }}>
        <div className="intro" style={{ maxWidth: 680 }}>
          <h1 className="title">Try one small thing for each</h1>
          <p className="lede">All free. No need to know anyone in the field. It’s just a taste, so see how it feels.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>
            {n} of {items.length} tried
          </span>
          <div aria-hidden="true" style={{ display: 'flex', gap: 6 }}>
            {items.map((it, i) => (
              <span key={it.id} style={{ display: 'block', width: 44, height: 8, borderRadius: 999, background: i < n ? 'var(--accent)' : 'var(--line)' }} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid-cards">
        {items.map((it) => (
          <ActivityCard key={it.id} item={it} />
        ))}
      </div>

      <DarkPanel title="Tried at least one? Tell us how it went." text="Takes about 2 minutes. Your options update based on what you say.">
        <ButtonLink to="/reflect" variant="inverse" size="lg">
          How did it go?
        </ButtonLink>
      </DarkPanel>
    </Screen>
  );
}
