import { ActivityId } from '../hooks/useActivityStats';

interface ActivityProps {
  onCorrect: (id: ActivityId) => void;
}

export function TFLSubproofActivity({ onCorrect }: ActivityProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">Coming soon: practice setting up subproof structures.</p>
      <button
        type="button"
        onClick={() => onCorrect('tfl-subproof')}
        className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
      >
        Mark Correct
      </button>
    </div>
  );
}
