import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  id: number;
}

interface ParticleSystemProps {
  word: string;
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ word, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const morphingRef = useRef<boolean>(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Universal scale factor based on canvas size (base at 300px for smaller effect)
  const getScale = () => {
    const minDim = Math.min(dimensions.width, dimensions.height);
    return minDim > 0 ? minDim / 300 : 1;
  };

  // Particle configurations for different words
  const getParticleConfig = (word: string) => {
    const configs = {
      'Human': {
        count: 40,
        pattern: 'concentric_rings',
        color: '#4192C5',
        connectionDistance: 60,
        speed: 0.15,
        morphSpeed: 0.08,
        particleRadius: 1.5,
        lineWidth: 2,
        pulse: false
      },
      'Product': {
        count: 40,
        pattern: 'hexagon',
        color: '#4192C5',
        connectionDistance: 50,
        speed: 0.15,
        morphSpeed: 0.08,
        particleRadius: 1.5,
        lineWidth: 2,
        pulse: false
      },
      'Process': {
        count: 40,
        pattern: 'wave',
        color: '#4192C5',
        connectionDistance: 55,
        speed: 0.15,
        morphSpeed: 0.08,
        particleRadius: 1.5,
        lineWidth: 2,
        pulse: false
      },
      'Usage': {
        count: 40,
        pattern: 'golden_spiral',
        color: '#4192C5',
        connectionDistance: 65,
        speed: 0.15,
        morphSpeed: 0.08,
        particleRadius: 1.5,
        lineWidth: 2,
        pulse: false
      },
      'Transaction': {
        count: 40,
        pattern: 'constellation',
        color: '#4192C5',
        connectionDistance: 45,
        speed: 0.15,
        morphSpeed: 0.08,
        particleRadius: 1.5,
        lineWidth: 2,
        pulse: false
      }
    };
    
    return configs[word as keyof typeof configs] || configs['Human'];
  };

  // Initialize particles based on pattern
  const getTargetPositions = (config: ReturnType<typeof getParticleConfig>) => {
    const particles: Particle[] = [];
    const { width, height } = dimensions;
    const scale = getScale();
    const clusterCount = 5;
    
    if (width === 0 || height === 0) return particles;

    for (let i = 0; i < config.count; i++) {
      let x, y;
      const cluster = i % clusterCount;
      
      switch (config.pattern) {
        case 'concentric_rings':
          // Concentric rings pattern: 3 rings centered at Transaction's location, 60% smaller
          const ringCount = 3;
          const ringIndex = Math.floor(i / (config.count / ringCount));
          const angle = (i % (config.count / ringCount)) / (config.count / ringCount) * Math.PI * 2;
          const ringRadius = (0.04 + ringIndex * 0.02) * Math.min(width, height) * scale; // Reduced from 0.1, 0.15, 0.2 to 0.04, 0.06, 0.08
          x = width * 0.75 + Math.cos(angle) * ringRadius + (Math.random() - 0.5) * 4 * scale; // Reduced from ±10 to ±4
          y = height * 0.4 + Math.sin(angle) * ringRadius + (Math.random() - 0.5) * 4 * scale;
          break;
          
        case 'hexagon':
          const layer = Math.floor((Math.sqrt(12 * i + 9) - 3) / 6);
          const posInLayer = i - 3 * layer * (layer + 1);
          const hexAngle = (posInLayer / Math.max(1, 6 * layer)) * Math.PI * 2;
          const hexRadius = layer * 20 * scale + 25 * scale;
          x = width * 0.75 + Math.cos(hexAngle) * hexRadius + (Math.random() - 0.5) * 15 * scale;
          y = height * 0.4 + Math.sin(hexAngle) * hexRadius + (Math.random() - 0.5) * 15 * scale;
          break;
          
        case 'wave':
          const waveX = (i / config.count) * width;
          const wave1 = Math.sin((i / config.count) * Math.PI * 4) * 40 * scale;
          const wave2 = Math.sin((i / config.count) * Math.PI * 8) * 20 * scale;
          const wave3 = Math.sin((i / config.count) * Math.PI * 16) * 10 * scale;
          x = waveX + (Math.random() - 0.5) * 30 * scale;
          y = height / 2 + wave1 + wave2 + wave3 + (Math.random() - 0.5) * 30 * scale;
          break;
          
        case 'golden_spiral':
          const goldenAngle = i * 0.618 * Math.PI;
          const goldenRadius = Math.pow(1.618, i * 0.1) * 12.5 * scale;
          x = width * 0.75 + Math.cos(goldenAngle) * goldenRadius;
          y = height * 0.4 + Math.sin(goldenAngle) * goldenRadius;
          break;
          
        case 'constellation':
          const clusterAngleConst = (cluster / clusterCount) * Math.PI * 2;
          const clusterRadiusConst = Math.min(width, height) * 0.125 * scale;
          x = width * 0.75 + Math.cos(clusterAngleConst) * clusterRadiusConst;
          y = height * 0.4 + Math.sin(clusterAngleConst) * clusterRadiusConst;
          
          const starAngle = Math.random() * Math.PI * 2;
          const starDistance = Math.random() * 40 * scale + 10 * scale;
          x += Math.cos(starAngle) * starDistance;
          y += Math.sin(starAngle) * starDistance;
          break;
          
        default:
          x = Math.random() * width;
          y = Math.random() * height;
          break;
      }
      
      x = Math.max(25 * scale, Math.min(width - 25 * scale, x));
      y = Math.max(25 * scale, Math.min(height - 25 * scale, y));
      
      particles.push({
        x,
        y,
        targetX: x,
        targetY: y,
        vx: 0,
        vy: 0,
        id: i
      });
    }
    
    return particles;
  };

  // Initialize particles for the first time
  const initializeParticles = (config: ReturnType<typeof getParticleConfig>) => {
    const positions = getTargetPositions(config);
    return positions.map(pos => ({
      ...pos,
      targetX: pos.x,
      targetY: pos.y
    }));
  };

  // Morph particles to new pattern
  const morphToPattern = (newWord: string) => {
    const config = getParticleConfig(newWord);
    const newPositions = getTargetPositions(config);
    
    morphingRef.current = true;
    
    particlesRef.current.forEach((particle, index) => {
      if (index < newPositions.length) {
        particle.targetX = newPositions[index].targetX;
        particle.targetY = newPositions[index].targetY;
      }
    });
    
    while (particlesRef.current.length < config.count) {
      const index = particlesRef.current.length;
      const newPos = newPositions[index];
      if (newPos) {
        particlesRef.current.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          targetX: newPos.targetX,
          targetY: newPos.targetY,
          vx: 0,
          vy: 0,
          id: index
        });
      }
    }
    
