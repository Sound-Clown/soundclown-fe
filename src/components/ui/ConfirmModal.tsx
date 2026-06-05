"use client";

import Modal from "./Modal";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  danger = false,
  loading = false,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}>) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-[var(--text-secondary)]">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="rounded-lg px-4 py-2 text-sm text-white hover:bg-elevated disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 ${
            danger
              ? "bg-danger text-white hover:opacity-90"
              : "bg-accent text-black hover:bg-accent-hover"
          }`}
        >
          {loading ? "Đang xử lý..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
