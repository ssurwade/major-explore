import { useNavigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { AnswerIcon } from '../components/Icons.jsx';
import { Button, Toggle } from '../components/ui.jsx';
import { AREAS, ANSWERS, CONFIDENCE, PRIORITIES } from '../data/catalog.js';
import { useStore } from '../state/store.jsx';

const display = { margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05 };
const card = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 };

function tileStyle(kind, on) {
  const t = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 120, padding: 16, borderRadius: 16, fontSize: 17, fontWeight: 600 };
  if (!on) return { ...t, border: '2px solid var(--line)', background: 'var(--surface)', color: 'var(--ink-2)' };
  if (kind === 'not_tried') return { ...t, border: '2px dashed var(--try)', background: 'var(--try-soft)', color: 'var(--try-strong)' };
  return { ...t, border: '2px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--accent-strong)' };
}

function chipStyle(v, current) {
  const c = { minHeight: 40, padding: '0 14px', borderRadius: 999, fontSize: 14, fontWeight: 500 };
  let s = { ...c, border: '1px dashed var(--line-strong)', background: 'transparent', color: 'var(--subtle)' };
  if (v === 'not_tried') s = { ...c, border: '1px dashed var(--try)', background: 'var(--try-soft)', color: 'var(--try-strong)' };
  else if (v) s = { ...c, border: '1px solid var(--line-strong)', background: 'var(--surface)', color: 'var(--ink)' };
  if (current) s = { ...s, outline: '2px solid var(--accent)', outlineOffset: 1 };
  return s;
}

