import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from '../components/Icons.jsx';
import { guardrail, reviewFields } from '../logic/engine.js';
import { useStore } from '../state/store.jsx';

const mono = { fontFamily: 'var(--font-mono)' };
const btn = { minHeight: 40, padding: '0 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, border: '1px solid var(--line-strong)', background: '#fff', color: 'var(--ink-2)' };
const SEL = {
  approve: { border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', fontWeight: 600 },
  edit: { border: '1px solid var(--ink)', background: 'var(--ink)', color: '#fff', fontWeight: 600 },
  reject: { border: '1px solid var(--try)', background: 'var(--try)', color: '#fff', fontWeight: 600 },
};
const BADGE = {
  approve: ['Approved', { background: 'var(--accent-soft)', color: 'var(--accent-strong)' }],
  edit: ['Edited', { background: 'var(--neutral-soft)', color: 'var(--ink)' }],
  reject: ['Rejected · will regenerate', { background: 'var(--try-soft)', color: 'var(--try-strong)' }],
};

function FieldCard({ f }) {
  const [state, { set }] = useStore();
  const r = state.review[f.key] || {};
  const v = r.decision;
  const [draft, setDraft] = useState(r.text || f.text);
  const flag = guardrail(v === 'edit' ? draft : f.text);
  const blocked = !!flag && v !== 'reject';

  const decide = (decision) => {
    const next = { ...state.review };
    if (v === decision) delete next[f.key];
    else next[f.key] = { decision, text: decision === 'edit' ? draft : undefined };
    set({ review: next, released: false });
  };
  const saveEdit = (text) => {
    setDraft(text);
    set({ review: { ...state.review, [f.key]: { decision: 'edit', text } }, released: false });
  };

  return (
    <article style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start', border: blocked ? '2px solid var(--try-line)' : '1px solid var(--line)' }}>
      <div style={{ flex: '3 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--subtle)' }}>{f.label}</span>
          {flag && <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'var(--try-soft)', color: 'var(--try-strong)', border: '1px solid var(--try-line-soft)' }}>Guardrail: {flag}</span>}
          {v && <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, ...BADGE[v][1] }}>{BADGE[v][0]}</span>}
        </div>
        {v === 'edit' ? (
          <textarea aria-label={`Edit: ${f.label}`} rows={3} className="textarea" style={{ fontSize: 16 }} value={draft} onChange={(e) => saveEdit(e.target.value)} />
        ) : (
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55 }}>{f.text}</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['approve', 'edit', 'reject'].map((k) => (
            <button key={k} type="button" aria-pressed={v === k ? 'true' : 'false'} disabled={k === 'approve' && !!flag} onClick={() => decide(k)} style={{ ...btn, ...(v === k ? SEL[k] : {}), ...(k === 'approve' && flag ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}>
              {k[0].toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <aside style={{ flex: '2 1 260px', minWidth: 0, background: 'var(--surface-sunk)', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--subtle)' }}>Grounded in</span>
        {f.sources.map((s) => (
          <span key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13, lineHeight: 1.45 }}>
            <span style={{ ...mono, fontSize: 12, color: 'var(--accent-strong)' }}>{s.id}</span>
            <span style={{ color: 'var(--ink-2)' }}>{s.text}</span>
          </span>
        ))}
        {flag && (
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13, lineHeight: 1.45 }}>
            <span style={{ ...mono, fontSize: 12, color: 'var(--accent-strong)' }}>blocker: pattern</span>
            <span style={{ color: 'var(--ink-2)' }}>This wording implies a score or certainty. Rephrase or reject.</span>
          </span>
        )}
      </aside>
    </article>
  );
}

