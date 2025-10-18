// FlowParticleSystem.tsx
import React, { useEffect, useRef } from "react";

interface Connection {
  targetIndex: number; // The index of the particle it connects to
  thickness: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  type: "left" | "right";
  vx: number;
  vy: number;
  targetX?: number;
  targetY?: number;
  converged?: boolean;
  isFading?: boolean;
  // New: Identifier to group particles for connections and synchronized movement
  structureId?: number;
  // NEW: Store calculated connections to prevent redrawing every frame
  connections?: Connection[]; 
}

export const FlowParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const connections = useRef<[number, number][]>([]);
  const animationRef = useRef<number>();
  const currentStructureId = useRef(0); 
  const lastEmitTimeRight = useRef(0);

  const PARTICLE_SCALE = 2.0; 

  // --- Particle Colors ---
  const GOLD_COLOR = "#4DAAE9"; 
  const GOLD_CONNECTION_COLOR = "#4DAAE9"; 
  
  // Reverted to the requested light grey color
  const GREY_COLOR = "rgba(192, 192, 192, 0.8)"; 
  const GREY_CONNECTION_COLOR = "rgba(192, 192, 192, 0.3)"; 
  
  // --- Left Particle Logic (Flowing) ---

  const getRandomTarget = (canvas: HTMLCanvasElement) => ({
    x: canvas.width * (0.2 + Math.random() * 0.2),
    // MODIFIED: Shifted the Y target upwards by 20% (from 0.5 to 0.3)
    y: canvas.height * (0.4 + Math.random() * 0.2), 
  });

  const getOffScreenStartPosition = (canvas: HTMLCanvasElement) => ({
    x: -Math.random() * 250 - 50,
    y: Math.random() * canvas.height,
  });

  const getInitialPositionAlongPath = (canvas: HTMLCanvasElement, target: { x: number, y: number }): { x: number, y: number } => {
    const startPos = getOffScreenStartPosition(canvas);
    const factor = Math.random();
    return {
      x: startPos.x * (1 - factor) + target.x * factor,
      y: startPos.y * (1 - factor) + target.y * factor,
    };
  };

  const resetLeftParticle = (p: Particle, canvas: HTMLCanvasElement) => {
    const startPos = getOffScreenStartPosition(canvas);
    const target = getRandomTarget(canvas);

    p.x = startPos.x;
    p.y = startPos.y;
    p.size = (Math.random() * 3 + 1) * PARTICLE_SCALE;
    p.alpha = 1; 
    p.color = Math.random() < 0.1 ? "rgba(0,0,0,0.6)" : "#4DAAE9";
    p.vx = 2 + Math.random() * 3; // Increased min speed for flow
    p.vy = (Math.random() - 0.5) * 1;
    p.targetX = target.x;
    p.targetY = target.y;
    p.converged = false;
    p.isFading = false;
  };

  // --- Right Particle Logic (Moving Bunches) ---

  const emitRightBunch = (canvas: HTMLCanvasElement) => {
    const groupID = currentStructureId.current++;
    const particlesPerBunch = Math.floor(Math.random() * 5) + 3; 
    const startX = canvas.width * 0.7;
    const targetX = canvas.width * 1.5 + Math.random() * 50 - 25;
    const targetY = canvas.height * 0.5 + Math.random() * 10;
    const horizontalRadius = 20 + Math.random() * 40; 
    const verticalRadius = 20 + Math.random() * 10; 
    const avgVx = 5 + Math.random() * 3; 
    const maxJitter = 0.3;

    const newParticles: Particle[] = [];
    const startIndex = particles.current.length; 

    for (let i = 0; i < particlesPerBunch; i++) {
      const angle = (i / particlesPerBunch) * Math.PI * 2;
      
      // FIX: Randomize color per particle (30% chance for grey)
      const particleColor = Math.random() < 0.3 ? GREY_COLOR : GOLD_COLOR;
      
      const p: Particle = {
        x: startX + Math.cos(angle) * horizontalRadius,
        y: targetY + Math.sin(angle) * verticalRadius,
        size: (Math.random() * 2.5 + 1.5) * PARTICLE_SCALE,
        alpha: 1, 
        color: particleColor, // Assigned the individual randomized color
        vx: avgVx + (Math.random() - 0.5) * maxJitter, 
        vy: (Math.random() - 0.5) * maxJitter,
        type: "right",
        structureId: groupID,
        targetX: targetX, 
        targetY: targetY, 
        converged: false, 
        isFading: false, 
        connections: [], 
      };
      newParticles.push(p);
      particles.current.push(p);
    }

    // Calculate and store connections only ONCE during emission
    for (let i = 0; i < newParticles.length; i++) {
      const p1 = newParticles[i];
      const p1Index = startIndex + i; 

      for (let j = i + 1; j < newParticles.length; j++) {
        // 50% connection chance check
        if (Math.random() > 0.5) {
          continue; 
        }
        
        const p2 = newParticles[j];
        const p2Index = startIndex + j;

        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 120) {
          // Calculate randomized thickness (1 to 5)
          const thickness =  2 ; 

          // Store connection information on both particles
          p1.connections!.push({ targetIndex: p2Index, thickness });
          p2.connections!.push({ targetIndex: p1Index, thickness });
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      particles.current = [];
      // Increased count
      const numLeftParticles = 100; 

      // Initialize Left Flowing Particles 
      for (let k = 0; k < numLeftParticles; k++) {
        const target = getRandomTarget(canvas);
        const initialPos = getInitialPositionAlongPath(canvas, target);

        const p: Particle = {
          x: initialPos.x,
          y: initialPos.y,
          size: (Math.random() * 3 + 1) * PARTICLE_SCALE,
          alpha: 1,
          color: Math.random() < 0.1 ? "rgba(0,0,0,0.6)" : "#4DAAE9",
          vx: 4 + Math.random() * 3, // Increased min speed
          vy: (Math.random() - 0.5) * 1,
          type: "left",
          targetX: target.x,
          targetY: target.y,
          converged: false,
          isFading: false,
        };
        particles.current.push(p);
      }

      connections.current = [];
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
        
      const now = performance.now();
      const EMIT_INTERVAL_RIGHT = 1500; 

      if (now - lastEmitTimeRight.current > EMIT_INTERVAL_RIGHT) {
        emitRightBunch(canvas);
        lastEmitTimeRight.current = now;
      }
        
      const RANDOM_JITTER_FORCE = 0.05; 

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
            
        if (p.type === "left") {
          // --- Left Particle Logic: Continuous Flow ---
          const dx = p.targetX! - p.x;
          const dy = p.targetY! - p.y;
          const dist = Math.hypot(dx, dy);

          if (!p.isFading && dist > 15) {
            const force = 0.03;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            p.converged = false;
            p.vx *= 0.95;
            p.vy *= 0.97;
          } else if (dist <= 15 || p.isFading) {
            p.converged = true;
            p.isFading = true;

            // ⭐ FIX APPLIED HERE: Slower Fade Out
            p.alpha -= 0.01; 
            
            if (p.alpha <= 0) {
              resetLeftParticle(p, canvas); 
            }
            
            p.vx *= 0.8; 
            p.vy *= 0.8; 
          }
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, Math.min(1, p.alpha));

        } else if (p.type === "right") {
          // --- Right Particle Logic (Move to center, stop, and fade) ---
          
          const dx = p.targetX! - p.x;
          const dy = p.targetY! - p.y;
          const dist = Math.hypot(dx, dy);
          
          if (!p.isFading) {
              
            if (p.x < p.targetX!) {
                const brakeForce = 0.03;
                p.vx += brakeForce * (p.targetX! - p.x) / 100;
                p.vx *= 0.95; // Matched damping to left particles
            } else {
                p.vx *= 0.95; // Matched damping to left particles
            }

            // JITTER
            p.vx += (Math.random() - 0.5) * RANDOM_JITTER_FORCE;
            p.vy += (Math.random() - 0.5) * RANDOM_JITTER_FORCE;

            // Check for convergence/stopping point
            if (p.x >= p.targetX! - 10 || dist < 25) {
                p.converged = true;
                p.isFading = true; 
            }
          }

          if (p.isFading) {
            // Faster fade out to decrease interval (increased from 0.005)
            p.alpha -= 0.008; 
            
            // Cap at 0
            if (p.alpha <= 0) {
              p.alpha = 0;
            }
            
            // Apply slight random movement to prevent being completely static
            p.vx *= 0.95; // Matched to left
            p.vy *= 0.97; // Matched to left
            p.vx += (Math.random() - 0.5) * 0.01;
            p.vy += (Math.random() - 0.5) * 0.01;
          }
          
          p.x += p.vx;
          p.y += p.vy;
            
          p.vx *= 0.95; // Reduced damping to match left particles' sustained speed
          p.vy *= 0.97; // Matched to left
            
          p.alpha = Math.max(0, Math.min(1, p.alpha));

          if (p.alpha <= 0) {
            particles.current.splice(i, 1);
            continue;
          }
        }

        // Draw particle 
        if (p.alpha > 0) {
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- Draw connections ---
      for (let i = 0; i < particles.current.length; i++) {
        const p1 = particles.current[i];
        
        if (p1.type !== "right" || p1.alpha <= 0 || !p1.connections) {
          continue;
        }

        for (const connection of p1.connections) {
          const p2 = particles.current[connection.targetIndex];

          if (!p2 || p2.alpha <= 0 || i >= connection.targetIndex) {
            continue; 
          }

          // Determine connection color based on particle color
          // Note: Connections are drawn between two particles. We assume the color of p1 dictates the connection stroke color.
          const connectionColor = p1.color === GOLD_COLOR ? GOLD_CONNECTION_COLOR : GREY_CONNECTION_COLOR;

          const minAlpha = Math.min(p1.alpha, p2.alpha);
          
          ctx.globalAlpha = minAlpha * 0.5; 
          ctx.strokeStyle = connectionColor; 
          
          ctx.lineWidth = connection.thickness; 

          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) { 
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
        
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
        zIndex: 2, 
        pointerEvents: "none",
      }}
    />
  );
};