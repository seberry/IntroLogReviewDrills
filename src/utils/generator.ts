// Logic formula generator utilities

const ATOMS = ['P', 'Q', 'R', 'S'];

export type ConnectiveTypes = {
  unary?: string[];
  binary?: string[];
};

export const ALL_CONNECTIVES: Required<ConnectiveTypes> = {
  binary: ['&', 'v', '->', '<->'],
  unary: ['~'],
};

const randomChoice = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const generateFormula = (depth: number, connectives: ConnectiveTypes): string => {
  const availableOpTypes = Object.entries(connectives)
    .filter(([, ops]) => ops && ops.length > 0)
    .map(([type]) => type as keyof ConnectiveTypes);

  if (depth <= 0 || Math.random() < 0.25) {
    return randomChoice(ATOMS);
  }

  if (availableOpTypes.length === 0) {
    return randomChoice(ATOMS);
  }

  const opType = randomChoice(availableOpTypes);

  if (opType === 'unary') {
    const unaryOps = connectives.unary ?? [];
    const op = randomChoice(unaryOps);
    const subFormula = generateFormula(depth - 1, connectives);
    return `(${op}${subFormula})`;
  }

  const binaryOps = connectives.binary ?? [];
  const op = randomChoice(binaryOps);
  const left = generateFormula(depth - 1, connectives);
  const right = generateFormula(depth - 1, connectives);
  return `(${left} ${op} ${right})`;
};

export const DEFAULT_MAX_DEPTH = 2;
export const DEFAULT_NUM_PREMISES_RANGE: [number, number] = [2, 3];
