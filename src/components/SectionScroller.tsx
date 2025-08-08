import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollHijack } from "@/hooks/useScrollHijack";

export interface SectionScrollerProps {
  slides: React.ReactNode[];
  className?: string;
  id?: string;
  goToIndex?: number;
  onIndexChange?: (index: number) => void;
}

export function SectionScroller({ slides, className, id, goToIndex, onIndexChange }: SectionScrollerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { currentIndex, scrollProgress, setIndex } = useScrollHijack(sectionRef, slides.length);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    if (typeof goToIndex === 'number' && goToIndex !== currentIndex) {
      setIndex(goToIndex);
    }
  }, [goToIndex, currentIndex, setIndex]);
  // Mobile: lista empilhada, sem hijack
  if (isMobile) {
    return (
      <section id={id} className={cn("relative w-full", className)}>
        <div className="space-y-8">
          {slides.map((slide, i) => (
            <article
              key={i}
              className="min-h-[70vh] rounded-xl card-gradient flex items-center justify-center"
            >
              {slide}
            </article>
          ))}
        </div>
      </section>
    );
  }

  // Desktop: tela cheia com transição entre seções
  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative w-full min-h-[100vh] overflow-hidden", className)}
      aria-roledescription="carousel"
      aria-label="Seções em tela cheia"
    >
      <div className="h-screen relative">
        <div
          className="h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <article key={i} className="h-screen w-full overflow-y-auto">
              <div className="h-full w-full">
                {slide}
              </div>
            </article>
          ))}
        </div>

        {/* Indicadores (pontos) */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2"
          aria-hidden="true"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir para seção ${i + 1}`}
              className={cn(
                "h-2 w-2 rounded-full bg-muted-foreground/30",
                i === currentIndex && "bg-primary"
              )}
            />
          ))}
        </div>

        {/* Barra de progresso */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-muted/30">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
