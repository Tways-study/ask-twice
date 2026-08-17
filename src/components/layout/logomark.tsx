// The favicon's mark (src/app/icon.svg), as a reusable component for pairing
// with the wordmark in the nav and footer. Same paths, currentColor for the
// ink bars so it follows text color on both light and dark surfaces.
export function Logomark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-hidden="true" className={className}>
      <g transform="rotate(-2 16 16)">
        <polygon points="5,7.78 27,7.5 27,14.29 5,14.5" fill="var(--highlight)" />
        <rect x="6.5" y="9.6" width="19" height="3" rx="0.4" fill="currentColor" />
        <polygon points="8,17.78 26,17.5 26,24.29 8,24.5" fill="var(--highlight)" />
        <rect x="9.5" y="19.6" width="14.5" height="3" rx="0.4" fill="currentColor" />
      </g>
    </svg>
  );
}
