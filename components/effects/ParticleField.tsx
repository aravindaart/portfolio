"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const PARTICLE_DENSITY = 1 / 22000; // particles per px²
const LINK_DISTANCE = 130;

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(90, Math.floor(width * height * PARTICLE_DENSITY));
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
  }));
}

/** Ambient neural-network particle canvas. Pauses off-screen; static under reduced motion. */
export default function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let visible = true;
    let particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      particles = createParticles(canvas.width, canvas.height);
    };

    const step = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const moved = particles.map((p) => {
        const nx = (p.x + p.vx + canvas.width) % canvas.width;
        const ny = (p.y + p.vy + canvas.height) % canvas.height;
        return { ...p, x: nx, y: ny };
      });
      particles = moved;

      ctx.fillStyle = "rgba(34, 211, 174, 0.55)";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(103, 232, 249, ${0.12 * (1 - dist / LINK_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(frame);
      }
    });

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        aria-hidden
        className={`${className ?? ""} bg-gradient-to-b from-surface to-bg`}
      />
    );
  }

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
