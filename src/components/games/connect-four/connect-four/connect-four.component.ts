import { css, html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';

import '../connect-four-token/connect-four-token.component';

import styles from './connect-four.component.scss';

@customElement('asm-connect-four')
export class ConnectFour extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @queryAll('.column')
  private readonly columns!: NodeListOf<HTMLDivElement>;

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

  handleColumnClick(column: number) {
    this.dropToken(column);
  }

  dropToken(columnIndex: number) {
    const token = document.createElement('asm-connect-four-token');
    token.setAttribute('lifted', 'lifted');
    const column = this.columns.item(columnIndex);
    column.prepend(token);
    requestAnimationFrame(() => {
      token.removeAttribute('lifted');
    });
  }

  // prettier-ignore
  render() {
    return html`
      <div class="board">
        ${Array.from({ length: this.columnCount }, (_, index) => html`
          <div class="column" @click="${() => this.handleColumnClick(index)}"></div>
        `)}
      </div>
    `;
  }
}
