import { Link } from 'react-router-dom';

export function Mark({ children }) {
  return <span className="mark">{children}</span>;
}

export function CtaLink({ to, children }) {
  return (
    <Link to={to} className="cta">
      {children}
    </Link>
  );
}

export function CtaButton({ children, ...props }) {
  return (
    <button type="button" className="cta" {...props}>
      {children}
    </button>
  );
}

export function TextButton({ children, ...props }) {
  return (
    <button type="button" className="text-btn" {...props}>
      {children}
    </button>
  );
}

// Pressable pill. `onGround` gives it a white rest state for use directly on the lavender ground;
// `variant` picks the pressed color ("accent" = orange, "done" = mint, default = ink).
export function Choice({ pressed, onGround = false, variant, className = '', style, children, ...props }) {
  const classes = ['choice', onGround && 'choice--on-ground', variant && `choice--${variant}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" aria-pressed={pressed} className={classes} style={style} {...props}>
      {children}
    </button>
  );
}

export function Badge({ tone, children }) {
  return <span className={`badge${tone ? ` badge--${tone}` : ''}`}>{children}</span>;
}
