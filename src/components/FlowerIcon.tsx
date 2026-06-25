/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface FlowerIconProps {
  note: string;
  active: boolean;
  accent: string;
}

export default function FlowerIcon({ note, active, accent }: FlowerIconProps) {
  const activeClass = active ? 'flower-blooming text-opacity-100 scale-110' : 'text-opacity-65 transition-all duration-300';

  // 13 unique hand-drawn botanical vectors
  switch (note) {
    case 'C': // Rosa (Rose)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 24 Q18 31 19 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M19 28 Q12 27 15 24 Q18 25 19 28" fill="#8a9a86" fillOpacity="0.8" />
            <path d="M20 27 Q26 26 23 23 Q21 24 20 27" fill="#8a9a86" fillOpacity="0.8" />
            <g transform="translate(20, 16)">
              <circle cx="0" cy="0" r="10" fill={accent} fillOpacity={active ? "0.3" : "0.15"} className="transition-all" />
              <path d="M-6 -6 C-10 -2, -9 5, -4 7 C0 9, 6 8, 8 4 C10 -1, 6 -7, 0 -8 C-3 -8, -5 -7, -6 -6 Z" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M-3 -3 C-5 0, -5 4, -1 5 C2 6, 4 3, 3 1 C2 -1, -1 -2, -3 -3 Z" fill="none" stroke={accent} strokeWidth="1" strokeLinecap="round" />
              <path d="M-1 -1 C-2 0, -1 2, 1 1 C2 0, 1 -1, -1 -1" fill="none" stroke={accent} strokeWidth="1" />
            </g>
          </svg>
        </div>
      );

    case 'C#': // Lavandula (Lavender)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 12 L20 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M20 30 Q14 28 17 25 Q19 26 20 30" fill="#8a9a86" fillOpacity="0.7" />
            <path d="M20 27 Q26 25 23 22 Q21 23 20 27" fill="#8a9a86" fillOpacity="0.7" />
            <g stroke={accent} strokeWidth="1.2" fill={accent} fillOpacity={active ? "0.45" : "0.22"}>
              <path d="M17 24 C15 22, 17 21, 20 23 C23 21, 25 22, 23 24 C21 26, 19 26, 17 24 Z" />
              <path d="M16 19 C14 17, 17 16, 20 18 C23 16, 26 17, 24 19 C22 21, 18 21, 16 19 Z" />
              <path d="M16 14 C15 12, 17 11, 20 13 C23 11, 25 12, 24 14 C22 16, 18 16, 16 14 Z" />
              <circle cx="20" cy="10" r="2.5" />
            </g>
          </svg>
        </div>
      );

    case 'D': // Taraxacum (Dandelion)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 25 L20 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <path d="M20 32 Q15 27 18 25 Q19 28 20 32" fill="#8a9a86" fillOpacity="0.8" />
            <g transform="translate(20, 16)" stroke={accent} strokeWidth="1" fill="none">
              <circle cx="0" cy="0" r="1.5" fill={accent} />
              {Array.from({ length: 14 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 14;
                const x1 = Math.cos(angle) * 2;
                const y1 = Math.sin(angle) * 2;
                const x2 = Math.cos(angle) * 11;
                const y2 = Math.sin(angle) * 11;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" />
                    <circle cx={x2} cy={y2} r="0.8" fill={accent} fillOpacity="0.7" />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      );

    case 'D#': // Trifolium (Clover)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 24 Q18 31 19 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <g transform="translate(20, 16)">
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = (i * Math.PI) / 2;
                return (
                  <g key={i} transform={`rotate(${angle * 180 / Math.PI})`}>
                    <path d="M0 0 C-4 -6, -8 -4, -4 0 C-8 4, -4 6, 0 0" fill={accent} fillOpacity={active ? "0.45" : "0.22"} stroke={accent} strokeWidth="1" />
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="1.2" fill="#faf7ef" stroke={accent} strokeWidth="0.8" />
            </g>
          </svg>
        </div>
      );

    case 'E': // Viola (Violet)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 24 Q21 31 19 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <g transform="translate(20, 16)">
              {/* Violet petals */}
              <path d="M0 0 C-5 -9, -9 -4, 0 0" fill={accent} fillOpacity={active ? "0.4" : "0.2"} stroke={accent} strokeWidth="1" />
              <path d="M0 0 C5 -9, 9 -4, 0 0" fill={accent} fillOpacity={active ? "0.4" : "0.2"} stroke={accent} strokeWidth="1" />
              <path d="M0 0 C-8 1, -6 7, 0 0" fill={accent} fillOpacity="0.3" stroke={accent} strokeWidth="0.9" />
              <path d="M0 0 C8 1, 6 7, 0 0" fill={accent} fillOpacity="0.3" stroke={accent} strokeWidth="0.9" />
              <path d="M0 0 C-3 8, 3 8, 0 0" fill={accent} fillOpacity="0.35" stroke={accent} strokeWidth="0.9" />
              <circle cx="0" cy="0" r="1.8" fill="#cca05a" />
            </g>
          </svg>
        </div>
      );

    case 'F': // Tulipa (Tulip)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 25 L20 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <path d="M20 30 Q27 28 24 23 Q21 24 20 30" fill="#8a9a86" fillOpacity="0.8" />
            <g transform="translate(20, 15)">
              <path d="M-8 -4 C-8 6, 8 6, 8 -4 C4 -1, -4 -1, -8 -4" fill={accent} fillOpacity={active ? "0.4" : "0.2"} stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M-6 -4 C-3 4, 3 4, 6 -4 C3 0, -3 0, -6 -4" fill={accent} fillOpacity={active ? "0.25" : "0.1"} stroke={accent} strokeWidth="0.8" />
              <path d="M0 -4 C-3 -9, 3 -9, 0 -4" fill={accent} fillOpacity="0.5" stroke={accent} strokeWidth="0.9" />
            </g>
          </svg>
        </div>
      );

    case 'F#': // Campanula (Bluebell)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 36 Q18 22 26 12" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <g transform="translate(19, 19) rotate(55)">
              <path d="M-5 -5 Q-2 5, -4 9 Q0 7, 4 9 Q2 5, 5 -5 Z" fill={accent} fillOpacity={active ? "0.45" : "0.2"} stroke={accent} strokeWidth="1" strokeLinecap="round" />
              <path d="M-4 9 Q-7 11, -5 12 Q-3 10, -3 9" fill="none" stroke={accent} strokeWidth="0.8" />
              <path d="M4 9 Q7 11, 5 12 Q3 10, 3 9" fill="none" stroke={accent} strokeWidth="0.8" />
              <line x1="0" y1="5" x2="0" y2="11" stroke="#cca05a" strokeWidth="0.8" />
            </g>
          </svg>
        </div>
      );

    case 'G': // Lilium (Lily)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 24 L20 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <g transform="translate(20, 14)">
              <path d="M-9 -6 C-3 -1, 3 -1, 9 -6 C6 4, -6 4, -9 -6" fill={accent} fillOpacity={active ? "0.35" : "0.15"} stroke={accent} strokeWidth="1" />
              <path d="M-5 -6 C-9 -13, -1 -10, -2 -4" fill={accent} fillOpacity="0.25" stroke={accent} strokeWidth="0.9" />
              <path d="M5 -6 C9 -13, 1 -10, 2 -4" fill={accent} fillOpacity="0.25" stroke={accent} strokeWidth="0.9" />
              <path d="M0 -2 C-2 -10, 2 -10, 0 -2" fill={accent} fillOpacity="0.45" stroke={accent} strokeWidth="0.9" />
              <path d="M-2 -2 Q-4 -7 -4 -8" stroke="#cca05a" strokeWidth="0.8" fill="none" />
              <path d="M2 -2 Q4 -7 4 -8" stroke="#cca05a" strokeWidth="0.8" fill="none" />
            </g>
          </svg>
        </div>
      );

    case 'G#': // Primula (Primrose)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 24 L20 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <g transform="translate(20, 15)">
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 5;
                return (
                  <g key={i} transform={`rotate(${angle * 180 / Math.PI})`}>
                    <path d="M0 0 C-4 -6, -3 -9, 0 -8 C3 -9, 4 -6, 0 0" fill={accent} fillOpacity={active ? "0.4" : "0.2"} stroke={accent} strokeWidth="1" />
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="2.2" fill="#e0b575" stroke={accent} strokeWidth="0.6" />
            </g>
          </svg>
        </div>
      );

    case 'A': // Cosmos (Cosmos)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 24 L20 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <g transform="translate(20, 15)">
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 8;
                return (
                  <g key={i} transform={`rotate(${angle * 180 / Math.PI})`}>
                    <path d="M0 0 C-2.2 -5, -1.2 -8, 0 -8 C1.2 -8, 2.2 -5, 0 0" fill={accent} fillOpacity={active ? "0.4" : "0.2"} stroke={accent} strokeWidth="1" strokeLinecap="round" />
                    <line x1="-1" y1="-7.5" x2="1" y2="-7.5" stroke={accent} strokeWidth="0.8" />
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="2.8" fill="#e0b575" />
            </g>
          </svg>
        </div>
      );

    case 'A#': // Calendula (Marigold)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 24 L20 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <g transform="translate(20, 15)">
              <circle cx="0" cy="0" r="8" fill={accent} fillOpacity="0.1" stroke={accent} strokeWidth="0.6" strokeDasharray="1.5,1.5" />
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 10;
                return (
                  <g key={i} transform={`rotate(${angle * 180 / Math.PI}) translate(0, -4.5)`}>
                    <path d="M-1.8 -1.8 C-2.5 -4.5, 2.5 -4.5, 1.8 -1.8 Z" fill={accent} fillOpacity={active ? "0.35" : "0.18"} stroke={accent} strokeWidth="0.8" />
                  </g>
                );
              })}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 6;
                return (
                  <g key={i} transform={`rotate(${angle * 180 / Math.PI + 30}) translate(0, -2)`}>
                    <path d="M-1.2 -1.2 C-1.8 -3, 1.8 -3, 1.2 -1.2 Z" fill={accent} fillOpacity={active ? "0.5" : "0.25"} stroke={accent} strokeWidth="0.8" />
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="2" fill="#e0b575" />
            </g>
          </svg>
        </div>
      );

    case 'B': // Myosotis (Forget-Me-Not)
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 24 L20 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <g transform="translate(20, 15)">
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 5;
                const x = Math.cos(angle) * 4;
                const y = Math.sin(angle) * 4;
                return (
                  <circle key={i} cx={x} cy={y} r="3.5" fill={accent} fillOpacity={active ? "0.45" : "0.2"} stroke={accent} strokeWidth="1" />
                );
              })}
              <circle cx="0" cy="0" r="1.8" fill="#fff" stroke="#e0b575" strokeWidth="1" />
            </g>
          </svg>
        </div>
      );

    case 'C_high': // Prunus (Cherry Blossom)
    default:
      return (
        <div className={`w-full h-full ${activeClass}`}>
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M20 24 Q22 31 20 36" stroke="#6b7a67" strokeWidth="1.2" fill="none" />
            <g transform="translate(20, 15)">
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 5;
                return (
                  <g key={i} transform={`rotate(${angle * 180 / Math.PI})`}>
                    <path d="M0 0 C-4 -4, -4 -8, -1 -7.5 L0 -6.2 L1 -7.5 C4 -8, 4 -4, 0 0" fill={accent} fillOpacity={active ? "0.4" : "0.2"} stroke={accent} strokeWidth="1" />
                  </g>
                );
              })}
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 5 + 36;
                const x = Math.cos(angle * Math.PI / 180) * 3;
                const y = Math.sin(angle * Math.PI / 180) * 3;
                return (
                  <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#cca05a" strokeWidth="0.8" />
                );
              })}
              <circle cx="0" cy="0" r="1" fill="#fff" />
            </g>
          </svg>
        </div>
      );
  }
}
