import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('ar-arrow')
export class Arrow extends LitElement {
    @property({type: Boolean, reflect: true})
    active: Boolean;

    @property({reflect: true})
    yAxisInitial: Number | null = null;

    @property({reflect: true})
    yAxisCurrent: Number | null = null;

    @property({reflect: true})
    rotation: Number;

    constructor() {
        super();
        this.active = true;
        this.rotation = 360;
    };

    static styles = css`
        :host #container {
            width: 0;
            height: 0;
        }

        :host #svg {
            width: 0;
            height: 0;
        }

        :host([active]) #container {
            position: relative;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background: #333;
            border: 2px solid #fff;
            -webkit-transform-origin: 50% 50%;
            -moz-transform-origin: 50% 50%;
            -o-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
        }

        :host([active]) #svg {
            position: absolute;
            left: 50%;
            top: 45%;
            transform: translate3d(-50%, -50%, 0);
            width: 2rem;
            height: 2rem;
        }
    `;

    protected render() {
        return html`
            <div id="container" style="-webkit-transform: rotate(${this.rotation}deg); -moz-transform: rotate(${this.rotation}deg); -o-transform: rotate(${this.rotation}deg); -ms-transform: rotate(${this.rotation}deg); transform: rotate(${this.rotation}deg);">
                <svg id="svg" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </div>
        `;
    }
}