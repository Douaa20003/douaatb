"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-cocoa-800/30 backdrop-blur-sm"
        aria-label="Fermer"
        onClick={onCancel}
      />
      <div className="card-surface relative z-10 w-full max-w-md p-6 animate-fade-up">
        <h3 className="font-display text-2xl text-cocoa-800">{title}</h3>
        <p className="mt-2 text-cocoa-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn-primary bg-rose-600 hover:bg-rose-600/90"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Suppression..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
