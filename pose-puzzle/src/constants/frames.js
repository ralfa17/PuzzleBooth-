// Definisi 3 Template Frame Photobooth Custom
export const PHOTOBOOTH_TEMPLATES = [
  {
    id: 'hollywood',
    name: 'Hollywood Red Carpet',
    tagline: 'Merah glamor, bintang & clapperboard sinematik',
    badge: 'Sinematik',
    themeColor: '#dc2626',
    previewBg: 'bg-red-950 border-red-700/60 text-red-100',
    options: null,
  },
  {
    id: 'scrapbook',
    name: 'Retro Editorial Scrapbook',
    tagline: 'Stiker majalah retro, kamera & topi koki',
    badge: 'Vintage',
    themeColor: '#d97706',
    previewBg: 'bg-amber-950 border-amber-700/60 text-amber-100',
    options: [
      { id: 'cream', name: 'Warm Cream', color: '#fef3c7' },
      { id: 'maroon', name: 'Deep Maroon', color: '#500724' },
    ],
  },
  {
    id: 'blackcat',
    name: 'Booo! Cute Black Cat',
    tagline: 'Slate grey minimalis dengan kucing hitam bermata bulat',
    badge: 'Cute Minimalist',
    themeColor: '#818cf8',
    previewBg: 'bg-slate-900 border-slate-700 text-slate-100',
    options: null,
  },
];
