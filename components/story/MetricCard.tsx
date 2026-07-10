"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Metric } from "@/lib/types";

export function MetricCard({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(metric.value);
      return;
    }
    const controls = animate(0, metric.value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, metric.value, reduced]);

  return (
    <div
      ref={ref}
      className="rounded-lg border border-edge bg-surface p-6 text-center"
    >
      <p className="font-mono text-5xl font-bold text-accent">
        {display}
        <span className="text-3xl">{metric.suffix}</span>
      </p>
      <p className="mt-2 text-sm text-dim">{metric.label}</p>
    </div>
  );
}
