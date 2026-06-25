/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BotanicalSpecimen, PipeDef, Petal } from './types';
import FlowerIcon from './components/FlowerIcon';

// 13 exquisite botanical specimens, with distinct natural tints, scientific names and hex accent colors
const SPECIMENS: BotanicalSpecimen[] = [
  { note: 'C', flower: 'Wild Rose', scientific: 'Rosa canina', bg: 'bg-[#faf2f3]', accent: '#d47a85', tint: 'rose' },
  { note: 'C#', flower: 'Lavender', scientific: 'Lavandula angustifolia', bg: 'bg-[#f4f2f7]', accent: '#8173a1', tint: 'lavender' },
  { note: 'D', flower: 'Dandelion', scientific: 'Taraxacum officinale', bg: 'bg-[#faf7eb]', accent: '#cca05a', tint: 'honey' },
  { note: 'D#', flower: 'Meadow Clover', scientific: 'Trifolium pratense', bg: 'bg-[#f2f6f1]', accent: '#6b7a67', tint: 'sage' },
  { note: 'E', flower: 'Sweet Violet', scientific: 'Viola odorata', bg: 'bg-[#f4f2f7]', accent: '#8173a1', tint: 'lavender' },
  { note: 'F', flower: 'Wild Tulip', scientific: 'Tulipa sylvestris', bg: 'bg-[#faf2f3]', accent: '#d47a85', tint: 'rose' },
  { note: 'F#', flower: 'Harebell', scientific: 'Campanula rotundifolia', bg: 'bg-[#f4f2f7]', accent: '#8173a1', tint: 'lavender' },
  { note: 'G', flower: 'Martagon Lily', scientific: 'Lilium martagon', bg: 'bg-[#faf7eb]', accent: '#cca05a', tint: 'honey' },
  { note: 'G#', flower: 'Primrose', scientific: 'Primula vulgaris', bg: 'bg-[#faf7eb]', accent: '#cca05a', tint: 'honey' },
  { note: 'A', flower: 'Pink Cosmos', scientific: 'Cosmos bipinnatus', bg: 'bg-[#faf2f3]', accent: '#d47a85', tint: 'rose' },
  { note: 'A#', flower: 'Calendula', scientific: 'Calendula officinalis', bg: 'bg-[#faf7eb]', accent: '#cca05a', tint: 'honey' },
  { note: 'B', flower: 'Forget-Me-Not', scientific: 'Myosotis sylvatica', bg: 'bg-[#f4f2f7]', accent: '#8173a1', tint: 'lavender' },
  { note: 'C_high', flower: 'Cherry Blossom', scientific: 'Prunus serrulata', bg: 'bg-[#faf2f3]', accent: '#d47a85', tint: 'rose' }
];

const pipeDefs: PipeDef[] = [
  { type: 'white', semitone: 0, specimen: SPECIMENS[0], keyBind: 'A' },
  { type: 'black', semitone: 1, specimen: SPECIMENS[1], keyBind: 'W' },
  { type: 'white', semitone: 2, specimen: SPECIMENS[2], keyBind: 'S' },
  { type: 'black', semitone: 3, specimen: SPECIMENS[3], keyBind: 'E' },
  { type: 'white', semitone: 4, specimen: SPECIMENS[4], keyBind: 'D' },
  { type: 'white', semitone: 5, specimen: SPECIMENS[5], keyBind: 'F' },
  { type: 'black', semitone: 6, specimen: SPECIMENS[6], keyBind: 'T' },
  { type: 'white', semitone: 7, specimen: SPECIMENS[7], keyBind: 'G' },
  { type: 'black', semitone: 8, specimen: SPECIMENS[8], keyBind: 'Y' },
  { type: 'white', semitone: 9, specimen: SPECIMENS[9], keyBind: 'H' },
  { type: 'black', semitone: 10, specimen: SPECIMENS[10], keyBind: 'U' },
  { type: 'white', semitone: 11, specimen: SPECIMENS[11], keyBind: 'J' },
  { type: 'white', semitone: 12, specimen: SPECIMENS[12], keyBind: 'K' }
];

