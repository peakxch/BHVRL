// components/mobile/ParticleSystemMobile.tsx
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
}

interface Props {
  word: string;
}

export const ParticleSystemMobile: React.FC<Props> = ({ word }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const color = '#4DAAE9';
  const particleCount = 30;

  const createParticles = (canvas: HTMLCanvasElement): Particle[] => {
    const { width, height } = canvas;
    const cx = width / 2;
    const cy = height / 2.3;
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.25;
      positions.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: cx + Math.cos(angle) * radius + (Math.random() - 0.5) * 30,
        targetY: cy + Math.sin(angle) * radius + (Math.random() - 0.5) * 30,
        vx: 0,
        vy: 0,
        size: 2 + Math.random() * 1.5,
      });
    }
    return positions;
  };

  const morphParticles = (canvas: HTMLCanvasElement) => {
    const { width, height } = canvas;
    const cx = width / 2;
    const cy = height / 2.3;
    particles.current.forEach((p, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.25;
      p.targetX = cx + Math.cos(angle) * radius + (Math.random() - 0.5) * 30;
      p.targetY = cy + Math.sin(angle) * radius + (Math.random() - 0.5) * 30;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      particles.current = createParticles(canvas);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // animate particle motion
      for (const p of particles.current) {
        p.x += (p.targetX - p.x) * 0.05;
        p.y += (p.targetY - p.y) * 0.05;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }

      // link nearby particles
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.25;
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // morph when word changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) morphParticles(canvas);
  }, [word]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};
