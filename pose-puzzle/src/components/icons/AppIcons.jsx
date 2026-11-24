import React from 'react';

// SNAP BOOTH - Pustaka Ikon Custom SVG Flat 2D Editorial & Geometris
// Strictly "Anti-AI Slop": Tanpa gradient pelangi, tanpa drop-shadow berlebihan, tanpa emoji.

// 1. Logo Brand SNAP BOOTH (Ikon Lensa / Shutter dengan Bintang 4-Sudut di Pojok Kanan Atas)
export function SnapBoothLogo({ className = 'h-8' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Lensa / Shutter Geometris dengan Star Sparkle 4-Sudut */}
      <svg
        className="w-8 h-8 shrink-0"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lingkaran Luar Shutter */}
        <circle cx="18" cy="18" r="14.5" stroke="currentColor" strokeWidth="2.5" />
        {/* Bilah Aperture / Shutter Geometris */}
        <circle cx="18" cy="18" r="8" fill="currentColor" fillOpacity="0.18" />
        <circle cx="18" cy="18" r="4.5" fill="currentColor" />
        {/* Bintang 4-Sudut di Pojok Kanan Atas */}
        <path
          d="M27 3C27.3 6.2 29.8 8.7 33 9C29.8 9.3 27.3 11.8 27 15C26.7 11.8 24.2 9.3 21 9C24.2 8.7 26.7 6.2 27 3Z"
          fill="currentColor"
        />
      </svg>
      {/* Tipografi Bersih & Geometris */}
      <div className="flex flex-col leading-none">
        <span className="font-black text-base sm:text-lg tracking-wider uppercase font-sans">
          SNAP BOOTH
        </span>
        <span className="text-[9px] font-bold tracking-[0.22em] uppercase opacity-80 mt-0.5">
          PHOTO &amp; PUZZLE
        </span>
      </div>
    </div>
  );
}

// 2. Ikon Gestur Dua Jari (Peace Hand Icon) - Flat Vector 2D Minimalist
export function PeaceHandIcon({ className = 'w-6 h-6', active = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Telapak tangan & pergelangan dengan jari telunjuk & tengah membentuk V */}
      <path
        d="M13.5 3C12.4 3 11.5 3.9 11.5 5V14.5C11.5 14.8 11.3 15 11 15C10.7 15 10.5 14.8 10.5 14.5V7C10.5 5.9 9.6 5 8.5 5C7.4 5 6.5 5.9 6.5 7V17.2L6 16.5C5.2 15.4 3.7 15.1 2.6 15.9C1.5 16.7 1.2 18.2 2 19.3L6.5 25.5C8.8 28.6 12.3 30.5 16.2 30.5H18C23 30.5 27 26.5 27 21.5V14.5C27 13.4 26.1 12.5 25 12.5C23.9 12.5 23 13.4 23 14.5V16C23 16.3 22.8 16.5 22.5 16.5C22.2 16.5 22 16.3 22 16V13C22 11.9 21.1 11 20 11C18.9 11 18 11.9 18 13V15.5C18 15.8 17.8 16 17.5 16C17.2 16 17 15.8 17 15.5V5C17 3.9 16.1 3 15 3C14.6 3 14.2 3.1 13.9 3.4C13.8 3.1 13.6 3 13.5 3Z"
        stroke={active ? '#0C3859' : 'none'}
        strokeWidth={active ? '1.5' : '0'}
      />
    </svg>
  );
}

// 3. Ikon Gestur Lima Jari Terbuka (Open Hand Icon) - Flat Vector 2D Minimalist
export function OpenHandIcon({ className = 'w-6 h-6', active = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.5 11.5C26.4 11.5 25.5 12.4 25.5 13.5V14.5C25.5 14.8 25.3 15 25 15C24.7 15 24.5 14.8 24.5 14.5V9.5C24.5 8.4 23.6 7.5 22.5 7.5C21.4 7.5 20.5 8.4 20.5 9.5V13.5C20.5 13.8 20.3 14 20 14C19.7 14 19.5 13.8 19.5 13.5V6.5C19.5 5.4 18.6 4.5 17.5 4.5C16.4 4.5 15.5 5.4 15.5 6.5V13.5C15.5 13.8 15.3 14 15 14C14.7 14 14.5 13.8 14.5 13.5V8.5C14.5 7.4 13.6 6.5 12.5 6.5C11.4 6.5 10.5 7.4 10.5 8.5V17L7.8 14.8C6.9 14.1 5.6 14.2 4.9 15.1C4.2 16 4.3 17.3 5.2 18L10.8 23.2C13.2 25.5 16.5 26.8 19.9 26.8H21C25.4 26.8 29 23.2 29 18.8V13.5C29 12.4 28.1 11.5 27.5 11.5Z"
        stroke={active ? '#0C3859' : 'none'}
        strokeWidth={active ? '1.5' : '0'}
      />
    </svg>
  );
}

