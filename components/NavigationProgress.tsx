'use client';

import React, { Suspense, useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function NavigationProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Complete progress whenever the pathname or search parameters change
  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setProgress(0), 200);
      }, 250);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept internal link clicks to trigger immediate progress feedback
  useEffect(() => {
    let trickleInterval: NodeJS.Timeout;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;

      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external, anchor links, mailto, tel, target="_blank", or download links
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      // Check if it's the exact current URL
      const currentFull = window.location.pathname + window.location.search;
      if (href === currentFull) return;

      // Start smart progress
      setIsVisible(true);
      setProgress(25);

      clearInterval(trickleInterval);
      trickleInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(trickleInterval);
            return 85;
          }
          return prev + Math.floor(Math.random() * 15 + 8);
        });
      }, 150);

      startTransition(() => {
        // Navigation starts
      });
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      clearInterval(trickleInterval);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] h-[2.5px] pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-km-green-300 via-km-green-500 to-km-green-700 shadow-[0_0_8px_rgba(143,209,158,0.7)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '200ms' : '250ms',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressBarInner />
    </Suspense>
  );
}

