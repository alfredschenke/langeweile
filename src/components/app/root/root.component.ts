import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { router } from 'lit-element-router';

import styles from './root.component.scss';

@router
@customElement('asm-root')
export class App extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  // prettier-ignore
  render() {
    return html`
      <asm-memory
        sources-path="/images.json"
        wait-on-fail="1000"
        wait-on-success="500"
      ></asm-memory>
    `;
  }
}
