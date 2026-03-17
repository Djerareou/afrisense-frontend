import React, { useEffect, useRef } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  ariaLabel?: string;
};

// A small accessible modal with focus trap and Escape handler.
export default function Modal({ isOpen, onClose, title, children, closeOnBackdropClick = true, ariaLabel }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    if (dialog) {
      // focus first focusable element inside dialog, or dialog itself
      const focusable = dialog.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable || dialog).focus();
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab') {
        // simple focus trap
        const dialogEl = dialogRef.current;
        if (!dialogEl) return;
        const focusableEls = Array.from(
          dialogEl.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
        ).filter((el) => el.offsetParent !== null);
        if (focusableEls.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // restore focus
      if (previouslyFocused.current && previouslyFocused.current.focus) previouslyFocused.current.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onMouseDown={(e) => {
          if (!closeOnBackdropClick) return;
          // ensure clicks on backdrop (not dialog) close
          if (e.target === overlayRef.current) onClose();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={title ? 'modal-title' : undefined}
        ref={dialogRef}
        tabIndex={-1}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 z-10"
      >
        {title && (
          <h2 id="modal-title" className="text-lg font-medium mb-2">
            {title}
          </h2>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
