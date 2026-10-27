import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { Badge, CtaButton, CtaLink, Mark, TextButton } from '../components/ui.jsx';

const CHANGES = [
  { name: 'Computational Biology', badge: 'Now a fit', tone: 'mint', reason: 'You enjoyed the coding lesson.' },
  { name: 'Environmental Science', badge: 'New', tone: 'lime', reason: 'Replaces Biology: you want biology outdoors, not in a lab.' },
  { name: 'Graphic Design', badge: 'Same', reason: 'Nothing new yet. Your poster quest is still open.' },
];

export default function Revised() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  return (
    <Screen
      step={5}
      back="/reflect"
      title={
        <>
          Your list, <Mark>updated</Mark>
        </>
      }
      lede={
        <>
          Based on what you just told us. <Link to="/shortlist">See old list</Link>
        </>
      }
      footer={
        accepted ? (
          <CtaLink to="/summary">Make my summary</CtaLink>
        ) : (
          <>
            <CtaButton onClick={() => setAccepted(true)}>Looks right</CtaButton>
            <TextButton onClick={() => navigate('/shortlist')}>Keep my old list</TextButton>
          </>
        )
      }
    >
      <div className="list-card">
        {CHANGES.map((c) => (
          <section key={c.name} className="list-card__row">
            <div className="row-between">
              <h2 style={{ fontSize: 16 }}>{c.name}</h2>
              <Badge tone={c.tone}>{c.badge}</Badge>
            </div>
            <p style={{ color: 'var(--muted)' }}>{c.reason}</p>
          </section>
        ))}
      </div>
      {accepted && (
        <p role="status" className="status">
          Saved
        </p>
      )}
    </Screen>
  );
}
