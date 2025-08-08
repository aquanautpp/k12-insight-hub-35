import { useEffect, useState, RefObject } from 'react';

/**
 * Hook de progresso de leitura baseado no scroll de um container.
 * Retorna um valor entre 0 e 100.
 */
export const useReadingProgress = (targetRef?: RefObject<HTMLElement>) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getEl = () => targetRef?.current || document.documentElement;

    const handleScroll = () => {
      const el = getEl();
      const isDoc = el === document.documentElement;
      const scrollTop = isDoc
        ? (window.scrollY || document.documentElement.scrollTop || 0)
        : (el as HTMLElement).scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const total = Math.max(scrollHeight - clientHeight, 1);
      const pct = Math.min(100, Math.max(0, (scrollTop / total) * 100));
      setProgress(pct);
    };

    const el = getEl();
    const scrollTarget: any = targetRef?.current ? targetRef.current : window;

    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
    };
  }, [targetRef]);

  return progress;
};
