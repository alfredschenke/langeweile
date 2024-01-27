/* eslint-disable lit-a11y/click-events-have-key-events */
import '../connect-four-token/connect-four-token.component.js';

import { Connect4AI, Difficulty, Solution } from 'connect4-ai';
import { css, html, PropertyValues, unsafeCSS } from 'lit';
import { customElement, eventOptions, property, queryAll, state } from 'lit/decorators.js';

import { Player, PlayState } from '../../../../types/game.types.js';
import { wait } from '../../../../utils/async.utils.js';
import { GenericGame } from '../../../../utils/generic-game.class.js';
import type { ConnectFourToken } from '../connect-four-token/connect-four-token.component';

import styles from './connect-four.component.scss';

@customElement('asm-connect-four')
export class ConnectFour extends GenericGame {
  static override readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  private readonly game = new Connect4AI();

  @queryAll('.column')
  private readonly columns!: NodeListOf<HTMLDivElement>;

  @queryAll('asm-connect-four-token')
  private readonly tokens!: NodeListOf<ConnectFourToken>;

  @state()
  private playState: PlayState = PlayState.Ready;

  @property({ reflect: true, type: String })
  difficulty: Difficulty = 'easy';

  @property({ attribute: 'column-count', reflect: true, type: Number })
  columnCount = 7;

  @property({ attribute: 'row-count', reflect: true, type: Number })
  rowCount = 6;

  @property({ attribute: 'interactive', reflect: true, type: Boolean })
  isInteractive = true;

  protected override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('columnCount')) {
      this.style.setProperty('--connect-four-column-count', `${this.columnCount}`);
    }
    if (changedProperties.has('rowCount')) {
      this.style.setProperty('--connect-four-row-count', `${this.rowCount}`);
    }
  }

  async handleColumnClick(column: number) {
    // do not go on if non-interactive or ended
    if (!this.isInteractive || this.playState > PlayState.Playing) {
      return;
    }

    // place token
    this.isInteractive = false;
    this.playState = PlayState.Playing;
    await this.dropToken(column, Player.A);
    this.game.play(column);

    // check player a result
    const gameStatusA = this.game.gameStatus();
    if (gameStatusA.gameOver) {
      this.finishGame(gameStatusA.solution);
      this.partyHard();
    } else {
      // wait and simulate other player
      await wait(500);
      await this.dropToken(this.game.playAI(this.difficulty), Player.B);

      // check player b result
      const gameStatusB = this.game.gameStatus();
      if (gameStatusB.gameOver) {
        this.finishGame(gameStatusB.solution);
        // TODO: LOOSER! BOO!
      } else {
        this.isInteractive = true;
      }
    }
  }

  async dropToken(columnIndex: number, player: Player): Promise<void> {
    return new Promise<void>((resolve) => {
      // prepare a new token
      const token = document.createElement('asm-connect-four-token');
      token.setAttribute('lifted', 'lifted');
      token.setAttribute('player', player);

      // add token to correct column
      const column = this.columns.item(columnIndex);
      column.appendChild(token);

      requestAnimationFrame(async () => {
        // start animation
        token.removeAttribute('lifted');

        // TODO: replace with transitionend (once) listener
        await wait(500);

        // check if we have a result
        resolve();
      });
    });
  }

  finishGame(solution: Solution) {
    this.playState = PlayState.Finished;
    this.tokens.forEach((token) => token.setAttribute('translucent', 'translucent'));
    solution.forEach(({ column, spacesFromBottom }) =>
      this.columns[column].children.item(spacesFromBottom)!.removeAttribute('translucent'),
    );
  }

  getTokens(player: Player): ConnectFourToken[] {
    return [...this.tokens].filter((token) => token.player === player);
  }

  @eventOptions({ passive: true })
  private async handleReloadClick() {
    this.game.reset();
    this.tokens.forEach((token) => token.remove());
    this.playState = PlayState.Ready;
    this.isInteractive = true;
  }

  // prettier-ignore
  protected override render() {
    return html`
      ${super.render()}

      <div class="board">
        ${Array.from({ length: this.columnCount }, (_, index) => html`
          <div class="column" @click="${() => this.handleColumnClick(index)}"></div>
        `)}
      </div>

      <button
        id="reload"
        ?hidden="${this.playState < PlayState.Finished}"
        @click="${() => this.handleReloadClick()}"
      >
        &#8635;
      </button>
    `;
  }
}
