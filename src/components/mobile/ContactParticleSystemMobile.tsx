import React, { useEffect, useRef, useState, useCallback, ReactNode } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: number;
}

interface ContactParticleSystemProps {
  children: ReactNode;
}

const ContactParticleSystem: React.FC<ContactParticleSystemProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const config = {
    particleCount: 100,
    particleColor: '#ffffff',
    particleRadius: 2,
    lineColor: '#ffffff',
    maxLineDistance: 80, // ✅ reduced from ~120 → tighter connections, fewer lines
    maxSpeed: 0.5,
    background: '#000000',
  };

  const initializeParticles = useCallback(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * config.maxSpeed,
        vy: (Math.random() - 0.5) * config.maxSpeed,
        id: i,
      });
    }
    particlesRef.current = particles;
  }, [dimensions.width, dimensions.height]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    const particles = particlesRef.current;

    ctx.fillStyle = config.background;
    ctx.fillRect(0, 0, width, height);

    // Move particles
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x > width) p.x = 0;
      else if (p.x < 0) p.x = width;
      if (p.y > height) p.y = 0;
      else if (p.y < 0) p.y = height;
    }

    // Draw connections — only within new smaller distance
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.maxLineDistance) {
          const alpha = 1 - dist / config.maxLineDistance;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (let p of particles) {
      ctx.fillStyle = config.particleColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, config.particleRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [config, dimensions]);

  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      canvas.width = rect.width;
      canvas.height = rect.height;
      initializeParticles();
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [initializeParticles]);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate, dimensions]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="relative z-10 w-full h-full text-white">
        {children}
      </div>
    </div>
  );
};

export default ContactParticleSystem;
