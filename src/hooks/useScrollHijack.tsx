import { useEffect, useState, useRef, RefObject } from 'react';

interface UseScrollHijackReturn {
  isHijacked: boolean;
  currentIndex: number;
  scrollProgress: number;
  setIndex: (index: number) => void;
}

export const useScrollHijack = (
  sectionRef: RefObject<HTMLElement>,
  itemCount: number
): UseScrollHijackReturn => {
  const [isHijacked, setIsHijacked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isScrollingRef = useRef(false);

  const setIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(i, Math.max(itemCount - 1, 0)));
    setCurrentIndex(clamped);
  };
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHijacked(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(section);

    const handleWheel = (e: WheelEvent) => {
      if (!isHijacked || isScrollingRef.current) return;

      // Allow inner content to scroll until reaching edges
      const section = sectionRef.current;
      if (section) {
        const slides = section.querySelectorAll('article');
        const activeSlide = slides[currentIndex] as HTMLElement | undefined;
        if (activeSlide) {
          const scTop = activeSlide.scrollTop;
          const scH = activeSlide.scrollHeight;
          const clH = activeSlide.clientHeight;
          const atTop = scTop <= 0;
          const atBottom = Math.ceil(scTop + clH) >= scH;

          if (e.deltaY > 0 && !atBottom) {
            // let inner scroll handle it
            return;
          }
          if (e.deltaY < 0 && !atTop) {
            return;
          }
        }
      }

      const canScrollNext = e.deltaY > 0 && currentIndex < itemCount - 1;
      const canScrollPrev = e.deltaY < 0 && currentIndex > 0;

      if (canScrollNext || canScrollPrev) {
        e.preventDefault();
        isScrollingRef.current = true;

        if (canScrollNext) {
          setCurrentIndex((prev) => prev + 1);
        } else if (canScrollPrev) {
          setCurrentIndex((prev) => prev - 1);
        }

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHijacked || isScrollingRef.current) return;

      if (e.key === 'ArrowDown' && currentIndex < itemCount - 1) {
        e.preventDefault();
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHijacked, currentIndex, itemCount, sectionRef]);

  useEffect(() => {
    setScrollProgress((currentIndex / Math.max(itemCount - 1, 1)) * 100);
  }, [currentIndex, itemCount]);

  return { isHijacked, currentIndex, scrollProgress, setIndex };
};