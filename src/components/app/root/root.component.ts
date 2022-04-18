import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { router } from '../../..';

import styles from './root.component.scss';

@customElement('asm-root')
export class Root extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ attribute: 'active-route', reflect: true, type: String })
  activeRoute!: string;

  isActive(path: string): boolean {
    return router.urlForPath(path) === this.activeRoute;
  }

  handleSlotChange() {
    this.activeRoute = router.location.getUrl();
  }

  // prettier-ignore
  render() {
    return html`
      <header>
        <h1>Alfreds</h1>
        <nav>
          <a class="${classMap({ active: this.isActive('/games/memory') })}" href="/games/memory">Memory</a>
          <a class="${classMap({ active: this.isActive('/games/connect-four') })}" href="/games/connect-four">Vier gewinnt</a>
        </nav>
      </header>
      <main>
        <slot @slotchange="${() => this.handleSlotChange()}"></slot>
      </main>
    `;
  }
}
