// Utilitas Rendering Canvas HTML5 untuk 3 Template Frame Photobooth

// Helper gambar bintang 5 sudut
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, fillStyle, strokeStyle = null) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// -----------------------------------------------------------------------------
// TEMPLATE 1: Hollywood Red Carpet Filmstrip
// -----------------------------------------------------------------------------
export function renderHollywoodFrame(canvas, photoImg) {
  const width = 1400;
  const height = 1100;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Background Glamour Red Glitter & Carpet Velvet
  const bgGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    100,
    width / 2,
    height / 2,
    width * 0.75
  );
  bgGrad.addColorStop(0, '#83141e');
  bgGrad.addColorStop(0.5, '#5c0d16');
  bgGrad.addColorStop(1, '#2c0409');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Efek glitter partikel emas & merah halus
  ctx.save();
  const glitterSeeds = [
    [120, 180, 2.5, 0.6], [240, 90, 3, 0.8], [420, 70, 2, 0.5],
    [980, 60, 2.5, 0.7], [1250, 140, 3.5, 0.9], [1320, 320, 2, 0.6],
    [80, 480, 2.5, 0.7], [1340, 580, 3, 0.8], [90, 750, 2, 0.5],
    [1300, 800, 2.5, 0.7], [300, 1020, 3, 0.8], [600, 1040, 2.5, 0.6],
    [850, 1030, 3, 0.7], [1150, 1010, 2, 0.5]
  ];
  glitterSeeds.forEach(([gx, gy, r, alpha]) => {
    ctx.fillStyle = `rgba(253, 230, 138, ${alpha})`;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(gx, gy, r, 0, Math.PI * 2);
    ctx.fill();
    // Silang cahaya kecil
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gx - r * 3, gy);
    ctx.lineTo(gx + r * 3, gy);
    ctx.moveTo(gx, gy - r * 3);
    ctx.lineTo(gx, gy + r * 3);
    ctx.stroke();
  });
  ctx.restore();

  // 2. Filmstrip Borders (Kiri & Kanan) dengan lubang sproket film putih
  const stripW = 85;
  // Border Kiri
  ctx.fillStyle = '#120204';
  ctx.fillRect(0, 0, stripW, height);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(stripW, 0);
  ctx.lineTo(stripW, height);
  ctx.stroke();

  // Border Kanan
  ctx.fillRect(width - stripW, 0, stripW, height);
  ctx.beginPath();
  ctx.moveTo(width - stripW, 0);
  ctx.lineTo(width - stripW, height);
  ctx.stroke();

  // Lubang sproket film (Film Sprocket Holes)
  const holeH = 34;
  const holeW = 44;
  const holeGap = 24;
  const totalHoles = Math.floor(height / (holeH + holeGap));
  const startY = (height - (totalHoles * (holeH + holeGap) - holeGap)) / 2;

  for (let i = 0; i < totalHoles; i++) {
    const y = startY + i * (holeH + holeGap);
    // Kiri
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect((stripW - holeW) / 2, y, holeW, holeH, 8);
    ctx.fill();
    // Bayangan dalam lubang
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Kanan
    ctx.beginPath();
    ctx.roundRect(width - stripW + (stripW - holeW) / 2, y, holeW, holeH, 8);
    ctx.fill();
    ctx.stroke();
  }

  // 3. Area Foto Utama (16:9 Widescreen) di Tengah
  const photoW = 1040;
  const photoH = (photoW * 9) / 16; // 585
  const photoX = (width - photoW) / 2;
  const photoY = 175;

  // Frame Emas Mewah Berlapis untuk Foto
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;

  const goldFrameGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
  goldFrameGrad.addColorStop(0, '#fef08a');
  goldFrameGrad.addColorStop(0.3, '#ca8a04');
  goldFrameGrad.addColorStop(0.5, '#fef9c3');
  goldFrameGrad.addColorStop(0.8, '#a16207');
  goldFrameGrad.addColorStop(1, '#eab308');

  ctx.fillStyle = goldFrameGrad;
  ctx.beginPath();
  ctx.roundRect(photoX - 16, photoY - 16, photoW + 32, photoH + 32, 16);
  ctx.fill();
  ctx.restore();

  // Gambar Foto Pengguna (Clips ke dalam frame)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 8);
  ctx.clip();
  if (photoImg) {
    ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }
  ctx.restore();

  // Garis aksen emas di dalam foto
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(photoX + 8, photoY + 8, photoW - 16, photoH - 16);

  // 4. Marquee Sign "HOLLYWOOD" di Bagian Atas
  const marqueeW = 540;
  const marqueeH = 90;
  const marqueeX = (width - marqueeW) / 2;
  const marqueeY = 45;

  ctx.save();
  // Shadow Marquee
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 25;

  // Board Marquee Emas / Merah Tua
  const marqueeGrad = ctx.createLinearGradient(marqueeX, marqueeY, marqueeX, marqueeY + marqueeH);
  marqueeGrad.addColorStop(0, '#991b1b');
  marqueeGrad.addColorStop(1, '#450a0a');
  ctx.fillStyle = marqueeGrad;
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(marqueeX, marqueeY, marqueeW, marqueeH, 18);
  ctx.fill();
  ctx.stroke();

  // Lampu-lampu Bohlam Marquee di sekeliling border
  const bulbSpacing = 26;
  const bulbRadius = 4.5;
  const numHoriz = Math.floor(marqueeW / bulbSpacing);
  const numVert = Math.floor(marqueeH / bulbSpacing);

  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 8;
  for (let i = 1; i < numHoriz; i++) {
    // Atas
    ctx.beginPath();
    ctx.arc(marqueeX + i * bulbSpacing, marqueeY + 8, bulbRadius, 0, Math.PI * 2);
    ctx.fill();
    // Bawah
    ctx.beginPath();
    ctx.arc(marqueeX + i * bulbSpacing, marqueeY + marqueeH - 8, bulbRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let j = 1; j < numVert; j++) {
    // Kiri
    ctx.beginPath();
    ctx.arc(marqueeX + 8, marqueeY + j * bulbSpacing, bulbRadius, 0, Math.PI * 2);
    ctx.fill();
    // Kanan
    ctx.beginPath();
    ctx.arc(marqueeX + marqueeW - 8, marqueeY + j * bulbSpacing, bulbRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Teks HOLLYWOOD
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 44px "Impact", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★ HOLLYWOOD ★', width / 2, marqueeY + marqueeH / 2 + 2);
  ctx.restore();

  // 5. Ornamen Bola Disko Perak (Kanan Atas/Samping)
  const discoX = width - 150;
  const discoY = 150;
  const discoR = 52;

  // Tali gantungan bola disko
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(discoX, 0);
  ctx.lineTo(discoX, discoY - discoR);
  ctx.stroke();

  // Bola Disko
  ctx.save();
  const discoGrad = ctx.createRadialGradient(
    discoX - discoR * 0.35,
    discoY - discoR * 0.35,
    5,
    discoX,
    discoY,
    discoR
  );
  discoGrad.addColorStop(0, '#ffffff');
  discoGrad.addColorStop(0.3, '#e2e8f0');
  discoGrad.addColorStop(0.7, '#64748b');
  discoGrad.addColorStop(1, '#1e293b');

  ctx.fillStyle = discoGrad;
  ctx.beginPath();
  ctx.arc(discoX, discoY, discoR, 0, Math.PI * 2);
  ctx.fill();

  // Pola kotak-kotak faset cermin bola disko
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.2;
  for (let lat = -discoR + 10; lat < discoR; lat += 12) {
    const chord = Math.sqrt(Math.max(0, discoR * discoR - lat * lat));
    ctx.beginPath();
    ctx.moveTo(discoX - chord, discoY + lat);
    ctx.lineTo(discoX + chord, discoY + lat);
    ctx.stroke();
  }
  for (let lon = -discoR + 10; lon < discoR; lon += 14) {
    const chord = Math.sqrt(Math.max(0, discoR * discoR - lon * lon));
    ctx.beginPath();
    ctx.moveTo(discoX + lon, discoY - chord);
    ctx.lineTo(discoX + lon, discoY + chord);
    ctx.stroke();
  }

  // Kilauan cermin bola disko
  drawStar(ctx, discoX - 22, discoY - 20, 4, 18, 5, '#ffffff');
  drawStar(ctx, discoX + 24, discoY + 16, 4, 12, 3, '#ffffff');
  ctx.restore();

  // Pita Roll Film Melingkar (Curving filmstrip ribbon)
  ctx.save();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.bezierCurveTo(discoX - 30, discoY + discoR + 10, width - 110, discoY + 130, width - 150, discoY + 220);
  ctx.stroke();
  ctx.restore();

  // 6. Clapperboard (Papan Sutradara) di Pojok Kiri Bawah
  const clapX = 140;
  const clapY = height - 265;
  const clapW = 240;
  const clapH = 180;

  ctx.save();
  ctx.translate(clapX, clapY);
  ctx.rotate(-0.06); // Sedikit miring dinamis
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 20;

  // Body Clapperboard Hitam
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(0, 45, clapW, clapH - 45, 8);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Teks Chalkboard di Clapper
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SCENE: 01    TAKE: 01', 20, 85);
  ctx.fillText('PROD: SNAP BOOTH', 20, 115);
  ctx.fillText('DIRECTOR: YOU', 20, 145);

  // Palang Atas Garis Belang Hitam-Putih (Chevron Stripes)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(0, 0, clapW, 40, [8, 8, 2, 2]);
  ctx.fill();

  // Garis hitam miring
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.roundRect(0, 0, clapW, 40, [8, 8, 2, 2]);
  ctx.clip();
  for (let s = -40; s < clapW + 40; s += 45) {
    ctx.beginPath();
    ctx.moveTo(s, 0);
    ctx.lineTo(s + 24, 0);
    ctx.lineTo(s - 16, 40);
    ctx.lineTo(s - 40, 40);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 7. Tiket Bioskop Emas "ADMIT ONE" di Pojok Kanan Bawah
  const tktX = width - 420;
  const tktY = height - 240;
  const tktW = 260;
  const tktH = 135;

  ctx.save();
  ctx.translate(tktX, tktY);
  ctx.rotate(0.05); // Sedikit miring estetik
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 20;

  // Badan Tiket Warna Emas Retro
  const tktGrad = ctx.createLinearGradient(0, 0, tktW, tktH);
  tktGrad.addColorStop(0, '#fef08a');
  tktGrad.addColorStop(0.5, '#f59e0b');
  tktGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = tktGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, tktW, tktH, 12);
  ctx.fill();

  // Notch / Coakan setengah lingkaran di kiri & kanan tiket
  ctx.fillStyle = '#5c0d16'; // Sesuai warna background belakangnya
  ctx.beginPath();
  ctx.arc(0, tktH / 2, 16, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(tktW, tktH / 2, 16, Math.PI / 2, (Math.PI * 3) / 2);
  ctx.fill();

  // Border Garis Putus-Putus
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 5]);
  ctx.strokeRect(20, 10, tktW - 40, tktH - 20);
  ctx.setLineDash([]);

  // Teks ADMIT ONE
  ctx.fillStyle = '#78350f';
  ctx.font = '900 24px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ ADMIT ONE ★', tktW / 2, 45);

  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('VIP RED CARPET ENTRY', tktW / 2, 70);

  // Barcode kecil
  ctx.font = '900 12px monospace';
  ctx.fillText('|||| ||| ||||| |||| ||', tktW / 2, 95);
  ctx.font = 'bold 11px monospace';
  ctx.fillText('NO. 778921-A', tktW / 2, 112);
  ctx.restore();

  // Bintang Emas Bertebaran
  drawStar(ctx, 420, 830, 5, 22, 10, '#fef08a', '#d97706');
  drawStar(ctx, 490, 860, 5, 14, 6, '#fef08a', '#d97706');
  drawStar(ctx, 950, 820, 5, 20, 9, '#fef08a', '#d97706');
  drawStar(ctx, 900, 855, 5, 13, 6, '#fef08a', '#d97706');

  // Footer Tagline Sinematik
  ctx.fillStyle = '#fef08a';
  ctx.font = 'italic 700 20px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ THE PREMIERE EDITION · SNAP BOOTH ✦', width / 2, height - 60);
}

