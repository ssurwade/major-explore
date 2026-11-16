import { Link } from 'react-router-dom';

const cx = (...xs) => xs.filter(Boolean).join(' ');

// Button and ButtonLink share the .btn look. variant: primary | secondary | ghost | inverse. size: sm | lg | xl.
export function Button({ variant = 'secondary', size, className, ...props }) {
  return <button type="button" className={cx('btn', `btn--${variant}`, size && `btn--${size}`, className)} {...props} />;
}

export function ButtonLink({ to, variant = 'secondary', size, className, ...props }) {
  return <Link to={to} className={cx('btn', `btn--${variant}`, size && `btn--${size}`, className)} {...props} />;
}

// Pressable choice. tone: ink (black when on) | solid (blue) | soft (light blue + ring).
export function Toggle({ pressed, tone = 'ink', pill = false, className, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={pressed ? 'true' : 'false'}
      className={cx('toggle', `toggle--${tone}`, pill && 'toggle--pill', className)}
      {...props}
    />
  );
}

export function Pill({ tone, small, className, ...props }) {
  return <span className={cx('pill', tone && `pill--${tone}`, small && 'pill--sm', className)} {...props} />;
}

export function Badge({ tone, className, ...props }) {
  return <span className={cx('badge', tone && `badge--${tone}`, className)} {...props} />;
}

export function Intro({ title, lede, eyebrow, children }) {
  return (
    <div className="intro">
      {eyebrow && <span style={{ fontSize: 15, color: 'var(--subtle)' }}>{eyebrow}</span>}
      <h1 className="title">{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </div>
  );
}

export function ViewTabs({ current }) {
  return (
    <div role="tablist" aria-label="View" className="tabs">
      <Link to="/shortlist" role="tab" aria-selected={current === 'cards'} className="tab">
        Cards
      </Link>
      <Link to="/compare" role="tab" aria-selected={current === 'compare'} className="tab">
        Side by side
      </Link>
    </div>
  );
}

export function DarkPanel({ title, text, children }) {
  return (
    <div className="panel-dark">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 640 }}>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
      {children}
    </div>
  );
}

export function Field({ id, label, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input id={id} className="input" {...props} />
    </div>
  );
}
