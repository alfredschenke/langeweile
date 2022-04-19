import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { router } from '../../..';
import '../header/header.component';

import styles from './root.component.scss';

@customElement('asm-root')
export class Root extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

@property({ attribute: 'active-route', reflect: true, type: String })
  activeRoute!: string;

  handleSlotChange() {
    this.activeRoute = router.location.getUrl();
  }

  // prettier-ignore
  render() {
    return html`
      <asm-header active-route="${this.activeRoute}"></asm-header>
      <main>
        <slot @slotchange="${() => this.handleSlotChange()}"></slot>
      </main>
    `;
  }
}
