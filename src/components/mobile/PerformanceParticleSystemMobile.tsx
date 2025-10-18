// components/mobile/PerformanceParticleSystemMobile.tsx
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  color: string;
}

export const PerformanceParticleSystemMobile: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const PARTICLE_COUNT = 80;
  const COLORS = ["#4DAAE9", "rgba(0,0,0,0.4)", "rgba(200,200,200,0.5)"];

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      alpha: 0.4 + Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: 0.6 + Math.random() * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
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

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Reset when particle leaves bottom or sides
        if (p.y > canvas.height + 10 || p.x < -10 || p.x > canvas.width + 10) {
          p.x = Math.random() * canvas.width;
          p.y = -10;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = 0.6 + Math.random() * 0.8;
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
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
};
