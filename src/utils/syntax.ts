/*
 * Copyright (C) Kevin C. Klement
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

// Helper: Basic symbol replacement
export const symReplaceNN = (s: string): string => {
  let fs = s;
  fs = fs.replace(/<[-−]*>/g, '↔');
  fs = fs.replace(/[-−]*>/g, '→');
  fs = fs.replace(/&/g, '∧');
  fs = fs.replace(/\^/g, '∧');
  fs = fs.replace(/v/g, '∨');
  fs = fs.replace(/~/g, '¬');
  return fs;
};

// Helper: Negation replacement
export const negReplace = (s: string): string => {
  let fs = s;
  fs = fs.replace(/~/g, '¬');
  fs = fs.replace(/∼/g, '¬');
  fs = fs.replace(/-/g, '¬');
  return fs;
};

// Helper: Main replacement wrapper
export const symReplace = (s: string): string => negReplace(symReplaceNN(s));

// Main Function 1: Fix Input
export const fixWffInputStr = (s: string): string => {
  let fs = symReplace(s);
  fs = fs.replace(/ /g, ' ');
  fs = fs.replace(/^\s/, '');
  fs = fs.replace(/\s*$/, '');
  return fs;
};

// Main Function 2: Pretty Print
export const prettyStr = (s: string): string => {
  let ps = s;
  ps = ps.replace(/\s*¬\s*/g, '¬');
  ps = ps.replace(/\s*∨\s*/g, ' ∨ ');
  ps = ps.replace(/\s*→\s*/g, ' → ');
  ps = ps.replace(/\s*↔\s*/g, ' ↔ ');
  ps = ps.replace(/\s*∧\s*/g, ' ∧ ');
  ps = ps.replace(/\s*=\s*/g, ' = ');
  return ps;
};
