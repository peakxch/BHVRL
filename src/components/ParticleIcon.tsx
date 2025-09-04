import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
}

interface ParticleIconProps {
  type: 'search' | 'trending' | 'scale' | 'target' | 'settings' | 'activity' | 'refresh' | 'magnifying_data' | 'network_nodes' | 'value_growth';
  color?: string;
  size?: number;
  className?: string;
}

export const ParticleIcon: React.FC<ParticleIconProps> = ({ 
  type, 
  color = '#4DAAE9', 
  size = 120,
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Get pattern configuration based on icon type
  const getPatternConfig = (type: string) => {
    const configs = {
      'search': {
        count: 25,
        pattern: 'magnifying_glass',
        animationType: 'pulse',
        baseColor: color
      },
      'trending': {
        count: 30,
        pattern: 'arrow_up',
        animationType: 'flow_up',
        baseColor: color
      },
      'scale': {
        count: 35,
        pattern: 'balance_scale',
        animationType: 'balance',
        baseColor: color
      },
      'target': {
        count: 28,
        pattern: 'target_circles',
        animationType: 'pulse_rings',
        baseColor: color
      },
      'settings': {
        count: 32,
        pattern: 'gear_teeth',
        animationType: 'rotate',
        baseColor: color
      },
      'activity': {
        count: 24,
        pattern: 'bar_chart',
        animationType: 'bounce',
        baseColor: color
      },
      'refresh': {
        count: 26,
        pattern: 'circular_arrow',
        animationType: 'spin',
        baseColor: color
      },
      'magnifying_data': {
        count: 30,
        pattern: 'magnifying_data',
        animationType: 'data_pulse',
        baseColor: color
      },
      'network_nodes': {
        count: 35,
        pattern: 'network_nodes',
        animationType: 'network_pulse',
        baseColor: color
      },
      'value_growth': {
        count: 36,
        pattern: 'value_growth',
        animationType: 'growth_wave',
        baseColor: color
      },
      'impact_curve': {
        count: 40,
        pattern: 'impact_curve',
        animationType: 'curve_wave',
        baseColor: color
      }
    };
    
    return configs[type as keyof typeof configs] || configs['search'];
  };

  // Generate target positions based on pattern
  const getTargetPositions = (config: ReturnType<typeof getPatternConfig>) => {
    const particles: Particle[] = [];
    const centerX = size / 2;
    const centerY = size / 2;
    const scale = size / 120; // Scale factor based on size
    
    for (let i = 0; i < config.count; i++) {
      let x, y, particleSize = 2 * scale, opacity = 0.8;
      
      switch (config.pattern) {
        case 'magnifying_glass':
          // Create magnifying glass shape
          if (i < 18) {
            // Circle part
            const angle = (i / 18) * Math.PI * 2;
            const radius = 25 * scale;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
          } else {
            // Handle part
            const handleProgress = (i - 18) / 7;
            x = centerX + 18 * scale + handleProgress * 20 * scale;
            y = centerY + 18 * scale + handleProgress * 20 * scale;
            particleSize = 1.5 * scale;
          }
          break;
          case 'impact_curve':
          // stronger exponential upward curve
          const totalPoints = config.count;
          const expBase = 5; // higher = steeper curve
          for (let j = 0; j < totalPoints; j++) {
            const progress = j / (totalPoints - 1); // 0 → 1

            // exponential growth normalized to [0,1]
            const expY = (Math.pow(expBase, progress) - 1) / (expBase - 1);

            x = centerX - size / 3 + progress * (size * 0.6);  // left to right
            y = centerY + size / 3 - expY * (size * 0.7);      // exponential rise

            // noise for natural feel
            const noise = (Math.random() - 0.5) * 15 * scale;
            y += noise;

            particleSize = 2 * scale;
            opacity = 0.9;

            particles.push({
              x: Math.random() * size,
              y: Math.random() * size,
              targetX: x,
              targetY: y,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              opacity,
              size: particleSize
            });
          }

          // Add X-axis particles (horizontal, at bottom)
          const xAxisPoints = 10; // Number of particles for X-axis
          for (let j = 0; j < xAxisPoints; j++) {
            const progress = j / (xAxisPoints - 1);
            x = centerX - size / 3 + progress * (size * 0.6); // Same range as curve
            y = centerY + size / 3; // Bottom of curve
            particleSize = 1.5 * scale; // Slightly smaller particles for axes
            opacity = 0.7; // Slightly dimmer for distinction

            particles.push({
              x: Math.random() * size,
              y: Math.random() * size,
              targetX: x,
              targetY: y,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              opacity,
              size: particleSize
            });
          }

          // Add Y-axis particles (vertical, at left)
          const yAxisPoints = 10; // Number of particles for Y-axis
          for (let j = 0; j < yAxisPoints; j++) {
            const progress = j / (yAxisPoints - 1);
            x = centerX - size / 3; // Left of curve
            y = centerY + size / 3 - progress * (size * 0.7); // Same vertical range as curve
            particleSize = 1.5 * scale;
            opacity = 0.7;

            particles.push({
              x: Math.random() * size,
              y: Math.random() * size,
              targetX: x,
              targetY: y,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              opacity,
              size: particleSize
            });
          }

          return particles;

        break;

        case 'magnifying_data':
          // Create magnifying glass with data points inside
          if (i < 18) {
            // Magnifying glass circle
            const angle = (i / 18) * Math.PI * 2;
            const radius = 25 * scale;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
            particleSize = 2 * scale;
          } else if (i < 24) {
            // Data points inside the glass
            const dataIndex = i - 18;
            const dataAngle = (dataIndex / 6) * Math.PI * 2;
            const dataRadius = 15 * scale;
            x = centerX + Math.cos(dataAngle) * dataRadius;
            y = centerY + Math.sin(dataAngle) * dataRadius;
            particleSize = 1.5 * scale;
            opacity = 0.9;
          } else {
            // Handle of magnifying glass
            const handleProgress = (i - 24) / 6;
            x = centerX + 18 * scale + handleProgress * 20 * scale;
            y = centerY + 18 * scale + handleProgress * 20 * scale;
            particleSize = 1.8 * scale;
          }
          break;
          
        case 'network_nodes':
          // Create network with central hub and outer nodes
          if (i < 8) {
            // Central hub ring
            const angle = (i / 8) * Math.PI * 2;
            const radius = 8 * scale;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
            particleSize = 2.5 * scale;
          } else if (i < 20) {
            // Middle ring nodes
            const angle = ((i - 8) / 12) * Math.PI * 2;
            const radius = 20 * scale;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
            particleSize = 2 * scale;
          } else {
            // Outer ring nodes
            const angle = ((i - 20) / 15) * Math.PI * 2;
            const radius = 32 * scale;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
            particleSize = 1.8 * scale;
          }
          break;
          
        case 'value_growth':
          // Create ascending bar chart with growth line
          const barCountNew = 6;
          const barIndexNew = Math.floor(i / 6);
          const posInBarNew = i % 6;
          
          if (barIndexNew < barCountNew) {
            // Bar chart bars
            const barHeight = [0.2, 0.4, 0.3, 0.6, 0.5, 0.8][barIndexNew];
            const barSpacing = 10 * scale;
            x = centerX - (barCountNew * barSpacing) / 2 + barIndexNew * barSpacing;
            y = centerY + 25 * scale - (posInBarNew / 5) * barHeight * 50 * scale;
            particleSize = 2 * scale;
          } else {
            // Growth trajectory line
            const lineIndex = i - (barCountNew * 6);
            const lineProgress = lineIndex / 5;
            x = centerX - 25 * scale + lineProgress * 50 * scale;
            y = centerY + 10 * scale - lineProgress * 30 * scale;
            particleSize = 1.5 * scale;
            opacity = 0.7;
          }
          break;
          
        case 'arrow_up':
          // Create upward trending arrow
          if (i < 15) {
            // Arrow shaft
            const progress = i / 14;
            x = centerX;
            y = centerY + 20 * scale - progress * 40 * scale;
            particleSize = 1.5 * scale;
          } else {
            // Arrow head
            const headIndex = i - 15;
            if (headIndex < 8) {
              // Left side of arrow head
              const progress = headIndex / 7;
              x = centerX - progress * 15 * scale;
              y = centerY - 20 * scale + progress * 10 * scale;
            } else {
              // Right side of arrow head
              const progress = (headIndex - 8) / 7;
              x = centerX + progress * 15 * scale;
              y = centerY - 20 * scale + progress * 10 * scale;
            }
            particleSize = 2.5 * scale;
          }
          break;
          
        case 'target_circles':
          // Create concentric target circles
          const ring = Math.floor(i / 7);
          const posInRing = i % 7;
          const ringRadius = (ring + 1) * 12 * scale;
          const ringAngle = (posInRing / 7) * Math.PI * 2;
          x = centerX + Math.cos(ringAngle) * ringRadius;
          y = centerY + Math.sin(ringAngle) * ringRadius;
          particleSize = (4 - ring) * scale; // Larger particles in center
          break;

        case 'gear_teeth':
          // Create gear with teeth pattern
          if (i < 20) {
            // Outer gear teeth
            const angle = (i / 20) * Math.PI * 2;
            const isTeeth = i % 2 === 0;
            const radius = isTeeth ? 30 * scale : 25 * scale;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
            particleSize = isTeeth ? 2.5 * scale : 1.5 * scale;
          } else {
            // Inner circle
            const angle = ((i - 20) / 12) * Math.PI * 2;
            const radius = 15 * scale;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
            particleSize = 1.8 * scale;
          }
          break;

        case 'bar_chart':
          // Create bar chart pattern
          const barCountChart = 6;
          const barIndexChart = Math.floor(i / 4);
          const posInBarChart = i % 4;
          const barHeightChart = [0.3, 0.7, 0.5, 0.9, 0.6, 0.8][barIndexChart % 6];
          
          x = centerX - (barCountChart * 12 * scale) / 2 + barIndexChart * 12 * scale;
          y = centerY + 20 * scale - (posInBarChart / 3) * barHeightChart * 40 * scale;
          particleSize = 2 * scale;
          break;

        case 'circular_arrow':
          // Create circular refresh arrow
          if (i < 20) {
            // Main circle
            const angle = (i / 20) * Math.PI * 1.8; // Not complete circle
            const radius = 25 * scale;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
            particleSize = 2 * scale;
          } else {
            // Arrow head
            const headIndex = i - 20;
            const baseAngle = Math.PI * 1.8;
            const headAngle = baseAngle + (headIndex / 6) * 0.5;
            const headRadius = 25 * scale - (headIndex / 6) * 8 * scale;
            x = centerX + Math.cos(headAngle) * headRadius;
            y = centerY + Math.sin(headAngle) * headRadius;
            particleSize = 2.5 * scale;
          }
          break;
          
        default:
          x = centerX;
          y = centerY;
          break;
      }
      
      particles.push({
        x: Math.random() * size,
        y: Math.random() * size,
        targetX: x,
        targetY: y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        opacity,
        size: particleSize
      });
    }
    
    return particles;
  };

  // Initialize particles
  useEffect(() => {
    const config = getPatternConfig(type);
    particlesRef.current = getTargetPositions(config);
  }, [type, size]);

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const config = getPatternConfig(type);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update particles
    particlesRef.current.forEach((particle, index) => {
      // Move towards target with easing
      const dx = particle.targetX - particle.x;
      const dy = particle.targetY - particle.y;
      
      particle.x += dx * 0.1;
      particle.y += dy * 0.1;
      
      // Add animation effects based on type
      let animationOffset = { x: 0, y: 0 };
      const time = Date.now() * 0.001;
      
      switch (config.animationType) {
        case 'pulse':
          // Pulsing effect for search
          const pulseScale = 1 + Math.sin(time * 3 + index * 0.5) * 0.1;
          animationOffset.x = (particle.targetX - size/2) * (pulseScale - 1);
          animationOffset.y = (particle.targetY - size/2) * (pulseScale - 1);
          break;
          
        case 'flow_up':
          // Upward flowing effect for trending
          animationOffset.y = Math.sin(time * 2 + index * 0.3) * 3;
          break;
          
        case 'balance':
          // Gentle swaying for balance scale
          animationOffset.x = Math.sin(time * 1.5 + index * 0.2) * 2;
          animationOffset.y = Math.cos(time * 1.5 + index * 0.2) * 1;
          break;

        case 'pulse_rings':
          // Pulsing rings for target
          const ringPulse = 1 + Math.sin(time * 2 + index * 0.8) * 0.15;
          animationOffset.x = (particle.targetX - size/2) * (ringPulse - 1);
          animationOffset.y = (particle.targetY - size/2) * (ringPulse - 1);
          break;
        case 'curve_wave':
          // wavey effect along curve
          animationOffset.y = Math.sin(time * 2 + index * 0.3) * 2;
          break;
          
        case 'rotate':
          // Rotation for gear
          const rotationAngle = time * 0.5;
          const gearCenterX = size / 2;
          const gearCenterY = size / 2;
          const currentRadius = Math.sqrt((particle.targetX - gearCenterX) ** 2 + (particle.targetY - gearCenterY) ** 2);
          const currentAngle = Math.atan2(particle.targetY - gearCenterY, particle.targetX - gearCenterX);
          const newAngle = currentAngle + rotationAngle;
          animationOffset.x = Math.cos(newAngle) * currentRadius - particle.targetX + gearCenterX;
          animationOffset.y = Math.sin(newAngle) * currentRadius - particle.targetY + gearCenterY;
          break;

        case 'bounce':
          // Bouncing bars for activity
          const bounceHeight = Math.abs(Math.sin(time * 3 + index * 0.4)) * 5;
          animationOffset.y = -bounceHeight;
          break;

        case 'spin':
          // Spinning circular arrow
          const spinAngle = time * 1.2;
          const spinCenterX = size / 2;
          const spinCenterY = size / 2;
          const spinRadius = Math.sqrt((particle.targetX - spinCenterX) ** 2 + (particle.targetY - spinCenterY) ** 2);
          const spinCurrentAngle = Math.atan2(particle.targetY - spinCenterY, particle.targetX - spinCenterX);
          const spinNewAngle = spinCurrentAngle + spinAngle;
          animationOffset.x = Math.cos(spinNewAngle) * spinRadius - particle.targetX + spinCenterX;
          animationOffset.y = Math.sin(spinNewAngle) * spinRadius - particle.targetY + spinCenterY;
          break;
          
        case 'data_pulse':
          // Data analysis pulsing effect
          const dataPulse = 1 + Math.sin(time * 4 + index * 0.3) * 0.2;
          animationOffset.x = (particle.targetX - size/2) * (dataPulse - 1);
          animationOffset.y = (particle.targetY - size/2) * (dataPulse - 1);
          // Add slight rotation to data points
          if (index >= 18 && index < 24) {
            const dataRotation = time * 0.8;
            const dataCenterX = size / 2;
            const dataCenterY = size / 2;
            const dataRadius = Math.sqrt((particle.targetX - dataCenterX) ** 2 + (particle.targetY - dataCenterY) ** 2);
            const dataAngle = Math.atan2(particle.targetY - dataCenterY, particle.targetX - dataCenterX);
            const newDataAngle = dataAngle + dataRotation;
            animationOffset.x += Math.cos(newDataAngle) * dataRadius - particle.targetX + dataCenterX;
            animationOffset.y += Math.sin(newDataAngle) * dataRadius - particle.targetY + dataCenterY;
          }
          break;
          
        case 'network_pulse':
          // Network nodes with pulsing connections
          const networkPulse = 1 + Math.sin(time * 2.5 + index * 0.4) * 0.1;
          animationOffset.x = (particle.targetX - size/2) * (networkPulse - 1);
          animationOffset.y = (particle.targetY - size/2) * (networkPulse - 1);
          break;
          
        case 'growth_wave':
          // Growth bars with wave motion
          const waveMotion = Math.sin(time * 3 + index * 0.6) * 2;
          animationOffset.y = waveMotion;
          // Add slight scaling effect
          const growthPulse = 1 + Math.sin(time * 2 + index * 0.4) * 0.05;
          animationOffset.x = (particle.targetX - size/2) * (growthPulse - 1);
          break;
      }
      
      const finalX = particle.x + animationOffset.x;
      const finalY = particle.y + animationOffset.y;
      
      // Draw connections between nearby particles
      if (isHovered) {
        ctx.strokeStyle = config.baseColor + '30';
        ctx.lineWidth = 0.5;
        
        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const otherFinalX = other.x;
          const otherFinalY = other.y;
          const distance = Math.sqrt((finalX - otherFinalX) ** 2 + (finalY - otherFinalY) ** 2);
          
          if (distance < 40) {
            const opacity = 1 - (distance / 40);
            ctx.strokeStyle = config.baseColor + Math.floor(opacity * 80).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.moveTo(finalX, finalY);
            ctx.lineTo(otherFinalX, otherFinalY);
            ctx.stroke();
          }
        }
      }
      
      // Draw particle
      const hoverScale = isHovered ? 1.5 : 1;
      ctx.fillStyle = config.baseColor + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(finalX, finalY, particle.size * hoverScale, 0, Math.PI * 2);
      ctx.fill();
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Start animation
  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, isHovered]);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="block"
      />
    </div>
  );
};