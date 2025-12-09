import { ActivityId } from '../hooks/useActivityStats';

interface ActivityProps {
  onCorrect: (id: ActivityId) => void;
}

export function NestedQuantifiersActivity({ onCorrect }: ActivityProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">Coming soon: check sentences against small models.</p>
      <button
        type="button"
        onClick={() => onCorrect('nested-quantifiers')}
        className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
      >
        Mark Correct
      </button>
    </div>
  );
}
