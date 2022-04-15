import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './tile.component.scss';

@customElement('asm-tile')
export class Tile extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ reflect: true, type: Boolean })
  covered = true;

  @property({ reflect: true, type: Boolean })
  solved = false;

  @property({ reflect: true, type: String })
  src!: string;

  render() {
    return html`
      <figure>
        <img class="front" src="${this.src}" />
        <div class="back"></div>
      </figure>
    `;
  }
}
