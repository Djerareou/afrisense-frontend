import { useEffect, useRef } from 'react';

/**
 * Turnstile component — Cloudflare Turnstile integration.
 *
 * Responsibilities:
 * - Dynamically loads the Turnstile script if not present.
 * - Renders the widget into the provided container element.
 * - Emits lifecycle events to the parent via onVerify/onExpire/onError.
 *
 * Notes:
 * - The component avoids sending any sensitive data to the provider.
 * - The frontend only receives a short-lived token which should be
 *   forwarded to the server and verified server-side (see backend spec).
 * - The component intentionally keeps side-effects minimal and cleans
 *   up listeners where applicable.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (selectorOrElement: string | HTMLElement, options: any) => void;
      reset?: (element: HTMLElement) => void;
    };
  }
}

/**
 * Public helper: attempts to coerce various shapes into a plain site key string.
 * Useful for callers that may accidentally pass an env object or small config.
 */
export function resolveTurnstileSiteKey(k: any): string | undefined {
  if (typeof k === 'string') return k;
  if (!k || typeof k !== 'object') return undefined;
  const tryKeys = ['sitekey', 'siteKey', 'SITE_KEY', 'key', 'value', 'VITE_TURNSTILE_SITE_KEY'];
  for (const tk of tryKeys) {
    if (tk in k && typeof (k as any)[tk] === 'string' && (k as any)[tk].trim()) {
      return (k as any)[tk] as string;
    }
  }
  // Fallback: pick the first string-like property that looks like a key
  const props = Object.keys(k);
  for (const p of props) {
    if (typeof (k as any)[p] === 'string' && (k as any)[p].trim().length > 6) {
      return (k as any)[p] as string;
    }
  }
  return undefined;
}

interface TurnstileProps {
  /** Public site key (VITE_TURNSTILE_SITE_KEY used when omitted) */
  siteKey?: string;
  /** Called when provider issues a token (one-time use) */
  onVerify: (token: string) => void;
  /** Optional: called when widget reports an error */
  onError?: (error: any) => void;
  /** Optional: called when token expires and user needs to solve again */
  onExpire?: () => void;
  /** Optional: widget theme override */
  theme?: 'light' | 'dark' | 'auto';
  /** Optional: size override */
  size?: 'normal' | 'compact';
}

