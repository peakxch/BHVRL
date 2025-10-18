import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  id: number;
  size: number;
  alpha: number;
  color: string;
}

interface ParticleSystemProps {
  word: string;
  className?: string;
}

const PARTICLE_SCALE = 2.0;
const PRIMARY_COLOR = '#4DAAE9';

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ word, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const morphingRef = useRef<boolean>(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const getScale = () => {
    const minDim = Math.min(dimensions.width, dimensions.height);
    return minDim > 0 ? minDim / 300 : 1;
  };

  const getParticleConfig = (word: string) => {
    const configs = {
      Human: { count: 40, pattern: 'concentric_rings' },
      Product: { count: 40, pattern: 'cube_projection' },
      Process: { count: 40, pattern: 'wave' },
      Usage: { count: 40, pattern: 'golden_spiral' },
      Transaction: { count: 40, pattern: 'constellation' },
    } as const;
    return (configs as any)[word] || configs.Human;
  };

  const getTargetPositions = (config: ReturnType<typeof getParticleConfig>, word: string) => {
    const positions: { x: number; y: number }[] = [];
    const { width, height } = dimensions;
    const scale = getScale();
    const clusterCount = 5;

    if (width === 0 || height === 0) return positions;

    // ✅ Center particles on mobile
    const isMobile = width < 768; // Tailwind 'md' breakpoint
    const anchorX = isMobile ? width / 2 : word === 'Process' ? width / 2 : width * 0.7;
    // ✅ Slightly lower on mobile to avoid text overlap
    const anchorY = isMobile ? height * 0.55 : height / 2;

    const humanMultiplier = word === 'Human' ? 1.3 : 1;

    for (let i = 0; i < config.count; i++) {
      let x: number, y: number;
      const cluster = i % clusterCount;

      switch (config.pattern) {
        case 'concentric_rings': {
          const ringCount = 3;
          const ringIndex = Math.floor(i / (config.count / ringCount));
          const angle = ((i % (config.count / ringCount)) / (config.count / ringCount)) * Math.PI * 2;
          const ringRadius = (0.04 + ringIndex * 0.02) * Math.min(width, height) * scale * humanMultiplier;
          x = anchorX + Math.cos(angle) * ringRadius;
          y = anchorY + Math.sin(angle) * ringRadius;
          break;
        }
        case 'cube_projection': {
          const cubeSize = 3; 
          const spacing = 40 * scale;
          const offset = (cubeSize - 1) * spacing * 0.5;
          const depthFactorX = 0.7;
          const depthFactorY = 0.45;
        
          for (let xi = 0; xi < cubeSize; xi++) {
            for (let yi = 0; yi < cubeSize; yi++) {
              for (let zi = 0; zi < cubeSize; zi++) {
                if (positions.length >= config.count) break;
                const x3d = xi * spacing - offset;
                const y3d = yi * spacing - offset;
                const z3d = zi * spacing - offset;
                const x2d = anchorX + (x3d - z3d * depthFactorX);
                const y2d = anchorY + (y3d - z3d * depthFactorY);
                positions.push({ x: x2d, y: y2d });
              }
            }
          }
          break;
        }
        case 'hexagon': {
          const layer = Math.floor((Math.sqrt(12 * i + 9) - 3) / 6);
          const posInLayer = i - 3 * layer * (layer + 1);
          const hexAngle = (posInLayer / Math.max(1, 6 * layer)) * Math.PI * 2;
          const hexRadius = (layer * 20 * scale + 25 * scale) * humanMultiplier;
          x = anchorX + Math.cos(hexAngle) * hexRadius;
          y = anchorY + Math.sin(hexAngle) * hexRadius;
          break;
        }
        case 'wave': {
          const minX = isMobile ? width * 0.25 : width * 0.45;
          const maxX = isMobile ? width * 0.75 : width * 0.9;
          const waveX = minX + ((i / config.count) * (maxX - minX));
          const waveY = Math.sin((i / config.count) * Math.PI * 4) * 40 * scale;
          const noiseX = (Math.random() - 0.5) * 60 * scale;
          const noiseY = (Math.random() - 0.5) * 60 * scale;
          x = waveX + noiseX;
          y = anchorY + waveY + noiseY;
          break;
        }
        case 'golden_spiral': {
          const goldenAngle = i * 0.618 * Math.PI;
          const goldenRadius = Math.pow(1.618, i * 0.1) * 12.5 * scale * humanMultiplier;
          x = anchorX + Math.cos(goldenAngle) * goldenRadius;
          y = anchorY + Math.sin(goldenAngle) * goldenRadius;
          break;
        }
        case 'constellation': {
          const clusterAngleConst = (cluster / clusterCount) * Math.PI * 2;
          const clusterRadiusConst = Math.min(width, height) * 0.125 * scale * humanMultiplier;
          x = anchorX + Math.cos(clusterAngleConst) * clusterRadiusConst;
          y = anchorY + Math.sin(clusterAngleConst) * clusterRadiusConst;
          const starAngle = Math.random() * Math.PI * 2;
          const starDistance = Math.random() * 40 * scale + 10 * scale;
          x += Math.cos(starAngle) * starDistance;
          y += Math.sin(starAngle) * starDistance;
          break;
        }
        default: {
          x = Math.random() * width;
          y = Math.random() * height;
        }
      }

      x = Math.max(25 * scale, Math.min(width - 25 * scale, x));
      y = Math.max(25 * scale, Math.min(height - 25 * scale, y));
      positions.push({ x, y });
    }

    return positions;
  };

  const initializeParticles = (word: string) => {
    const config = getParticleConfig(word);
    const targets = getTargetPositions(config, word);
    return targets.map((pos, i) => ({
      x: pos.x,
      y: pos.y,
      targetX: pos.x,
      targetY: pos.y,
      vx: 0,
      vy: 0,
      id: i,
      size: 2 * PARTICLE_SCALE,
      alpha: 1,
      color: PRIMARY_COLOR,
    }));
  };

  const morphToPattern = (newWord: string) => {
    const config = getParticleConfig(newWord);
    const newPositions = getTargetPositions(config, newWord);
    morphingRef.current = true;

    particlesRef.current.forEach((p, idx) => {
      const pos = newPositions[idx % newPositions.length];
      if (pos) {
        p.targetX = pos.x;
        p.targetY = pos.y;
        p.color = PRIMARY_COLOR;
        p.size = 2 * PARTICLE_SCALE;
      }
    });

    while (particlesRef.current.length < config.count) {
      const index = particlesRef.current.length;
      const pos = newPositions[index % newPositions.length];
      particlesRef.current.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        targetX: pos?.x ?? Math.random() * dimensions.width,
        targetY: pos?.y ?? Math.random() * dimensions.height,
        vx: 0,
        vy: 0,
        id: index,
        size: 2 * PARTICLE_SCALE,
        alpha: 1,
        color: PRIMARY_COLOR,
      });
    }

    if (particlesRef.current.length > config.count) {
      particlesRef.current = particlesRef.current.slice(0, config.count);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = getScale();
    if (!particlesRef.current.length) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allAtTarget = true;

    for (const p of particlesRef.current) {
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.5 * scale) {
        const morphSpeed = 0.08;
        p.x += dx * morphSpeed;
        p.y += dy * morphSpeed;
        allAtTarget = false;
      } else {
        p.x = p.targetX;
        p.y = p.targetY;
      }
    }

    ctx.strokeStyle = PRIMARY_COLOR;
    ctx.lineWidth = 0.4 * scale;
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const a = particlesRef.current[i];
        const b = particlesRef.current[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 50 * scale) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    for (const p of particlesRef.current) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      const radius = p.size * scale;
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (morphingRef.current && allAtTarget) {
      morphingRef.current = false;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

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

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      if (particlesRef.current.length === 0) {
        particlesRef.current = initializeParticles(word);
      } else {
        morphToPattern(word);
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animate();
    }
  }, [word, dimensions]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