    if (particlesRef.current.length > config.count) {
      particlesRef.current = particlesRef.current.slice(0, config.count);
    }
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const config = getParticleConfig(word);
    const scale = getScale();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let allParticlesAtTarget = true;
    
    particlesRef.current.forEach(particle => {
      if (morphingRef.current) {
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1 * scale) {
          particle.x += dx * config.morphSpeed;
          particle.y += dy * config.morphSpeed;
          allParticlesAtTarget = false;
        } else {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
        }
      }
      
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));
    });
    
    if (morphingRef.current && allParticlesAtTarget) {
      morphingRef.current = false;
    }
    
    ctx.strokeStyle = config.color ;
    ctx.lineWidth = config.lineWidth ;
    
    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const p1 = particlesRef.current[i];
        const p2 = particlesRef.current[j];
        const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        
        if (distance < config.connectionDistance * scale) {
          const opacity = 1 - (distance / (config.connectionDistance * scale));
          ctx.strokeStyle = config.color + Math.floor(opacity * 200).toString(16).padStart(2, '0');
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    
    // Draw particles without pulsing
    ctx.fillStyle = config.color;
    particlesRef.current.forEach(particle => {
      ctx.beginPath();
      const radius = config.particleRadius * scale;
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize particles when word or dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      if (particlesRef.current.length === 0) {
        const config = getParticleConfig(word);
        particlesRef.current = initializeParticles(config);
      } else {
        morphToPattern(word);
      }
    }
  }, [word, dimensions]);

  // Start animation
  useEffect(() => {
    if (particlesRef.current.length > 0) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  // Handle word changes for morphing
  useEffect(() => {
    if (particlesRef.current.length > 0 && dimensions.width > 0) {
      morphToPattern(word);
    }
  }, [word]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};