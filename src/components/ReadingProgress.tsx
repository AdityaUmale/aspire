"use client";

import { useEffect, useRef } from "react";

export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    // Reading scrollHeight forces a synchronous layout. Doing it inside rAF keeps
    // it to one measurement per painted frame instead of one per scroll event.
    const measure = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) {
        return;
      }

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      bar.style.transform = `scaleX(${progress / 100})`;
    };

    const schedule = () => {
      if (frame) {
        return;
      }
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-[2px] w-full origin-left bg-[#1a237e] z-[60] transition-none"
      style={{ transform: "scaleX(0)" }}
      aria-hidden
    />
  );
}
