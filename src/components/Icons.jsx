const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export function LogoMark({ size = 26, color = 'var(--accent)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M14 24V14" />
      <path d="M14 14L6 6" />
      <path d="M14 14V4" />
      <path d="M14 14l8-8" />
      <circle cx="14" cy="24" r="2" fill={color} />
    </svg>
  );
}

export function ArrowRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" strokeWidth="2" {...base}>
      <path d="M3 9h12M10 4l5 5-5 5" />
    </svg>
  );
}

export function LongArrow() {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" stroke="var(--accent)" strokeWidth="2.4" {...base}>
      <path d="M3 12h32M27 4l8 8-8 8" />
    </svg>
  );
}

export function Check({ size = 12, color = '#fff', width = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" stroke={color} strokeWidth={width} {...base}>
      <path d="M2.5 6.2l2.3 2.3 4.7-5" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" strokeWidth="2" {...base}>
      <path d="M9 2v10M5 8l4 4 4-4M3 15h12" />
    </svg>
  );
}

export function TryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" strokeWidth="1.8" {...base}>
      <circle cx="9" cy="9" r="7" strokeDasharray="2.5 2.5" />
      <path d="M9 5.5v7M5.5 9h7" />
    </svg>
  );
}

const faces = {
  like: (
    <>
      <circle cx="16" cy="16" r="12" />
      <path d="M11 19c1.5 2 3 3 5 3s3.5-1 5-3" />
      <path d="M12 13h.01M20 13h.01" />
    </>
  ),
  dislike: (
    <>
      <circle cx="16" cy="16" r="12" />
      <path d="M11 22c1.5-2 3-3 5-3s3.5 1 5 3" />
      <path d="M12 13h.01M20 13h.01" />
    </>
  ),
  not_tried: (
    <>
      <circle cx="16" cy="16" r="12" strokeDasharray="3 3.3" />
      <path d="M16 11v10M11 16h10" />
    </>
  ),
  not_sure: (
    <>
      <circle cx="16" cy="16" r="12" />
      <path d="M13 12.5a3 3 0 1 1 4 2.8c-.8.4-1 1-1 1.7" />
      <path d="M16 21h.01" />
    </>
  ),
};

export function AnswerIcon({ kind }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" strokeWidth="2" {...base}>
      {faces[kind]}
    </svg>
  );
}
