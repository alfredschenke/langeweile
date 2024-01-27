// https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export type Quest = {
  solution: Date;
  possibleSolutions: ReadonlyArray<Date>;
};

export type QuestOptions = {
  alternatives: number;
  roundMinutes: number;
};

/**
 * Generates a random date. Minutes can be rounded to a given number.
 * E.g. roundMinutes = 15 will round the minutes to 0, 15, 30 or 45.
 */
export function getRandomTime(roundMinutes?: number, exclude: Date[] = []): Date {
  const h = Math.floor(Math.random() * 24);
  let m = Math.floor(Math.random() * 60);
  if (roundMinutes) {
    m = Math.round(m / roundMinutes) * roundMinutes;
  }
  const time = new Date(0, 0, 0, h, m);

  if (exclude.some((t) => +t === +time)) {
    return getRandomTime(roundMinutes, exclude);
  }
  return time;
}

export function generateQuest({ alternatives = 2, roundMinutes = 15 }: Partial<QuestOptions> = {}): Quest {
  const solution = getRandomTime(roundMinutes);

  // generate alternative solutions
  const alternativeSolutions = [];
  for (let i = 0; i < alternatives; i += 1) {
    const alternativeSolution = getRandomTime(roundMinutes, [solution, ...alternativeSolutions]);
    alternativeSolutions.push(alternativeSolution);
  }

  const possibleSolutions = shuffle([solution, ...alternativeSolutions]);

  return { solution, possibleSolutions };
}
