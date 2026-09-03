/**
 * Sintetizador armónico de vals de celebración utilizando la Web Audio API
 * Genera una secuencia orquestal suave de 5 segundos con desvanecimiento gradual (fade out)
 */
export function playSynthesizedWaltz(): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Notas de acorde de Vals (Frecuencias Hz para La bemol / Mib mayor romántico)
    const notes = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 659.25, time: 0.3 },   // E5
      { freq: 783.99, time: 0.6 },   // G5
      { freq: 1046.50, time: 0.9 },  // C6 (Campaña principal)
      { freq: 880.00, time: 1.4 },   // A5
      { freq: 783.99, time: 1.9 },   // G5
      { freq: 659.25, time: 2.4 },   // E5
      { freq: 1046.50, time: 2.9 },  // C6 acorde final
      { freq: 1318.51, time: 3.2 },  // E6 acorde final brillante
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, now);
    // Fade out a los 4.5 segundos
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);
    masterGain.connect(ctx.destination);

    notes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      // Ataque suave y decaimiento armónico
      noteGain.gain.setValueAtTime(0.01, now + time);
      noteGain.gain.linearRampToValueAtTime(0.2, now + time + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + time + 1.2);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now + time);
      osc.stop(now + time + 1.3);
    });

    // Cerrar AudioContext al terminar
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 5000);
  } catch (e) {
    console.log('Web Audio API no soportado o bloqueado por el navegador:', e);
  }
}

/**
 * Función principal para reproducir el efecto de audio de vals de 5 segundos
 */
export function playCelebrationWaltzSound(): void {
  if (typeof window === 'undefined') return;

  try {
    const audio = new Audio('/sounds/vals.mp3');
    audio.volume = 0.6;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Detener suavemente después de 4.5 segundos con fade out
          setTimeout(() => {
            const fadeOut = setInterval(() => {
              if (audio && audio.volume > 0.05) {
                audio.volume -= 0.05;
              } else {
                clearInterval(fadeOut);
                audio.pause();
              }
            }, 80);
          }, 4500);
        })
        .catch((err) => {
          console.log('Autoplay de audio restringido por el navegador, ejecutando vals sintetizado:', err);
          playSynthesizedWaltz();
        });
    }
  } catch {
    // Resiliencia total: Si falla el objeto Audio, disparar sintetizador Web Audio API
    playSynthesizedWaltz();
  }
}
