/*
 * Fitch proof styling component.
 *
 * Copyright (C) 2016 Kevin C. Klement
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';

export interface ProofLine {
  id: string;
  formula: string;
  justification: string;
  depth: number;
  isHypothesis?: boolean;
  highlight?: boolean;
}

interface FitchDisplayProps {
  lines: ProofLine[];
}

export function FitchDisplay({ lines }: FitchDisplayProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {lines.map((line) => (
          <tr key={line.id} className={line.highlight ? 'bg-red-100' : undefined}>
            <td className="text-right pr-2 text-gray-500 align-top">{line.id}</td>
            {Array.from({ length: line.depth }).map((_, index) => (
              <td key={`mid-${line.id}-${index}`} className="w-2 border-l-2 border-black align-top" />
            ))}
            <td
              className={`px-2 align-top${line.isHypothesis ? ' border-b-2 border-black' : ''}`}
            >
              {line.formula}
            </td>
            <td className="italic text-gray-700 align-top">{line.justification}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FitchDisplay;
