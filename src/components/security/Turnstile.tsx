import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (selectorOrElement: string | HTMLElement, options: any) => void;
      reset?: (element: HTMLElement) => void;
    };
  }
}

interface TurnstileProps {
  siteKey?: string; // if not provided, will use env VITE_TURNSTILE_SITE_KEY
  onVerify: (token: string) => void;
  onError?: (error: any) => void;
  onExpire?: () => void;
}

export function Turnstile({ siteKey, onVerify, onError, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const key = siteKey || import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!key) {
      console.warn('Turnstile: missing site key (VITE_TURNSTILE_SITE_KEY)');
      return;
    }

    const init = () => {
      if (!window.turnstile || !containerRef.current) return;
      window.turnstile.render(containerRef.current, {
        sitekey: key,
        theme: 'auto',
        size: 'normal',
        callback: (token: string) => onVerify(token),
        'error-callback': (err: any) => onError?.(err),
        'expired-callback': () => onExpire?.(),
      });
    };

    // If script already loaded, render immediately, else wait for it
    if (window.turnstile) {
      init();
    } else {
      const id = 'cf-turnstile-api';
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => init();
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', init);
      }
    }

    return () => {
      // No explicit cleanup API needed; widget follows element lifecycle
    };
  }, [siteKey, onVerify, onError, onExpire]);

  return (
    <div ref={containerRef} className="cf-turnstile" />
  );
}

export default Turnstile;
