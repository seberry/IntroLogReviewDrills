import { useEffect, useMemo, useState } from 'react';
import { FitchDisplay, ProofLine } from '../components/FitchDisplay';
import { ActivityId } from '../hooks/useActivityStats';
import { ALL_CONNECTIVES, generateFormula } from '../utils/generator';
import { fixWffInputStr, prettyStr } from '../utils/syntax';

type Rule = 'vE' | 'vI' | 'iffI' | 'iffE' | '~E' | 'IP';

type SubproofExpectation = {
  assumption: string;
  conclusion: string;
};

type Scenario = {
  rule: Rule;
  phi: string;
  psi: string;
  chi: string;
  contextLines: ProofLine[];
  expectedSubproofs: SubproofExpectation[];
};

const RULE_LABELS: Record<Rule, string> = {
  vE: '∨ Elimination (∨E)',
  vI: '∨ Introduction (∨I)',
  iffI: '↔ Introduction (↔I)',
  iffE: '↔ Elimination (↔E)',
  '~E': '¬ Elimination (¬E)',
  IP: 'Indirect Proof (IP)',
};

interface ActivityProps {
  onCorrect: (id: ActivityId) => void;
  onIncorrect?: (id: ActivityId) => void;
}

const normalize = (input: string): string => fixWffInputStr(input ?? '');

const generateRandomFormula = () => prettyStr(generateFormula(2, ALL_CONNECTIVES));

const buildScenario = (): Scenario => {
  const phi = generateRandomFormula();
  const psi = generateRandomFormula();
  let chi = generateRandomFormula();

  const rule: Rule = ['vE', 'vI', 'iffI', 'iffE', '~E', 'IP'][Math.floor(Math.random() * 6)] as Rule;

  const contextLines: ProofLine[] = [];
  const expectedSubproofs: SubproofExpectation[] = [];

  switch (rule) {
    case 'vE': {
      contextLines.push({ id: '1', formula: `${phi} ∨ ${psi}`, justification: 'Pr', depth: 0 });
      expectedSubproofs.push(
        { assumption: phi, conclusion: chi },
        { assumption: psi, conclusion: chi },
      );
      break;
    }
    case 'vI': {
      chi = `${phi} ∨ ${psi}`;
      contextLines.push({ id: '1', formula: phi, justification: 'Pr', depth: 0 });
      // Trick question: no subproofs needed for ∨I
      break;
    }
    case 'iffI': {
      chi = `${phi} ↔ ${psi}`;
      expectedSubproofs.push(
        { assumption: phi, conclusion: psi },
        { assumption: psi, conclusion: phi },
      );
      break;
    }
    case 'iffE': {
      const deriveRight = Math.random() < 0.5;
      const start = deriveRight ? phi : psi;
      const conclusion = deriveRight ? psi : phi;
      contextLines.push(
        { id: '1', formula: `${phi} ↔ ${psi}`, justification: 'Pr', depth: 0 },
        { id: '2', formula: start, justification: 'Pr', depth: 0 },
      );
      chi = conclusion;
      return { rule, phi, psi, chi, contextLines, expectedSubproofs } satisfies Scenario;
    }
    case '~E': {
      contextLines.push(
        { id: '1', formula: phi, justification: 'Pr', depth: 0 },
        { id: '2', formula: `¬${phi}`, justification: 'Pr', depth: 0 },
      );
      chi = '⊥';
      return { rule, phi, psi, chi, contextLines, expectedSubproofs } satisfies Scenario;
    }
    case 'IP': {
      expectedSubproofs.push({ assumption: `¬${chi}`, conclusion: '⊥' });
      break;
    }
    default:
      break;
  }

  return { rule, phi, psi, chi, contextLines, expectedSubproofs } satisfies Scenario;
};

