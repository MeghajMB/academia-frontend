const InstructorSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Head */}
    <circle cx="12" cy="4" r="2" />

    {/* Body */}
    <path d="M9 8h6l.5 4h-7z" />

    {/* Arms */}
    <path d="M9 12v2m6-2v2" />

    {/* Legs */}
    <path d="M10 16v4M14 16v4" />

    {/* Board */}
    <rect x="2" y="4" width="6" height="4" rx="1" />
    <path d="M2 8v2h6V8" />

    {/* Pointer */}
    <path d="M8 7l2 1" />
  </svg>
);

export default InstructorSvg;
