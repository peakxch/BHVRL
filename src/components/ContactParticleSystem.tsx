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

  // Configuration for the particle network
  const config = {
    particleCount: 100,
    particleColor: '#ffffff',
    particleRadius: 2,
    lineColor: '#ffffff',
    maxLineDistance: 120,
    maxSpeed: 0.5,
  };

  // Generates random particle positions and velocities
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

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill the background with black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;

    // Update particle positions and draw lines
    particles.forEach(p1 => {
      // Update position
      p1.x += p1.vx;
      p1.y += p1.vy;

      // Wrap around the edges
      if (p1.x > dimensions.width) p1.x = 0;
      else if (p1.x < 0) p1.x = dimensions.width;
      if (p1.y > dimensions.height) p1.y = 0;
      else if (p1.y < 0) p1.y = dimensions.height;

      // Draw lines to nearby particles
      particles.forEach(p2 => {
        const distance = Math.sqrt(
          Math.pow(p1.x - p2.x, 2) +
          Math.pow(p1.y - p2.y, 2)
        );

        if (distance < config.maxLineDistance) {
          const alpha = 1 - distance / config.maxLineDistance;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });

    // Draw particles
    particles.forEach(particle => {
      ctx.fillStyle = config.particleColor;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, config.particleRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [config, dimensions]);

  // Handle canvas resize and initialization
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

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [initializeParticles]);

  // Start the animation loop once dimensions and particles are ready
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
