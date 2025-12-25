// Sound design for NKA: play M3-compliant sound cues for nodes/actions
export const playNkaSound = (type: 'node' | 'action' | 'badge') => {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  const ctx = new window.AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  switch (type) {
    case 'node':
      o.frequency.value = 440;
      break;
    case 'action':
      o.frequency.value = 660;
      break;
    case 'badge':
      o.frequency.value = 880;
      break;
  }
  g.gain.value = 0.08;
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.18);
  o.onended = () => ctx.close();
};
