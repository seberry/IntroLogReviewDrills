import { useEffect, useMemo, useState } from 'react';

export type ActivityId = 'tfl-subproof' | 'fol-checklist' | 'error-spotting' | 'nested-quantifiers';

export interface ActivityStats {
  id: ActivityId;
  streak: number;
  maxStreak: number;
  score: number;
}

type ActivityStatsMap = Record<ActivityId, ActivityStats>;

const STORAGE_KEY = 'activity-stats';

const defaultStats: ActivityStatsMap = {
  'tfl-subproof': { id: 'tfl-subproof', streak: 0, maxStreak: 0, score: 0 },
  'fol-checklist': { id: 'fol-checklist', streak: 0, maxStreak: 0, score: 0 },
  'error-spotting': { id: 'error-spotting', streak: 0, maxStreak: 0, score: 0 },
  'nested-quantifiers': { id: 'nested-quantifiers', streak: 0, maxStreak: 0, score: 0 },
};

function loadStats(): ActivityStatsMap {
  if (typeof window === 'undefined') {
    return defaultStats;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultStats;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ActivityStatsMap>;
    return { ...defaultStats, ...parsed } satisfies ActivityStatsMap;
  } catch (error) {
    console.warn('Failed to parse stored activity stats', error);
    return defaultStats;
  }
}

export function useActivityStats() {
  const [stats, setStats] = useState<ActivityStatsMap>(() => loadStats());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const recordResult = (id: ActivityId, isCorrect: boolean) => {
    setStats((previous) => {
      const activity = previous[id];
      const updated: ActivityStats = isCorrect
        ? {
            ...activity,
            streak: activity.streak + 1,
            maxStreak: Math.max(activity.maxStreak, activity.streak + 1),
            score: activity.score + 1,
          }
        : {
            ...activity,
            streak: 0,
            maxStreak: activity.maxStreak,
            score: activity.score - 2,
          };

      return { ...previous, [id]: updated } satisfies ActivityStatsMap;
    });
  };

  const recordCorrect = (id: ActivityId) => recordResult(id, true);
  const recordIncorrect = (id: ActivityId) => recordResult(id, false);

  const statsList = useMemo(() => Object.values(stats), [stats]);

  return { stats, statsList, recordResult, recordCorrect, recordIncorrect };
}
