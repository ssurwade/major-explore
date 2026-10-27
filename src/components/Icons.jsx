const stroke = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function BackIcon() {
  return (
    <svg {...stroke}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg {...stroke}>
      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
    </svg>
  );
}
