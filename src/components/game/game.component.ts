import shuffle from 'lodash-es/shuffle';
import { css, html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import styles from './game.component.scss';

enum PlayState {
  Ready = 0,
  Playing = 1,
  Finished = 2,
}

@customElement('asm-game')
export class Game extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ reflect: true, type: Number })
  pairs = 8;

  @property({ reflect: true, type: Number })
  wait = 2000;

  @property({ attribute: 'sources-path', reflect: true, type: String })
  sourcesPath!: string;

  @state()
  isInteractive = false;

  @state()
  images: string[] = [];

  @state()
  revealedTiles: number[] = [];

  @state()
  solvedTiles: string[] = [];

  @state()
  challengedTiles: number[] = [];

  @state()
  playState: PlayState = PlayState.Ready;

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('sourcesPath')) {
      this.loadImages(this.sourcesPath);
    }
  }

  private async loadImages(path: string) {
    // load image list, restrict and double it
    const sources = await fetch(path);
    const images = await sources.json();
    const reduced = images.slice(0, this.pairs);
    const pairs = [...reduced, ...reduced];

    // shuffle tiles and reset play state
    this.images = shuffle(pairs);
    this.playState = PlayState.Ready;
    this.isInteractive = true;
  }

  private isCovered(index: number): boolean {
    return this.playState < PlayState.Finished && !this.revealedTiles.includes(index);
  }

  private isSolved(image: string): boolean {
    return this.playState < PlayState.Finished && this.solvedTiles.includes(image);
  }

  private async challengeTile(index: number, image: string) {
    switch (this.challengedTiles.length) {
      // reveal cards as long as challenge is open
      case 0:
      case 1:
        this.challengedTiles = [...this.challengedTiles, index];
        this.revealedTiles = [...this.revealedTiles, index];

        // fall through with delay if challengable
        if (this.challengedTiles.length < 2) {
          break;
        } else {
          await new Promise(resolve => window.setTimeout(resolve, this.wait));
        }

      // match cards if enough revealed
      case 2:
        // store result and reset challenge
        const [first, second] = this.challengedTiles;
        if (this.images[first] === this.images[second]) {
          this.solvedTiles = [...this.solvedTiles, image];
        } else {
          this.revealedTiles = this.revealedTiles.filter(tile => !this.challengedTiles.includes(tile));
        }
        this.challengedTiles = [];
        break;
    }
  }

  private async handleTileClick(index: number, image: string) {
    // we need interactivity enabled
    if (!this.isInteractive) {
      return;
    }

    // tile is already solved or challenged
    if (this.solvedTiles.includes(image) || this.revealedTiles.includes(index)) {
      return;
    }

    // check clicked card (and pause interactions then)
    this.isInteractive = false;
    await this.challengeTile(index, image);
    this.isInteractive = true;
  }

  // prettier-ignore
  render() {
    return html`${this.images.map(
      (image, index) => html`
        <asm-tile
          ?covered="${this.isCovered(index)}"
          ?solved="${this.isSolved(image)}"
          src="${image}"
          @click="${() => this.handleTileClick(index, image)}"
        ></asm-tile>
      `,
    )}`;
  }
}
