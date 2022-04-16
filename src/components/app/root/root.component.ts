import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './root.component.scss';

@customElement('asm-root')
export class App extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/games/memory">Memory</a>
        </nav>
      </header>
      <main>
        <slot></slot>
      </main>
    `;
  }
}
