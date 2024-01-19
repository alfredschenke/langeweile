type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const OPERATORS = ['add', 'subtract', 'multiply', 'divide'] as const;
export const OPERATOR_SYMBOLS = {
  add: '+',
  subtract: '−',
  multiply: '⋅',
  divide: '÷',
} as const;

export type Operator = {
  type: (typeof OPERATORS)[number];
  symbol: (typeof OPERATOR_SYMBOLS)[keyof typeof OPERATOR_SYMBOLS];
};
export type OperatorLimit = ReadonlyArray<'all' | Operator['type']>;

export type Quest = {
  operator: Operator;
  solution: number;
  possibleSolutions: ReadonlyArray<number>;
};

export type StandaloneQuest = Quest & {
  left: number;
  right: number;
};

export type ChainedQuest = Quest & {
  value: number;
};

export type ChainedQuestState = {
  previousResult: number;
  previousQuest?: Quest;
};

export type QuestOptions = {
  limitOperators: OperatorLimit;
  negativeResults: boolean;
  operatorValues: {
    [operator in Operator['type']]: [number, number];
  };
};

export function calculateSolution({ type }: Operator, left: number, right: number): number {
  switch (type) {
    case 'add':
      return left + right;
    case 'subtract':
      return left - right;
    case 'multiply':
      return left * right;
    case 'divide':
      return left / right;

    default: {
      const _exhaustiveCheck: never = type;
      throw new Error(`Unknown operator ${_exhaustiveCheck}`);
    }
  }
}

export function getRandomOperator(limitOperators: OperatorLimit): Operator {
  const operators = limitOperators.includes('all') ? OPERATORS : (limitOperators as typeof OPERATORS);
  const randomIndex = Math.floor(Math.random() * operators.length);

  return {
    type: operators[randomIndex],
    symbol: OPERATOR_SYMBOLS[operators[randomIndex]],
  };
}

export function getRandomValue(from = Infinity, to = Infinity, exclude: number[] = []): number {
  const value = Math.floor(Math.random() * (to - from + 1) + from);
  return exclude.includes(value) ? getRandomValue(from, to, exclude) : value;
}

export function getQuestOptions({
  limitOperators = ['all'],
  negativeResults = false,
  operatorValues = { add: [1, 10], subtract: [1, 10], multiply: [1, 10], divide: [1, 10] },
}: DeepPartial<QuestOptions> = {}): QuestOptions {
  return { limitOperators, negativeResults, operatorValues } as QuestOptions;
}

export function generateStandaloneQuest(options: DeepPartial<QuestOptions> = {}): StandaloneQuest {
  const { limitOperators, negativeResults, operatorValues } = getQuestOptions(options);
  const operator = getRandomOperator(limitOperators);
  const [valuesFrom, valuesTo] = operatorValues[operator.type];
  const left = getRandomValue(valuesFrom, valuesTo);
  const right = getRandomValue(valuesFrom, valuesTo);
  const solution = calculateSolution(operator, left, right);

  // prevent negative results if configured
  if (!negativeResults && solution < 0) {
    return generateStandaloneQuest(options);
  }

  // generate multiple choices
  const alternativeSolutionA = getRandomValue(valuesFrom, valuesTo, [solution]);
  const alternativeSolutionB = getRandomValue(valuesFrom, valuesTo, [solution, alternativeSolutionA]);
  const possibleSolutions = shuffle([solution, alternativeSolutionA, alternativeSolutionB]);

  return { operator, left, right, solution, possibleSolutions };
}

export function generateChainedQuest(
  state: ChainedQuestState,
  options: DeepPartial<QuestOptions> = {},
): ChainedQuest {
  const { previousResult = 0 } = state;
  const { limitOperators, operatorValues } = getQuestOptions(options);
  const operator = getRandomOperator(limitOperators);
  const [valuesFrom, valuesTo] = operatorValues[operator.type];
  const right = getRandomValue(valuesFrom, valuesTo);
  const solution = calculateSolution(operator, previousResult, right);
  const possibleSolutions = [solution];

  return { operator, value: right, solution, possibleSolutions };
}
