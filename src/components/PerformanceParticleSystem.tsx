import React, { useEffect, useRef, useState } from "react";

const metrics = ["Revenue", "Efficiency", "Engagement", "CX"];

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const PerformanceNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [metricIndex, setMetricIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const numPoints = 120;
  const trimRatio = 0.9;
  const rightBufferRatio = 0.08;
  const upliftStart = -10;
  const upliftEnd = -120;

  // 🔁 Smooth vertical metric transition (like Process.tsx)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setMetricIndex((prev) => (prev + 1) % (metrics.length + 1)); // +1 for seamless clone
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (metricIndex === metrics.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setMetricIndex(0);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [metricIndex]);

  // 🎨 Particle network logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const rightBuffer = width * rightBufferRatio;
    const cGrey = 0.000002;
    const stepSigma = height * 0.04;

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const generateCurve = (c: number) => {
      const pts: { x: number; y: number }[] = [];
      let accumulatedNoise = 0;
      const usableWidth = width - rightBuffer;
      const linearSlope = -(c * usableWidth * usableWidth) / 4;
      for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * usableWidth;
        const centeredX = x - usableWidth / 2;
        let y = height * 0.6 + linearSlope * centeredX;
        const t = i / (numPoints - 1);
        const fade = Math.sin(t * Math.PI);
        const localScale =
          (1 + Math.sin(t * Math.PI * 4) * 2 + Math.sin(t * Math.PI * 8)) * fade;
        accumulatedNoise += (Math.random() - 0.5) * stepSigma * localScale;
        y = clamp(y + accumulatedNoise + height * 0.1, height * 0.1, height * 0.9);
        pts.push({ x, y });
      }
      return pts.slice(0, Math.floor(pts.length * trimRatio));
    };

    const generateParticles = (curve: { x: number; y: number }[]): Point[] =>
      curve.map((p) => ({
        x: p.x + (Math.random() - 0.5) * 10,
        y: p.y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));

    const baseCurve = generateCurve(cGrey);
    const upliftedCurve = baseCurve.map((p, i) => {
      const t = i / (baseCurve.length - 1);
      const uplift = upliftStart + (upliftEnd - upliftStart) * t;
      return { x: p.x, y: clamp(p.y + uplift, height * 0.1, height * 0.85) };
    });
    let greyParticles = generateParticles(baseCurve);
    let greenParticles = generateParticles(upliftedCurve);

    let revealProgress = 0;
    const revealSpeed = 0.008;
    let frameId: number;

    const drawAxes = () => {
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.lineTo(2, height - 30);
      ctx.moveTo(0, height - 30);
      ctx.lineTo(width - 80, height - 30);
      ctx.stroke();
      ctx.restore();
    };

    // 🧩 Connect only 2–3 nearest neighbors
    const drawConnections = (particles: Point[], color: string, maxDist: number) => {
      const visibleCount = Math.floor(particles.length * revealProgress);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;

      for (let i = 0; i < visibleCount; i++) {
        const p1 = particles[i];
        const distances: { j: number; d: number }[] = [];

        for (let j = 0; j < visibleCount; j++) {
          if (i === j) continue;
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) distances.push({ j, d });
        }

        distances
          .sort((a, b) => a.d - b.d)
          .slice(0, 3)
          .forEach(({ j }) => {
            const p2 = particles[j];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          });
      }

      ctx.globalAlpha = 1;
    };

    const drawParticles = (particles: Point[], color: string, r = 2) => {
      const visibleCount = Math.floor(particles.length * revealProgress);
      ctx.fillStyle = color;
      for (let i = 0; i < visibleCount; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const updateParticles = (particles: Point[], curve: { x: number; y: number }[]) => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const target = curve[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (target.x - p.x) * 0.002;
        p.vy += (target.y - p.y) * 0.002;
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;
        p.x = clamp(p.x, 0, width);
        p.y = clamp(p.y, height * 0.05, height * 0.95);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      drawAxes();
      revealProgress = Math.min(revealProgress + revealSpeed, 1);

      updateParticles(greyParticles, baseCurve);
      updateParticles(greenParticles, upliftedCurve);

      drawConnections(greyParticles, "rgba(150,150,150,0.5)", 60);
      drawParticles(greyParticles, "rgba(150,150,150,0.7)");

      drawConnections(greenParticles, "#4DAAE9", 65);
      drawParticles(greenParticles, "#4DAAE9");

      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [metricIndex]);

  // 🧱 Setup for text animation
  const lineHeight = 64; // increased for larger text
  const metricBoxHeight = `${lineHeight}px`;

  return (
    <div className="relative w-full h-full">
      {/* Canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />

      {/* BHVRL impact on [Metric] */}
      <div
        className="absolute  left-8 flex items-center space-x-4 font-space-grotesk font-bold"
        style={{ fontSize: "32px", lineHeight: metricBoxHeight }}
      >
        {/* BHVRL in blue */}
        <span className="text-[#4DAAE9]">BHVRL</span>
        {/* Impact on in black */}
        <span className="text-black">Impact On</span>

        {/* Metrics scroll container */}
        <div
          className="overflow-hidden"
          style={{
            height: metricBoxHeight,
            width: "18rem",
          }}
        >
          <div
            className={`${
              isTransitioning ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{
              transform: `translateY(-${metricIndex * lineHeight}px)`,
            }}
          >
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="text-[#000000]"
                style={{
                  height: metricBoxHeight,
                  lineHeight: metricBoxHeight,
                }}
              >
                {metric}
              </div>
            ))}
            {/* Clone first for looping */}
            <div
              className="text-[#4DAAE9]"
              style={{
                height: metricBoxHeight,
                lineHeight: metricBoxHeight,
              }}
            >
              {metrics[0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
