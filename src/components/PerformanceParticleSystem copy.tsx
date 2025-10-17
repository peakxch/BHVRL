import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  id: number;
}

interface PerformanceParticleSystemProps {
  pattern: 'Search' | 'TrendingUp' | 'Scale';
  className?: string;
}

export const PerformanceParticleSystem: React.FC<PerformanceParticleSystemProps> = ({ pattern, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Particle configurations
  const getParticleConfig = (pattern: string) => {
    const configs = {
      Search: {
        count: 12,
        pattern: 'magnifying_glass',
        color: '#4DAAE9',
        speed: 0.1,
        particleRadius: 1,
      },
      TrendingUp: {
        count: 12,
        pattern: 'ascending_line',
        color: '#4DAAE9',
        speed: 0.1,
        particleRadius: 1,
      },
      Scale: {
        count: 12,
        pattern: 'balance_scale',
        color: '#4DAAE9',
        speed: 0.1,
        particleRadius: 1,
      },
    };
    return configs[pattern as keyof typeof configs];
  };

  // Initialize particle positions based on pattern
  const getTargetPositions = (config: ReturnType<typeof getParticleConfig>) => {
    const particles: Particle[] = [];
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return particles;

    const scale = Math.min(width, height) / 32; // Base scale for 32px icons

    for (let i = 0; i < config.count; i++) {
      let x, y;

      switch (config.pattern) {
        case 'magnifying_glass':
          if (i < config.count * 0.6) { // Circle for lens
            const angle = (i / (config.count * 0.6)) * Math.PI * 2;
            const radius = height * 0.35 * scale;
            x = width / 2 + Math.cos(angle) * radius;
            y = height / 2 + Math.sin(angle) * radius;
          } else { // Diagonal handle
            const progress = ((i - config.count * 0.6) / (config.count * 0.4));
            x = width / 2 + 0.35 * width * scale + progress * 0.3 * width * scale;
            y = height / 2 + 0.35 * height * scale + progress * 0.3 * height * scale;
          }
          x += (Math.random() - 0.5) * 2 * scale;
          y += (Math.random() - 0.5) * 2 * scale;
          break;

        case 'ascending_line':
          const progress = i / (config.count - 1);
          x = progress * width;
          y = height - (progress * height);
          if (i % 3 === 0) y -= 3 * scale; // Small steps
          x += (Math.random() - 0.5) * 2 * scale;
          y += (Math.random() - 0.5) * 2 * scale;
          break;

        case 'balance_scale':
          if (i < config.count * 0.3) { // Central beam
            const angle = Math.PI + (i / (config.count * 0.3)) * Math.PI;
            const radius = height * 0.2 * scale;
            x = width / 2 + Math.cos(angle) * radius;
            y = height / 2 + Math.sin(angle) * radius * 0.4;
          } else if (i < config.count * 0.65) { // Left pan
            const progress = ((i - config.count * 0.3) / (config.count * 0.35));
            x = width * 0.3 + progress * 0.2 * width * scale;
            y = height * 0.8;
          } else { // Right pan
            const progress = ((i - config.count * 0.65) / (config.count * 0.35));
            x = width * 0.7 + progress * 0.2 * width * scale;
            y = height * 0.8;
          }
          x += (Math.random() - 0.5) * 2 * scale;
          y += (Math.random() - 0.5) * 2 * scale;
          break;

        default:
          x = Math.random() * width;
          y = Math.random() * height;
          break;
      }

      x = Math.max(5 * scale, Math.min(width - 5 * scale, x));
      y = Math.max(5 * scale, Math.min(height - 5 * scale, y));

      particles.push({ x, y, targetX: x, targetY: y, id: i });
    }

    return particles;
  };

  // Initialize particles
  const initializeParticles = (config: ReturnType<typeof getParticleConfig>) => {
    particlesRef.current = getTargetPositions(config);
    console.log('Initialized particles:', particlesRef.current.length, pattern, dimensions);
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Context not found');
      return;
    }

    const config = getParticleConfig(pattern);
    const scale = Math.min(dimensions.width, dimensions.height) / 32;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach(particle => {
      const dx = particle.targetX - particle.x;
      const dy = particle.targetY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0.5 * scale) {
        particle.x += dx * config.speed;
        particle.y += dy * config.speed;
      } else {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
      }

      ctx.fillStyle = config.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, config.particleRadius * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle resize and initialization
  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.log('Parent has zero dimensions:', rect);
        return;
      }

      setDimensions({ width: rect.width, height: rect.height });
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const config = getParticleConfig(pattern);
      initializeParticles(config);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const timeout = setTimeout(updateDimensions, 100); // Retry after layout

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeout);
    };
  }, [pattern]);

  // Start animation
  useEffect(() => {
    if (particlesRef.current.length > 0 && dimensions.width > 0 && dimensions.height > 0) {
      console.log('Starting animation:', pattern, particlesRef.current.length);
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pattern, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};