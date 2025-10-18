// components/mobile/FlowParticleSystemMobile.tsx
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  vx: number;
  vy: number;
  isFading: boolean;
}

export const FlowParticleSystemMobile: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const PARTICLE_COUNT = 100;
  const COLOR = "#4DAAE9";

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    return {
      x: canvas.width * (0.1 + Math.random() * 0.8),
      y: -Math.random() * 100,
      size: Math.random() * 3 + 1,
      alpha: 0.8,
      color: COLOR,
      vx: (Math.random() - 0.5) * 0.3,
      vy: 1.5 + Math.random() * 1.5,
      isFading: false,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      particles.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas)
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y > canvas.height * 0.8) p.isFading = true;
        if (p.isFading) p.alpha -= 0.01;

        if (p.alpha <= 0 || p.y > canvas.height + 50) {
          particles.current[i] = createParticle(canvas);
          return;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
};
