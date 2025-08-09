import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type SectionItem = {
  id: string;
  title: string;
  element: React.ReactNode;
};

interface SectionScrollerProps {
  sections: SectionItem[];
  currentId?: string;
  onActiveChange?: (id: string) => void;
}

const SectionScroller: React.FC<SectionScrollerProps> = ({ sections, currentId, onActiveChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const isReducedMotion = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const isThrottled = useRef(false);
  const mountedRef = useRef(false);

  const ids = useMemo(() => sections.map(s => s.id), [sections]);

  const scrollToIndex = (index: number, opts?: ScrollIntoViewOptions) => {
    const target = sectionRefs.current[index];
    if (!target) return;
    target.scrollIntoView({ block: 'start', behavior: isReducedMotion ? 'auto' : 'smooth', ...opts });
  };

  const indexFromId = (id?: string | null) => {
    const idx = ids.indexOf(id || "");
    return idx >= 0 ? idx : 0;
  };

  // Observe visible section to update activeIndex
  useEffect(() => {
    const elements = sectionRefs.current.filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a,b) => (b.intersectionRatio - a.intersectionRatio))[0];
        if (visible) {
          const idx = elements.indexOf(visible.target as HTMLElement);
          if (idx !== -1) {
            setActiveIndex((prev) => {
              if (prev !== idx) {
                const id = sections[idx]?.id;
                // Update hash (without scroll jump)
                if (id && window.location.hash !== `#${id}`) {
                  window.history.replaceState(null, "", `#${id}`);
                }
                onActiveChange?.(id);
              }
              return idx;
            });
          }
        }
      },
      { threshold: [0.55, 0.75] }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections, onActiveChange]);

  // External control via currentId prop
  useEffect(() => {
    if (!mountedRef.current) return;
    if (!currentId) return;
    const idx = indexFromId(currentId);
    if (idx !== activeIndex) scrollToIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  // Initial mount: handle hash deep link or prop
  useEffect(() => {
    mountedRef.current = true;
    const hashId = window.location.hash?.replace('#', '') || currentId;
    const idx = indexFromId(hashId);
    if (idx) scrollToIndex(idx, { behavior: 'auto' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel/keyboard navigation (desktop only)
  useEffect(() => {
    if (isMobile) return; // allow natural scroll + scroll-snap on mobile

    const onWheel = (e: WheelEvent) => {
      if (isThrottled.current) return;
      const delta = e.deltaY;
      if (Math.abs(delta) < 10) return; // ignore tiny scrolls
      e.preventDefault();
      isThrottled.current = true;

      if (delta > 0 && activeIndex < sections.length - 1) {
        scrollToIndex(activeIndex + 1);
      } else if (delta < 0 && activeIndex > 0) {
        scrollToIndex(activeIndex - 1);
      }

      window.setTimeout(() => { isThrottled.current = false; }, 750);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown","PageDown"].includes(e.key)) {
        e.preventDefault();
        scrollToIndex(Math.min(activeIndex + 1, sections.length - 1));
      } else if (["ArrowUp","PageUp"].includes(e.key)) {
        e.preventDefault();
        scrollToIndex(Math.max(activeIndex - 1, 0));
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToIndex(sections.length - 1);
      }
    };

    // Attach to container for better isolation
    const container = containerRef.current ?? window;
    container.addEventListener('wheel', onWheel as any, { passive: false } as any);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      container.removeEventListener('wheel', onWheel as any);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, sections.length, isMobile]);

  return (
    <div
      ref={containerRef}
      className={[
        "relative",
        isReducedMotion ? "" : "scroll-smooth",
        // use the main area height without header (h-16). Tailwind calc utility
        "h-[calc(100vh-4rem)]",
        // scrolling container
        "overflow-y-auto",
        // snap for mobile and as graceful fallback
        "snap-y snap-mandatory",
      ].join(" ")}
      aria-label="Seções principais"
    >
      {/* Slides */}
      {sections.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          ref={(el) => (sectionRefs.current[i] = el)}
          className="snap-start min-h-[calc(100vh-4rem)] flex items-stretch"
          aria-labelledby={`${s.id}-label`}
        >
          <div className="w-full">
            {/* Optional hidden heading for a11y */}
            <h2 id={`${s.id}-label`} className="sr-only">{s.title}</h2>
            {s.element}
          </div>
        </section>
      ))}

      {/* Dots navigation */}
      <nav
        className="hidden md:flex flex-col gap-2 items-center fixed right-4 top-1/2 -translate-y-1/2 z-30"
        aria-label="Navegação por seções"
      >
        {sections.map((s, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={s.id}
              onClick={() => scrollToIndex(i)}
              className={[
                "w-2.5 h-2.5 rounded-full",
                active ? "bg-primary" : "bg-muted",
                "hover:opacity-90 transition-opacity",
                active ? "ring-2 ring-primary/40" : "",
              ].join(" ")}
              aria-label={`Ir para ${s.title}`}
              title={s.title}
            />
          );
        })}
      </nav>
    </div>
  );
};

export default SectionScroller;