// 4. Ikon Kamera Flat Solid
export function IconCamera({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6.5C2.6 6.5 1.5 7.6 1.5 9V18C1.5 19.4 2.6 20.5 4 20.5H20C21.4 20.5 22.5 19.4 22.5 18V9C22.5 7.6 21.4 6.5 20 6.5H16.8L15.6 4.2C15.3 3.5 14.5 3 13.7 3H10.3C9.5 3 8.7 3.5 8.4 4.2L7.2 6.5H4ZM12 18C9.2 18 7 15.8 7 13C7 10.2 9.2 8 12 8C14.8 8 17 10.2 17 13C17 15.8 14.8 18 12 18Z" />
      <circle cx="12" cy="13" r="3.2" fill="var(--icon-inner-bg, #0C3859)" />
      <circle cx="19" cy="9.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

// 5. Ikon Timer Flat Solid
export function IconTimer({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 2C9.45 2 9 2.45 9 3C9 3.55 9.45 4 10 4H14C14.55 4 15 3.55 15 3C15 2.45 14.55 2 14 2H10ZM12 5C7.58 5 4 8.58 4 13C4 17.42 7.58 21 12 21C16.42 21 20 17.42 20 13C20 8.58 16.42 5 12 5ZM13 13.5C13 14.05 12.55 14.5 12 14.5C11.45 14.5 11 14.05 11 13.5V8.5C11 7.95 11.45 7.5 12 7.5C12.55 7.5 13 7.95 13 8.5V13.5Z" />
    </svg>
  );
}

// 6. Ikon Grid 3x3 Geometris
export function IconGrid3x3({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="4.5" height="4.5" rx="1" />
      <rect x="9.75" y="3" width="4.5" height="4.5" rx="1" />
      <rect x="16.5" y="3" width="4.5" height="4.5" rx="1" />
      <rect x="3" y="9.75" width="4.5" height="4.5" rx="1" />
      <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1" />
      <rect x="16.5" y="9.75" width="4.5" height="4.5" rx="1" />
      <rect x="3" y="16.5" width="4.5" height="4.5" rx="1" />
      <rect x="9.75" y="16.5" width="4.5" height="4.5" rx="1" />
      <rect x="16.5" y="16.5" width="4.5" height="4.5" rx="1" />
    </svg>
  );
}

// 7. Ikon Grid 4x4 Geometris
export function IconGrid4x4({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2.5" y="2.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="7.5" y="2.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="12.5" y="2.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="17.5" y="2.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="2.5" y="7.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="7.5" y="7.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="12.5" y="7.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="17.5" y="7.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="2.5" y="12.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="7.5" y="12.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="12.5" y="12.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="17.5" y="12.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="2.5" y="17.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="7.5" y="17.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="12.5" y="17.5" width="3.5" height="3.5" rx="0.8" />
      <rect x="17.5" y="17.5" width="3.5" height="3.5" rx="0.8" />
    </svg>
  );
}

// 8. Ikon Unduh Flat
export function IconDownload({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 3C13.5 2.2 12.8 1.5 12 1.5C11.2 1.5 10.5 2.2 10.5 3V11.5L8.1 9.1C7.5 8.5 6.5 8.5 5.9 9.1C5.3 9.7 5.3 10.7 5.9 11.3L10.9 16.3C11.5 16.9 12.5 16.9 13.1 16.3L18.1 11.3C18.7 10.7 18.7 9.7 18.1 9.1C17.5 8.5 16.5 8.5 15.9 9.1L13.5 11.5V3ZM4 18C4 16.9 4.9 16 6 16H18C19.1 16 20 16.9 20 18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18Z" />
    </svg>
  );
}

// 9. Ikon Video Flat Solid
export function IconVideoPlay({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 5C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H14C15.1 19 16 18.1 16 17V14.5L20.3 17.7C21.1 18.3 22 17.7 22 16.8V7.2C22 6.3 21.1 5.7 20.3 6.3L16 9.5V7C16 5.9 15.1 5 14 5H4Z" />
    </svg>
  );
}

// 10. Ikon Ulang (Refresh)
export function IconRefresh({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4V1L7 5.5L12 10V7C15.31 7 18 9.69 18 13C18 14.18 17.65 15.28 17.06 16.2L18.52 17.66C19.45 16.34 20 14.74 20 13C20 8.58 16.42 5 12 4ZM12 19C8.69 19 6 16.31 6 13C6 11.82 6.35 10.72 6.94 9.8L5.48 8.34C4.55 9.66 4 11.26 4 13C4 17.42 7.58 21 12 21V24L17 19.5L12 15V19Z" />
    </svg>
  );
}

// 11. Ikon Puzzle Geometris
export function IconPuzzle({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13.5C20.4 13.5 21.5 12.4 21.5 11C21.5 9.6 20.4 8.5 19 8.5V5C19 3.9 18.1 3 17 3H13.5C13.5 1.6 12.4 0.5 11 0.5C9.6 0.5 8.5 1.6 8.5 3H5C3.9 3 3 3.9 3 5V8.5C4.4 8.5 5.5 9.6 5.5 11C5.5 12.4 4.4 13.5 3 13.5V17C3 18.1 3.9 19 5 19H8.5V17C8.5 15.6 9.6 14.5 11 14.5C12.4 14.5 13.5 15.6 13.5 17V19H17C18.1 19 19 18.1 19 17V13.5Z" />
    </svg>
  );
}

// 12. Ikon Centang (Checkmark)
export function IconCheck({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.9 16.6L5.7 12.4C5.3 12 5.3 11.4 5.7 11C6.1 10.6 6.7 10.6 7.1 11L10.6 14.5L16.9 8.2C17.3 7.8 17.9 7.8 18.3 8.2C18.7 8.6 18.7 9.2 18.3 9.6L11.3 16.6C10.9 17 10.3 17 9.9 16.6Z" />
    </svg>
  );
}

// 13. Ikon Panah Kanan
export function IconArrowRight({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.2 4.3C12.6 3.7 11.6 3.7 11 4.3C10.4 4.9 10.4 5.9 11 6.5L16.5 12L11 17.5C10.4 18.1 10.4 19.1 11 19.7C11.6 20.3 12.6 20.3 13.2 19.7L20 12.9C20.5 12.4 20.5 11.6 20 11.1L13.2 4.3ZM4 11C3.4 11 3 11.4 3 12C3 12.6 3.4 13 4 13H15C15.6 13 16 12.6 16 12C16 11.4 15.6 11 15 11H4Z" />
    </svg>
  );
}

// 14. Ikon Beranda (Home)
export function IconHome({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L2 12H5V20C5 20.6 5.4 21 6 21H10V15H14V21H18C18.6 21 19 20.6 19 20V12H22L12 3Z" />
    </svg>
  );
}

// 15. Ikon Single Player
export function IconSinglePlayer({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="7" r="4.2" />
      <path d="M4 19C4 15.7 7.6 13 12 13C16.4 13 20 15.7 20 19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19Z" />
    </svg>
  );
}

// 16. Ikon 2P Co-Op
export function IconCoop({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="8" cy="7" r="3.3" />
      <circle cx="16" cy="7" r="3.3" />
      <path d="M2.5 19C2.5 16.2 5 14 8 14C9.2 14 10.3 14.4 11.2 15C11.5 14.4 12 14.1 12.8 14C13.7 14 14.8 14 16 14C19 14 21.5 16.2 21.5 19C21.5 20.1 20.6 21 19.5 21H4.5C3.4 21 2.5 20.1 2.5 19Z" />
    </svg>
  );
}

// 17. Ikon 2P Battle
export function IconBattle({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="6" cy="7" r="3" />
      <circle cx="18" cy="7" r="3" />
      <path d="M2 18.5C2 16.2 4 14.2 6.5 14.2C7.8 14.2 8.9 14.8 9.7 15.6L10.5 14.5L11.5 16L10.5 17.5L9.5 18H3.5C2.7 18 2 18.7 2 18.5Z" />
      <path d="M22 18.5C22 16.2 20 14.2 17.5 14.2C16.2 14.2 15.1 14.8 14.3 15.6L13.5 14.5L12.5 16L13.5 17.5L14.5 18H20.5C21.3 18 22 18.7 22 18.5Z" />
      <path d="M13.8 3L8.5 13H12.2L10.2 21L15.5 11H11.8L13.8 3Z" />
    </svg>
  );
}

// 18. Ikon Bintang 4-Sudut (Star Sparkle)
export function IconStarSparkle({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C12.4 7.2 16.8 11.6 22 12C16.8 12.4 12.4 16.8 12 22C11.6 16.8 7.2 12.4 2 12C7.2 11.6 11.6 7.2 12 2Z" />
    </svg>
  );
}
