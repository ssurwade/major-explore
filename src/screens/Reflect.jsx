import { useState } from 'react';
import Screen from '../components/Screen.jsx';
import { Choice, CtaLink, Mark } from '../components/ui.jsx';

const PROMPTS = [
  { id: 'enjoy', label: 'What did you enjoy?', initial: 'The coding lesson. Way more fun than I expected.' },
  { id: 'dislike', label: 'What wasn’t for you?', initial: 'Lab work sounds repetitive.' },
  { id: 'wonder', label: 'What are you still curious about?', initial: 'Biology that happens outdoors, with animals.' },
];

export default function Reflect() {
  const [notes, setNotes] = useState(() => Object.fromEntries(PROMPTS.map((p) => [p.id, p.initial])));
  const [confidence, setConfidence] = useState(3);

  return (
    <Screen
      step={5}
      back="/explore"
      title={
        <>
          How’d it <Mark>go?</Mark>
        </>
      }
      lede="No wrong answers."
      footer={<CtaLink to="/revised">Update my shortlist</CtaLink>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 4 }}>
        {PROMPTS.map((p) => (
          <div key={p.id} className="field">
            <label htmlFor={`r-${p.id}`} className="field__label">
              {p.label}
            </label>
            <textarea
              id={`r-${p.id}`}
              rows={2}
              className="field__input"
              value={notes[p.id]}
              onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })}
            />
          </div>
        ))}
        <fieldset className="fieldset" style={{ gap: 10 }}>
          <legend className="fieldset__legend" style={{ padding: '0 0 10px' }}>
            How sure do you feel now?
          </legend>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Choice
                key={n}
                pressed={confidence === n}
                onGround
                aria-label={`${n} out of 5`}
                style={{ minHeight: 52, padding: 0, borderRadius: 'var(--radius-field)', fontSize: 17, fontWeight: 800 }}
                onClick={() => setConfidence(n)}
              >
                {n}
              </Choice>
            ))}
          </div>
          <div className="row-between" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700 }}>
            <span>No clue</span>
            <span>Locked in</span>
          </div>
        </fieldset>
      </div>
    </Screen>
  );
}
