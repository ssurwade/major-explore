import { useState } from 'react';
import Screen from '../components/Screen.jsx';
import { Badge, Choice, CtaLink, Mark, TextButton } from '../components/ui.jsx';

const LANES = [
  {
    id: 'bio',
    name: 'Biology',
    fit: 'You like bio class and loved volunteering with animals.',
    not: 'Some careers here need grad or professional school.',
    q: 'Lab work or field work?',
  },
  {
    id: 'gd',
    name: 'Graphic Design',
    fit: 'Art club is something you chose for fun.',
    not: 'A lot of the work is for someone else’s goals.',
    q: 'Do you like designing for other people?',
  },
  {
    id: 'cb',
    name: 'Computational Biology',
    worth: true,
    fit: 'You haven’t tried coding yet, and it connects to biology, which you like.',
    not: 'Uses math and stats a lot, though not timed tests.',
    q: 'Would you enjoy writing code?',
  },
];

const RATINGS = [
  { id: 'in', label: 'Into it' },
  { id: 'no', label: 'Not for me' },
];

export default function Shortlist() {
  const [rating, setRating] = useState({ bio: 'in' });
  const [open, setOpen] = useState({ cb: true });

  return (
    <Screen
      step={2}
      back="/"
      title={
        <>
          Your <Mark>3 lanes</Mark>
        </>
      }
      lede="A starting point, not a verdict."
      footer={<CtaLink to="/compare">Compare them</CtaLink>}
    >
      {LANES.map((lane) => {
        const isOpen = !!open[lane.id];
        const dimmed = lane.worth && rating[lane.id] === 'no';
        return (
          <article
            key={lane.id}
            className="card"
            style={{
              boxShadow: lane.worth ? 'inset 0 0 0 2px var(--orange)' : undefined,
              opacity: dimmed ? 0.5 : 1,
            }}
          >
            <div className="row-between" style={{ gap: 12 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                {lane.name}
              </h2>
              {lane.worth && <Badge tone="orange">Worth a try</Badge>}
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.45 }}>{lane.fit}</p>
            {isOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4, fontSize: 14, lineHeight: 1.45, color: 'var(--muted)' }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--ink)' }}>Why it might not:</strong> {lane.not}
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--ink)' }}>Still to find out:</strong> {lane.q}
                </p>
              </div>
            )}
            <div className="row-between">
              <TextButton aria-expanded={isOpen} onClick={() => setOpen({ ...open, [lane.id]: !isOpen })}>
                {isOpen ? 'Less' : 'Why not?'}
              </TextButton>
              <div style={{ display: 'flex', gap: 6 }}>
                {RATINGS.map((r) => {
                  const on = rating[lane.id] === r.id;
                  return (
                    <Choice
                      key={r.id}
                      pressed={on}
                      style={{ padding: '0 14px', fontSize: 13 }}
                      onClick={() => setRating({ ...rating, [lane.id]: on ? null : r.id })}
                    >
                      {r.label}
                    </Choice>
                  );
                })}
              </div>
            </div>
          </article>
        );
      })}
    </Screen>
  );
}
