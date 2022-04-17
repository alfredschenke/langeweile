import { css, html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './connect-four.component.scss';

@customElement('asm-connect-four')
export class ConnectFour extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ attribute: 'column-count', reflect: true, type: Number })
  columnCount = 7;

  @property({ attribute: 'row-count', reflect: true, type: Number })
  rowCount = 6;

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('columnCount')) {
      this.style.setProperty('--connect-four-column-count', `${this.columnCount}`);
    }
    if (changedProperties.has('rowCount')) {
      this.style.setProperty('--connect-four-row-count', `${this.rowCount}`);
    }
  }

  handleColumnClick() {}

  // prettier-ignore
  render() {
    return html`
      ${Array.from({ length: this.columnCount }, (_, index) => html`
        <div class="column" @click="${() => this.handleColumnClick()}">
          ${Array.from({ length: Math.round(this.rowCount / (index + 1)) }, () => html`
            <span></span>
          `)}
        </div>
      `)}
    `;
  }
}
