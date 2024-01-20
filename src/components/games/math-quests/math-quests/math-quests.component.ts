import confetti from 'canvas-confetti';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { wait } from '../../../../utils/async.utils.js';
import { END_MODE, QUEST_MODE } from '../utils/game.utils.js';
import { generateStandaloneQuest, StandaloneQuest } from '../utils/quest.utils.js';

import styles from './math-quests.component.scss';

@customElement('asm-math-quests')
export class MathQuests extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @queryAll('button[data-choice]')
  private readonly choiceRefs!: NodeListOf<HTMLButtonElement>;

  @query('canvas')
  private readonly canvasRef!: HTMLCanvasElement;

  @state()
  private interactive = true;

  @state()
  private questCount = 1;

  @state()
  private correctQuests = 0;

  @state()
  private currentQuest = this.#generateQuest();

  /**
   * how long the interactions are disabled (the game is paused)
   * once the challenge has failed
   */
  @property({ attribute: 'wait-on-fail', reflect: true, type: Number })
  waitOnFail = 1500;

  /**
   * how long the interactions are disabled (the game is paused)
   * once the challenge was successful
   */
  @property({ attribute: 'wait-on-success', reflect: true, type: Number })
  waitOnSuccess = 1000;

  endMode: (typeof END_MODE)[number] = 'errors';

  questMode: (typeof QUEST_MODE)[number] = 'standalone';

  // eslint-disable-next-line class-methods-use-this
  #generateQuest(): StandaloneQuest {
    return generateStandaloneQuest({
      alternatives: 2,
      limitOperators: ['add', 'subtract', 'multiply'],
      negativeResults: false,
      operatorValues: { add: [1, 20], subtract: [1, 20], multiply: [1, 10] },
    });
  }

  async selectChoice(event: MouseEvent): Promise<void> {
    this.interactive = false;

    const button = event.currentTarget as HTMLButtonElement;
    const choice = Number(button.dataset.choice);

    this.choiceRefs.forEach((choiceRef) => {
      const value = Number(choiceRef.dataset.choice);
      choiceRef.classList.add(value === this.currentQuest?.solution ? 'correct' : 'wrong');
    });

    if (choice === this.currentQuest?.solution) {
      this.partyHard();
      this.correctQuests += 1;
      await wait(this.waitOnSuccess);
    } else {
      button.classList.add('error');
      await wait(this.waitOnFail);
    }

    this.currentQuest = this.#generateQuest();
    this.questCount += 1;
    this.interactive = true;
  }

  partyHard() {
    confetti.create(this.canvasRef, {
      resize: true,
      useWorker: true,
    })({
      particleCount: 100,
      spread: 160,
      startVelocity: 30,
    });
  }

  render() {
    return html`
      <figure id="left">${this.currentQuest?.left}</figure>
      <figure id="operator">${this.currentQuest?.operator.symbol}</figure>
      <figure id="right">${this.currentQuest?.right}</figure>
      <figure id="equals">=</figure>

      <ul id="solutions">
        ${map(this.currentQuest?.possibleSolutions, (solution) =>
          keyed(
            this.questCount,
            html`
              <li>
                <button
                  data-choice="${solution}"
                  ?disabled="${!this.interactive}"
                  @click="${this.selectChoice}"
                >
                  <figure>${solution}</figure>
                </button>
              </li>
            `,
          ),
        )}
      </ul>

      ${when(
        this.questCount > 0,
        () => html`<div id="info"><strong>${this.correctQuests}</strong> / ${this.questCount}</div>`,
      )}

      <canvas></canvas>
    `;
  }
}
