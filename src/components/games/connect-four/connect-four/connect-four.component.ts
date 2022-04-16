import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './connect-four.component.scss';

@customElement('asm-connect-four')
export class ConnectFour extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ attribute: 'column-count', reflect: true, type: Number })
  columnCount = 5;

  // prettier-ignore
  render() {
    return html`
      ${Array.from({ length: this.columnCount }, (_, index) => html`
        <div class="column">${index}</div>
      `)}
    `;
  }
}
