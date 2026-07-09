"use client";

import { useEffect, useRef, useState } from "react";

type ParsedValue = {
  prefix: string;
  numberText: string;
  suffix: string;
  target: number;
  decimals: number;
};

/**
 * Parse the first numeric part (integer or decimal) out of a string,
 * remembering whatever comes before it (prefix) and after it (suffix).
 * Returns null when there is no leading-ish number to animate.
 */
function parseValue(value: string): ParsedValue | null {
  // Match: optional non-numeric prefix, a number (int or decimal), then the rest.
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)([\s\S]*)$/);
  if (!match) return null;

  const [, prefix, numberText, suffix] = match;
  const target = Number(numberText);
  if (!Number.isFinite(target)) return null;

  const dotIndex = numberText.indexOf(".");
  const decimals = dotIndex === -1 ? 0 : numberText.length - dotIndex - 1;

  return { prefix, numberText, suffix, target, decimals };
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Ease-out cubic: fast start, gentle landing — reads as a natural "count up".
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function CountUp({
  value,
  durationMs = 1600,
}: {
  value: string;
  durationMs?: number;
}) {
  const parsed = parseValue(value);

  // First paint (server + first client render) always shows the final `value`
  // verbatim, so server and client markup match and there's no hydration flash.
  const [display, setDisplay] = useState<string>(value);

  const spanRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Nothing to animate: no number, or reduced motion — keep final value shown.
    if (!parsed) {
      setDisplay(value);
      return;
    }
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const { prefix, suffix, target, decimals } = parsed;

    const format = (n: number): string =>
      `${prefix}${n.toFixed(decimals)}${suffix}`;

    let cancelled = false;

    const runAnimation = () => {
      const start = performance.now();

      const tick = (now: number) => {
        if (cancelled) return;
        const elapsed = now - start;
        const t = durationMs > 0 ? Math.min(elapsed / durationMs, 1) : 1;
        const current = target * easeOutCubic(t);
        setDisplay(format(current));

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(format(target));
        }
      };

      // Reset to 0 the moment we start, then animate up.
      setDisplay(format(0));
      rafRef.current = requestAnimationFrame(tick);
    };

    const node = spanRef.current;

    // No IntersectionObserver support (or no node): just show final value.
    if (!node || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            runAnimation();
            break;
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // Re-run if the target value or duration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return (
    <span ref={spanRef} suppressHydrationWarning>
      {display}
    </span>
  );
}
