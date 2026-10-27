import { useState } from 'react';
import Screen from '../components/Screen.jsx';
import { Choice, CtaLink, Mark } from '../components/ui.jsx';

const ACTIVITIES = [
  { id: 'bio', label: 'Biology class' },
  { id: 'art', label: 'Art club' },
  { id: 'math', label: 'Timed math tests' },
  { id: 'code', label: 'Coding' },
];

const ANSWERS = [
  { id: 'like', label: 'Like' },
  { id: 'nope', label: 'Nope' },
  { id: 'not', label: 'Not tried' },
];

export default function Intake() {
  const [answers, setAnswers] = useState({ bio: 'like', art: 'like', math: 'nope', code: 'not' });
  const [more, setMore] = useState('Volunteering at an animal shelter');

  return (
    <Screen
      step={1}
      title={
        <>
          What have you <Mark>tried?</Mark>
        </>
      }
      lede="Never tried it isn’t the same as hating it."
      footer={
        <>
          <CtaLink to="/shortlist">Get my shortlist</CtaLink>
          <p className="footnote">Ready later today. We’ll email you.</p>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        {ACTIVITIES.map((activity) => (
          <fieldset key={activity.id} className="card" style={{ border: 0, gap: 12, padding: 16 }}>
            <legend className="fieldset__legend" style={{ float: 'left', width: '100%', padding: 0 }}>
              {activity.label}
            </legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6 }}>
              {ANSWERS.map((answer) => (
                <Choice
                  key={answer.id}
                  pressed={answers[activity.id] === answer.id}
                  variant={answer.id === 'not' ? 'accent' : undefined}
                  style={{ padding: '0 4px' }}
                  onClick={() => setAnswers({ ...answers, [activity.id]: answer.id })}
                >
                  {answer.label}
                </Choice>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="field" style={{ marginTop: 8 }}>
        <label htmlFor="intake-more" className="field__label">
          Anything else you’re into?
        </label>
        <input
          id="intake-more"
          type="text"
          className="field__input"
          value={more}
          onChange={(e) => setMore(e.target.value)}
        />
      </div>
    </Screen>
  );
}
