import { create, type CreateTypes } from 'canvas-confetti';
import { html, LitElement } from 'lit';
import { ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

export class GenericGame extends LitElement {
  #confetti?: CreateTypes;

  partyHard() {
    this.#confetti?.({
      particleCount: 100,
      spread: 80,
      startVelocity: 30,
    });
  }

  async #addConfetti(canvasRef?: Element) {
    // we really need this canvas!
    if (!(canvasRef instanceof HTMLCanvasElement)) return;

    this.#confetti = create(canvasRef, {
      resize: true,
      useWorker: false,
    });
  }

  protected override render() {
    return html`
      <canvas
        style="${styleMap({
          position: 'absolute',
          inset: 0,
          maxHeight: '100svh',
          maxWidth: '100svw',
          height: '100vh',
          width: '100vw',
          pointerEvents: 'none',
          zIndex: 9999,
        })}"
        ${ref(this.#addConfetti)}
      ></canvas>
    `;
  }
}
