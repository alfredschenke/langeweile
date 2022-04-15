import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './app.component.scss';

@customElement('asm-app')
export class App extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`<asm-memory sources-path="/images.json"></asm-memory>`;
  }
}
