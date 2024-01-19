export const QUEST_MODE = [
  // chained quests, each quest depends on previous one
  'chained',
  // standalone quests, each isolated from each other
  'standalone',
] as const;

export const END_MODE = [
  // game ends when time runs out
  'time',
  // game ends when amount of errors is reached
  'errors',
] as const;
