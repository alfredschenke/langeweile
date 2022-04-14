import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './game.component.scss';

@customElement('asm-game')
export class Game extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`<slot />`;
  }
}
