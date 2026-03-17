import { useEffect, useState } from 'react';

type Err = {
  message: string;
  filename?: string | null;
  lineno?: number | null;
  colno?: number | null;
  stack?: string | null;
};

export default function ErrorOverlay() {
  const [errors, setErrors] = useState<Err[]>([]);

  useEffect(() => {
    const onErr = (ev: ErrorEvent) => {
      setErrors((s) => [
        {
          message: ev.message,
          filename: ev.filename,
          lineno: ev.lineno,
          colno: ev.colno,
          stack: (ev.error && ev.error.stack) || null,
        },
        ...s,
      ]);
    };

    const onRej = (ev: PromiseRejectionEvent) => {
      const reason = ev.reason as any;
      setErrors((s) => [
        {
          message: reason?.message || String(reason),
          stack: reason?.stack || null,
        },
        ...s,
      ]);
    };

    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onRej as any);
    return () => {
      window.removeEventListener('error', onErr);
      window.removeEventListener('unhandledrejection', onRej as any);
    };
  }, []);

  if (!errors.length) return null;

  return (
    <div style={{ position: 'fixed', right: 12, top: 12, zIndex: 99999, maxWidth: '36rem' }}>
      {errors.map((e, i) => (
        <div key={i} style={{ background: 'rgba(255,60,60,0.95)', color: 'white', padding: 12, marginBottom: 8, borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{e.message}</div>
          {e.filename && <div>File: {e.filename}:{e.lineno}:{e.colno}</div>}
          {e.stack && <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{e.stack}</pre>}
        </div>
      ))}
    </div>
  );
}
