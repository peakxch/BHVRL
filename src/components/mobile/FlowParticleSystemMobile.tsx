import React, { useEffect, useRef } from "react";

interface Connection {
  targetIndex: number;
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
  structureId?: number;
  connections?: Connection[];
}

export const FlowParticleSystemMobile: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const connections = useRef<[number, number][]>([]);
  const animationRef = useRef<number>();
  const currentStructureId = useRef(0);
  const lastEmitTimeRight = useRef(0);

  const PARTICLE_SCALE = 2.0;

  const GOLD_COLOR = "#4DAAE9";
  const GOLD_CONNECTION_COLOR = "#4DAAE9";
  const GREY_COLOR = "rgba(192,192,192,0.8)";
  const GREY_CONNECTION_COLOR = "rgba(192,192,192,0.3)";

  // --- Target and Start Logic (Flipped vertically) ---

  const getRandomTarget = (canvas: HTMLCanvasElement) => ({
    // Slightly random horizontal spread, roughly center-left
    x: canvas.width * (0.35 + Math.random() * 0.3),
    // ✅ Converge around 25% of screen height (top quarter)
    y: canvas.height * (0.35 + Math.random() * 0.05),
  });

  const getOffScreenStartPosition = (canvas: HTMLCanvasElement) => ({
    // Start slightly above the top
    x: Math.random() * canvas.width,
    y: -Math.random() * 200 - 50,
  });

  const getInitialPositionAlongPath = (
    canvas: HTMLCanvasElement,
    target: { x: number; y: number }
  ) => {
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
    p.color = Math.random() < 0.1 ? "rgba(0,0,0,0.6)" : GOLD_COLOR;
    p.vx = (Math.random() - 0.5) * 0.8;
    p.vy = 2 + Math.random() * 3; // Downward flow
    p.targetX = target.x;
    p.targetY = target.y;
    p.converged = false;
    p.isFading = false;
  };

  // --- Right Particle Bunch Logic (Flipped vertically) ---

  const emitRightBunch = (canvas: HTMLCanvasElement) => {
    const groupID = currentStructureId.current++;
    const particlesPerBunch = Math.floor(Math.random() * 5) + 3;

    const startY = canvas.height * 0.4;
    const targetY = canvas.height * 1.4 + Math.random() * 50 - 25;
    const targetX = canvas.width * 0.5 + Math.random() * 10;
    const horizontalRadius = 20 + Math.random() * 20;
    const verticalRadius = 20 + Math.random() * 30;
    const avgVy = 10 + Math.random() * 3;
    const maxJitter = 0.3;

    const newParticles: Particle[] = [];
    const startIndex = particles.current.length;

    for (let i = 0; i < particlesPerBunch; i++) {
      const angle = (i / particlesPerBunch) * Math.PI * 2;

      const particleColor = Math.random() < 0.3 ? GREY_COLOR : GOLD_COLOR;

      const p: Particle = {
        x: targetX + Math.cos(angle) * horizontalRadius,
        y: startY + Math.sin(angle) * verticalRadius,
        size: (Math.random() * 2.5 + 1.5) * PARTICLE_SCALE,
        alpha: 1,
        color: particleColor,
        vx: (Math.random() - 0.5) * maxJitter,
        vy: avgVy + (Math.random() - 0.5) * maxJitter, // flow downward
        type: "right",
        structureId: groupID,
        targetX,
        targetY,
        converged: false,
        isFading: false,
        connections: [],
      };
      newParticles.push(p);
      particles.current.push(p);
    }

    // Calculate connections between bunch particles
    for (let i = 0; i < newParticles.length; i++) {
      const p1 = newParticles[i];
      const p1Index = startIndex + i;
      for (let j = i + 1; j < newParticles.length; j++) {
        if (Math.random() > 0.5) continue;
        const p2 = newParticles[j];
        const p2Index = startIndex + j;
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 120) {
          const thickness = 2;
          p1.connections!.push({ targetIndex: p2Index, thickness });
          p2.connections!.push({ targetIndex: p1Index, thickness });
        }
      }
    }
  };

  // --- Core Animation ---

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      particles.current = [];
      const numLeftParticles = 100;

      for (let k = 0; k < numLeftParticles; k++) {
        const target = getRandomTarget(canvas);
        const initialPos = getInitialPositionAlongPath(canvas, target);
        const p: Particle = {
          x: initialPos.x,
          y: initialPos.y,
          size: (Math.random() * 3 + 1) * PARTICLE_SCALE,
          alpha: 1,
          color: Math.random() < 0.1 ? "rgba(0,0,0,0.6)" : GOLD_COLOR,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 3 + Math.random() * 2,
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      const EMIT_INTERVAL_RIGHT = 2000;
      if (now - lastEmitTimeRight.current > EMIT_INTERVAL_RIGHT) {
        emitRightBunch(canvas);
        lastEmitTimeRight.current = now;
      }

      const RANDOM_JITTER_FORCE = 0.05;

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];

        if (p.type === "left") {
          // --- Left flow vertically downward ---
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
            p.alpha -= 0.01;
            if (p.alpha <= 0) resetLeftParticle(p, canvas);
            p.vx *= 0.8;
            p.vy *= 0.8;
          }

          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, Math.min(1, p.alpha));
        } else if (p.type === "right") {
          // --- Right bunch moving downwards ---
          const dx = p.targetX! - p.x;
          const dy = p.targetY! - p.y;
          const dist = Math.hypot(dx, dy);

          if (!p.isFading) {
            if (p.y < p.targetY!) {
              const brakeForce = 0.03; // ⚙️ lighter braking so they keep speed longer
              p.vy += brakeForce * (p.targetY! - p.y) / 100;
              p.vy *= 0.97;
            } else {
              p.vy *= 0.97;
            }

            p.vx += (Math.random() - 0.5) * RANDOM_JITTER_FORCE;
            p.vy += (Math.random() - 0.5) * RANDOM_JITTER_FORCE;

            if (p.y >= p.targetY! - 10 || dist < 25) {
              p.converged = true;
              p.isFading = true;
            }
          }

          if (p.isFading) {
            p.alpha -= 0.008;
            if (p.alpha <= 0) p.alpha = 0;
            p.vx *= 0.95;
            p.vy *= 0.97;
            p.vx += (Math.random() - 0.5) * 0.01;
            p.vy += (Math.random() - 0.5) * 0.01;
          }

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.97;
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
        if (p1.type !== "right" || p1.alpha <= 0 || !p1.connections) continue;

        for (const connection of p1.connections) {
          const p2 = particles.current[connection.targetIndex];
          if (!p2 || p2.alpha <= 0 || i >= connection.targetIndex) continue;

          const connectionColor =
            p1.color === GOLD_COLOR
              ? GOLD_CONNECTION_COLOR
              : GREY_CONNECTION_COLOR;
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
        zIndex: 2,
        pointerEvents: "none",
      }}
    />
  );
};
