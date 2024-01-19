/* eslint-disable max-classes-per-file */
declare module 'rollup-plugin-serve' {
  import type { Plugin } from 'rollup';

  type ServeOptions = {
    contentBase: string | string[];
    historyApiFallback: boolean | string;
    host: string;
    open: boolean;
    openPage: string;
    port: number;
    verbose: boolean;
  };
  const serve: (options: Partial<ServeOptions>) => Plugin;
  export default serve;
}

declare module 'connect4-ai' {
  export type Solution = {
    column: number;
    spacesFromBottom: number;
  }[];

  export type GameStatus = {
    movesPlayed: number;
    currentPlayer: 1 | 2;
  } & (
    | {
        gameOver: false;
      }
    | {
        gameOver: true;
        winner: 1 | 2;
        solution: Solution;
      }
  );

  export type Difficulty = 'easy' | 'medium' | 'hard';

  export type Direction = 'southwestByNortheast' | 'northwestBySoutheast' | 'westByEast' | 'south' | '';

  export class Connect4 {
    solution: Solution | null;

    winner: 1 | 2 | null;

    constructor(width?: number, height?: number);

    reset(): void;

    canPlay(column: number): boolean;

    play(column: number): void;

    play1BasedColumn(column: number): void;

    playMoves(columns: number[]): void;

    isWinningMove(column: number): Direction;

    southBy3(column: number): string;

    westBy3EastBy3(column: number, rowMovementWestToEast: number): string;

    southwestBy3NortheastBy3(column: number): string;

    northwestBy3SoutheastBy3(column: number): string;

    setSolution(column: number, direction: Direction): void;

    getMoveCount(): number;

    getPlays(): string;

    getActivePlayer(): 1 | 2;

    gameStatus(): GameStatus;

    ascii(): string;
  }

  export class Connect4AI extends Connect4 {
    playAI(difficulty?: Difficulty): number;

    negamaxScores(maxDepth: number): number[] | null;

    negamax(game: Connect4, nextPlay: number, maxDepth: number, currentDepth?: number): number;

    recreateBoard(gamePlays: string): Connect4;
  }
}
