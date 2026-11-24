import React from 'react';
import { CAMERA_FILTERS } from '../constants/filters';

export default function FilterBar({ selectedFilter, onSelectFilter }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 no-scrollbar">
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#F2E9DB]/70 pr-2 border-r border-[#F2E9DB]/20 shrink-0">
        Filter
      </div>
      {CAMERA_FILTERS.map((f) => {
        const isSelected = selectedFilter.id === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onSelectFilter(f)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
              isSelected
                ? 'bg-[#F2E9DB] text-[#0C3859] border-[#F2E9DB] shadow-sm'
                : 'bg-[#0C3859]/70 hover:bg-[#0C3859] text-[#F2E9DB] border-[#F2E9DB]/30'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/20"
              style={{ backgroundColor: f.colorHex }}
            />
            <span>{f.name}</span>
          </button>
        );
      })}
    </div>
  );
}
