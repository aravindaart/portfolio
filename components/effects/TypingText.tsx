"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface TypingTextProps {
  text: string;
  /** ms per character */
  speed?: number;
  /** ms before typing starts */
  delay?: number;
  showCaret?: boolean;
  className?: string;
  onDone?: () => void;
}

export function TypingText({
  text,
  speed = 28,
  delay = 0,
  showCaret = false,
  className,
  onDone,
}: TypingTextProps) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((current) => {
          if (current >= text.length) {
            clearInterval(interval);
            return current;
          }
          return current + 1;
        });
      }, speed);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay, reduced]);

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      {showCaret && <span className="caret" aria-hidden />}
    </span>
  );
}