export default function App() {
  const [octave, setOctave] = useState<number>(4);
  const [activePipes, setActivePipes] = useState<Record<number, boolean>>({});
  const [currentPipedReadout, setCurrentPipedReadout] = useState<string>('—');
  const [hoveredPipeIdx, setHoveredPipeIdx] = useState<number | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'off' | 'starting' | 'live' | 'blocked'>('off');
  const [isCameraStarted, setIsCameraStarted] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, isVisible: false, isHovered: false });
  const [multiCursors, setMultiCursors] = useState<{
    id: number;
    name: string;
    x: number;
    y: number;
    isPinching: boolean;
    color: string;
    matchedIdx: number;
  }[]>([]);
  const [hoveredPipeIdxs, setHoveredPipeIdxs] = useState<Record<number, boolean>>({});

  // Refs for tracking elements and background states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageWrapRef = useRef<HTMLDivElement | null>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeVoicesRef = useRef<Record<number, any>>({});
  const petalsRef = useRef<Petal[]>([]);
  
  // Hand tracking refs to preserve values in the out-of-band MediaPipe thread
  const octaveRef = useRef<number>(4);
  const activePipesRef = useRef<Record<number, boolean>>({});
  const currentPipeIdxRef = useRef<number | null>(null);
  const cameraFingersRef = useRef<Record<number, number | null>>({
    8: null,
    12: null,
    16: null,
    20: null
  });
  const isPinchingRef = useRef<boolean>(false);
  const cameraInstanceRef = useRef<any>(null);
  const handsInstanceRef = useRef<any>(null);

  // Sync state with refs for out-of-band callback access
  useEffect(() => { octaveRef.current = octave; }, [octave]);
  useEffect(() => { activePipesRef.current = activePipes; }, [activePipes]);

  // Handle page-level canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial resize trigger
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Keyboard binding logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const char = e.key.toUpperCase();
      const pipeIdx = pipeDefs.findIndex(p => p.keyBind === char);
      if (pipeIdx !== -1) {
        triggerNoteOn(pipeIdx);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      const pipeIdx = pipeDefs.findIndex(p => p.keyBind === char);
      if (pipeIdx !== -1) {
        triggerNoteOff(pipeIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Particle System render tick
  useEffect(() => {
    let animId: number;
    const tickFx = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(tickFx);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(tickFx);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update petal particles
      petalsRef.current.forEach(p => {
        // Apply physics
        p.vy += 0.045; // Soft natural gravity
        p.x += p.vx + Math.sin(p.swayTime) * 0.35; // Swaying wind drift
        p.y += p.vy;
        p.angle += p.spinSpeed;
        p.swayTime += p.swaySpeed;
        p.life -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        if (p.shape === 'oval') {
          // Draw elegant oval petal
          const rX = Math.max(0, p.width * p.life);
          const rY = Math.max(0, p.height * p.life);
          ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
        } else {
          // Draw soft curved organic leaf shape
          const w = Math.max(0, p.width * p.life);
          const h = Math.max(0, p.height * p.life);
          ctx.moveTo(-w / 2, -h / 2);
          ctx.quadraticCurveTo(0, -h, w / 2, -h / 2);
          ctx.quadraticCurveTo(w, 0, w / 2, h / 2);
          ctx.quadraticCurveTo(0, h, -w / 2, h / 2);
          ctx.quadraticCurveTo(-w, 0, -w / 2, -h / 2);
        }
        ctx.fill();
        ctx.restore();
      });

      // Filter out dead particles
      petalsRef.current = petalsRef.current.filter(p => p.life > 0);

      animId = requestAnimationFrame(tickFx);
    };

    tickFx();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Web Audio frequency calculator
  const noteFreq = (semitoneFromC4: number): number => {
    const midi = 60 + semitoneFromC4;
    return 440 * Math.pow(2, (midi - 69) / 12);
  };

  // Get musical note name representation
  const noteLabel = (semitone: number): string => {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'];
    const index = ((semitone % 12) + 12) % 12;
    const offsetOctave = octaveRef.current + Math.floor(semitone / 12);
    return names[index] + offsetOctave;
  };

  // Sound Engine - Play Note
  const triggerNoteOn = (idx: number) => {
    if (activeVoicesRef.current[idx]) return; // Already sounding

    // Initialize/resume Audio Context
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    const audioCtx = audioCtxRef.current;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const def = pipeDefs[idx];
    const semitoneFromC4 = def.semitone + (octaveRef.current - 4) * 12;
    const freq = noteFreq(semitoneFromC4);
    const now = audioCtx.currentTime;

    // Master warm volume envelope
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.012); // Rapid, snap attack without clicking
    gainNode.gain.exponentialRampToValueAtTime(0.09, now + 0.45); // Warm woodwind decay

    // High Q lowpass filter to emulate wood soundboard resonance
    const filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 1700;
    filterNode.Q.value = 1.3;

    // Osc 1: Warm physical body (triangle)
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = freq;

    // Osc 2: Fundamental shine octave (sine)
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    const osc2Gain = audioCtx.createGain();
    osc2Gain.gain.value = 0.14;

    // Osc 3: Sharp toy-piano mechanical clink (sine, extremely rapid decay)
    const osc3 = audioCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = freq * 4.01; // Slightly detuned high mechanical harmonic
    const osc3Gain = audioCtx.createGain();
    osc3Gain.gain.setValueAtTime(0.18, now);
    osc3Gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075); // Quick acoustic chime strike

    // Route audio nodes
    osc1.connect(filterNode);
    
    osc2.connect(osc2Gain);
    osc2Gain.connect(filterNode);
    
    osc3.connect(osc3Gain);
    osc3Gain.connect(filterNode);
    
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start synths
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    activeVoicesRef.current[idx] = {
      osc1,
      osc2,
      osc3,
      gain: gainNode,
      startedAt: now
    };

    setActivePipes(prev => ({ ...prev, [idx]: true }));
    setCurrentPipedReadout(noteLabel(def.semitone));
    spawnPetalFX(idx);
  };

  // Sound Engine - Stop Note
  const triggerNoteOff = (idx: number) => {
    const voice = activeVoicesRef.current[idx];
    if (!voice) return;

    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const releaseDuration = 0.35; // Gentle, lingering bell ring-out

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + releaseDuration);

    voice.osc1.stop(now + releaseDuration + 0.02);
    voice.osc2.stop(now + releaseDuration + 0.02);
    voice.osc3.stop(now + releaseDuration + 0.02);

    delete activeVoicesRef.current[idx];
    setActivePipes(prev => ({ ...prev, [idx]: false }));
  };

  // Particle Emitter logic
  const spawnPetalFX = (idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Map 1D column division to absolute canvas x coordinates
    const colWidthFrac = 1 / pipeDefs.length;
    const xFrac = (idx + 0.5) * colWidthFrac;
    const x = xFrac * canvas.width;
    const y = canvas.height * 0.72; // Spawn near the card center line

    const petalPalettes = [
      'rgba(212, 122, 133, 0.65)', // rose gold
      'rgba(138, 154, 134, 0.65)', // moss sage
      'rgba(158, 152, 176, 0.65)', // antique violet
      'rgba(224, 181, 117, 0.65)'  // field honey
    ];

    const newPetals: Petal[] = Array.from({ length: 14 }).map(() => {
      const angle = Math.PI + Math.random() * Math.PI; // Expand upwards in a beautiful fan spread
      const speed = 1.3 + Math.random() * 3.2;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        size: 3.5 + Math.random() * 5.0,
        width: 6.0 + Math.random() * 6.0,
        height: 4.5 + Math.random() * 4.5,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.08,
        swayTime: Math.random() * 100,
        swaySpeed: 0.02 + Math.random() * 0.04,
        color: petalPalettes[Math.floor(Math.random() * petalPalettes.length)],
        shape: Math.random() > 0.6 ? 'oval' : 'rectangle',
        life: 1.0,
        decay: 0.01 + Math.random() * 0.012
      };
    });

    petalsRef.current.push(...newPetals);
  };

  // Helper calculation for landmark distance (pinch thresholding)
  const landmarkDistance = (a: any, b: any) => {
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  // Enable Camera & Start MediaPipe Hands tracking
  const handleEnableCamera = async () => {
    // Force Audio Context setup to comply with browser autoplay constraints
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    setCameraStatus('starting');
    setIsCameraStarted(true);

    try {
      const HandsClass = (window as any).Hands;
      const CameraClass = (window as any).Camera;

      if (!HandsClass || !CameraClass) {
        throw new Error("Tracking engines are still loading. Please wait a moment.");
      }

      // Initialize MediaPipe Hands
      const hands = new HandsClass({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.6
      });

      hands.onResults((results: any) => {
        const stageWrap = stageWrapRef.current;
        if (!stageWrap) return;

        // If no hand is detected, release current played nodes
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
          setCursorPos(prev => ({ ...prev, isVisible: false }));
          setMultiCursors([]);
          setHoveredPipeIdxs({});
          setIsPinching(false);
          isPinchingRef.current = false;
          setHoveredPipeIdx(null);
          
          Object.keys(cameraFingersRef.current).forEach((fIdStr) => {
            const fId = parseInt(fIdStr, 10);
            const activeKey = cameraFingersRef.current[fId];
            if (activeKey !== null) {
              triggerNoteOff(activeKey);
              cameraFingersRef.current[fId] = null;
            }
          });
          
          if (currentPipeIdxRef.current !== null) {
            triggerNoteOff(currentPipeIdxRef.current);
            currentPipeIdxRef.current = null;
          }
          setCurrentPipedReadout('—');
          return;
        }

        // Get single tracking hand
        const lm = results.multiHandLandmarks[0];
        const thumbTip = lm[4]; // Thumb tip is the common pinch anchor for other fingers

        const rect = stageWrap.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        // Fetch actual camera video resolutions to dynamically calibrate alignment
        const videoElement = videoRef.current;
        const videoWidth = videoElement && videoElement.videoWidth ? videoElement.videoWidth : 640;
        const videoHeight = videoElement && videoElement.videoHeight ? videoElement.videoHeight : 480;

        // Calculate scale factor and offsets to perfectly reverse CSS object-cover scaling
        const scale = Math.max(containerWidth / videoWidth, containerHeight / videoHeight);

        // Grid boundaries for key columns
        const isMd = containerWidth >= 768;
        const P = isMd ? 16 : 8;
        const G = isMd ? 12 : 6;
        const N = pipeDefs.length;
        const usableWidth = containerWidth - 2 * P;
        const totalGaps = (N - 1) * G;
        const totalColumnsWidth = Math.max(0, usableWidth - totalGaps);
        const colWidth = totalColumnsWidth / N;

        const fingerDefinitions = [
          { id: 8, name: 'Index', color: '#C98B8B' },
          { id: 12, name: 'Middle', color: '#8A9A86' },
          { id: 16, name: 'Ring', color: '#9E98B0' },
          { id: 20, name: 'Pinky', color: '#cca05a' },
        ];

        const updatedCursors: typeof multiCursors = [];
        const updatedHoveredIdxs: Record<number, boolean> = {};
        let anyPinchActive = false;
        const notesToPlayLabels: string[] = [];

        fingerDefinitions.forEach((finger) => {
          const tip = lm[finger.id];
          if (!tip) return;

          // Mirror horizontal x visually because front webcam stream is mirrored
          const mirroredX = 1 - tip.x;
          const y = tip.y;

          // Convert to absolute coordinates on stage
          const absoluteX = (mirroredX - 0.5) * (videoWidth * scale) + containerWidth / 2;
          const absoluteY = (y - 0.5) * (videoHeight * scale) + containerHeight / 2;

          // Calculate mapped key column index from the visual screen position
          const x_rel = absoluteX - P;
          let matchedIdx = 0;
          if (x_rel < 0) {
            matchedIdx = 0;
          } else {
            matchedIdx = Math.floor(x_rel / (colWidth + G));
          }
          matchedIdx = Math.max(0, Math.min(N - 1, matchedIdx));

          // Set hovered key for this finger
          updatedHoveredIdxs[matchedIdx] = true;

          // Detect pinching with thumb
          const pinchDist = landmarkDistance(tip, thumbTip);
          const isFingerPinching = pinchDist < 0.055; // calibrated gap threshold
          if (isFingerPinching) {
            anyPinchActive = true;
            notesToPlayLabels.push(noteLabel(pipeDefs[matchedIdx].semitone));
          }

          // Add to cursor list
          updatedCursors.push({
            id: finger.id,
            name: finger.name,
            x: absoluteX,
            y: absoluteY,
            isPinching: isFingerPinching,
            color: finger.color,
            matchedIdx
          });

          // State machine for sound triggering on this specific finger
          const prevActiveKeyIdx = cameraFingersRef.current[finger.id];

          if (isFingerPinching) {
            if (prevActiveKeyIdx !== matchedIdx) {
              // Note shifted or started pinch
              if (prevActiveKeyIdx !== null) {
                // If no other finger is currently pinching this specific key, turn it off
                const keyUsedByOther = Object.entries(cameraFingersRef.current).some(([fIdStr, kIdx]) => {
                  return parseInt(fIdStr, 10) !== finger.id && kIdx === prevActiveKeyIdx;
                });
                if (!keyUsedByOther) {
                  triggerNoteOff(prevActiveKeyIdx);
                }
              }
              // Strike new key
              triggerNoteOn(matchedIdx);
              cameraFingersRef.current[finger.id] = matchedIdx;
            }
          } else {
            // Releasing pinch
            if (prevActiveKeyIdx !== null) {
              const keyUsedByOther = Object.entries(cameraFingersRef.current).some(([fIdStr, kIdx]) => {
                return parseInt(fIdStr, 10) !== finger.id && kIdx === prevActiveKeyIdx;
              });
              if (!keyUsedByOther) {
                triggerNoteOff(prevActiveKeyIdx);
              }
              cameraFingersRef.current[finger.id] = null;
            }
          }
        });

        setMultiCursors(updatedCursors);
        setHoveredPipeIdxs(updatedHoveredIdxs);
        setIsPinching(anyPinchActive);
        isPinchingRef.current = anyPinchActive;

        // Set the primary hovered index to the first finger (Index) for legacy single indicators, or the first active one
        if (updatedCursors.length > 0) {
          setHoveredPipeIdx(updatedCursors[0].matchedIdx);
        }

        // Set the HUD note label
        if (notesToPlayLabels.length > 0) {
          // Join active notes as a chord, e.g. "C4 + E4"
          const uniqueNotes = Array.from(new Set(notesToPlayLabels));
          setCurrentPipedReadout(uniqueNotes.join(' + '));
        } else if (updatedCursors.length > 0) {
          // Show the note of the hovered index finger
          setCurrentPipedReadout(noteLabel(pipeDefs[updatedCursors[0].matchedIdx].semitone));
        } else {
          setCurrentPipedReadout('—');
        }
      });

      handsInstanceRef.current = hands;

      // Boot camera element stream
      if (videoRef.current) {
        const camera = new CameraClass(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        await camera.start();
        cameraInstanceRef.current = camera;
        setCameraStatus('live');
      }

    } catch (err: any) {
      console.error(err);
      setCameraStatus('blocked');
      setIsCameraStarted(false);
    }
  };

  // Mouse interaction triggers
  const handleStageMouseMove = (e: React.MouseEvent) => {
    // Mouse tracking disabled if hand tracking is actively controlling the cursor
    if (cameraStatus === 'live' && cursorPos.isVisible) return;

    const stageWrap = stageWrapRef.current;
    if (!stageWrap) return;

    const rect = stageWrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCursorPos({
      x,
      y,
      isVisible: true,
      isHovered: true
    });
  };

  const handleStageMouseLeave = () => {
    if (cameraStatus === 'live' && cursorPos.isVisible) return;
    setCursorPos(prev => ({ ...prev, isVisible: false, isHovered: false }));
    setIsPinching(false);
  };

  const handleKeyMouseDown = (idx: number) => {
    setIsPinching(true);
    triggerNoteOn(idx);
  };

  const handleKeyMouseUp = (idx: number) => {
    setIsPinching(false);
    triggerNoteOff(idx);
  };

  return (
    <div id="app" className="h-screen w-screen flex flex-col justify-between overflow-hidden botanic-paper font-sans text-stone-800 select-none paper-texture">
      
      {/* Decorative Botanical Corner SVGs (hand-drawn line-art look) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-Left Corner Rosebuds */}
        <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-36 md:h-36 text-[#6b7a67] opacity-40 absolute top-0 left-0">
          <path d="M0 0 Q45 15 85 45 Q45 60 0 0" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M22 8 Q27 0 32 5 Q27 11 22 8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <path d="M38 18 Q46 12 48 20 Q41 24 38 18" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <path d="M52 28 Q62 26 61 34 Q53 35 52 28" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="41" cy="13" r="3" fill="#C98B8B" />
          <circle cx="55" cy="23" r="2.5" fill="#C98B8B" />
        </svg>

        {/* Top-Right Corner Hanging Bells */}
        <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-36 md:h-36 text-[#6b7a67] opacity-40 absolute top-0 right-0">
          <path d="M120 0 Q75 15 35 45 Q75 60 120 0" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M98 8 Q93 0 88 5 Q93 11 98 8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <path d="M82 18 Q74 12 72 20 Q79 24 82 18" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <path d="M68 28 Q58 26 59 34 Q67 35 68 28" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="79" cy="13" r="2.5" fill="#C98B8B" />
          <circle cx="65" cy="23" r="3" fill="#C98B8B" />
        </svg>

        {/* Bottom-Left Corner Fern & Dandelions */}
        <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-36 md:h-36 text-[#6b7a67] opacity-40 absolute bottom-0 left-0">
          <path d="M0 120 Q45 105 85 75 Q45 60 0 120" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M22 112 Q27 120 32 115 Q27 109 22 112" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <path d="M38 102 Q46 108 48 100 Q41 96 38 102" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <path d="M52 92 Q62 94 61 86 Q53 85 52 92" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="41" cy="107" r="2.5" fill="#D4AF37" />
          <circle cx="55" cy="97" r="3" fill="#D4AF37" />
        </svg>

        {/* Bottom-Right Corner Fern & Lavender */}
        <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-36 md:h-36 text-[#6b7a67] opacity-40 absolute bottom-0 right-0">
          <path d="M120 120 Q75 105 35 75 Q75 60 120 120" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M98 112 Q93 120 88 115 Q93 109 98 112" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <path d="M82 102 Q74 108 72 100 Q79 96 82 102" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <path d="M68 92 Q58 94 59 86 Q67 85 68 92" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="79" cy="107" r="3" fill="#C98B8B" />
          <circle cx="65" cy="97" r="2.5" fill="#C98B8B" />
        </svg>

        {/* Drifting Background Leaves */}
        <span className="absolute leaf-bg-1 top-[10%] left-[-8%] text-[#6b7a67]">
          <svg width="45" height="24" viewBox="0 0 45 24" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.1">
            <path d="M0 12 Q22.5 0 45 12 Q22.5 24 0 12 Z" />
          </svg>
        </span>
        <span className="absolute leaf-bg-2 top-[24%] left-[-15%] text-[#6b7a67]">
          <svg width="35" height="18" viewBox="0 0 35 18" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.08">
            <path d="M0 9 Q17.5 0 35 9 Q17.5 18 0 9 Z" />
          </svg>
        </span>
        <span className="absolute leaf-bg-3 top-[6%] left-[-22%] text-[#6b7a67]">
          <svg width="55" height="28" viewBox="0 0 55 28" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.12">
            <path d="M0 14 Q27.5 0 55 14 Q27.5 28 0 14 Z" />
          </svg>
        </span>
      </div>

      {/* Header Panel */}
      <header className="relative z-20 px-6 pt-8 pb-3 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 pointer-events-none">
        <div className="title-block text-center md:text-left max-w-md">
          <h1 className="text-4xl md:text-5xl serif-italic text-stone-800 tracking-tight flex items-center justify-center md:justify-start gap-3">
            <span className="not-italic text-2xl md:text-3xl filter saturate-[0.85]">🌿</span>
            Air <span className="text-rose-700 font-serif font-bold">Piano</span>
          </h1>
          <p className="text-xs md:text-sm serif-italic text-stone-500 mt-2 uppercase tracking-widest">
            Pressed Botanical Specimen • No. 0422
          </p>
        </div>

        {/* Live HUD Status Card */}
        <div className="status text-center md:text-right space-y-1 bg-white/60 border border-[#D9D2C5] px-4 py-2.5 rounded-xl shadow-sm backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center justify-center md:justify-end gap-3">
            <span className="typewriter text-xs text-stone-400 uppercase">
              STATUS: {cameraStatus === 'live' ? 'OPERATIONAL' : cameraStatus === 'starting' ? 'STARTING' : cameraStatus === 'blocked' ? 'RESTRICTED' : 'OFFLINE'}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full ${cameraStatus === 'live' ? 'bg-rose-400 animate-pulse' : 'bg-stone-300'}`}></div>
          </div>
          <div className="text-xl md:text-2xl serif-italic text-stone-700">
            Note: <span className="text-rose-700 font-bold">{currentPipedReadout}</span>
          </div>
        </div>
      </header>

      {/* Main Mounting Area (Stage) */}
      <main className="relative flex-1 mx-4 md:mx-12 mb-6 bg-stone-100/40 rounded-sm border border-stone-200 shadow-inner overflow-hidden z-10">
        <div 
          ref={stageWrapRef} 
          className="relative w-full h-full cursor-none"
          onMouseMove={handleStageMouseMove}
          onMouseLeave={handleStageMouseLeave}
        >
          {/* Live webcam feed backplane */}
          <video 
            ref={videoRef} 
            id="video" 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-700 pointer-events-none"
            style={{ opacity: cameraStatus === 'live' ? 0.16 : 0 }}
          />

          {/* Optical sensor active backdrop title when camera is live */}
          {cameraStatus === 'live' && (
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
              <div className="text-stone-300 text-3xl md:text-6xl opacity-20 serif-italic tracking-wider select-none">OPTICAL SENSOR ACTIVE</div>
            </div>
          )}

          {/* Falling Flower Petals Overlay */}
          <canvas ref={canvasRef} id="fx" className="absolute inset-0 w-full h-full z-20 pointer-events-none" />

          {/* Antique Compass Rose & Crosshair Cursor */}
          {cameraStatus === 'live' ? (
            multiCursors.map((cursor) => (
              <div 
                key={cursor.id} 
                className="absolute pointer-events-none z-40 transition-all duration-75 flex flex-col items-center justify-center"
                style={{
                  left: `${cursor.x}px`,
                  top: `${cursor.y}px`,
                  transform: `translate(-50%, -50%) ${cursor.isPinching ? 'scale(0.85)' : 'scale(1)'}`
                }}
              >
                {/* Compass circle / ring border */}
                <div 
                  className="w-8 h-8 border rounded-full flex items-center justify-center relative bg-white/10 backdrop-blur-[0.5px]"
                  style={{ borderColor: cursor.color }}
                >
                  {/* Center dot */}
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cursor.color }} />
                  {/* Crosshair lines */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px]" style={{ backgroundColor: `${cursor.color}40` }} />
                  <div className="absolute left-0 right-0 top-1/2 h-[1px]" style={{ backgroundColor: `${cursor.color}40` }} />
                  {/* Micro compass alignment glow */}
                  {cursor.isPinching && (
                    <div className="absolute inset-0 border rounded-full animate-ping opacity-45" style={{ borderColor: cursor.color }} />
                  )}
                </div>
                
                {/* Floating finger name & note readout */}
                <div 
                  className="absolute top-9 whitespace-nowrap typewriter text-[9px] bg-white/90 border px-1.5 py-0.5 rounded shadow-sm font-bold flex items-center gap-1"
                  style={{ color: cursor.color, borderColor: '#D9D2C5' }}
                >
                  <span>{cursor.name.toUpperCase()}</span>
                  <span className="w-1 h-1 rounded-full bg-stone-300" />
                  <span>{noteLabel(pipeDefs[cursor.matchedIdx].semitone)}</span>
                </div>
              </div>
            ))
          ) : (
            cursorPos.isVisible && (
              <div 
                id="handDot" 
                className="absolute pointer-events-none z-40 transition-all duration-75 flex flex-col items-center justify-center"
                style={{
                  left: `${cursorPos.x}px`,
                  top: `${cursorPos.y}px`,
                  transform: `translate(-50%, -50%) ${isPinching ? 'scale(0.85)' : 'scale(1)'}`
                }}
              >
                {/* Compass circle / ring border */}
                <div className="w-10 h-10 border border-[#C98B8B] rounded-full flex items-center justify-center relative bg-white/10 backdrop-blur-[0.5px]">
                  {/* Center dot */}
                  <div className="w-1 h-1 bg-[#C98B8B] rounded-full" />
                  {/* Crosshair lines */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#C98B8B]/30" />
                  <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#C98B8B]/30" />
                  {/* Micro compass alignment glow */}
                  {isPinching && (
                    <div className="absolute inset-0 border border-rose-400 rounded-full animate-ping opacity-40" />
                  )}
                </div>
                
                {/* Floating index readout */}
                <div className="absolute top-11 whitespace-nowrap typewriter text-[10px] text-rose-800 bg-white/90 border border-[#D9D2C5] px-2.5 py-1 rounded shadow-md font-bold">
                  {isPinching 
                    ? `PLAY: ${noteLabel(pipeDefs[hoveredPipeIdx ?? 0].semitone)}` 
                    : hoveredPipeIdx !== null 
                      ? `HOVER: ${noteLabel(pipeDefs[hoveredPipeIdx].semitone)}` 
                      : 'SEARCHING...'
                  }
                </div>
              </div>
            )
          )}
 
           {/* 13 Botanical Specimen Card Columns */}
           <div className="absolute inset-0 flex items-end p-2 md:p-4 gap-1.5 md:gap-3 z-10 pointer-events-none">
             {pipeDefs.map((def, idx) => {
               const isActive = activePipes[idx] || false;
               const isBlack = def.type === 'black';
               const isHoveredKey = hoveredPipeIdx === idx || (cameraStatus === 'live' && hoveredPipeIdxs[idx]) || false;
               
               return (
                 <div
                   key={idx}
                   className="relative flex-1 h-full flex flex-col justify-end items-center pointer-events-auto group min-w-0"
                   style={{
                     transform: isActive 
                       ? 'translateY(-12px)' 
                       : isHoveredKey 
                         ? 'translateY(-6px)' 
                         : 'translateY(0)',
                     transition: 'transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.15)'
                   }}
                   onMouseDown={() => handleKeyMouseDown(idx)}
                   onMouseUp={() => handleKeyMouseUp(idx)}
                   onMouseLeave={() => {
                     triggerNoteOff(idx);
                     setHoveredPipeIdx(null);
                   }}
                   onMouseEnter={() => {
                     if (cameraStatus !== 'live') {
                       setHoveredPipeIdx(idx);
                     }
                   }}
                   onTouchStart={(e) => {
                     e.preventDefault();
                     handleKeyMouseDown(idx);
                   }}
                   onTouchEnd={() => {
                     handleKeyMouseUp(idx);
                     setHoveredPipeIdx(null);
                   }}
                 >
                   {/* Specimen Card Body */}
                   <div 
                     className={`specimen-card rounded-t-lg flex flex-col justify-between items-center select-none transition-colors duration-200
                       ${isBlack 
                         ? 'w-[72%] h-[72%] border-stone-950 shadow-md text-stone-100 ' + (isHoveredKey ? 'bg-stone-700 border-stone-600' : 'bg-stone-800') 
                         : 'w-[90%] h-[85%] border-[#D9D2C5] text-stone-800 ' + (isHoveredKey ? 'bg-rose-50/50 border-rose-300 shadow-sm' : 'bg-white')
                       } 
                       ${isActive ? 'active-key' : ''}`}
                    style={{
                      borderWidth: '1px'
                    }}
                  >
                    {/* Inner Dashed Frame */}
                    <div className="specimen-card-inner rounded-md">
                      {/* Top metadata indexing */}
                      <div className={`flex justify-between items-center w-full px-1.5 typewriter text-[9px] ${isBlack ? 'text-stone-400 opacity-85' : 'text-stone-400 opacity-60'}`}>
                        <span>{isBlack ? 'CHROMATIC' : 'DIATONIC'}</span>
                        <span className={`border px-1 rounded-sm ${isBlack ? 'border-stone-600' : 'border-[#736555]/30'}`}>{def.keyBind}</span>
                      </div>

                      {/* Blooming flower centerpiece */}
                      <div className="flex-1 flex items-center justify-center py-1 md:py-2 min-h-0 w-full">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 max-w-full max-h-full flex items-center justify-center">
                          <FlowerIcon note={def.specimen.note} active={isActive} accent={def.specimen.accent} />
                        </div>
                      </div>

                      {/* Bottom classification labels */}
                      <div className="w-full text-center px-1">
                        <div className={`serif-italic font-semibold text-[10px] md:text-xs truncate ${isBlack ? 'text-stone-300' : 'text-stone-800'}`}>
                          {def.specimen.scientific}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-0.5">
                          <span className={`serif-italic text-xs font-bold ${isBlack ? 'text-rose-400' : 'text-rose-700'}`}>
                            {noteLabel(def.semitone)}
                          </span>
                          <span className={`w-1 h-1 rounded-full ${isBlack ? 'bg-stone-500' : 'bg-[#826e55]/35'}`} />
                          <span className={`text-[9px] md:text-[10px] font-bold tracking-tight truncate max-w-[48px] md:max-w-[70px] ${isBlack ? 'text-stone-400' : 'text-stone-600'}`}>
                            {def.specimen.flower}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Antique Welcome & Camera Enable Dialog Overlay */}
          <AnimatePresence>
            {!isCameraStarted && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 text-center bg-gradient-to-br from-[#f8f6ee]/98 to-[#f0ebde]/98 px-8 py-10"
              >
                {/* Pressed flower cluster graphic */}
                <div className="text-5xl tracking-widest filter saturate-[0.8] mb-1 animate-pulse">🌸🌿🎻</div>
                
                <h2 className="serif-italic font-bold text-2xl md:text-3xl text-stone-800 max-w-lg leading-snug">
                  Unveil the specimen sheets of the <span className="text-rose-700">Air Piano</span>
                </h2>
                
                <p className="text-stone-600 text-sm md:text-base font-medium max-w-md leading-relaxed">
                  Now tracking <b>all fingers</b>! Hover your hands over the keys and pinch <b>any or all fingers</b> (Index, Middle, Ring, or Pinky) to your thumb to play rich polyphonic chords and bloom multiple flowers simultaneously.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button 
                    onClick={handleEnableCamera}
                    className="btn bg-rose-700 text-white serif-italic font-bold tracking-wide text-md px-8 py-3.5 rounded-sm cursor-pointer hover:bg-rose-800 active:scale-95 transition-all shadow-sm"
                  >
                    Enable Camera Tracking
                  </button>
                  
                  <button 
                    onClick={() => {
                      // Lazy play notes bypass directly
                      setIsCameraStarted(true);
                      setCameraStatus('off');
                    }}
                    className="btn bg-[#6b7a67] text-white serif-italic font-bold tracking-wide text-md px-6 py-3.5 rounded-sm cursor-pointer hover:bg-[#525e4f] active:scale-95 transition-all shadow-sm"
                  >
                    Play with Keyboard/Mouse
                  </button>
                </div>

                <div className="text-[11px] typewriter tracking-wide text-stone-500 max-w-xs mt-3 flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>No data leaves your device.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Camera Permission Blocked Dialog Panel */}
          {cameraStatus === 'blocked' && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 text-center bg-[#F5F2ED]/95 p-8">
              <div className="text-4xl">⚠️</div>
              <h2 className="serif-italic font-bold text-xl text-stone-800">Camera access is restricted</h2>
              <p className="text-stone-600 text-xs md:text-sm max-w-sm leading-relaxed">
                Please unlock webcam access inside your browser settings, or restart with mouse and keyboard bindings enabled to play the Air Piano.
              </p>
              <button 
                onClick={() => {
                  setCameraStatus('off');
                  setIsCameraStarted(true);
                }}
                className="btn bg-[#6b7a67] text-white px-6 py-2.5 rounded-sm cursor-pointer serif-italic font-bold shadow-sm hover:bg-[#525e4f]"
              >
                Use Keyboard / Click Mode instead
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer controls & help desk */}
      <footer className="relative z-20 px-6 md:px-12 pb-8 pt-2 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-12 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="typewriter text-[10px] text-stone-400 uppercase">Manual Gesture</p>
            <p className="serif-italic text-sm text-stone-600">Pinch any of your fingers with your thumb to play chords</p>
          </div>
          
          <div className="hidden sm:block h-8 w-px bg-stone-300"></div>
          
          <div className="space-y-0.5 flex flex-col items-center sm:items-start">
            <p className="typewriter text-[10px] text-stone-400 uppercase">Environs</p>
            <select 
              id="octaveSelect"
              value={octave}
              onChange={(e) => setOctave(parseInt(e.target.value, 10))}
              className="bg-transparent serif-italic text-sm text-stone-700 border-none outline-none cursor-pointer hover:text-rose-800"
            >
              <option value="3">Night Chorus</option>
              <option value="4">Morning Mist</option>
              <option value="5">Birdsong Sonata</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowInstructions(true)}
            className="flex items-center gap-1 text-[#6b7a67] hover:text-[#525e4f] transition-colors pointer-events-auto cursor-pointer"
            title="Show Guide"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="serif-italic font-semibold text-sm">specimen guide</span>
          </button>
          
          <div className="h-4 w-px bg-stone-300"></div>

          <div className="typewriter text-[10px] text-stone-400">
            EDITION 2026 • BOTANICAL MUSICAL INTERFACE
          </div>
        </div>
      </footer>

      {/* Guide Specimen modal card */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#322c26]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#FAF7EF] rounded-sm p-6 md:p-8 max-w-md w-full border border-[#D9D2C5] shadow-2xl relative cursor-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 text-xs typewriter border border-stone-300 px-2 py-0.5 rounded-sm text-stone-500 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                CLOSE
              </button>
              
              <h3 className="serif-italic font-bold text-xl text-stone-800 mb-4 flex items-center gap-2 border-b border-[#D9D2C5] pb-2">
                <span>📖</span> Herbarium Piano Guide
              </h3>

              <div className="space-y-4 text-xs md:text-sm text-stone-600 leading-relaxed font-medium">
                <p>
                  Welcome to the <b className="serif-bold">Botanical Air Piano</b>, a virtual herbarium that synthesizes notes by matching physical gestures to pressed natural specimens:
                </p>
                <div className="bg-white/40 border border-stone-200 p-3 rounded-sm space-y-2.5">
                  <div className="flex gap-2">
                    <span className="serif-bold text-rose-700">1. All-Finger Tracking:</span>
                    <span>The optical sensor tracks all four fingers (Index, Middle, Ring, Pinky) simultaneously with distinct visual compass lines.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="serif-bold text-stone-700">2. Bloom Polyphony:</span>
                    <span>Pinch any finger to your thumb to play that note. Pinch multiple fingers together to play rich harmonic chords and burst drifting petals!</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="serif-bold text-stone-600">3. Register:</span>
                    <span>Switch registers in the footer: **Night Chorus** corresponds to low tones, **Morning Mist** is standard, and **Birdsong Sonata** represents high octaves.</span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 serif-italic">
                  *Keyboard and mouse triggers are enabled at all times. Move your pointer over a card and click or tap, or press any keyboard key indicated on the specimens to play.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
