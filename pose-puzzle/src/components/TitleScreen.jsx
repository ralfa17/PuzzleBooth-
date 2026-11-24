import React, { useState } from 'react';
import {
  SnapBoothLogo,
  IconPuzzle,
  PeaceHandIcon,
  OpenHandIcon,
  IconSinglePlayer,
  IconCoop,
  IconBattle,
  IconArrowRight,
  IconStarSparkle,
} from './icons/AppIcons';

const GAME_MODES = [
  {
    id: 'single',
    number: '01',
    label: 'SINGLE PLAYER',
    icon: IconSinglePlayer,
    badge: 'MODE TUNGGAL',
    title: 'SNAP BOOTH',
    subtitle:
      'Gunakan gestur tangan untuk memicu hitung mundur kamera, lalu tukar petak orthogonal untuk menyusun foto utuh.',
    features: ['Gestur AI 2/5 Jari', 'Auto Rekam 16:9', '3 Frame Photobooth'],
  },
  {
    id: 'coop',
    number: '02',
    label: '2P CO-OP',
    icon: IconCoop,
    badge: 'MODE KOLABORASI',
    title: 'SNAP BOOTH',
    subtitle:
      'Masuk ke dalam satu frame kamera bersama teman, pose serentak, dan selesaikan puzzle secara bergantian.',
    features: ['Dua Pemain Satu Frame', 'Kerja Sama Taktis', 'Cetak Momen Bersama'],
  },
  {
    id: 'battle',
    number: '03',
    label: '2P BATTLE',
    icon: IconBattle,
    badge: 'MODE TANDING',
    title: 'SNAP BOOTH',
    subtitle:
      'Uji kecepatan dan ketepatan perhitungan langkah pergeseran petak puzzle untuk mencatatkan rekor waktu terbaik.',
    features: ['Kecepatan Tangan', 'Hitungan Langkah Efisien', 'Hasil Foto Final'],
  },
];

export default function TitleScreen({ onStart }) {
  const [activeModeIdx, setActiveModeIdx] = useState(0);
  const currentMode = GAME_MODES[activeModeIdx];

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl bg-[#0C3859] p-6 sm:p-10 md:p-12 border-2 border-[#0C3859] shadow-xl text-[#F2E9DB] overflow-hidden">
      {/* Bar Atas: Logo Brand & Navigasi Mode */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#F2E9DB]/20">
        {/* Logo SNAP BOOTH */}
        <SnapBoothLogo className="text-[#F2E9DB]" />

        {/* Tab Pilihan Mode dengan Garis Bawah Solid */}
        <div className="flex items-center gap-1 sm:gap-2">
          {GAME_MODES.map((mode, idx) => {
            const isActive = activeModeIdx === idx;
            const ModeIcon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveModeIdx(idx)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#F2E9DB]'
                    : 'text-[#F2E9DB]/60 hover:text-[#F2E9DB]'
                }`}
              >
                <ModeIcon className="w-4 h-4 shrink-0" />
                <span>{mode.label}</span>
                {/* Garis Bawah Solid Aktif */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C3E0F4] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Showcase Editorial 2D Flat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-8 md:pt-10">
        {/* Sisi Kiri: Hierarki Teks & Tombol Aksi */}
        <div className="lg:col-span-7 flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C3E0F4]/15 border border-[#C3E0F4]/30 text-[11px] font-black uppercase tracking-widest text-[#C3E0F4]">
            <IconStarSparkle className="w-3.5 h-3.5" />
            <span>{currentMode.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#F2E9DB] tracking-tight leading-none uppercase font-sans">
            {currentMode.title}
          </h1>

          <p className="text-sm sm:text-base text-[#F2E9DB]/85 leading-relaxed max-w-lg font-normal">
            {currentMode.subtitle}
          </p>

          {/* Label Fitur Flat Solid */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {currentMode.features.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-md bg-[#F2E9DB]/10 border border-[#F2E9DB]/20 text-xs font-semibold text-[#F2E9DB]"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Tombol CTA Pill Solid */}
          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={() => onStart(currentMode.id)}
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#F2E9DB] text-[#0C3859] font-black text-sm sm:text-base tracking-wider uppercase border-2 border-[#F2E9DB] hover:bg-[#C3E0F4] hover:border-[#C3E0F4] active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span>Mulai Main</span>
              <div className="w-6 h-6 rounded-full bg-[#0C3859] text-[#F2E9DB] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <IconArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <span className="text-xs text-[#F2E9DB]/60 font-medium">
              Akses webcam 16:9 saat mulai
            </span>
          </div>
        </div>

        {/* Sisi Kanan: Ilustrasi Vektor Flat & Indikator Angka */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[260px]">
          {/* Angka Mode Watermark Editorial */}
          <div className="absolute inset-0 flex items-center justify-end select-none pointer-events-none pr-4">
            <span className="text-9xl sm:text-[140px] font-black text-[#F2E9DB]/10 leading-none tracking-tighter">
              {currentMode.number}
            </span>
          </div>

          {/* Ilustrasi Vektor Flat Minimalis (Tanpa Glow, Tanpa Efek Neon) */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Kartu Kepingan Puzzle Geometris */}
            <div className="absolute top-4 left-6 z-20 bg-[#F2E9DB] text-[#0C3859] p-5 rounded-2xl border-2 border-[#0C3859] shadow-sm transform -rotate-3">
              <IconPuzzle className="w-10 h-10" />
            </div>

            {/* Kartu Gestur Dua Jari (Peace) */}
            <div className="absolute bottom-6 left-12 z-20 bg-[#C3E0F4] text-[#0C3859] p-4 rounded-2xl border-2 border-[#0C3859] shadow-sm transform rotate-6">
              <PeaceHandIcon className="w-10 h-10" />
            </div>

            {/* Kartu Gestur Lima Jari (Open Hand) */}
            <div className="absolute top-10 right-4 z-20 bg-[#0C3859] text-[#F2E9DB] p-4 rounded-2xl border-2 border-[#F2E9DB] shadow-sm transform -rotate-6">
              <OpenHandIcon className="w-9 h-9" />
            </div>

            {/* Bintang Geometris */}
            <div className="absolute bottom-4 right-10 text-[#C3E0F4]">
              <IconStarSparkle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Bar Bawah Info */}
      <div className="mt-8 pt-5 border-t border-[#F2E9DB]/20 flex flex-wrap items-center justify-between text-xs text-[#F2E9DB]/60">
        <div>
          <span>Mode Terpilih: </span>
          <span className="font-bold text-[#F2E9DB]">{currentMode.label}</span>
          <span> ({currentMode.number} / 03)</span>
        </div>
        <div>
          <span>MediaPipe Tasks Vision · WebCam 16:9</span>
        </div>
      </div>
    </div>
  );
}
