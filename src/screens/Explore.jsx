import { useState } from 'react';
import Screen from '../components/Screen.jsx';
import { Choice, CtaLink, Mark, TextButton } from '../components/ui.jsx';

const QUESTS = [
  { id: 'bio', direction: 'Biology · Conversation', title: 'Ask your bio teacher what a normal workday looks like' },
  { id: 'gd', direction: 'Graphic Design · School club', title: 'Make one poster for an art club event' },
  { id: 'cb', direction: 'Computational Biology · Free lesson', title: 'Take a free intro coding lesson' },
];

export default function Explore() {
  const [done, setDone] = useState({ cb: true });
  const doneCount = QUESTS.filter((q) => done[q.id]).length;

  return (
    <Screen
      step={4}
      back="/compare"
      title={
        <>
          One <Mark>side quest</Mark> each
        </>
      }
      lede={`Free and doable solo. A taste, not proof. ${doneCount} of ${QUESTS.length} done.`}
      footer={<CtaLink to="/reflect">Tell us how it went</CtaLink>}
    >
      {QUESTS.map((quest) => {
        const on = !!done[quest.id];
        return (
          <article key={quest.id} className="card" style={{ gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{quest.direction}</span>
            <h2 style={{ margin: 0, fontSize: 17, lineHeight: 1.3, fontWeight: 800 }}>{quest.title}</h2>
            <div className="row-between" style={{ paddingTop: 4 }}>
              <TextButton>Swap</TextButton>
              <Choice
                pressed={on}
                variant="done"
                className="choice--solid"
                style={{ padding: '0 18px', fontWeight: 800 }}
                onClick={() => setDone({ ...done, [quest.id]: !on })}
              >
                {on ? 'Done' : 'Mark done'}
              </Choice>
            </div>
          </article>
        );
      })}
    </Screen>
  );
}