export function TFLSubproofActivity({ onCorrect, onIncorrect }: ActivityProps) {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [subproofInputs, setSubproofInputs] = useState<SubproofExpectation[]>([]);
  const [feedback, setFeedback] = useState<string>('');

  const reset = () => {
    const nextScenario = buildScenario();
    setScenario(nextScenario);
    setSelectedCount(null);
    setSubproofInputs([]);
    setFeedback('');
  };

  useEffect(() => {
    reset();
  }, []);

  const expectedCount = scenario?.expectedSubproofs.length ?? 0;

  const promptText = useMemo(() => {
    if (!scenario) return '';
    const ruleLabel = RULE_LABELS[scenario.rule];
    return `You want to derive ${scenario.chi} using ${ruleLabel}. How is this rule structured?`;
  }, [scenario]);

  useEffect(() => {
    if (selectedCount && selectedCount > 0) {
      setSubproofInputs((current) => {
        const existing = [...current];
        while (existing.length < selectedCount) {
          existing.push({ assumption: '', conclusion: '' });
        }
        return existing.slice(0, selectedCount);
      });
    } else {
      setSubproofInputs([]);
    }
  }, [selectedCount]);

  const handleSubproofChange = (index: number, field: keyof SubproofExpectation, value: string) => {
    setSubproofInputs((current) => {
      const updated = [...current];
      updated[index] = { ...updated[index], [field]: value } as SubproofExpectation;
      return updated;
    });
  };

  const checkAnswer = () => {
    if (!scenario) return;

    if (selectedCount === null) {
      setFeedback('Select how many subproofs the rule needs.');
      onIncorrect?.('tfl-subproof');
      return;
    }

    if (selectedCount !== expectedCount) {
      setFeedback('That is not the right number of subproofs for this rule.');
      onIncorrect?.('tfl-subproof');
      return;
    }

    if (expectedCount === 0) {
      setFeedback('Correct! This rule does not require any subproofs.');
      onCorrect('tfl-subproof');
      return;
    }

    const isStructureCorrect = scenario.expectedSubproofs.every((expected, index) => {
      const user = subproofInputs[index];
      if (!user) return false;
      return (
        normalize(user.assumption) === normalize(expected.assumption) &&
        normalize(user.conclusion) === normalize(expected.conclusion)
      );
    });

    if (isStructureCorrect) {
      setFeedback('Correct! You set up the subproof(s) properly.');
      onCorrect('tfl-subproof');
    } else {
      setFeedback('Not quite. Check the assumptions and conclusions required by this rule.');
      onIncorrect?.('tfl-subproof');
    }
  };

  if (!scenario) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-800">
        <p className="font-semibold">Rule:</p>
        <p>{RULE_LABELS[scenario.rule]}</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-800">Context Line</p>
        {scenario.contextLines.length > 0 ? (
          <FitchDisplay lines={scenario.contextLines} />
        ) : (
          <p className="text-sm text-slate-600">No starting lines provided for this rule. Set up the subproof(s) from scratch.</p>
        )}
      </div>

      <p className="text-sm text-slate-800">{promptText}</p>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">How many subproofs?</p>
          <div className="mt-1 flex gap-4 text-sm text-slate-700">
            {[0, 1, 2].map((count) => (
              <label key={count} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subproof-count"
                  value={count}
                  checked={selectedCount === count}
                  onChange={() => setSelectedCount(count)}
                  className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                {count}
              </label>
            ))}
          </div>
        </div>

        {selectedCount !== null && selectedCount > 0 && (
          <div className="space-y-4">
            {Array.from({ length: selectedCount }).map((_, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">Subproof {index + 1}</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm text-slate-700">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Assumption (Top)</span>
                    <input
                      type="text"
                      value={subproofInputs[index]?.assumption ?? ''}
                      onChange={(event) => handleSubproofChange(index, 'assumption', event.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </label>
                  <label className="text-sm text-slate-700">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Conclusion (Bottom)</span>
                    <input
                      type="text"
                      value={subproofInputs[index]?.conclusion ?? ''}
                      onChange={(event) => handleSubproofChange(index, 'conclusion', event.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {feedback && <p className="text-sm font-semibold text-slate-800">{feedback}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={checkAnswer}
          className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
        >
          Check Answer
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 shadow hover:bg-slate-200"
        >
          New Challenge
        </button>
      </div>
    </div>
  );
}
