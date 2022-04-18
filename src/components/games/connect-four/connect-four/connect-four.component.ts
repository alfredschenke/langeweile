import { css, html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { Player } from '../../../../types/player.types';
import { getElementIndex } from '../../../../utils/dom.utils';
import type { ConnectFourToken } from '../connect-four-token/connect-four-token.component';

import '../connect-four-token/connect-four-token.component';

import styles from './connect-four.component.scss';

type TokenGrid = {
  grid: { [row: number]: { [column: number]: ConnectFourToken } };
  tokens: { column: number; row: number; token: ConnectFourToken }[];
};
let tempPlayer: Player = 'a';

@customElement('asm-connect-four')
export class ConnectFour extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @queryAll('.column')
  private readonly columns!: NodeListOf<HTMLDivElement>;

  @queryAll('asm-connect-four-token')
  private readonly tokens!: NodeListOf<ConnectFourToken>;

  @property({ attribute: 'column-count', reflect: true, type: Number })
  columnCount = 7;

  @property({ attribute: 'row-count', reflect: true, type: Number })
  rowCount = 6;

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('columnCount')) {
      this.style.setProperty('--connect-four-column-count', `${this.columnCount}`);
    }
    if (changedProperties.has('rowCount')) {
      this.style.setProperty('--connect-four-row-count', `${this.rowCount}`);
    }
  }

  handleColumnClick(column: number) {
    this.dropToken(column, tempPlayer);
    tempPlayer = tempPlayer === 'a' ? 'b' : 'a';
  }

  dropToken(columnIndex: number, player: Player) {
    // prepare a new token
    const token = document.createElement('asm-connect-four-token');
    token.setAttribute('lifted', 'lifted');
    token.setAttribute('player', player);

    // add token to correct column
    const column = this.columns.item(columnIndex);
    column.appendChild(token);

    requestAnimationFrame(() => {
      // start animation
      token.removeAttribute('lifted');

      // read player tokens from current grid
      const grid = this.getTokenGrid(player);

      // check for solutions
      console.log(player, this.challengeGrid(grid));
    });
  }

  getTokens(player: Player): ConnectFourToken[] {
    return [...this.tokens].filter(token => token.player === player);
  }

  // reads the tokens from the DOM of the given player
  getTokenGrid(player: Player): TokenGrid {
    return this.getTokens(player).reduce(
      ({ grid, tokens }, token) => {
        const row = getElementIndex(token);
        const column = getElementIndex(token.parentElement!);
        return {
          grid: { ...grid, [row]: { ...grid[row], [column]: token } },
          tokens: [...tokens, { column, row, token }],
        };
      },
      { grid: {}, tokens: [] } as TokenGrid,
    );
  }

  // search given grid for solutions
  challengeGrid({ grid, tokens }: TokenGrid): boolean {
    // walk each token
    return tokens.some(({ column, row }) => {
      // check horizontal
      const matchesHorizontal = (grid[row][column + 1] && grid[row][column + 2] && grid[row][column + 3]) !== undefined;
      // check vertical
      const matchesVertical = (grid[row + 1] && grid[row + 2] && grid[row + 3]) !== undefined;
      // check diagonal up
      const matchesDiagonalUp =
        (grid[row + 1] && grid[row + 2] && grid[row + 3] && grid[row + 1][column + 1] && grid[row + 2][column + 2] && grid[row + 3][column + 3]) !== undefined;
      // check diagonal down
      const matchesDiagonalDown =
        (grid[row - 1] && grid[row - 2] && grid[row - 3] && grid[row - 1][column - 1] && grid[row - 2][column - 2] && grid[row - 3][column - 3]) !== undefined;
      // check all matches
      return matchesHorizontal || matchesVertical || matchesDiagonalUp || matchesDiagonalDown;
    });
  }

  // prettier-ignore
  render() {
    return html`
      <div class="board">
        ${Array.from({ length: this.columnCount }, (_, index) => html`
          <div class="column" @click="${() => this.handleColumnClick(index)}"></div>
        `)}
      </div>
    `;
  }
}