export default function Turnstile({ siteKey, onVerify, onError, onExpire, theme = 'auto', size = 'normal' }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Track whether we've already rendered the widget for this instance.
  const renderedRef = useRef(false);

  useEffect(() => {
    // Resolve the site key from props or env. If missing, log and noop.
    const key = siteKey || import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!key) {
      const err = new Error('[Turnstile] missing site key (VITE_TURNSTILE_SITE_KEY). Widget will not render.');
      console.warn(err.message);
      onError?.(err);
      return;
    }

  // Initialize the widget once the external script is available
    const init = () => {
      if (!window.turnstile || !containerRef.current) return;
      if (renderedRef.current) return; // prevent duplicate renders on re-renders
      try {
        // Diagnostic: log the raw key type/value (truncated) to help
        // locate mis-configurations where an object is passed instead
        // of the plain site key string.
        try {
          if (typeof key === 'object') {
            const preview = JSON.stringify(key, Object.keys(key).slice(0, 5)).slice(0, 200);
            console.warn('[Turnstile] received non-string site key (object). preview:', preview);
          } else {
            // don't log the full key in console to avoid accidental leaks; log length only
            if (import.meta.env.DEV) console.debug('[Turnstile] site key type:', typeof key, 'length:', (key as string).length);
          }
        } catch (e) {
          // ignore logging errors
        }
        // The provider strictly expects a string sitekey. In some setups
        // the value may be passed as an object (for example someone placed
        // a small config object into the env). Try to recover gracefully
        // by extracting a string from several common shapes.
        const resolvedKey = resolveTurnstileSiteKey(key);
        if (!resolvedKey) {
          const typeErr = new Error(`[Turnstile] invalid site key type: expected string, got ${typeof key}`);
          console.error(typeErr, key);
          onError?.(typeErr);
          return;
        }

        // Do NOT set `data-sitekey` here. The Cloudflare script will auto-scan
        // elements with that attribute and auto-render them on load. If we
        // both set the attribute and call `turnstile.render()` we can end up
        // with duplicate widgets. Avoid the attribute to keep control and
        // render explicitly.

        // Debug helper: log the resolved key type (avoid logging the key value in production)
        if (import.meta.env.DEV) {
          console.debug('[Turnstile] rendering widget with resolved sitekey (length):', resolvedKey.length);
        }

        window.turnstile.render(containerRef.current, {
          sitekey: resolvedKey,
          theme,
          size,
          callback: (token: string) => onVerify(token),
          'error-callback': (err: any) => onError?.(err),
          'expired-callback': () => onExpire?.(),
        });
        renderedRef.current = true;
      } catch (err) {
        // Surface errors but don't throw — parent can decide how to handle UX
        console.error('[Turnstile] failed to render widget', err);
        onError?.(err);
      }
    };

    // DEV-only visual diagnostic: show resolved key type/preview on the page
    // This helps when the site key is accidentally passed as an object.
    let debugEl: HTMLDivElement | null = null;
    if (import.meta.env.DEV) {
      try {
        debugEl = document.createElement('div');
        debugEl.style.position = 'fixed';
        debugEl.style.right = '8px';
        debugEl.style.bottom = '8px';
        debugEl.style.zIndex = '99999';
        debugEl.style.background = 'rgba(0,0,0,0.7)';
        debugEl.style.color = 'white';
        debugEl.style.padding = '6px 8px';
        debugEl.style.borderRadius = '6px';
        debugEl.style.fontSize = '12px';
        const keyType = typeof key;
        let preview = keyType === 'object' ? JSON.stringify(key, Object.keys(key).slice(0,5)).slice(0,200) : `string(len=${(key as string).length})`;
        debugEl.textContent = `[Turnstile debug] siteKey type: ${keyType} preview: ${preview}`;
        document.body.appendChild(debugEl);
      } catch (e) {
        // ignore
      }
    }

    // If script already present, render immediately. Otherwise, load it.
    if (window.turnstile) {
      init();
      return;
    }

    const SCRIPT_ID = 'cf-turnstile-api';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  script.async = true;
  script.defer = true;
  // Request anonymous CORS-enabled error reporting so the browser can
  // show useful stack traces instead of the generic "Script error.".
  // This requires the external script to be served with the
  // Access-Control-Allow-Origin header (Cloudflare provides this).
  script.crossOrigin = 'anonymous';
      script.onload = () => init();
      script.onerror = (ev) => {
        console.error('[Turnstile] failed to load external script', ev);
        onError?.(new Error('Failed to load Turnstile script'));
      };
      document.head.appendChild(script);
    } else {
      // Already inserted by another component — attach a one-time listener
      script.addEventListener('load', init);
    }

    // Try to reset/cleanup the widget on unmount if provider exposes reset.
    return () => {
      try {
        if (renderedRef.current && window.turnstile && containerRef.current && typeof window.turnstile.reset === 'function') {
          window.turnstile.reset(containerRef.current);
        }
      } catch (e) {
        // best-effort cleanup; swallow errors
      } finally {
        renderedRef.current = false;
      }
      // Remove DEV debug element if present
      try {
        if (debugEl && debugEl.parentNode) {
          debugEl.parentNode.removeChild(debugEl);
        }
      } catch (e) {
        // ignore
      }
      // Do not remove the shared script element here; other components may use it.
    };
  }, [siteKey, onVerify, onError, onExpire, theme, size]);

  // The Turnstile provider renders into this div. We intentionally avoid
  // exposing internal markup — the provider controls the accessible widget.
  // Use a neutral class name to avoid any automatic rendering the external
  // Cloudflare script might perform when detecting well-known selectors.
  return <div ref={containerRef} className="turnstile-wrapper" aria-hidden={false} />;
}
