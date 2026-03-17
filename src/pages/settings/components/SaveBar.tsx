import { Save } from 'lucide-react';

export default function SaveBar({
  saving,
  saveMessage,
  onSave,
}: {
  saving: boolean;
  saveMessage: string | null;
  onSave: () => void;
}) {
  return (
    <div className="flex justify-end items-center gap-4">
      {saveMessage && <div className="text-sm text-green-600">{saveMessage}</div>}
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
      >
        <Save size={16} />
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </div>
  );
}
