import '../clock/clock.component.js';

import { css, html, unsafeCSS } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { wait } from '../../../../utils/async.utils.js';
import { GenericGame } from '../../../../utils/generic-game.class.js';
import { generateQuest, type Quest } from '../utils/quest.utils.js';
import { readableTime } from '../utils/time.utils.js';

import styles from './clock-quests.component.scss';

@customElement('asm-clock-quests')
export class ClockQuests extends GenericGame {
  static override readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @queryAll('button[data-choice]')
  private readonly choiceRefs!: NodeListOf<HTMLButtonElement>;

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

  // eslint-disable-next-line class-methods-use-this
  #generateQuest(): Quest {
    return generateQuest({ alternatives: 2, roundMinutes: 15 });
  }

  async selectChoice(event: MouseEvent): Promise<void> {
    this.interactive = false;

    const button = event.currentTarget as HTMLButtonElement;
    const choice = Number(button.dataset.choice!);

    this.choiceRefs.forEach((choiceRef) => {
      const value = Number(choiceRef.dataset.choice!);
      choiceRef.classList.add(value === +this.currentQuest.solution ? 'correct' : 'wrong');
    });

    if (choice === +this.currentQuest.solution) {
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

  protected override render() {
    return html`
      ${super.render()}

      <asm-clock .time="${this.currentQuest?.solution}"></asm-clock>

      <ul id="solutions">
        ${map(this.currentQuest?.possibleSolutions, (solution) =>
          keyed(
            this.questCount,
            html`
              <li>
                <button
                  data-choice="${+solution}"
                  ?disabled="${!this.interactive}"
                  @click="${this.selectChoice}"
                >
                  <figure>${readableTime(solution)}</figure>
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
    `;
  }
}
