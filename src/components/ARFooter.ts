import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ARMap } from './ARMap';

const zIndex = css`3`;

@customElement('ar-footer')
export class ARFooter extends LitElement {
    @property({type: Boolean, reflect: true})
    isAr: Boolean;

    @property({type: Boolean, reflect: true})
    active: Boolean;

    @property()
    private arMap: ARMap | null = null;

    constructor() {
        super();
        this.isAr    = false;
        this.active  = false;
        this.arMap   = document.querySelector('ar-map');
    }

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener("deviceorientation", this.handleOrientation, true);
    }

    disconnectedCallback(): void {
        window.removeEventListener("deviceorientation", this.handleOrientation);
        super.disconnectedCallback();
    }

    private handleOrientation = (evt: DeviceOrientationEvent) => {

        // const absolute = evt.absolute;
        // const zAxis    = evt.alpha;
        // const yAxis    = evt.gamma;

        const xAxis = evt.beta;

        if (!this.isAr || xAxis === null) {
            this.active = false;
            this.arMap!.active = false;

            return;
        }

        this.active = xAxis > 30 ? true : false;
        this.arMap!.active = !this.active;
    }

    static styles = css`
        :host([active]) footer {
            position: fixed;
	        left: 25%;
	        bottom: 5%;
	        height: 10%;
	        width: 50%;
	        z-index: ${zIndex};
            transition: all .5s linear;
        }

        :host footer {
            position: fixed;
	        left: 0;
	        bottom: 0;
	        height: 15%;
	        width: 100%;
	        z-index: ${zIndex};
            transition: all .5s linear;
        }

        :host([active]) footer div {
            width: 100%;
            height: 100%;
            border: 1px solid #222;
            border-radius: 1rem;
            background: #000;
        }

        :host footer div {
            width: 100%;
            height: 100%;
            background: #000;
            border-top: 1px solid #333;
        }

        :host footer div ar-button {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    `;

    protected render() {
        return html`
            <footer>
                <div>
                    <ar-button></ar-button>
                </div>
            </footer>
        `;
    }
}