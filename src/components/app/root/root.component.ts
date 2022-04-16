import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './root.component.scss';

@customElement('asm-root')
export class App extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`<slot></slot>`;
  }
}
