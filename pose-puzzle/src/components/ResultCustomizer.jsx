import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PHOTOBOOTH_TEMPLATES } from '../constants/frames';
import { renderPhotoboothFrame } from '../utils/canvasRenderer';
import {
  IconDownload,
  IconVideoPlay,
  IconRefresh,
  IconCheck,
} from './icons/AppIcons';

export default function ResultCustomizer({
  fullPhotoUrl,
  recordedVideoUrl,
  moves,
  onReset,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState('hollywood');
  const [scrapbookTheme, setScrapbookTheme] = useState('cream');
  const [isExporting, setIsExporting] = useState(false);
  const previewCanvasRef = useRef(null);
  const photoImageRef = useRef(null);

  const drawPreview = useCallback(() => {
    if (!previewCanvasRef.current || !photoImageRef.current) return;
    renderPhotoboothFrame(
      previewCanvasRef.current,
      photoImageRef.current,
      selectedTemplate,
      { colorTheme: scrapbookTheme }
    );
  }, [selectedTemplate, scrapbookTheme]);

  useEffect(() => {
    if (!fullPhotoUrl) return;
    const img = new Image();
    img.src = fullPhotoUrl;
    img.onload = () => {
      photoImageRef.current = img;
      drawPreview();
    };
  }, [fullPhotoUrl, drawPreview]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const handleDownloadFramedPhoto = () => {
    if (!photoImageRef.current) return;
    setIsExporting(true);

    try {
      const exportCanvas = document.createElement('canvas');
      renderPhotoboothFrame(
        exportCanvas,
        photoImageRef.current,
        selectedTemplate,
        { colorTheme: scrapbookTheme }
      );

      const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.96);
      const a = document.createElement('a');
      a.href = dataUrl;
      const themeSuffix =
        selectedTemplate === 'scrapbook' ? `-${scrapbookTheme}` : '';
      a.download = `SnapBooth-${selectedTemplate}${themeSuffix}-${Date.now()}.jpg`;
      a.click();
    } catch (err) {
      console.error('Gagal mengunduh foto frame:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadVideo = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement('a');
    a.href = recordedVideoUrl;
    a.download = `SnapBooth-GameplayReplay-${Date.now()}.webm`;
    a.click();
  };

  return (
    <div className="absolute inset-0 bg-[#0C3859]/90 backdrop-blur-sm flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto z-40">
      <div className="max-w-4xl w-full flex flex-col gap-4">
        {/* Header Kemenangan - Editorial Minimalis */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F2E9DB] text-[#0C3859] p-4 sm:p-5 rounded-2xl border-2 border-[#0C3859] shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0C3859] text-[#F2E9DB] flex items-center justify-center shrink-0">
              <IconCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#C3E0F4] text-[#0C3859]">
                  Puzzle Selesai
                </span>
                <span className="text-xs text-[#0C3859]/70 font-semibold">
                  {moves} Langkah
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#0C3859] mt-0.5">
                Kustomisasi Frame Photobooth
              </h2>
            </div>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#0C3859] bg-transparent hover:bg-[#0C3859] hover:text-[#F2E9DB] text-[#0C3859] text-xs font-bold transition cursor-pointer"
          >
            <IconRefresh className="w-3.5 h-3.5" />
            <span>Main Lagi</span>
          </button>
        </div>

        {/* Pilihan 3 Template Frame Photobooth */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PHOTOBOOTH_TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplate === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#F2E9DB] bg-[#F2E9DB] text-[#0C3859] shadow-md'
                    : 'border-[#F2E9DB]/30 bg-[#0C3859] text-[#F2E9DB] hover:border-[#F2E9DB]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#0C3859] text-[#F2E9DB]'
                          : 'bg-[#F2E9DB]/15 text-[#F2E9DB]'
                      }`}
                    >
                      {tpl.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0C3859]">
                        Terpilih
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-sm tracking-tight">{tpl.name}</h3>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      isSelected ? 'text-[#0C3859]/80' : 'text-[#F2E9DB]/70'
                    }`}
                  >
                    {tpl.tagline}
                  </p>
                </div>

                {/* Sub-opsi warna untuk Scrapbook */}
                {tpl.id === 'scrapbook' && isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-[#0C3859]/20 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#0C3859]/70">
                      Warna:
                    </span>
                    {tpl.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setScrapbookTheme(opt.id);
                        }}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                          scrapbookTheme === opt.id
                            ? 'bg-[#0C3859] text-[#F2E9DB] border-[#0C3859]'
                            : 'bg-transparent text-[#0C3859] border-[#0C3859]/40 hover:bg-[#0C3859]/10'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/30"
                          style={{ backgroundColor: opt.color }}
                        />
                        {opt.name}
                      </button>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Canvas Preview Photobooth Card */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#F2E9DB]/30 bg-[#0C3859] shadow-sm flex flex-col items-center justify-center p-3">
          <canvas
            ref={previewCanvasRef}
            className="w-full max-h-[50vh] object-contain rounded-xl"
          />
        </div>

        {/* Action Buttons: Simpan Foto, Simpan Video Replay, Main Lagi */}
        <div className="flex flex-wrap items-center justify-end gap-3 pb-4">
          <button
            onClick={onReset}
            className="px-5 py-3 rounded-full border border-[#F2E9DB]/40 text-[#F2E9DB] hover:bg-[#F2E9DB]/10 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <IconRefresh className="w-4 h-4" />
            <span>Main Lagi</span>
          </button>

          <button
            onClick={handleDownloadVideo}
            disabled={!recordedVideoUrl}
            className={`px-5 py-3 rounded-full border text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              recordedVideoUrl
                ? 'bg-[#C3E0F4] text-[#0C3859] border-[#C3E0F4] hover:bg-[#C3E0F4]/90'
                : 'bg-transparent text-[#F2E9DB]/40 border-[#F2E9DB]/20 cursor-not-allowed'
            }`}
          >
            <IconVideoPlay className="w-4 h-4" />
            <span>{recordedVideoUrl ? 'Simpan Video (.webm)' : 'Memproses Video...'}</span>
          </button>

          <button
            onClick={handleDownloadFramedPhoto}
            disabled={isExporting}
            className="px-7 py-3 rounded-full bg-[#F2E9DB] text-[#0C3859] font-black text-xs sm:text-sm flex items-center gap-2.5 border-2 border-[#F2E9DB] hover:bg-white transition cursor-pointer active:scale-95"
          >
            <IconDownload className="w-4 h-4" />
            <span>{isExporting ? 'Mengekspor...' : 'Simpan Foto Frame (.jpg)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
