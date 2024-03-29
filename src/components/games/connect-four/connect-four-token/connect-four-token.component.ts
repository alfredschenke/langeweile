import { css, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Player } from '../../../../types/game.types.js';

import styles from './connect-four-token.component.scss';

@customElement('asm-connect-four-token')
export class ConnectFourToken extends LitElement {
  static override readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ reflect: true, type: String })
  player?: Player;

  @property({ reflect: true, type: Boolean })
  lifted = false;

  @property({ reflect: true, type: Boolean })
  translucent = false;
}
