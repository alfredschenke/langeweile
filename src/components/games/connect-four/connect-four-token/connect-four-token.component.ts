import { css, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Player } from '../../../../types/player.types';

import styles from './connect-four-token.component.scss';

@customElement('asm-connect-four-token')
export class ConnectFourToken extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ reflect: true, type: String })
  player?: Player;

  @property({ reflect: true, type: Boolean })
  lifted = false;
}
