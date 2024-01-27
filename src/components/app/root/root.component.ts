/* eslint-disable max-classes-per-file */
import '../header/header.component.js';

import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { router } from '../../../index.js';

import styles from './root.component.scss';

@customElement('asm-root')
export class Root extends LitElement {
  static override readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ attribute: 'active-route', reflect: true, type: String })
  activeRoute!: string;

  handleSlotChange() {
    this.activeRoute = router.location.getUrl();
  }

  protected override render() {
    return html`
      <asm-header active-route="${this.activeRoute}"></asm-header>
      <main>
        <slot @slotchange="${this.handleSlotChange}"></slot>
      </main>
    `;
  }
}
