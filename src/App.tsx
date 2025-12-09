import React from 'react';
import {
  ErrorSpottingActivity,
  FolChecklistActivity,
  NestedQuantifiersActivity,
  TFLSubproofActivity,
} from './activities';
import { ActivityId, useActivityStats } from './hooks/useActivityStats';

const activities: {
  id: ActivityId;
  title: string;
  description: string;
  Component: React.ComponentType<{ onCorrect: (id: ActivityId) => void }>;
}[] = [
  {
    id: 'tfl-subproof',
    title: 'TFL Subproof Drill',
    description: 'How many subproofs does this rule need?',
    Component: TFLSubproofActivity,
  },
  {
    id: 'fol-checklist',
    title: 'FOL Proof Checklist',
    description: 'Warm-up checklist linking to the proof checker.',
    Component: FolChecklistActivity,
  },
  {
    id: 'error-spotting',
    title: 'Spot the Error',
    description: 'Find the invalid justification in a proof.',
    Component: ErrorSpottingActivity,
  },
  {
    id: 'nested-quantifiers',
    title: 'Nested Quantifiers',
    description: 'Model check quick first-order sentences.',
    Component: NestedQuantifiersActivity,
  },
];

export default function App() {
  const { stats, statsList, recordCorrect } = useActivityStats();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Intro Logic Review Drills</p>
            <h1 className="text-3xl font-bold text-slate-900">Main Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Phase 1 shell: track your streaks while we build each activity.
            </p>
          </div>
          <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-inner">
            <p className="font-semibold">Total streaks</p>
            <div className="flex gap-4 text-sm sm:text-base">
              <div>
                <span className="font-semibold">Active streaks:</span> {statsList.reduce((sum, item) => sum + item.streak, 0)}
              </div>
              <div>
                <span className="font-semibold">Max streaks:</span> {statsList.reduce((sum, item) => sum + item.maxStreak, 0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {activities.map(({ id, title, description, Component }) => {
            const activityStats = stats[id];
            return (
              <article
                key={id}
                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Activity</p>
                    <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                    <p className="text-sm text-slate-600">{description}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Coming Soon
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Streak</dt>
                    <dd className="text-lg font-bold text-slate-900">{activityStats.streak}</dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Max Streak</dt>
                    <dd className="text-lg font-bold text-slate-900">{activityStats.maxStreak}</dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Score</dt>
                    <dd className="text-lg font-bold text-slate-900">{activityStats.score}</dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-4">
                  <Component onCorrect={recordCorrect} />
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
