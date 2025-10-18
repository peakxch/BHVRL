import React, { useEffect, useRef } from "react";

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
  structureId?: number; // == bunch id for right particles
}

// Shared state for a emitted bunch (right side)
interface BunchState {
  id: number;
  vx: number; // optional horizontal drift shared across bunch
  vy: number; // **single speed for the whole bunch**
  targetX: number;
  targetY: number;
}

export const FlowParticleSystemMobile: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const currentStructureId = useRef(0);
  const lastEmitTimeRight = useRef(0);

  // Track active right-side bunches and their shared velocities
  const bunches = useRef<Map<number, BunchState>>(new Map());

  const PARTICLE_SCALE = 2.0;

  const GOLD_COLOR = "#4DAAE9";
  const GOLD_CONNECTION_COLOR = "#4DAAE9";
  const GREY_COLOR = "rgba(192,192,192,0.8)";
  const GREY_CONNECTION_COLOR = "rgba(192,192,192,0.3)";

  // --- Target and Start Logic (Flipped vertically) ---

  const getRandomTarget = (canvas: HTMLCanvasElement) => ({
    x: canvas.width * (0.35 + Math.random() * 0.3),
    y: canvas.height * (0.35 + Math.random() * 0.05),
  });

  const getOffScreenStartPosition = (canvas: HTMLCanvasElement) => ({
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
    const id = currentStructureId.current++;
    const particlesPerBunch = Math.floor(Math.random() * 5) + 3; // 3–7

    const startY = canvas.height * 0.4;
    const targetY = canvas.height * 1.4 + Math.random() * 50 - 25;
    const targetX = canvas.width * 0.5 + Math.random() * 10;
    const horizontalRadius = 20 + Math.random() * 20;
    const verticalRadius = 20 + Math.random() * 30;

    // **Single shared speed for the bunch**
    const sharedVy = 10 + Math.random() * 3; // starting speed
    const sharedVx = (Math.random() - 0.5) * 0.2; // subtle shared drift

    // Register bunch state
    bunches.current.set(id, {
      id,
      vx: sharedVx,
      vy: sharedVy,
      targetX,
      targetY,
    });

    for (let i = 0; i < particlesPerBunch; i++) {
      const angle = (i / particlesPerBunch) * Math.PI * 2;
      const particleColor = Math.random() < 0.3 ? GREY_COLOR : GOLD_COLOR;

      const p: Particle = {
        x: targetX + Math.cos(angle) * horizontalRadius,
        y: startY + Math.sin(angle) * verticalRadius,
        size: (Math.random() * 2.5 + 1.5) * PARTICLE_SCALE,
        alpha: 1,
        color: particleColor,
        vx: sharedVx, // match bunch drift
        vy: sharedVy, // match bunch speed
        type: "right",
        structureId: id,
        targetX,
        targetY,
        converged: false,
        isFading: false,
      };
      particles.current.push(p);
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
      bunches.current.clear();
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
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      const EMIT_INTERVAL_RIGHT = 1500;
      if (now - lastEmitTimeRight.current > EMIT_INTERVAL_RIGHT) {
        emitRightBunch(canvas);
        lastEmitTimeRight.current = now;
      }

      // --- Update LEFT particles ---
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        if (p.type !== "left") continue;

        const dx = (p.targetX! - p.x);
        const dy = (p.targetY! - p.y);
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
      }

      // --- Update RIGHT particles in **bunches** so each bunch has the same speed ---
      // 1) Compute a representative y for each bunch to drive braking/acceleration
      const bunchRepresentativeY = new Map<number, number>();
      for (const p of particles.current) {
        if (p.type !== "right" || p.structureId == null) continue;
        if (!bunchRepresentativeY.has(p.structureId)) bunchRepresentativeY.set(p.structureId, p.y);
        else {
          // keep the max y to make the braking based on the leading edge
          const prev = bunchRepresentativeY.get(p.structureId)!;
          if (p.y > prev) bunchRepresentativeY.set(p.structureId, p.y);
        }
      }

      // 2) Update each bunch's shared velocity once
      for (const [id, state] of bunches.current) {
        const repY = bunchRepresentativeY.get(id);
        if (repY == null) continue; // bunch might be empty

        // Brake as we approach targetY, otherwise keep a steady descent
        const toTarget = state.targetY - repY; // positive while above target
        const brakeForce = 0.009;
        if (toTarget > 0) {
          state.vy += (brakeForce * toTarget) / 100; // accelerate early, gently
          state.vy *= 0.97; // light damping to avoid runaway
        } else {
          state.vy *= 0.97; // keep damping once below target
        }

        // Cap speeds to avoid extremes
        state.vy = Math.max(1, Math.min(state.vy, 14));

        // Subtle horizontal drift back towards targetX (kept shared)
        state.vx += ((state.targetX - (state.targetX)) * 0); // placeholder (no pull)
        state.vx *= 0.99;
      }

      // 3) Apply shared velocity to all right particles, then integrate
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        if (p.type !== "right" || p.structureId == null) continue;
        const state = bunches.current.get(p.structureId);
        if (!state) continue;

        if (!p.isFading) {
          // Everyone in the bunch gets the **same vy and vx** (optionally add tiny independent jitter in position only)
          p.vx = state.vx + (Math.random() - 0.5) * 0.03; // tiny jitter that does not affect shared speed feel
          p.vy = state.vy; // locked speed per bunch

          // Start fading when the bunch is near its target
          const dist = Math.hypot((p.targetX! - p.x), (p.targetY! - p.y));
          if (p.y >= state.targetY - 10 || dist < 25) {
            p.converged = true;
            p.isFading = true;
          }
        } else {
          // Fade out, keep decaying but still respect group vy trend a bit
          p.alpha -= 0.008;
          if (p.alpha <= 0) p.alpha = 0;
          p.vx *= 0.95;
          p.vy = state.vy * 0.9; // fade with slightly reduced speed
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.97;
        p.alpha = Math.max(0, Math.min(1, p.alpha));

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
        }
      }

      // Clean up empty bunches
      // If no particle remains with a structureId, remove the bunch entry
      const activeIds = new Set<number>();
      for (const p of particles.current) if (p.type === "right" && p.structureId != null) activeIds.add(p.structureId);
      for (const id of bunches.current.keys()) if (!activeIds.has(id)) bunches.current.delete(id);

      // --- Draw particles ---
      for (const p of particles.current) {
        if (p.alpha <= 0) continue;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Draw connections: **only between particles in the same bunch** ---
      // To avoid stale indices, compute connections on-the-fly per frame, restricted to same structureId.
      for (let i = 0; i < particles.current.length; i++) {
        const p1 = particles.current[i];
        if (p1.type !== "right" || p1.alpha <= 0) continue;

        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          if (p2.type !== "right" || p2.alpha <= 0) continue;

          // ✅ Only connect within the SAME bunch
          if (p1.structureId !== p2.structureId) continue;

          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            const connectionColor = p1.color === GOLD_COLOR ? GOLD_CONNECTION_COLOR : GREY_CONNECTION_COLOR;
            const minAlpha = Math.min(p1.alpha, p2.alpha);
            ctx.globalAlpha = minAlpha * 0.5;
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = 2;
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
