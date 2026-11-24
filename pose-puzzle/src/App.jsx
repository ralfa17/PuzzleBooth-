import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import {
  SnapBoothLogo,
  IconCamera,
  IconRefresh,
  PeaceHandIcon,
  OpenHandIcon,
  IconTimer,
  IconGrid3x3,
  IconGrid4x4,
  IconHome,
} from './components/icons/AppIcons';

import { CAMERA_FILTERS } from './constants/filters';
import TitleScreen from './components/TitleScreen';
import FilterBar from './components/FilterBar';
import PuzzleGrid from './components/PuzzleGrid';
import ResultCustomizer from './components/ResultCustomizer';

export default function App() {
  const videoRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const compositeCanvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const requestRef = useRef(null);
  const detectLoopRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  // MediaRecorder Refs
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordLoopRef = useRef(null);

  // State Game & Konfigurasi
  const [phase, setPhase] = useState('intro'); // intro | loading | camera | countdown | puzzle | solved
  const [selectedGameMode, setSelectedGameMode] = useState('single');
  const [countdownDuration, setCountdownDuration] = useState(3);
  const [countdown, setCountdown] = useState(3);
  const [gridSize, setGridSize] = useState(3); // 3x3 atau 4x4
  const [gestureStatus, setGestureStatus] = useState('Arahkan gestur tangan ke kamera');
  const [activeGesture, setActiveGesture] = useState(null); // 'peace' | 'five' | null
  const [isRecording, setIsRecording] = useState(false);

  // State Filter Kamera Real-Time
  const [selectedFilter, setSelectedFilter] = useState(CAMERA_FILTERS[0]);

  // State Puzzle, Hasil Foto & Video
  const [tiles, setTiles] = useState([]);
  const [tileImages, setTileImages] = useState([]);
  const [fullPhotoUrl, setFullPhotoUrl] = useState(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [moves, setMoves] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cursorPos, setCursorPos] = useState(null);
  const [dwellProgress, setDwellProgress] = useState(0);

  // Refs untuk sinkronisasi di dalam requestAnimationFrame & loop recorder
  const phaseRef = useRef(phase);
  const tilesRef = useRef(tiles);
  const tileImagesRef = useRef(tileImages);
  const selectedPosRef = useRef(selectedPos);
  const countdownRef = useRef(countdown);
  const countdownDurationRef = useRef(countdownDuration);
  const gridSizeRef = useRef(gridSize);
  const cursorPosRef = useRef(cursorPos);
  const isAnimatingRef = useRef(isAnimating);
  const selectedFilterRef = useRef(selectedFilter);

  const gestureHoldStartRef = useRef(null);
  const hoverStateRef = useRef({ pos: null, startTime: 0 });

  // Sinkronisasi state ke refs
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    tilesRef.current = tiles;
  }, [tiles]);

  useEffect(() => {
    tileImagesRef.current = tileImages;
  }, [tileImages]);

  useEffect(() => {
    selectedPosRef.current = selectedPos;
  }, [selectedPos]);

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  useEffect(() => {
    countdownDurationRef.current = countdownDuration;
  }, [countdownDuration]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  useEffect(() => {
    cursorPosRef.current = cursorPos;
  }, [cursorPos]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    selectedFilterRef.current = selectedFilter;
  }, [selectedFilter]);

  // Helper Cek Jarak Orthogonal 1 Petak
  const isAdjacentOrthogonal = useCallback((pos1, pos2, size = gridSize) => {
    if (pos1 === null || pos2 === null) return false;
    const row1 = Math.floor(pos1 / size);
    const col1 = pos1 % size;
    const row2 = Math.floor(pos2 / size);
    const col2 = pos2 % size;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  }, [gridSize]);

  // Stop MediaRecorder dengan jeda agar momen puzzle terpecahkan terekam
  const stopScreenRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== 'inactive'
        ) {
          mediaRecorderRef.current.stop();
        }
      }, 1200);
    }
  }, []);

  // Mulai Perekaman Gameplay Canvas Komposit 16:9
  const startScreenRecording = useCallback(() => {
    const compCanvas = compositeCanvasRef.current;
    if (!compCanvas) return;

    compCanvas.width = 1280;
    compCanvas.height = 720;
    const ctx = compCanvas.getContext('2d');
    recordedChunksRef.current = [];

    const drawCompositeFrame = () => {
      const currentPhase = phaseRef.current;
      const video = videoRef.current;
      const curFilter = selectedFilterRef.current;

      ctx.fillStyle = '#0C3859';
      ctx.fillRect(0, 0, compCanvas.width, compCanvas.height);

      if ((currentPhase === 'camera' || currentPhase === 'countdown') && video) {
        ctx.save();
        if (curFilter && curFilter.canvasFilter && curFilter.canvasFilter !== 'none') {
          ctx.filter = curFilter.canvasFilter;
        }
        ctx.translate(compCanvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, compCanvas.width, compCanvas.height);
        ctx.restore();

        if (currentPhase === 'countdown') {
          ctx.fillStyle = 'rgba(12, 56, 89, 0.45)';
          ctx.fillRect(0, 0, compCanvas.width, compCanvas.height);

          ctx.fillStyle = '#F2E9DB';
          ctx.font = 'bold 180px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            String(countdownRef.current),
            compCanvas.width / 2,
            compCanvas.height / 2
          );
        }
      } else if (currentPhase === 'puzzle' || currentPhase === 'solved') {
        const currentTiles = tilesRef.current;
        const images = tileImagesRef.current;
        const gSize = gridSizeRef.current;
        const tileW = compCanvas.width / gSize;
        const tileH = compCanvas.height / gSize;

        currentTiles.forEach((tile) => {
          const img = images[tile.id];
          if (img) {
            const col = tile.currentPos % gSize;
            const row = Math.floor(tile.currentPos / gSize);
            const pad = currentPhase === 'solved' ? 0 : 2;

            ctx.drawImage(
              img,
              col * tileW + pad,
              row * tileH + pad,
              tileW - pad * 2,
              tileH - pad * 2
            );

            if (selectedPosRef.current === tile.currentPos && currentPhase === 'puzzle') {
              ctx.strokeStyle = '#F2E9DB';
              ctx.lineWidth = 5;
              ctx.strokeRect(
                col * tileW + 4,
                row * tileH + 4,
                tileW - 8,
                tileH - 8
              );
            }
          }
        });

        // Gambar kursor jari di rekaman
        if (currentPhase === 'puzzle' && cursorPosRef.current) {
          ctx.beginPath();
          ctx.arc(
            cursorPosRef.current.x * compCanvas.width,
            cursorPosRef.current.y * compCanvas.height,
            15,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(195, 224, 244, 0.8)';
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#0C3859';
          ctx.stroke();
        }
      }

      // Badge REC Editorial Minimalis
      ctx.fillStyle = 'rgba(12, 56, 89, 0.85)';
      ctx.beginPath();
      ctx.roundRect(24, 24, 135, 34, 17);
      ctx.fill();
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(44, 41, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F2E9DB';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('REC 16:9', 58, 42);

      recordLoopRef.current = requestAnimationFrame(drawCompositeFrame);
    };

    drawCompositeFrame();

    try {
      const stream = compCanvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (recordLoopRef.current) cancelAnimationFrame(recordLoopRef.current);
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('MediaRecorder error:', err);
    }
  }, []);

  // 5. Jepret Frame 16:9 dengan Filter Terpilih & Potong Jadi Puzzle Solvable
  const captureAndSlice = useCallback(() => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas) return;

    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const videoRatio = video.videoWidth / video.videoHeight;
    const targetRatio = 16 / 9;
    let sx = 0,
      sy = 0,
      sWidth = video.videoWidth,
      sHeight = video.videoHeight;

    if (videoRatio > targetRatio) {
      sWidth = video.videoHeight * targetRatio;
      sx = (video.videoWidth - sWidth) / 2;
    } else {
      sHeight = video.videoWidth / targetRatio;
      sy = (video.videoHeight - sHeight) / 2;
    }

    ctx.save();
    const curFilter = selectedFilterRef.current;
    if (curFilter && curFilter.canvasFilter && curFilter.canvasFilter !== 'none') {
      ctx.filter = curFilter.canvasFilter;
    }

    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);
    ctx.restore();

    const fullPhoto = canvas.toDataURL('image/jpeg', 0.96);
    setFullPhotoUrl(fullPhoto);

    // Potong canvas 16:9 menjadi N x N bagian
    const currentGrid = gridSizeRef.current;
    const tileW = width / currentGrid;
    const tileH = height / currentGrid;
    const newTiles = [];
    const loadedImgs = [];

    for (let row = 0; row < currentGrid; row++) {
      for (let col = 0; col < currentGrid; col++) {
        const id = row * currentGrid + col;
        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = tileW;
        tileCanvas.height = tileH;
        const tileCtx = tileCanvas.getContext('2d');

        tileCtx.drawImage(
          canvas,
          col * tileW,
          row * tileH,
          tileW,
          tileH,
          0,
          0,
          tileW,
          tileH
        );

        const dataUrl = tileCanvas.toDataURL('image/jpeg', 0.92);
        const imgObj = new Image();
        imgObj.src = dataUrl;
        loadedImgs[id] = imgObj;

        newTiles.push({
          id,
          currentPos: id,
          imgUrl: dataUrl,
        });
      }
    }

    setTileImages(loadedImgs);

    // Acak puzzle dengan serangkaian langkah tukar tetangga orthogonal
    const totalTiles = currentGrid * currentGrid;
    const positions = Array.from({ length: totalTiles }, (_, i) => i);
    let focusPos = Math.floor(Math.random() * totalTiles);

    const shuffleSteps = currentGrid * 20;
    for (let i = 0; i < shuffleSteps; i++) {
      const neighbors = [];
      for (let p = 0; p < totalTiles; p++) {
        if (isAdjacentOrthogonal(focusPos, p, currentGrid)) {
          neighbors.push(p);
        }
      }
      const randomNeighbor =
        neighbors[Math.floor(Math.random() * neighbors.length)];
      const temp = positions[focusPos];
      positions[focusPos] = positions[randomNeighbor];
      positions[randomNeighbor] = temp;
      focusPos = randomNeighbor;
    }

    if (positions.every((pos, idx) => pos === idx)) {
      const temp = positions[0];
      positions[0] = positions[1];
      positions[1] = temp;
    }

    const shuffledTiles = newTiles.map((tile, idx) => ({
      ...tile,
      currentPos: positions[idx],
    }));

    setTiles(shuffledTiles);
    setMoves(0);
    setSelectedPos(null);
    setIsAnimating(false);
    setPhase('puzzle');
  }, [isAdjacentOrthogonal]);

  // Trigger Countdown dan Perekaman
  const triggerCountdownAndRecord = useCallback(() => {
    setRecordedVideoUrl(null);
    setFullPhotoUrl(null);
    startScreenRecording();

    setPhase('countdown');
    let current = countdownDurationRef.current;
    setCountdown(current);

    const interval = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
      } else {
        clearInterval(interval);
        captureAndSlice();
      }
    }, 1000);
  }, [startScreenRecording, captureAndSlice]);

  // Deteksi Gestur Peace atau 5 Jari (Return 'peace' | 'five' | null)
  const detectTriggerGesture = useCallback((landmarks) => {
    const indexUp = landmarks[8].y < landmarks[6].y;
    const middleUp = landmarks[12].y < landmarks[10].y;
    const ringUp = landmarks[16].y < landmarks[14].y;
    const pinkyUp = landmarks[20].y < landmarks[18].y;

    const isPeace = indexUp && middleUp && !ringUp && !pinkyUp;
    const isFive = indexUp && middleUp && ringUp && pinkyUp;

    if (isPeace) return 'peace';
    if (isFive) return 'five';
    return null;
  }, []);

  // 3. Loop Deteksi Gestur & Kursor Jari (Real-Time)
  const detectLoop = useCallback(() => {
    const video = videoRef.current;
    const landmarker = handLandmarkerRef.current;

    if (video && landmarker && video.readyState >= 2) {
      const nowMs = performance.now();
      if (nowMs > lastVideoTimeRef.current) {
        lastVideoTimeRef.current = nowMs;
        try {
          const results = landmarker.detectForVideo(video, nowMs);

          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];

            if (phaseRef.current === 'camera') {
              const detected = detectTriggerGesture(landmarks);
              if (detected) {
                setActiveGesture(detected);
                const gestureLabel =
                  detected === 'peace' ? 'Gestur Dua Jari' : 'Gestur Lima Jari';
                setGestureStatus(`${gestureLabel} terdeteksi, tahan sebentar...`);
                if (!gestureHoldStartRef.current) {
                  gestureHoldStartRef.current = nowMs;
                } else if (nowMs - gestureHoldStartRef.current > 750) {
                  gestureHoldStartRef.current = null;
                  triggerCountdownAndRecord();
                }
              } else {
                setActiveGesture(null);
                gestureHoldStartRef.current = null;
                setGestureStatus('Arahkan gestur dua jari atau lima jari ke kamera');
              }
            }

            if (phaseRef.current === 'puzzle') {
              const normX = Math.min(Math.max(1 - landmarks[8].x, 0), 1);
              const normY = Math.min(Math.max(landmarks[8].y, 0), 1);
              setCursorPos({ x: normX, y: normY });
            }
          } else {
            setActiveGesture(null);
            gestureHoldStartRef.current = null;
            if (phaseRef.current === 'camera') {
              setGestureStatus('Arahkan gestur tangan ke kamera');
            }
            setCursorPos(null);
            setDwellProgress(0);
          }
        } catch {
          // Abaikan frame drop sesaat
        }
      }
    }
    requestRef.current = requestAnimationFrame(() => {
      if (detectLoopRef.current) detectLoopRef.current();
    });
  }, [detectTriggerGesture, triggerCountdownAndRecord]);

  useEffect(() => {
    detectLoopRef.current = detectLoop;
  }, [detectLoop]);

  // 2. Akses Kamera 16:9 Widescreen
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: 16 / 9,
          facingMode: 'user',
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setPhase('camera');
          detectLoop();
        };
      }
    } catch (err) {
      console.error('Error akses kamera:', err);
      setGestureStatus('Izin kamera ditolak atau kamera tidak ditemukan.');
    }
  }, [detectLoop]);

  // 1. Inisialisasi MediaPipe HandLandmarker
  const initMediaPipeAndCamera = useCallback(async () => {
    setPhase('loading');
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      let landmarker;
      try {
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      } catch {
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      }

      handLandmarkerRef.current = landmarker;
      startCamera();
    } catch (err) {
      console.error('Gagal memuat MediaPipe:', err);
      setGestureStatus('Gagal memuat model AI. Kamera tetap dapat digunakan.');
      startCamera();
    }
  }, [startCamera]);

  useEffect(() => {
    const currentVideo = videoRef.current;
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (recordLoopRef.current) cancelAnimationFrame(recordLoopRef.current);
      if (currentVideo?.srcObject) {
        currentVideo.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartGame = (modeId) => {
    setSelectedGameMode(modeId);
    initMediaPipeAndCamera();
  };

  // 7. Mekanik Tukar Petak Orthogonal (1 Petak: Atas/Bawah/Kiri/Kanan) + Animasi Halus
  const handleTileClick = useCallback((targetPos) => {
    if (phaseRef.current !== 'puzzle' || isAnimatingRef.current) return;

    const currentSelected = selectedPosRef.current;

    if (currentSelected === null) {
      setSelectedPos(targetPos);
    } else if (currentSelected === targetPos) {
      setSelectedPos(null);
    } else if (isAdjacentOrthogonal(currentSelected, targetPos, gridSizeRef.current)) {
      setIsAnimating(true);
      isAnimatingRef.current = true;

      setTiles((prevTiles) => {
        const updated = prevTiles.map((t) => {
          if (t.currentPos === currentSelected) {
            return { ...t, currentPos: targetPos };
          }
          if (t.currentPos === targetPos) {
            return { ...t, currentPos: currentSelected };
          }
          return t;
        });

        const isSolved = updated.every((t) => t.currentPos === t.id);

        setTimeout(() => {
          setIsAnimating(false);
          isAnimatingRef.current = false;
          if (isSolved) {
            setPhase('solved');
            stopScreenRecording();
          }
        }, 260);

        return updated;
      });

      setMoves((m) => m + 1);
      setSelectedPos(null);
    } else {
      setSelectedPos(targetPos);
    }
  }, [isAdjacentOrthogonal, stopScreenRecording]);

  // 6. Logika Hover Kursor Jari di Atas Petak Puzzle (Dwell-Time 800ms)
  useEffect(() => {
    if (phase !== 'puzzle' || !cursorPos || isAnimating) {
      hoverStateRef.current = { pos: null, startTime: 0 };
      return;
    }

    const col = Math.floor(cursorPos.x * gridSize);
    const row = Math.floor(cursorPos.y * gridSize);

    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      const pos = row * gridSize + col;
      const now = performance.now();

      if (hoverStateRef.current.pos !== pos) {
        hoverStateRef.current = { pos, startTime: now };
      } else {
        const elapsed = now - hoverStateRef.current.startTime;
        const progress = Math.min(1, elapsed / 800);
        setDwellProgress(progress);

        if (elapsed >= 800) {
          handleTileClick(pos);
          hoverStateRef.current = { pos, startTime: now + 999999 };
          setDwellProgress(0);
        }
      }
    } else {
      hoverStateRef.current = { pos: null, startTime: 0 };
    }
  }, [cursorPos, phase, gridSize, isAnimating, handleTileClick]);

  const resetGame = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    setTiles([]);
    setSelectedPos(null);
    setMoves(0);
    setIsAnimating(false);
    setFullPhotoUrl(null);
    setRecordedVideoUrl(null);
    setPhase('camera');
  }, []);

  const handleReturnToIntro = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setTiles([]);
    setSelectedPos(null);
    setMoves(0);
    setIsAnimating(false);
    setFullPhotoUrl(null);
    setRecordedVideoUrl(null);
    setPhase('intro');
  }, []);

  return (
    <div className="min-h-screen bg-[#C3E0F4] text-[#0C3859] flex flex-col items-center justify-center p-3 sm:p-5 md:p-8 font-sans select-none antialiased">
      {/* 1. Fase 0: Title Screen (1-Layer Showcase Card) */}
      {phase === 'intro' && (
        <TitleScreen onStart={handleStartGame} />
      )}

      {/* 2. Fase Game: Loading, Camera, Countdown, Puzzle, Solved */}
      {phase !== 'intro' && (
        <div className="w-full max-w-5xl flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
          {/* Header Bar Kontrol Editorial */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-3 bg-[#0C3859] text-[#F2E9DB] px-4 sm:px-5 py-3 rounded-2xl border-2 border-[#0C3859] shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={handleReturnToIntro}
                title="Kembali ke Menu Utama"
                className="w-8 h-8 rounded-lg bg-[#F2E9DB]/10 hover:bg-[#F2E9DB] hover:text-[#0C3859] text-[#F2E9DB] flex items-center justify-center transition cursor-pointer"
              >
                <IconHome className="w-4 h-4" />
              </button>
              <SnapBoothLogo className="text-[#F2E9DB]" />
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F2E9DB]/20 text-[#F2E9DB] border border-[#F2E9DB]/30">
                {selectedGameMode === 'single' ? '1P SOLO' : selectedGameMode === 'coop' ? '2P CO-OP' : '2P BATTLE'}
              </span>
            </div>

            {/* Pengaturan Timer & Grid (Saat Mode Kamera) */}
            {(phase === 'camera' || phase === 'loading') && (
              <div className="flex items-center gap-2 text-xs">
                {/* Timer 3s / 5s */}
                <div className="bg-[#0C3859] border border-[#F2E9DB]/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                  <IconTimer className="w-3.5 h-3.5 text-[#C3E0F4]" />
                  <span className="text-[#F2E9DB]/70 font-semibold mr-1">Timer:</span>
                  {[3, 5].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setCountdownDuration(sec)}
                      className={`px-2 py-0.5 rounded font-black transition cursor-pointer ${
                        countdownDuration === sec
                          ? 'bg-[#F2E9DB] text-[#0C3859]'
                          : 'bg-transparent text-[#F2E9DB] hover:bg-[#F2E9DB]/10'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>

                {/* Grid 3x3 / 4x4 */}
                <div className="bg-[#0C3859] border border-[#F2E9DB]/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                  <span className="text-[#F2E9DB]/70 font-semibold mr-1">Grid:</span>
                  {[3, 4].map((size) => (
                    <button
                      key={size}
                      onClick={() => setGridSize(size)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded font-black transition cursor-pointer ${
                        gridSize === size
                          ? 'bg-[#F2E9DB] text-[#0C3859]'
                          : 'bg-transparent text-[#F2E9DB] hover:bg-[#F2E9DB]/10'
                      }`}
                    >
                      {size === 3 ? (
                        <IconGrid3x3 className="w-3 h-3" />
                      ) : (
                        <IconGrid4x4 className="w-3 h-3" />
                      )}
                      <span>{size}x{size}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Indikator REC */}
            {isRecording && (
              <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                REC 16:9
              </div>
            )}
          </div>

          {/* Area Utama 16:9 Widescreen */}
          <div className="relative w-full aspect-video bg-[#0C3859] rounded-2xl overflow-hidden border-2 border-[#0C3859] shadow-md">
            {/* Video Feed Kamera dengan Filter CSS Real-Time */}
            <video
              ref={videoRef}
              playsInline
              muted
              style={{ filter: selectedFilter.cssFilter }}
              className={`w-full h-full object-cover -scale-x-100 transition-opacity duration-300 ${
                phase === 'camera' || phase === 'countdown'
                  ? 'opacity-100'
                  : 'opacity-0 pointer-events-none absolute inset-0'
              }`}
            />

            {/* Canvas Tersembunyi */}
            <canvas ref={captureCanvasRef} className="hidden" />
            <canvas ref={compositeCanvasRef} className="hidden" />

            {/* Loading State */}
            {phase === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0C3859]/95 p-6 text-center z-20 text-[#F2E9DB]">
                <div className="w-10 h-10 border-3 border-[#F2E9DB] border-t-transparent rounded-full animate-spin mb-3" />
                <h3 className="text-base font-black tracking-wider uppercase">
                  Menyiapkan Kamera &amp; Sensor AI...
                </h3>
              </div>
            )}

            {/* Overlay Kontrol & Gestur di Mode Kamera */}
            {phase === 'camera' && (
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-[#0C3859]/95 via-[#0C3859]/70 to-transparent flex flex-col gap-2">
                {/* Pemilih Filter Minimalis */}
                <div className="bg-[#0C3859]/80 border border-[#F2E9DB]/20 rounded-xl p-1.5 backdrop-blur-xs">
                  <FilterBar
                    selectedFilter={selectedFilter}
                    onSelectFilter={setSelectedFilter}
                  />
                </div>

                {/* Status Gestur & Tombol Jepret Manual */}
                <div className="bg-[#0C3859] border border-[#F2E9DB]/30 rounded-xl px-4 py-2.5 flex items-center justify-between text-[#F2E9DB]">
                  {/* Indikator Ikon Gestur Tangan Flat Vector Custom */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {/* Ikon Dua Jari (Peace) */}
                      <div
                        className={`p-1.5 rounded-lg border transition-all ${
                          activeGesture === 'peace'
                            ? 'bg-[#C3E0F4] text-[#0C3859] border-[#0C3859] ring-2 ring-[#C3E0F4]'
                            : 'bg-[#F2E9DB]/10 text-[#F2E9DB] border-transparent'
                        }`}
                        title="Gestur Dua Jari (Peace)"
                      >
                        <PeaceHandIcon
                          className="w-5 h-5"
                          active={activeGesture === 'peace'}
                        />
                      </div>

                      {/* Ikon Lima Jari (Open Hand) */}
                      <div
                        className={`p-1.5 rounded-lg border transition-all ${
                          activeGesture === 'five'
                            ? 'bg-[#C3E0F4] text-[#0C3859] border-[#0C3859] ring-2 ring-[#C3E0F4]'
                            : 'bg-[#F2E9DB]/10 text-[#F2E9DB] border-transparent'
                        }`}
                        title="Gestur Lima Jari Terbuka"
                      >
                        <OpenHandIcon
                          className="w-5 h-5"
                          active={activeGesture === 'five'}
                        />
                      </div>
                    </div>

                    <span className="text-xs sm:text-sm font-semibold tracking-wide">
                      {gestureStatus}
                    </span>
                  </div>

                  <button
                    onClick={triggerCountdownAndRecord}
                    className="bg-[#F2E9DB] hover:bg-white text-[#0C3859] text-xs sm:text-sm font-black px-5 py-2 rounded-full flex items-center gap-2 border border-[#F2E9DB] transition shrink-0 cursor-pointer active:scale-95"
                  >
                    <IconCamera className="w-4 h-4" />
                    <span>Mulai &amp; Rekam</span>
                  </button>
                </div>
              </div>
            )}

            {/* Overlay Countdown Besar */}
            {phase === 'countdown' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0C3859]/50 backdrop-blur-[1px] text-[#F2E9DB]">
                <span className="text-8xl sm:text-9xl md:text-[140px] font-black leading-none drop-shadow-md">
                  {countdown}
                </span>
                <span className="mt-3 px-6 py-1.5 bg-[#F2E9DB] text-[#0C3859] rounded-full text-xs sm:text-sm font-black uppercase tracking-widest border border-[#0C3859]">
                  Siapkan Pose
                </span>
              </div>
            )}

            {/* Grid Puzzle (Dengan Animasi CSS Translate Halus & Anti-Bug) */}
            {phase === 'puzzle' && (
              <PuzzleGrid
                tiles={tiles}
                gridSize={gridSize}
                selectedPos={selectedPos}
                isAdjacentOrthogonal={isAdjacentOrthogonal}
                onTileClick={handleTileClick}
                cursorPos={cursorPos}
                dwellProgress={dwellProgress}
                isAnimating={isAnimating}
              />
            )}

            {/* Layar Kustomisasi Frame Photobooth saat Puzzle Selesai (Solved) */}
            {phase === 'solved' && (
              <ResultCustomizer
                fullPhotoUrl={fullPhotoUrl}
                recordedVideoUrl={recordedVideoUrl}
                moves={moves}
                onReset={resetGame}
              />
            )}
          </div>

          {/* Footer Info saat Menyusun Puzzle */}
          {phase === 'puzzle' && (
            <div className="w-full mt-3 flex items-center justify-between bg-[#0C3859] text-[#F2E9DB] border-2 border-[#0C3859] rounded-xl px-4 py-2.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#F2E9DB]/70 font-semibold">Langkah:</span>
                  <span className="font-black text-[#C3E0F4] text-sm px-2 py-0.5 rounded bg-black/20">
                    {moves}
                  </span>
                </div>
                <div className="hidden sm:block text-[#F2E9DB]/30">|</div>
                <p className="hidden sm:block text-[11px] text-[#F2E9DB]/80 font-medium">
                  Tukar petak hanya dengan 1 tetangga langsung di atas, bawah, kiri, atau kanan.
                </p>
              </div>
              <button
                onClick={resetGame}
                className="bg-[#F2E9DB]/10 hover:bg-[#F2E9DB] hover:text-[#0C3859] text-[#F2E9DB] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shrink-0 border border-[#F2E9DB]/30 text-xs font-bold cursor-pointer"
              >
                <IconRefresh className="w-3.5 h-3.5" />
                <span>Ulang</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
