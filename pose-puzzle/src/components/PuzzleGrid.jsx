import React from 'react';

export default function PuzzleGrid({
  tiles,
  gridSize,
  selectedPos,
  isAdjacentOrthogonal,
  onTileClick,
  cursorPos,
  dwellProgress,
  isAnimating,
}) {
  const percent = 100 / gridSize;

  return (
    <div
      className={`relative w-full h-full bg-[#0C3859] overflow-hidden select-none ${
        isAnimating ? 'pointer-events-none' : ''
      }`}
    >
      {tiles.map((tile) => {
        const col = tile.currentPos % gridSize;
        const row = Math.floor(tile.currentPos / gridSize);

        const isSelected = selectedPos === tile.currentPos;
        const isValidNeighbor =
          selectedPos !== null &&
          isAdjacentOrthogonal(selectedPos, tile.currentPos, gridSize);

        return (
          <div
            key={tile.id}
            onClick={() => onTileClick(tile.currentPos)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${percent}%`,
              height: `${percent}%`,
              transform: `translate3d(${col * 100}%, ${row * 100}%, 0)`,
              transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
              zIndex: isSelected ? 30 : isValidNeighbor ? 20 : 10,
            }}
            className="p-1 cursor-pointer"
          >
            <div
              className={`relative w-full h-full rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-[#F2E9DB] ring-4 ring-[#F2E9DB]/40 scale-[0.96] brightness-105'
                  : isValidNeighbor
                  ? 'border-[#C3E0F4] ring-2 ring-[#C3E0F4]/60 brightness-105'
                  : selectedPos !== null
                  ? 'border-[#0C3859]/60 opacity-70 hover:opacity-90'
                  : 'border-[#0C3859] hover:border-[#F2E9DB]/60'
              }`}
            >
              <img
                src={tile.imgUrl}
                alt={`Petak ${tile.id}`}
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />

              {/* Indikator Tetangga Valid untuk Ditukar (Flat Editorial) */}
              {isValidNeighbor && (
                <div className="absolute inset-0 bg-[#C3E0F4]/15 flex items-center justify-center pointer-events-none">
                  <span className="w-5 h-5 rounded-full bg-[#C3E0F4] border-2 border-[#0C3859] flex items-center justify-center text-[#0C3859] font-black text-[11px] shadow-sm">
                    ⇄
                  </span>
                </div>
              )}

              {/* Nomor Petak Minimalis */}
              <div className="absolute top-1.5 left-1.5 bg-[#0C3859]/80 text-[#F2E9DB] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#F2E9DB]/30 pointer-events-none">
                {tile.id + 1}
              </div>
            </div>
          </div>
        );
      })}

      {/* Kursor Ujung Jari Telunjuk Minimalis (Tanpa Neon Glow) */}
      {cursorPos && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-40 transition-transform duration-75"
          style={{
            left: `${cursorPos.x * 100}%`,
            top: `${cursorPos.y * 100}%`,
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Lingkaran Progress Dwell-Time */}
            <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="18"
                className="stroke-[#0C3859]/40"
                strokeWidth="3.5"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                className="stroke-[#C3E0F4] transition-all duration-75"
                strokeWidth="4"
                fill="none"
                strokeDasharray={113.1}
                strokeDashoffset={113.1 * (1 - (dwellProgress || 0))}
                strokeLinecap="round"
              />
            </svg>

            {/* Titik Kursor Solid */}
            <div className="absolute w-3.5 h-3.5 rounded-full bg-[#F2E9DB] border-2 border-[#0C3859] shadow-xs" />
          </div>
        </div>
      )}
    </div>
  );
}
