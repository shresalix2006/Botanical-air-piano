/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BotanicalSpecimen {
  note: string;
  flower: string;
  scientific: string;
  bg: string; // Background color class
  accent: string; // Accent color hex code
  tint: 'rose' | 'sage' | 'lavender' | 'honey';
}

export interface PipeDef {
  type: 'white' | 'black';
  semitone: number;
  specimen: BotanicalSpecimen;
  keyBind: string;
}

export interface ActiveVoice {
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  osc3: OscillatorNode; // High bell overtone
  gain: GainNode;
  startedAt: number;
}

export interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  width: number;
  height: number;
  angle: number;
  spinSpeed: number;
  swayTime: number;
  swaySpeed: number;
  color: string;
  shape: 'oval' | 'rectangle';
  life: number;
  decay: number;
}
