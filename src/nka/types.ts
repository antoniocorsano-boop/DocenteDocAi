// Shared types for NKA module
export interface NKANode {
  id: string;
  label: string;
  color: string; // M3 tonalità
  elevation: number; // M3 elevation
  depth: number; // 0-1
  shape: 'circle' | 'pill';
  actions: string[];
}

export interface NKASettings {
  sound: boolean;
  reducedMotion: boolean;
}
