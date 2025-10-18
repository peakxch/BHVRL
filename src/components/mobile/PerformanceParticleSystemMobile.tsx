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
  const upliftEnd = -100;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setMetricIndex((prev) => (prev + 1) % (metrics.length + 1));
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const usableWidth = width * 0.92; // ✅ tighter range to keep within box
    const rightBuffer = width * rightBufferRatio;
    const cGrey = 0.000002;
    const stepSigma = height * 0.04;

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const generateCurve = (c: number) => {
      const pts: { x: number; y: number }[] = [];
      let accumulatedNoise = 0;
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
        pts.push({ x: x + rightBuffer * 0.25, y }); // ✅ adds margin on both sides
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
    let blueParticles = generateParticles(upliftedCurve);

    let revealProgress = 0;
    const revealSpeed = 0.02;
    let frameId: number;

    const drawAxes = () => {
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(2, 40);
      ctx.lineTo(2, height - 25);
      ctx.moveTo(0, height - 25);
      ctx.lineTo(width - 40, height - 25);
      ctx.stroke();
      ctx.restore();
    };

    // ✅ Now clamps lines horizontally as well as vertically
    const drawConnections = (particles: Point[], color: string, maxDist: number) => {
      const visibleCount = Math.floor(particles.length * revealProgress);
      const topLimit = height * 0.1;
      const bottomLimit = height * 0.9;
      const leftLimit = width * 0.05;
      const rightLimit = width * 0.95;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;

      for (let i = 0; i < visibleCount; i++) {
        const p1 = particles[i];
        if (
          p1.y < topLimit ||
          p1.y > bottomLimit ||
          p1.x < leftLimit ||
          p1.x > rightLimit
        )
          continue;

        const distances: { j: number; d: number }[] = [];
        for (let j = 0; j < visibleCount; j++) {
          if (i === j) continue;
          const p2 = particles[j];
          if (
            p2.y < topLimit ||
            p2.y > bottomLimit ||
            p2.x < leftLimit ||
            p2.x > rightLimit
          )
            continue;

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
      const topLimit = height * 0.1;
      const bottomLimit = height * 0.9;
      const leftLimit = width * 0.05;
      const rightLimit = width * 0.95;

      for (let i = 0; i < visibleCount; i++) {
        const p = particles[i];
        if (
          p.y < topLimit ||
          p.y > bottomLimit ||
          p.x < leftLimit ||
          p.x > rightLimit
        )
          continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const updateParticles = (particles: Point[], curve: { x: number; y: number }[]) => {
      const topLimit = height * 0.1;
      const bottomLimit = height * 0.9;
      const leftLimit = width * 0.05;
      const rightLimit = width * 0.95;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const target = curve[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (target.x - p.x) * 0.002;
        p.vy += (target.y - p.y) * 0.002;
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;
        p.x = clamp(p.x, leftLimit, rightLimit);
        p.y = clamp(p.y, topLimit, bottomLimit);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      drawAxes();
      revealProgress = Math.min(revealProgress + revealSpeed, 1);

      updateParticles(greyParticles, baseCurve);
      updateParticles(blueParticles, upliftedCurve);

      drawConnections(greyParticles, "rgba(150,150,150,0.4)", 70);
      drawParticles(greyParticles, "rgba(150,150,150,0.7)");

      drawConnections(blueParticles, "#4DAAE9", 80);
      drawParticles(blueParticles, "#4DAAE9");

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

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />
      <div
        className="absolute  mb-2 flex items-center font-space-grotesk font-bold"
        style={{
          fontSize: "20px",
          whiteSpace: "nowrap",
        }}
      >
        <span className="text-[#4DAAE9] mr-1">BHVRL</span>
        <span className="text-black mr-1">Impact On</span>
        <div
  className="overflow-hidden"
  style={{
    height: "1.1em", // 🔧 slightly taller to fully mask during transitions
    width: "8rem",
    maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
  }}
>
          <div
            className={`${
              isTransitioning ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{
              transform: `translateY(-${metricIndex * 1}em)`,
            }}
          >
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="text-[#4DAAE9]"
                style={{
                  height: "1em",
                  lineHeight: "1em",
                }}
              >
                {metric}
              </div>
            ))}
            <div
              className="text-[#4DAAE9]"
              style={{
                height: "1em",
                lineHeight: "1em",
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
