import { useEffect, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';
import { VisualizerMode } from '../types';

interface VisualizerProps {
  mode: VisualizerMode;
  isPlaying: boolean;
  className?: string;
  accentColor?: string; // hex or rgb
}

export default function Visualizer({
  mode,
  isPlaying,
  className = '',
  accentColor = '#38bdf8'
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(canvas);

    const dataArray = new Uint8Array(128);
    const timeDomainArray = new Uint8Array(128);

    // Particle state for nebula mode
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      baseRadius: number;
    }
    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * (canvas.clientWidth || 300),
      y: Math.random() * (canvas.clientHeight || 200),
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      baseRadius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3
    }));

    const render = () => {
      const width = canvas.clientWidth || 300;
      const height = canvas.clientHeight || 150;

      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        audioEngine.getFrequencyData(dataArray);
        audioEngine.getTimeDomainData(timeDomainArray);
      } else {
        // Idle gentle breathing state
        dataArray.fill(6);
        timeDomainArray.fill(128);
      }

      if (mode === 'bars') {
        // Frequency bars
        const barCount = 48;
        const totalGap = (barCount - 1) * 3;
        const barWidth = Math.max(2, (width - totalGap) / barCount);

        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor((i / barCount) * (dataArray.length * 0.75));
          const value = isPlaying ? dataArray[dataIndex] : 8 + Math.sin(Date.now() / 400 + i * 0.3) * 6;
          const percent = value / 255;
          const barHeight = Math.max(4, percent * (height - 12));

          const x = i * (barWidth + 3);
          const y = height - barHeight;

          // Gradient for bar
          const gradient = ctx.createLinearGradient(0, y, 0, height);
          gradient.addColorStop(0, accentColor);
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0.15)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
          ctx.fill();

          // Peak cap highlight
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, Math.max(0, y - 2), barWidth, 1.5);
        }
      } else if (mode === 'wave') {
        // Mirrored oscilloscope wave
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = accentColor;
        ctx.beginPath();

        const sliceWidth = width / timeDomainArray.length;
        let x = 0;

        for (let i = 0; i < timeDomainArray.length; i++) {
          const v = timeDomainArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.stroke();

        // Subtle glowing second harmonic
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();
      } else if (mode === 'circle') {
        // Circular radar audio visualizer
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(centerX, centerY) * 0.48;

        ctx.save();
        ctx.translate(centerX, centerY);

        const segments = 40;
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const dataIndex = Math.floor((i / segments) * (dataArray.length * 0.6));
          const val = isPlaying ? dataArray[dataIndex] : 10;
          const barLen = (val / 255) * (Math.min(centerX, centerY) * 0.45) + 4;

          const x1 = Math.cos(angle) * baseRadius;
          const y1 = Math.sin(angle) * baseRadius;
          const x2 = Math.cos(angle) * (baseRadius + barLen);
          const y2 = Math.sin(angle) * (baseRadius + barLen);

          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Inner core circle
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      } else if (mode === 'nebula') {
        // Ambient particle nebula
        // Average low bass energy
        let bassSum = 0;
        for (let b = 0; b < 10; b++) bassSum += dataArray[b];
        const bassLevel = (bassSum / 10 / 255) || 0.05;

        particles.forEach((p) => {
          p.x += p.vx * (1 + bassLevel * 2);
          p.y += p.vy * (1 + bassLevel * 2);

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const currentRadius = p.baseRadius * (1 + bassLevel * 3);

          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * (0.4 + bassLevel * 0.6)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [mode, isPlaying, accentColor]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
