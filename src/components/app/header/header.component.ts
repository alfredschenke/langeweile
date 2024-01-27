import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';

import { GAMES, router } from '../../../index.js';

import styles from './header.component.scss';

@customElement('asm-header')
export class Root extends LitElement {
  static override readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ attribute: 'active-route', reflect: true, type: String })
  activeRoute!: string;

  #isActive(path: string): boolean {
    return router.urlForPath(path) === this.activeRoute;
  }

  protected override render() {
    return html`
      <header>
        <h1>Alfreds</h1>
        <nav>
          ${map(
            GAMES,
            ({ path, name }) =>
              html`<a class="${classMap({ active: this.#isActive(path) })}" href="${path}">${name}</a>`,
          )}
        </nav>
      </header>
    `;
  }
}
