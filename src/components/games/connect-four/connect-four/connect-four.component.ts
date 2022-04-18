import { css, html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';

import type { Player } from '../../../../types/player.types';
import type { ConnectFourToken } from '../connect-four-token/connect-four-token.component';

import { wait } from '../../../../utils/async.utils';
import { getElementIndex } from '../../../../utils/dom.utils';
import { TokenGrid } from '../utils/token-grid.class';

import '../connect-four-token/connect-four-token.component';

import styles from './connect-four.component.scss';

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

  @property({ attribute: 'interactive', reflect: true, type: Boolean })
  isInteractive = true;

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('columnCount')) {
      this.style.setProperty('--connect-four-column-count', `${this.columnCount}`);
    }
    if (changedProperties.has('rowCount')) {
      this.style.setProperty('--connect-four-row-count', `${this.rowCount}`);
    }
  }

  async handleColumnClick(column: number) {
    // place token
    this.isInteractive = false;
    this.dropToken(column, 'a');

    // wait and simulate other player
    await wait(500);
    this.placeOtherPlayersToken();
    this.isInteractive = true;
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
      console.log(player, grid.isSolved());
    });
  }

  getTokens(player: Player): ConnectFourToken[] {
    return [...this.tokens].filter(token => token.player === player);
  }

  // reads the tokens from the DOM of the given player
  getTokenGrid(player: Player): TokenGrid {
    return this.getTokens(player).reduce((grid, token) => {
      const row = getElementIndex(token);
      const column = getElementIndex(token.parentElement!);
      return grid.addToken(token, row, column);
    }, new TokenGrid());
  }

  // for the time being we'll randomly pick a column which has a token slot left
  placeOtherPlayersToken() {
    const columns = [...this.columns].filter(column => column.childElementCount < this.rowCount);
    const column = getElementIndex(columns[Math.floor(Math.random() * columns.length)]);
    this.dropToken(column, 'b');
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
