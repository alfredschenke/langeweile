import { css, html, LitElement, svg, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';

import styles from './clock.component.scss';

@customElement('asm-clock')
export class Clock extends LitElement {
  static override readonly styles = css`
    ${unsafeCSS(styles)}
  `;

  // stores the given time
  #time: [number, number] = [0, 0];

  @property({ attribute: false, noAccessor: true })
  set time(time: Date | undefined) {
    // read hour and minutes in 12h format
    const m = time?.getMinutes() ?? 0;
    const h = (time?.getHours() ?? 0) % 12;
    // ignore if time has not changed
    if (h === this.#time[0] && m === this.#time[1]) return;
    // store (previous) time
    const previousTime = this.#time;
    this.#time = [h, m];
    // update time
    this.requestUpdate('time', previousTime);
  }

  protected override render() {
    const [h, m] = this.#time;
    const hm = h + m / 60;

    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <circle id="border" cx="50" cy="50" r="50" />
        <circle id="background" cx="50" cy="50" r="45" />

        <line
          id="hour-hand"
          x1="50"
          y1="55"
          x2="50"
          y2="25"
          stroke-width="5"
          transform="rotate(${(hm / 12) * 360}, 50, 50)"
        />
        <line
          id="minute-hand"
          x1="50"
          y1="55"
          x2="50"
          y2="12"
          stroke-width="3"
          transform="rotate(${(m / 60) * 360}, 50, 50)"
        />

        ${map(
          range(60),
          (i) => svg`
            <line
              class="tick"
              x1="50"
              y1="5"
              x2="50"
              y2="${i % 5 === 0 ? 10 : 7}"
              stroke-width="1"
              transform="rotate(${(i / 60) * 360}, 50, 50)"
            />
          `,
        )}
      </svg>
    `;
  }
}