// -----------------------------------------------------------------------------
// TEMPLATE 2: Retro Editorial & Chef/Studio Scrapbook
// -----------------------------------------------------------------------------
export function renderScrapbookFrame(canvas, photoImg, colorTheme = 'cream') {
  const width = 1400;
  const height = 1100;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const isCream = colorTheme === 'cream';

  // 1. Background Kertas Vintage (Warm Cream atau Deep Maroon)
  if (isCream) {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#fdfbf7');
    bgGrad.addColorStop(0.5, '#f7f1e5');
    bgGrad.addColorStop(1, '#ebdcc4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Titik-titik pola dot grid scrapbook
    ctx.fillStyle = 'rgba(180, 160, 130, 0.22)';
    for (let x = 20; x < width; x += 32) {
      for (let y = 20; y < height; y += 32) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else {
    // Deep Maroon
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#561623');
    bgGrad.addColorStop(0.5, '#400f19');
    bgGrad.addColorStop(1, '#2c0810');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 220, 200, 0.08)';
    for (let x = 20; x < width; x += 32) {
      for (let y = 20; y < height; y += 32) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Border Luar bergaya cetakan majalah retro
  ctx.strokeStyle = isCream ? '#d1c4aa' : '#882236';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // 2. Area Foto 16:9 di Tengah (Gaya Polaroid / Editorial Matting)
  const photoW = 1040;
  const photoH = (photoW * 9) / 16; // 585
  const photoX = (width - photoW) / 2;
  const photoY = 175;

  // Background Kertas Alas Foto
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 12;

  ctx.fillStyle = isCream ? '#ffffff' : '#fcfbf7';
  ctx.beginPath();
  ctx.roundRect(photoX - 16, photoY - 16, photoW + 32, photoH + 32, 4);
  ctx.fill();
  ctx.restore();

  // Gambar Foto
  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();
  if (photoImg) {
    ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
  } else {
    ctx.fillStyle = '#64748b';
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }
  ctx.restore();

  // Washi Tape (Pita Perekat) di Pojok Kiri Atas Foto
  ctx.save();
  ctx.translate(photoX - 25, photoY - 15);
  ctx.rotate(-0.15);
  ctx.fillStyle = 'rgba(234, 179, 8, 0.75)'; // Kuning semi transparan
  ctx.fillRect(0, 0, 110, 30);
  ctx.strokeStyle = 'rgba(202, 138, 4, 0.5)';
  ctx.strokeRect(0, 0, 110, 30);
  ctx.restore();

  // Washi Tape di Pojok Kanan Bawah Foto
  ctx.save();
  ctx.translate(photoX + photoW - 75, photoY + photoH - 12);
  ctx.rotate(0.12);
  ctx.fillStyle = 'rgba(52, 211, 153, 0.75)'; // Mint hijau semi transparan
  ctx.fillRect(0, 0, 110, 30);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.strokeRect(0, 0, 110, 30);
  ctx.restore();

  // 3. Stiker Label "SNAPSHOT" (Cutout Label)
  ctx.save();
  const snapX = photoX + photoW - 140;
  const snapY = photoY - 45;
  ctx.translate(snapX, snapY);
  ctx.rotate(0.08);
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = '#dc2626'; // Merah cerah label dymo
  ctx.beginPath();
  ctx.roundRect(0, 0, 200, 48, 6);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('★ SNAPSHOT ★', 100, 31);
  ctx.restore();

  // 4. Stempel Bulat "SMILE TO CAM!" (Cutout Stamp)
  ctx.save();
  const stampX = photoX - 55;
  const stampY = photoY + photoH - 45;
  ctx.translate(stampX, stampY);
  ctx.rotate(-0.18);

  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 10;

  // Stempel Jingga / Oranye
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(60, 60, 58, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(60, 60, 50, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ SMILE TO CAM! ★', 60, 42);

  // Ikon Kamera Kecil di Tengah Stempel (Canvas Path)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(46, 60, 28, 18, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(54, 56, 12, 4, 1.5);
  ctx.fill();
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(60, 69, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('AUTHENTIC POSE', 60, 94);
  ctx.restore();

  // 5. Stiker Topi Koki & Foodie / Chef's Studio Special
  ctx.save();
  const chefX = 90;
  const chefY = 85;
  ctx.translate(chefX, chefY);
  ctx.rotate(-0.08);

  // Lencana Koki
  ctx.fillStyle = '#f8fafc';
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(0, 0, 160, 72, 10);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Topi Koki Geometris
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 16px sans-serif';
  ctx.fillText('★ CHEF ★', 38, 45);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText("CHEF'S SPECIAL", 85, 33);
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('RECIPE FOR FUN', 85, 52);
  ctx.restore();

  // 6. Ilustrasi Rol Film & Lensa Kamera Retro
  ctx.save();
  const filmX = width - 260;
  const filmY = 75;
  ctx.translate(filmX, filmY);
  ctx.rotate(0.06);

  // Tabung Rol Film 35mm
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(0, 0, 150, 68, 8);
  ctx.fill();

  ctx.fillStyle = '#eab308';
  ctx.fillRect(25, 10, 100, 48);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('35mm FILM', 75, 34);
  ctx.font = 'bold 10px monospace';
  ctx.fillText('ISO 400 · 36 EXP', 75, 50);
  ctx.restore();

  // 7. Header Editorial Retro
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = isCream ? '#1c1917' : '#fdf8f6';
  ctx.font = '900 36px "Courier New", Courier, monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('THE SCRAPBOOK CHRONICLE', width / 2, 85);

  ctx.font = 'bold 15px "Courier New", Courier, monospace';
  ctx.fillStyle = isCream ? '#78716c' : '#fda4af';
  ctx.fillText('VOL. 04 · SPECIAL EDITION · STUDIO SNAP BOOTH', width / 2, 120);
  ctx.restore();

  // 8. Bagian Bawah: Tipografi Playful Editorial, Barcode & Tanggal
  const bottomY = height - 120;
  ctx.save();
  ctx.fillStyle = isCream ? '#292524' : '#fff1f2';
  ctx.font = 'italic 700 24px "Times New Roman", Times, serif';
  ctx.textAlign = 'left';
  ctx.fillText('"Capturing spontaneous candid moments & playful puzzle memories."', photoX, bottomY);

  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = isCream ? '#57534e' : '#fecdd3';
  ctx.fillText('ARCHIVE NO: SNB-2026-X99   |   LOCATION: SNAP BOOTH STUDIO', photoX, bottomY + 30);

  // Barcode di Pojok Kanan Bawah
  ctx.textAlign = 'right';
  ctx.font = '900 20px monospace';
  ctx.fillStyle = isCream ? '#1c1917' : '#ffffff';
  ctx.fillText('||| | ||||| || |||| ||||', photoX + photoW, bottomY + 5);
  ctx.font = '11px monospace';
  ctx.fillText('SERIES 9820-001', photoX + photoW, bottomY + 28);
  ctx.restore();
}

// -----------------------------------------------------------------------------
// TEMPLATE 3: Booo! Cute Black Cat Minimalist
// -----------------------------------------------------------------------------
export function renderBlackCatFrame(canvas, photoImg) {
  const width = 1400;
  const height = 1100;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Background Slate / Charcoal Grey
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#242734');
  bgGrad.addColorStop(0.5, '#1e202b');
  bgGrad.addColorStop(1, '#161720');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Taburan bintang-bintang kecil putih & pastel
  ctx.save();
  const stars = [
    [120, 120, 4], [250, 70, 3], [410, 110, 5], [980, 80, 3.5],
    [1200, 130, 4.5], [1320, 240, 3], [90, 460, 4], [1340, 520, 4],
    [100, 800, 3.5], [1300, 830, 4], [320, 1020, 4], [640, 1040, 3],
    [880, 1010, 5], [1160, 1030, 3.5]
  ];
  stars.forEach(([sx, sy, r]) => {
    drawStar(ctx, sx, sy, 4, r * 2.2, r * 0.7, 'rgba(255, 255, 255, 0.75)');
  });

  // Jejak Kaki Kucing (Paw Prints 🐾)
  function drawPaw(px, py, size, rot = 0, color = 'rgba(255, 255, 255, 0.25)') {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.fillStyle = color;
    // Telapak utama
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 1.2, size, 0, 0, Math.PI * 2);
    ctx.fill();
    // 4 Jari kecil
    const toeR = size * 0.42;
    const toeDist = size * 1.5;
    [-0.55, -0.2, 0.2, 0.55].forEach((angle) => {
      ctx.beginPath();
      ctx.arc(
        Math.sin(angle) * toeDist,
        -Math.cos(angle) * toeDist,
        toeR,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
    ctx.restore();
  }

  drawPaw(110, 260, 10, -0.2);
  drawPaw(135, 330, 11, 0.1);
  drawPaw(120, 400, 10, -0.15);

  drawPaw(width - 120, 680, 10, 0.3);
  drawPaw(width - 145, 750, 11, 0.1);
  drawPaw(width - 125, 820, 10, 0.25);
  ctx.restore();

  // 2. Potongan Bingkai Foto: Scalloped / Clover Curvature Border
  const photoW = 1040;
  const photoH = (photoW * 9) / 16; // 585
  const photoX = (width - photoW) / 2;
  const photoY = 175;

  // Frame Luar Putih Tebal dengan Scalloped / Rounded Corner Indah
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 14;

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  // Sudut membulat unik 28px
  ctx.roundRect(photoX - 18, photoY - 18, photoW + 36, photoH + 36, 32);
  ctx.fill();
  ctx.restore();

  // Garis dekoratif putus-putus abu-abu di dalam frame putih
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.roundRect(photoX - 10, photoY - 10, photoW + 20, photoH + 20, 24);
  ctx.stroke();
  ctx.setLineDash([]);

  // Gambar Foto
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 20);
  ctx.clip();
  if (photoImg) {
    ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
  } else {
    ctx.fillStyle = '#334155';
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }
  ctx.restore();

  // 3. Tipografi "Booo!" Tebal dengan Telinga Kucing di Bagian Atas
  ctx.save();
  const titleX = width / 2;
  const titleY = 105;

  // Bayangan teks
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Booo!', titleX, titleY);

  // Telinga Kucing Hitam di Huruf "B"
  const earBaseX = titleX - 105;
  const earBaseY = titleY - 32;

  // Telinga Kiri
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(earBaseX - 22, earBaseY + 6);
  ctx.lineTo(earBaseX - 12, earBaseY - 28);
  ctx.lineTo(earBaseX + 6, earBaseY + 6);
  ctx.closePath();
  ctx.fill();
  // Inner Pink Kiri
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.moveTo(earBaseX - 18, earBaseY + 4);
  ctx.lineTo(earBaseX - 11, earBaseY - 20);
  ctx.lineTo(earBaseX + 1, earBaseY + 4);
  ctx.closePath();
  ctx.fill();

  // Telinga Kanan
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(earBaseX + 10, earBaseY + 6);
  ctx.lineTo(earBaseX + 28, earBaseY - 28);
  ctx.lineTo(earBaseX + 38, earBaseY + 6);
  ctx.closePath();
  ctx.fill();
  // Inner Pink Kanan
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.moveTo(earBaseX + 14, earBaseY + 4);
  ctx.lineTo(earBaseX + 27, earBaseY - 20);
  ctx.lineTo(earBaseX + 34, earBaseY + 4);
  ctx.closePath();
  ctx.fill();

  // Subtitle Menggemaskan
  ctx.shadowBlur = 0;
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('✦ CUTE BLACK CAT EDITION ✦', titleX, titleY + 42);
  ctx.restore();

  // 4. Karakter Kucing Hitam Menggemaskan Mengintip di Pojok Kiri Bawah
  ctx.save();
  const catX = photoX + 60;
  const catY = photoY + photoH - 12;

  // Bayangan badan kucing
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 16;

  // Kepala Kucing Hitam Bulat
  ctx.fillStyle = '#111318';
  ctx.beginPath();
  ctx.arc(catX, catY + 25, 62, 0, Math.PI * 2);
  ctx.fill();

  // Telinga Kucing Kiri & Kanan
  ctx.beginPath();
  ctx.moveTo(catX - 52, catY - 5);
  ctx.lineTo(catX - 44, catY - 48);
  ctx.lineTo(catX - 12, catY - 14);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(catX + 12, catY - 14);
  ctx.lineTo(catX + 44, catY - 48);
  ctx.lineTo(catX + 52, catY - 5);
  ctx.closePath();
  ctx.fill();

  // Telinga Dalam Pink
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.moveTo(catX - 45, catY - 6);
  ctx.lineTo(catX - 40, catY - 38);
  ctx.lineTo(catX - 18, catY - 12);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(catX + 18, catY - 12);
  ctx.lineTo(catX + 40, catY - 38);
  ctx.lineTo(catX + 45, catY - 6);
  ctx.closePath();
  ctx.fill();

  // Mata Kucing Bulat Besar Menggemaskan (Luminous Anime Eyes)
  const drawEye = (ex, ey) => {
    // Sclera / Iris Kuning Kehijauan Terang
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(ex, ey, 18, 0, Math.PI * 2);
    ctx.fill();

    // Pupil Hitam Besar
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(ex, ey, 12, 0, Math.PI * 2);
    ctx.fill();

    // Kilau Cahaya Putih (Sparkle Highlight)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex - 4, ey - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 4, ey + 4, 2.5, 0, Math.PI * 2);
    ctx.fill();
  };

  drawEye(catX - 22, catY + 12);
  drawEye(catX + 22, catY + 12);

  // Hidung Pink Kecil
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.moveTo(catX - 4, catY + 28);
  ctx.lineTo(catX + 4, catY + 28);
  ctx.lineTo(catX, catY + 34);
  ctx.closePath();
  ctx.fill();

  // Kumis Putih Halus
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  // Kiri
  ctx.beginPath();
  ctx.moveTo(catX - 12, catY + 32);
  ctx.lineTo(catX - 48, catY + 26);
  ctx.moveTo(catX - 12, catY + 35);
  ctx.lineTo(catX - 50, catY + 38);
  ctx.stroke();
  // Kanan
  ctx.beginPath();
  ctx.moveTo(catX + 12, catY + 32);
  ctx.lineTo(catX + 48, catY + 26);
  ctx.moveTo(catX + 12, catY + 35);
  ctx.lineTo(catX + 50, catY + 38);
  ctx.stroke();

  // Dua Cakar Kucing Menggantung di Atas Frame Foto (Paws peeking over edge)
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.roundRect(catX - 35, photoY + photoH - 6, 26, 18, 9);
  ctx.roundRect(catX + 10, photoY + photoH - 6, 26, 18, 9);
  ctx.fill();
  ctx.restore();

  // 5. Kucing Kecil Kedua Mengintip di Pojok Kanan Atas Foto
  ctx.save();
  const miniCatX = photoX + photoW - 35;
  const miniCatY = photoY - 10;
  ctx.translate(miniCatX, miniCatY);
  ctx.rotate(0.2);

  ctx.fillStyle = '#111318';
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fill();

  // Telinga
  ctx.beginPath();
  ctx.moveTo(-28, -10);
  ctx.lineTo(-24, -40);
  ctx.lineTo(-4, -18);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(4, -18);
  ctx.lineTo(24, -40);
  ctx.lineTo(28, -10);
  ctx.closePath();
  ctx.fill();

  // Mata Mengintip
  ctx.fillStyle = '#34d399'; // Mata Emerald
  ctx.beginPath();
  ctx.arc(-12, -4, 9, 0, Math.PI * 2);
  ctx.arc(12, -4, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(-12, -4, 5.5, 0, Math.PI * 2);
  ctx.arc(12, -4, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-14, -6, 2.5, 0, Math.PI * 2);
  ctx.arc(10, -6, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Doodle Ikan / Fishbone & Love di Bagian Bawah
  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  const fishX = width - 260;
  const fishY = height - 120;
  // Duri ikan
  ctx.beginPath();
  ctx.moveTo(fishX, fishY);
  ctx.lineTo(fishX + 60, fishY);
  // Kepala
  ctx.moveTo(fishX, fishY);
  ctx.lineTo(fishX - 16, fishY - 14);
  ctx.lineTo(fishX - 16, fishY + 14);
  ctx.closePath();
  // Tulang
  ctx.moveTo(fishX + 15, fishY - 12);
  ctx.lineTo(fishX + 15, fishY + 12);
  ctx.moveTo(fishX + 32, fishY - 12);
  ctx.lineTo(fishX + 32, fishY + 12);
  ctx.moveTo(fishX + 48, fishY - 10);
  ctx.lineTo(fishX + 48, fishY + 10);
  // Ekor
  ctx.moveTo(fishX + 60, fishY);
  ctx.lineTo(fishX + 74, fishY - 12);
  ctx.lineTo(fishX + 74, fishY + 12);
  ctx.closePath();
  ctx.stroke();

  // Footer Tagline
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MEOW & SMILE · SNAP BOOTH · 2026', width / 2, height - 70);
  ctx.restore();
}

// Master Render Function
export function renderPhotoboothFrame(canvas, photoImg, frameId, options = {}) {
  if (frameId === 'hollywood') {
    renderHollywoodFrame(canvas, photoImg);
  } else if (frameId === 'scrapbook') {
    renderScrapbookFrame(canvas, photoImg, options.colorTheme || 'cream');
  } else if (frameId === 'blackcat') {
    renderBlackCatFrame(canvas, photoImg);
  } else {
    renderHollywoodFrame(canvas, photoImg);
  }
}
