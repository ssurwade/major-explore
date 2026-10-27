import { useState } from 'react';
import Screen from '../components/Screen.jsx';
import { DownloadIcon } from '../components/Icons.jsx';
import { CtaButton, Mark } from '../components/ui.jsx';

const DIRECTIONS = [
  { name: 'Computational Biology', note: 'enjoyed coding with real data.' },
  { name: 'Environmental Science', note: 'wants biology outdoors.' },
  { name: 'Graphic Design', note: 'art club; not tested yet.' },
];

const SECTIONS = [
  { id: 'open', label: 'Open questions' },
  { id: 'next', label: 'Next step' },
];

const line = { margin: 0, fontSize: 14, lineHeight: 1.45 };

export default function Summary() {
  const [include, setInclude] = useState({ open: true, next: true });

  return (
    <Screen
      step={6}
      back="/revised"
      title={
        <>
          Ready for your <Mark>counselor</Mark>
        </>
      }
      lede="This is exactly what gets shared."
      footer={
        <CtaButton onClick={() => window.print()}>
          <DownloadIcon />
          Download PDF
        </CtaButton>
      }
    >
      <div className="card" style={{ padding: 20, gap: 14, marginTop: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Maya’s directions
          </span>
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>[DATE]</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {DIRECTIONS.map((d) => (
            <p key={d.name} style={line}>
              <strong>{d.name}</strong>: {d.note}
            </p>
          ))}
        </div>
        {include.open && (
          <p style={{ ...line, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
            <strong>Open questions:</strong> Which colleges offer environmental science with field work?
          </p>
        )}
        {include.next && (
          <p style={line}>
            <strong>Next step:</strong> Finish the art club poster.
          </p>
        )}
      </div>
      <fieldset className="fieldset no-print">
        <legend className="fieldset__legend" style={{ padding: '0 0 4px' }}>
          Include
        </legend>
        {SECTIONS.map((s) => (
          <label
            key={s.id}
            style={{ minHeight: 44, display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={include[s.id]}
              onChange={() => setInclude({ ...include, [s.id]: !include[s.id] })}
              style={{ width: 22, height: 22, margin: 0, accentColor: 'var(--ink)' }}
            />
            <span>{s.label}</span>
          </label>
        ))}
      </fieldset>
    </Screen>
  );
}
