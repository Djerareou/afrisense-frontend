import Modal from '@/components/Modal';

type Props = {
  isOpen: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
};

export default function ConfirmDialog({ isOpen, title = 'Confirm', message, onCancel, onConfirm, confirmLabel = 'Confirm' }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} ariaLabel={title}>
      <div className="text-sm text-gray-700">{message}</div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 rounded border">Cancel</button>
        <button onClick={onConfirm} className="px-3 py-2 rounded bg-red-600 text-white">{confirmLabel}</button>
      </div>
    </Modal>
  );
}
