import confetti from 'canvas-confetti';
import { LitElement } from 'lit';

export class GenericGame extends LitElement {
  #createCanvas(): {
    ref: HTMLCanvasElement;
    remove(): void;
  } {
    // prepare a canvas element
    const canvas = document.createElement('canvas');
    this.renderRoot.appendChild(canvas);

    // add some styling
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.maxHeight = '100svh';
    canvas.style.maxWidth = '100svw';
    canvas.style.height = '100vh';
    canvas.style.width = '100vw';
    canvas.style.pointerEvents = 'none';

    // provide a clean up function
    const remove = () => this.renderRoot.removeChild(canvas);
    return { ref: canvas, remove };
  }

  async partyHard() {
    const canvas = this.#createCanvas();

    await confetti.create(canvas.ref, {
      resize: true,
      useWorker: true,
    })({
      particleCount: 100,
      spread: 160,
      startVelocity: 30,
    });

    canvas.remove();
  }
}
