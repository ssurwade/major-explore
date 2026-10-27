import { useState } from 'react';
import Screen from '../components/Screen.jsx';
import { CtaLink, Mark } from '../components/ui.jsx';

const MAJORS = ['Biology', 'Graphic Design', 'Computational Biology'];

const DIMENSIONS = [
  {
    id: 'study',
    label: 'Classes',
    source: { name: 'NCES CIP', href: 'https://nces.ed.gov/ipeds/cipcode/' },
    text: ['Cells, genetics, ecology. Lots of labs.', 'Typography, layout, color. Studio critiques.', 'Biology plus coding and stats.'],
  },
  {
    id: 'daily',
    label: 'Day to day',
    source: { name: 'O*NET', href: 'https://www.onetonline.org/' },
    text: ['Experiments and data, in a lab or the field.', 'Making visuals, then revising after feedback.', 'Writing code to analyze biological data.'],
  },
  {
    id: 'req',
    label: 'More school?',
    source: { name: 'BLS Occupational Outlook Handbook', href: 'https://www.bls.gov/ooh/' },
    text: ['Many research and health careers need grad school.', 'Usually a bachelor’s plus a portfolio.', 'Research roles often need grad school.'],
  },
  {
    id: 'money',
    label: 'Money',
    source: { name: 'College Scorecard', href: 'https://collegescorecard.ed.gov/' },
    text: ['[Early-career earnings range]', 'No reliable data yet: too few grads reported. Ask your counselor.', '[Early-career earnings range]'],
  },
];

export default function Compare() {
  const [dimId, setDimId] = useState('req');
  const dim = DIMENSIONS.find((d) => d.id === dimId);

  return (
    <Screen
      step={3}
      back="/shortlist"
      bleed
      title={
        <>
          How they <Mark>differ</Mark>
        </>
      }
      lede="Every fact shows where it came from."
      footer={<CtaLink to="/explore">Try each one</CtaLink>}
    >
      <div
        role="tablist"
        aria-label="Compare by"
        style={{ display: 'flex', gap: 6, overflowX: 'auto', margin: 0, padding: '0 var(--gutter)' }}
      >
        {DIMENSIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={d.id === dimId}
            aria-controls="compare-panel"
            className="choice choice--on-ground"
            style={{ flex: 'none' }}
            onClick={() => setDimId(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div id="compare-panel" role="tabpanel" className="list-card">
        {MAJORS.map((name, i) => (
          <section key={name} className="list-card__row">
            <h2>{name}</h2>
            <p>{dim.text[i]}</p>
          </section>
        ))}
      </div>
      <p style={{ marginTop: 0, marginBottom: 0, fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
        Source:{' '}
        <a href={dim.source.href} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>
          {dim.source.name}
        </a>{' '}
        · as of [DATE]
      </p>
    </Screen>
  );
}
