import { ConnectFourToken } from '../connect-four-token/connect-four-token.component.js';

export class TokenGrid {
  private grid: { [row: number]: { [column: number]: ConnectFourToken } } = {};

  private tokens: { column: number; row: number; token: ConnectFourToken }[] = [];

  private solvedTokens?: [ConnectFourToken, ConnectFourToken, ConnectFourToken, ConnectFourToken];

  /**
   * adds a token at the given coordinates
   */
  addToken(token: ConnectFourToken, row: number, column: number): this {
    this.grid = { ...this.grid, [row]: { ...this.grid[row], [column]: token } };
    this.tokens = [...this.tokens, { column, row, token }];
    return this;
  }

  /**
   * checks for a token at the given coordinates
   */
  hasToken(row: number, column: number): boolean {
    return this.getToken(row, column) !== undefined;
  }

  /**
   * get a token at the given coordinates
   */
  getToken(row: number, column: number): ConnectFourToken | undefined {
    return this.grid[row] && this.grid[row][column];
  }

  getSolvedTokens(): typeof this.solvedTokens {
    return this.solvedTokens;
  }

  /**
   * searches the grid for solutions
   */
  isSolved(): boolean {
    // walk each token
    return this.tokens.some(({ column, row }) => {
      // check horizontal
      const matchesHorizontal =
        this.hasToken(row, column + 1) && this.hasToken(row, column + 2) && this.hasToken(row, column + 3);
      if (matchesHorizontal) {
        this.solvedTokens = [
          this.getToken(row, column)!,
          this.getToken(row, column + 1)!,
          this.getToken(row, column + 2)!,
          this.getToken(row, column + 3)!,
        ];
      }
      // check vertical
      const matchesVertical =
        this.hasToken(row + 1, column) && this.hasToken(row + 2, column) && this.hasToken(row + 3, column);
      if (matchesVertical) {
        this.solvedTokens = [
          this.getToken(row, column)!,
          this.getToken(row + 1, column)!,
          this.getToken(row + 2, column)!,
          this.getToken(row + 3, column)!,
        ];
      }
      // check diagonal up
      const matchesDiagonalUp =
        this.hasToken(row + 1, column + 1) &&
        this.hasToken(row + 2, column + 2) &&
        this.hasToken(row + 3, column + 3);
      if (matchesDiagonalUp) {
        this.solvedTokens = [
          this.getToken(row, column)!,
          this.getToken(row + 1, column + 1)!,
          this.getToken(row + 2, column + 2)!,
          this.getToken(row + 3, column + 3)!,
        ];
      }
      // check diagonal down
      const matchesDiagonalDown =
        this.hasToken(row - 1, column - 1) &&
        this.hasToken(row - 2, column - 2) &&
        this.hasToken(row - 3, column - 3);
      if (matchesDiagonalDown) {
        this.solvedTokens = [
          this.getToken(row, column)!,
          this.getToken(row - 1, column - 1)!,
          this.getToken(row - 2, column - 2)!,
          this.getToken(row - 3, column - 3)!,
        ];
      }
      // check all matches
      return matchesHorizontal || matchesVertical || matchesDiagonalUp || matchesDiagonalDown;
    });
  }
}
