import { useEffect, useRef } from 'react';

export function useMouseParallax(ref: React.RefObject<HTMLDivElement>, intensity = 20) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let mouseX = 0;
    let mouseY = 0;
    let rafId: number;

    const updateParallax = () => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (mouseX - centerX) / centerX * intensity;
      const y = (mouseY - centerY) / centerY * intensity;

      element.style.transform = `translate(${x}px, ${y}px)`;
      rafId = requestAnimationFrame(updateParallax);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [intensity, ref]);
}

