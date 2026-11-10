import { Link } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { Check } from '../components/Icons.jsx';
import { Button, ButtonLink, Pill } from '../components/ui.jsx';
import { playback } from '../logic/engine.js';
import { useStore } from '../state/store.jsx';

const display = { margin: 0, fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 };

function Row({ title, color, last, step, children }) {
  const [, { set }] = useStore();
  return (
    <div className="row-between" style={{ padding: '20px 0', borderBottom: last ? 0 : '1px solid var(--line-soft)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color }}>{title}</span>
        {children}
      </div>
      <Link to="/intake" onClick={() => set({ intakeIdx: step })} className="btn" style={{ minHeight: 44, padding: '0 12px', fontWeight: 600, color: 'var(--accent)' }}>
        Change
      </Link>
    </div>
  );
}

const Empty = ({ children }) => <span style={{ fontSize: 16, color: 'var(--subtle)' }}>{children}</span>;

export default function Playback() {
  const [state, { set }] = useStore();
  const p = playback(state);
  const lastStep = 8;

  if (state.submitted) {
    return (
      <Screen step={1} width={760}>
        <div className="card" style={{ borderRadius: 24, padding: '44px 36px', alignItems: 'center', textAlign: 'center', gap: 22 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={36} color="var(--accent)" width={1.6} />
          </div>
          <h1 style={display}>{state.released ? 'Your options are ready!' : 'You’re all set!'}</h1>
          {state.released ? (
            <p className="lede" style={{ fontSize: 19, maxWidth: 520 }}>A reviewer checked every reason on your shortlist. Take a look.</p>
          ) : (
            <p className="lede" style={{ fontSize: 19, maxWidth: 520 }}>
              A real person checks your options before you see them. We’ll email you <strong>today</strong>, usually within [2 HOURS].
            </p>
          )}
          <p className="note" style={{ fontSize: 16 }}>{state.released ? 'Everything’s saved.' : 'You can close this tab. Everything’s saved.'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {state.released ? (
              <ButtonLink to="/shortlist" variant="primary" size="lg">
                See my options
              </ButtonLink>
            ) : (
null
            )}
            <Button size="lg" onClick={() => set({ submitted: false })}>
              Look at my answers again
            </Button>
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen step={1} width={760}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 style={display}>Here’s you, in a nutshell. Did we get it right?</h1>
        <p className="lede" style={{ fontSize: 17 }}>Your options are picked from this, so fix anything that’s off.</p>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 20, padding: '8px 28px' }}>
        <Row title="You’re into" color="var(--accent-strong)" step={1}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {p.into.length ? p.into.map((t) => <Pill key={t} tone="accent">{t}</Pill>) : <Empty>Nothing yet</Empty>}
          </div>
        </Row>
        <Row title="Not your thing" color="var(--muted)" step={1}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {p.not.length ? p.not.map((t) => <Pill key={t}>{t}</Pill>) : <Empty>Nothing ruled out</Empty>}
          </div>
        </Row>
        <Row title="Haven’t tried yet (still open)" color="var(--try-strong)" step={1}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {p.open.length ? (
              p.open.map((o) => (
                <Pill key={o.label} tone="try">
                  {o.label}
                  {o.sure ? ' (not sure)' : ''}
                </Pill>
              ))
            ) : (
              <Empty>None</Empty>
            )}
          </div>
        </Row>
        <Row title="What matters most to you" color="var(--muted)" step={lastStep}>
          {p.priorities.length ? (
            <ol style={{ margin: 0, paddingLeft: 22, fontSize: 17, lineHeight: 1.7 }}>
              {p.priorities.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          ) : (
            <Empty>Not picked yet</Empty>
          )}
        </Row>
        <Row title="Good to know" color="var(--muted)" step={lastStep} last>
          {p.notes ? <span style={{ fontSize: 17 }}>{p.notes}</span> : <Empty>Nothing added</Empty>}
        </Row>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="primary" size="xl" onClick={() => set({ submitted: true, released: false, review: {} })} style={{ fontSize: 18 }}>
          Yep, that’s me
        </Button>
        <span className="note" style={{ fontSize: 15, textAlign: 'center' }}>
          You can still change things later.
        </span>
      </div>
    </Screen>
  );
}