// Steps: 0 = name, 1..N = one area each, N+1 = free text, priorities and limits.
export default function Intake() {
  const [state, { set, merge }] = useStore();
  const navigate = useNavigate();
  const n = AREAS.length;
  const total = n + 2;
  const idx = Math.min(state.intakeIdx, n + 1);
  const go = (i) => set({ intakeIdx: Math.max(0, Math.min(n + 1, i)) });
  const area = idx >= 1 && idx <= n ? AREAS[idx - 1] : null;
  const canFinish = Object.keys(state.answers).length > 0;

  const togglePriority = (id) => {
    const has = state.priorities.includes(id);
    if (has) set({ priorities: state.priorities.filter((p) => p !== id) });
    else if (state.priorities.length < 3) set({ priorities: [...state.priorities, id] });
  };

  return (
    <Screen step={1} width={720}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="row-between" style={{ fontSize: 15, color: 'var(--subtle)' }}>
          <span>{idx <= n ? `Question ${idx + 1} of ${total}` : 'Last question'}</span>
          <span>Saved automatically</span>
        </div>
        <div aria-hidden="true" style={{ height: 8, background: 'var(--line)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: 8, background: 'var(--accent)', borderRadius: 999, width: `${Math.round(((idx + 1) / total) * 100)}%`, transition: 'width .25s ease' }} />
        </div>
      </div>

      {idx === 0 && (
        <form
          style={card}
          onSubmit={(e) => {
            e.preventDefault();
            if (state.name.trim()) go(1);
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--subtle)' }}>First things first</span>
            <h1 style={{ ...display, fontSize: 44 }}>What should we call you?</h1>
            <span style={{ fontSize: 17, color: 'var(--muted)' }}>Just a first name or nickname. It goes on your one-pager.</span>
          </div>
          <div className="field">
            <label htmlFor="name" className="field__label">
              First name
            </label>
            <input id="name" className="input" autoComplete="given-name" value={state.name} onChange={(e) => set({ name: e.target.value })} style={{ fontSize: 18, minHeight: 52 }} />
          </div>
          <div className="field">
            <label htmlFor="grade" className="field__label">
              Grade
            </label>
            <select id="grade" className="input" value={state.grade} onChange={(e) => set({ grade: e.target.value })}>
              {['9', '10', '11', '12'].map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn--primary btn--lg" disabled={!state.name.trim()}>
              Next
            </button>
          </div>
        </form>
      )}

      {area && (
        <section aria-live="polite" style={card}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--subtle)' }}>How do you feel about…</span>
            <h1 style={{ ...display, fontSize: 44 }}>{area.label}</h1>
            <span style={{ fontSize: 17, color: 'var(--muted)' }}>{area.hint}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: 12 }}>
            {Object.entries(ANSWERS).map(([k, label]) => {
              const on = state.answers[area.id] === k;
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on ? 'true' : 'false'}
                  style={tileStyle(k, on)}
                  onClick={() => {
                    merge('answers', { [area.id]: k });
                    go(idx + 1);
                  }}
                >
                  <AnswerIcon kind={k} />
                  <span>{k === 'not_tried' ? 'Haven’t tried it' : label}</span>
                </button>
              );
            })}
          </div>
          <p className="callout-try">
            <strong>Never done it?</strong> Pick “Haven’t tried it.” That doesn’t count as a no. It keeps the subject open for you.
          </p>
          <div className="row-between">
            <Button onClick={() => go(idx - 1)}>Back</Button>
            <Button variant="ghost" onClick={() => go(idx + 1)}>
              Skip
            </Button>
          </div>
        </section>
      )}

      {idx === n + 1 && (
        <section style={{ ...card, gap: 22 }}>
          <h1 style={{ ...display, fontSize: 34, letterSpacing: '-0.015em' }}>Nice. One last thing.</h1>
          <div className="field" style={{ gap: 8 }}>
            <label htmlFor="free" style={{ fontSize: 18, fontWeight: 600 }}>
              Tell us about a class, club or job you liked. Write it however you’d say it.
            </label>
            <textarea id="free" rows={4} className="textarea" value={state.freeText} onChange={(e) => set({ freeText: e.target.value })} placeholder="For example: I volunteered at an animal shelter and liked making the adoption posters." />
            <span style={{ fontSize: 15, color: 'var(--subtle)' }}>Please don’t include names or phone numbers.</span>
          </div>

          <fieldset className="fieldset" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <legend style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>What matters most to you? Pick up to 3, in order.</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, clear: 'both' }}>
              {PRIORITIES.map((p) => {
                const i = state.priorities.indexOf(p.id);
                return (
                  <Toggle key={p.id} pill tone="solid" pressed={i >= 0} onClick={() => togglePriority(p.id)} disabled={i < 0 && state.priorities.length >= 3}>
                    {i >= 0 ? `${i + 1}. ` : ''}
                    {p.label}
                  </Toggle>
                );
              })}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="notes" className="field__label" style={{ fontSize: 18 }}>
              Anything else we should know? (optional)
            </label>
            <input id="notes" className="input" value={state.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="For example: want to stay in-state, cost matters for my family" />
          </div>

          <fieldset className="fieldset" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <legend style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Right now, how sure are you about what to study?</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(120px, 100%), 1fr))', gap: 8, clear: 'both' }}>
              {CONFIDENCE.map((c) => (
                <Toggle key={c.id} tone="soft" pressed={state.confidenceBefore === c.id} onClick={() => set({ confidenceBefore: c.id })}>
                  {c.label}
                </Toggle>
              ))}
            </div>
          </fieldset>

          <div className="row-between">
            <Button onClick={() => go(idx - 1)}>Back</Button>
            <Button variant="primary" size="lg" disabled={!canFinish} onClick={() => navigate('/check')}>
              Check my answers
            </Button>
          </div>
          {!canFinish && <p className="note">Answer at least one question above first.</p>}
        </section>
      )}

      {idx > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--muted)' }}>Your answers (tap one to change it)</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AREAS.map((a, i) => {
              const v = state.answers[a.id];
              return (
                <button key={a.id} type="button" onClick={() => go(i + 1)} style={chipStyle(v, i + 1 === idx)}>
                  {a.label}
                  {v ? `: ${ANSWERS[v]}` : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Screen>
  );
}
