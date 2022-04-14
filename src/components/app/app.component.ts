import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './app.component.scss';

@customElement('asm-app')
export class App extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`
      <h1 class="title">Alfreds <strong>Memory</strong></h1>
      <asm-game class="canvas">Tiles?</asm-game>
    `;
  }
}