export default function Reviewer() {
  const [state, { set }] = useStore();
  const has = Object.keys(state.answers).length > 0;
  const fields = has ? reviewFields(state) : [];
  const decided = fields.filter((f) => state.review[f.key]?.decision);
  const blocked = fields.some((f) => {
    const r = state.review[f.key];
    return r?.decision !== 'reject' && guardrail(r?.decision === 'edit' ? r.text : f.text);
  });
  const ready = has && state.submitted && decided.length === fields.length && !blocked;
  const label = state.name ? `${state.name} · ${state.studentId}` : state.studentId;

  return (
    <div className="page" style={{ background: 'var(--bg-console)' }}>
      <header style={{ background: 'var(--ink)', color: '#fff' }}>
        <div className="row-between" style={{ maxWidth: 1400, margin: '0 auto', padding: '12px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/" aria-label="Home" style={{ display: 'flex' }}>
              <LogoMark size={24} color="var(--accent-line)" />
            </Link>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>Reviewer console</span>
            <span style={{ fontSize: 13, padding: '3px 8px', borderRadius: 6, background: 'var(--ink-2)', color: 'var(--line-strong)' }}>Concierge pilot</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, fontSize: 14, color: 'var(--line-strong)' }}>
            <span>Cohort session [COHORT] · on shift until [TIME]</span>
            <span role="img" aria-label="Signed in as reviewer" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--muted)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>
              R
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: 24, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        <nav aria-label="Draft queue" style={{ flex: '1 1 260px', minWidth: 0, background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontSize: 15 }}>My queue</strong>
            <span style={{ fontSize: 13, color: 'var(--subtle)' }}>Assigned to you only</span>
          </div>
          {has && state.submitted ? (
            <div aria-current="page" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 18px', background: 'var(--accent-soft)' }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <strong style={{ fontSize: 15 }}>{label}</strong>
                <span style={{ fontSize: 13, fontWeight: 600, color: state.released ? 'var(--subtle)' : 'var(--try)' }}>{state.released ? 'Released' : 'Waiting'}</span>
              </span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                Shortlist v{state.excluded.length ? Math.ceil(state.excluded.length / 3) + 1 : 1} · {fields.length} fields
              </span>
            </div>
          ) : (
            <p className="note" style={{ padding: '14px 18px' }}>
              Nothing to review. A draft shows up here when a student taps “Yep, that’s me.”
            </p>
          )}
        </nav>

        <section aria-labelledby="draft-h" style={{ flex: '999 1 720px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!has || !state.submitted ? (
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h1 id="draft-h" className="h2">
                No draft selected
              </h1>
              <p className="body">Go through the student flow to submit answers, then come back here to review.</p>
              <Link to="/intake" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>
                Open the student flow
              </Link>
            </div>
          ) : (
            <>
              <div className="row-between" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 22px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <h1 id="draft-h" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600 }}>
                    {state.name || state.studentId} · Shortlist draft
                  </h1>
                  <span style={{ ...mono, fontSize: 12, color: 'var(--subtle)' }}>engine rules-v1 · kb [KB_V] · selector: diversity ok{fields.some((f) => f.key.endsWith('.try')) ? ', worth-a-try slot used' : ''}</span>
                </div>
              </div>

              {fields.map((f) => (
                <FieldCard key={f.key} f={f} />
              ))}

              <div className="row-between" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 22px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <strong style={{ fontSize: 15 }}>
                    {decided.length} of {fields.length} fields reviewed
                  </strong>
                  <span style={{ fontSize: 13, color: 'var(--subtle)' }}>
                    {blocked ? 'A guardrail is blocking release. Edit or reject the flagged field.' : 'Edits replace the draft text the student sees.'}
                  </span>
                </div>
                {state.released ? (
                  <span style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <strong style={{ color: 'var(--accent-strong)' }}>Released to student</strong>
                    <Link to="/check" className="btn btn--secondary">
                      View as student
                    </Link>
                  </span>
                ) : (
                  <button type="button" className={`btn ${ready ? 'btn--primary' : ''}`} disabled={!ready} onClick={() => set({ released: true })} style={{ fontSize: 15 }}>
                    Release to student
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
