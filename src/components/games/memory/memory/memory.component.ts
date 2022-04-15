import shuffle from 'lodash-es/shuffle';
import { css, html, LitElement, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import styles from './memory.component.scss';

enum PlayState {
  Ready = 0,
  Playing = 1,
  Finished = 2,
}

@customElement('asm-memory')
export class Memory extends LitElement {
  static readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * amount of pairs for the game
   */
  @property({ reflect: true, type: Number })
  pairs = 8;

  /**
   * where the json lsit of the image paths can be found
   */
  @property({ attribute: 'sources-path', reflect: true, type: String })
  sourcesPath!: string;

  /**
   * how long the interactions are disabled (the game is paused)
   * once the challenge has failed
   */
  @property({ attribute: 'wait-on-fail', reflect: true, type: Number })
  waitOnFail = 2000;

  /**
   * how long the interactions are disabled (the game is paused)
   * once the challenge was successfull
   */
  @property({ attribute: 'wait-on-success', reflect: true, type: Number })
  waitOnSuccess = 500;

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
  challenges = 0;

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
    this.challenges = 0;
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
        }

      // match cards if enough revealed
      case 2:
        // pick challenged ids and increase count
        const [first, second] = this.challengedTiles;
        ++this.challenges;
        // store successfull result and wait to allow the player to recognize
        if (this.images[first] === this.images[second]) {
          await new Promise(resolve => window.setTimeout(resolve, this.waitOnSuccess));
          this.solvedTiles = [...this.solvedTiles, image];
        }
        // roll back if failed and wait to allow the player to check
        else {
          await new Promise(resolve => window.setTimeout(resolve, this.waitOnFail));
          this.revealedTiles = this.revealedTiles.filter(tile => !this.challengedTiles.includes(tile));
        }
        // reset challenge
        this.challengedTiles = [];
        // check play state
        this.checkPlayState();
        break;
    }
  }

  private checkPlayState() {
    if (this.challenges === 0) {
      this.playState = PlayState.Ready;
    } else if (this.solvedTiles.length === this.images.length / 2) {
      this.playState = PlayState.Finished;
    } else {
      this.playState = PlayState.Playing;
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
