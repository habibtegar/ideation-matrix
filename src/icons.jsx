function BaseSvg({ children, size = 24, stroke = "currentColor", strokeWidth = 2, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export function Plus(props) {
  return (
    <BaseSvg {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </BaseSvg>
  );
}

export function Sparkles(props) {
  return (
    <BaseSvg {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </BaseSvg>
  );
}

export function Copy(props) {
  return (
    <BaseSvg {...props}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </BaseSvg>
  );
}

export function RotateCcw(props) {
  return (
    <BaseSvg {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </BaseSvg>
  );
}

export function CheckCircle2(props) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </BaseSvg>
  );
}

export function AlertCircle(props) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12" y1="16" y2="16.01" />
    </BaseSvg>
  );
}

export function AlertTriangle(props) {
  return (
    <BaseSvg {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12" y1="17" y2="17.01" />
    </BaseSvg>
  );
}

export function Info(props) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </BaseSvg>
  );
}

export function X(props) {
  return (
    <BaseSvg {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </BaseSvg>
  );
}

export function LayoutGrid(props) {
  return (
    <BaseSvg {...props}>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </BaseSvg>
  );
}

export function Table(props) {
  return (
    <BaseSvg {...props}>
      <path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </BaseSvg>
  );
}

export function Search(props) {
  return (
    <BaseSvg {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </BaseSvg>
  );
}

export function UserCheck(props) {
  return (
    <BaseSvg {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </BaseSvg>
  );
}

export function ShoppingBag(props) {
  return (
    <BaseSvg {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </BaseSvg>
  );
}

export function Store(props) {
  return (
    <BaseSvg {...props}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2" />
    </BaseSvg>
  );
}

export function GripVertical(props) {
  return (
    <BaseSvg {...props}>
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </BaseSvg>
  );
}

export function MoreVertical(props) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </BaseSvg>
  );
}

export function Edit2(props) {
  return (
    <BaseSvg {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </BaseSvg>
  );
}

export function Trash2(props) {
  return (
    <BaseSvg {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </BaseSvg>
  );
}

export function MoveRight(props) {
  return (
    <BaseSvg {...props}>
      <path d="M18 8L22 12L18 16" />
      <path d="M2 12H22" />
    </BaseSvg>
  );
}

export function ArrowUp(props) {
  return (
    <BaseSvg {...props}>
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </BaseSvg>
  );
}

export function ArrowRight(props) {
  return (
    <BaseSvg {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </BaseSvg>
  );
}

export function ArrowDown(props) {
  return (
    <BaseSvg {...props}>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </BaseSvg>
  );
}

export function ArrowLeft(props) {
  return (
    <BaseSvg {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </BaseSvg>
  );
}

export function ArrowUpDown(props) {
  return (
    <BaseSvg {...props}>
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </BaseSvg>
  );
}

export function Inbox(props) {
  return (
    <BaseSvg {...props}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </BaseSvg>
  );
}

export function ChevronRight(props) {
  return (
    <BaseSvg {...props}>
      <path d="m9 18 6-6-6-6" />
    </BaseSvg>
  );
}

export function Check(props) {
  return (
    <BaseSvg {...props}>
      <polyline points="20 6 9 17 4 12" />
    </BaseSvg>
  );
}

export function Download(props) {
  return (
    <BaseSvg {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </BaseSvg>
  );
}

export function Printer(props) {
  return (
    <BaseSvg {...props}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="8" x="6" y="14" />
    </BaseSvg>
  );
}

export function BookOpen(props) {
  return (
    <BaseSvg {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </BaseSvg>
  );
}

export function Eye(props) {
  return (
    <BaseSvg {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </BaseSvg>
  );
}

export function EyeOff(props) {
  return (
    <BaseSvg {...props}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </BaseSvg>
  );
}

export function ScatterChart(props) {
  return (
    <BaseSvg {...props}>
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="17" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="7" cy="16" r="1.5" fill="currentColor" />
      <circle cx="17" cy="15" r="1.5" fill="currentColor" />
      <line x1="3" x2="3" y1="3" y2="21" />
      <line x1="3" x2="21" y1="21" y2="21" />
    </BaseSvg>
  );
}

export function Target(props) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </BaseSvg>
  );
}

export function ChevronDown(props) {
  return (
    <BaseSvg {...props}>
      <path d="m6 9 6 6 6-6" />
    </BaseSvg>
  );
}

export function ChevronUp(props) {
  return (
    <BaseSvg {...props}>
      <path d="m18 15-6-6-6 6" />
    </BaseSvg>
  );
}

export function Award(props) {
  return (
    <BaseSvg {...props}>
      <circle cx="12" cy="8" r="6" />
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.204 0l-3.58 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
    </BaseSvg>
  );
}

export function Zap(props) {
  return (
    <BaseSvg {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </BaseSvg>
  );
}
