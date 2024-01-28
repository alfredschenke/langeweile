/* eslint-disable max-classes-per-file */
import '../header/header.component.js';

import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, eventOptions, property, state } from 'lit/decorators.js';

import { router } from '../../../index.js';
import { read, write } from '../../../utils/storage.utils.js';

import styles from './root.component.scss';

@customElement('asm-root')
export class Root extends LitElement {
  static override readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @state()
  overallScore = read<number>('score') ?? 0;

  @state()
  currentScore = 0;

  @property({ attribute: 'active-route', reflect: true, type: String })
  activeRoute!: string;

  @eventOptions({ passive: true })
  private handleScoreUpdate(event: CustomEvent<number>) {
    this.currentScore += event.detail;
    this.overallScore += event.detail;
    write('score', this.overallScore);
  }

  @eventOptions({ passive: true })
  private handleSlotChange() {
    this.activeRoute = router.location.getUrl();
  }

  protected override render() {
    return html`
      <asm-header
        active-route="${this.activeRoute}"
        current-score="${this.currentScore}"
        overall-score="${this.overallScore}"
      ></asm-header>
      <main @score-update="${this.handleScoreUpdate}">
        <slot @slotchange="${this.handleSlotChange}"></slot>
      </main>
    `;
  }
}
