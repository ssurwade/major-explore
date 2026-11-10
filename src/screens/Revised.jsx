import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { LongArrow } from '../components/Icons.jsx';
import { Badge, Button, ButtonLink, Intro, Pill } from '../components/ui.jsx';
import { majorById } from '../data/catalog.js';
import { computeRevision, confidenceLabel } from '../logic/engine.js';
import { useStore } from '../state/store.jsx';

const KIND = {
  added: { label: 'Added', tone: 'accent' },
  moved: { label: 'Moved up', tone: 'soft' },
  kept: { label: 'Kept', tone: 'neutral' },
  removed: { label: 'Removed', tone: 'outline' },
};

export default function Revised() {
  const [state, { set }] = useStore();
  const [showHistory, setShowHistory] = useState(false);
  if (!Object.keys(state.answers).length) return <Navigate to="/intake" replace />;
  const { before, after, changes } = computeRevision(state);
  const removedIds = changes.filter((c) => c.kind === 'removed').map((c) => c.id);
  const addedIds = changes.filter((c) => c.kind === 'added').map((c) => c.id);
  const d = state.revision;

  const accept = () =>
    set({
      revision: 'accepted',
      revisedIds: after,
      history: [...state.history, { at: new Date().toISOString(), ids: before.map((b) => b.id) }],
    });
  const undo = () => set({ revision: 'pending', revisedIds: null, history: state.history.slice(0, d === 'accepted' ? -1 : undefined) });

  const cb = confidenceLabel(state.confidenceBefore);
  const cn = confidenceLabel(state.confidenceNow);

  return (
    <Screen step={3} width={900} gap={22}>
      <Intro title="Here’s what changed" lede="Based on what you told us. Nothing changes until you say yes." />

      <section aria-label="Before and after" className="card" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
        <div style={{ flex: '1 1 240px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="label">Before</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {before.map((b) =>
              removedIds.includes(b.id) ? (
                <Pill key={b.id} style={{ fontWeight: 600, color: 'var(--subtle)', textDecoration: 'line-through' }}>
                  {b.major.name}
                </Pill>
              ) : (
                <Pill key={b.id} tone={b.slot === 'try' ? 'try' : undefined} style={{ fontWeight: 600 }}>
                  {b.major.name}
                </Pill>
              )
            )}
          </div>
        </div>
        <LongArrow />
        <div style={{ flex: '1 1 240px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="label" style={{ color: 'var(--accent-strong)' }}>
            After
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {after.map((id) =>
              addedIds.includes(id) ? (
                <Pill key={id} style={{ fontWeight: 700, background: 'var(--accent)', color: '#fff' }}>
                  New: {majorById[id].name}
                </Pill>
              ) : (
                <Pill key={id} tone="accent" style={{ fontWeight: 600 }}>
                  {majorById[id].name}
                </Pill>
              )
            )}
          </div>
        </div>
      </section>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {changes.map((c) => {
          const k = KIND[c.kind];
          const removed = c.kind === 'removed';
          const head = (
            <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              <Badge tone={k.tone}>{k.label}</Badge>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 600, color: removed ? 'var(--muted)' : undefined }}>{c.name}</strong>
            </span>
          );
          const text = <span style={{ fontSize: 16, lineHeight: 1.5, color: removed ? 'var(--muted)' : 'var(--ink-2)' }}>{c.reason}</span>;
          const style = {
            background: removed ? 'var(--surface-soft)' : 'var(--surface)',
            border: c.kind === 'added' ? '2px solid var(--accent)' : removed ? '1px dashed var(--line-dash)' : '1px solid var(--line)',
            borderRadius: 18,
            padding: c.kind === 'added' ? '19px 21px' : '20px 22px',
            display: 'flex',
            gap: removed ? 12 : 6,
          };
          return removed ? (
            <li key={c.id} className="row-between" style={style}>
              <div style={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {head}
                {text}
              </div>
              {d === 'pending' && (
                <Button size="sm" style={{ fontWeight: 600 }} onClick={() => set({ broughtBack: [...state.broughtBack, c.id] })}>
                  Bring it back
                </Button>
              )}
            </li>
          ) : (
            <li key={c.id} style={{ ...style, flexDirection: 'column' }}>
              {head}
              {text}
            </li>
          );
        })}
      </ol>

      {d === 'pending' && (
        <div className="card" style={{ padding: 22, gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>Does this sound right?</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 10 }}>
            <Button variant="primary" size="xl" onClick={accept}>
              Yes, update my options
            </Button>
            <Button size="xl" style={{ fontWeight: 600, fontSize: 16 }} onClick={() => set({ revision: 'rejected' })}>
              No, keep my old list
            </Button>
          </div>
        </div>
      )}
      {d === 'accepted' && (
        <div className="row-between" style={{ padding: 22, borderRadius: 20, background: 'var(--accent-soft)' }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--accent-strong)' }}>Updated! Your old list is saved too.</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Button size="lg" onClick={undo} style={{ borderColor: 'var(--accent-line)', color: 'var(--accent-strong)', fontWeight: 600 }}>
              Undo
            </Button>
            <ButtonLink to="/summary" variant="primary" size="lg">
              Make my one-pager
            </ButtonLink>
          </div>
        </div>
      )}
      {d === 'rejected' && (
        <div className="card row-between" style={{ flexDirection: 'row', padding: 22 }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>OK, kept your old list. What you wrote is still saved.</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Button size="lg" style={{ fontWeight: 600 }} onClick={undo}>
              See the changes again
            </Button>
            <ButtonLink to="/summary" variant="primary" size="lg">
              Make my one-pager
            </ButtonLink>
          </div>
        </div>
      )}

      <div className="row-between" style={{ gap: 10, fontSize: 15, color: 'var(--subtle)' }}>
        <span>
          {cb || cn ? (
            <>
              How sure you feel: {cb && <strong style={{ color: 'var(--ink)' }}>{cb}</strong>} {cb && cn && '→ '}
              {cn && <strong style={{ color: 'var(--ink)' }}>{cn}</strong>} {cb && cn ? 'now' : ''}
            </>
          ) : (
            'Tell us how sure you feel on the last step to track it here.'
          )}
        </span>
        <button type="button" className="btn btn--ghost" aria-expanded={showHistory} onClick={() => setShowHistory(!showHistory)} style={{ minHeight: 44, padding: 0 }}>
          {showHistory ? 'Hide older lists' : 'See older lists'}
        </button>
      </div>
      {showHistory && (
        <ul className="card" style={{ margin: 0, listStyle: 'none', gap: 8 }}>
          {state.history.length === 0 && <li className="note">No older lists yet. Accepting a change saves the list before it.</li>}
          {state.history.map((h) => (
            <li key={h.at} style={{ fontSize: 15 }}>
              <strong>{new Date(h.at).toLocaleString()}</strong>: {h.ids.map((id) => majorById[id]?.name).join(', ')}
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}
