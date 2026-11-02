import { useEffect } from "react";
import Button from "./Button.jsx";

export default function Modal({ open, title, children, onClose, onConfirm, confirmText = "Confirm", confirmVariant = "danger", busy = false }) {
  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape" && !busy) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, busy]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="modal-title" className="text-xl font-bold text-slate-900">{title}</h2>
        <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant={confirmVariant} onClick={onConfirm} disabled={busy}>{busy ? "Please wait..." : confirmText}</Button>
        </div>
      </section>
    </div>
  );
}
