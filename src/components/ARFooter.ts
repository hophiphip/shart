import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ar-footer')
export class ARFooter extends LitElement {
    @property({type: Boolean, reflect: true})
    isAr: Boolean;

    @property({type: Boolean, reflect: true})
    active: Boolean;

    constructor() {
        super();
        this.isAr = false;
        this.active = false;

        window.addEventListener("deviceorientation", this.handleOrientation, true);
    }

    private handleOrientation = (evt: DeviceOrientationEvent) => {

        // const absolute = evt.absolute;
        // const zAxis    = evt.alpha;
        // const yAxis    = evt.gamma;

        const xAxis = evt.beta;

        if (!this.isAr || xAxis === null) {
            this.active = false;
            document.getElementById("sidenav")!.style.height = "0";
            
            return;
        }

        this.active = xAxis > 30 ? true : false;
        document.getElementById("sidenav")!.style.height = this.active ? "0" : "100%";
    }

    static styles = css`
        :host([active]) footer {
            position: fixed;
	        left: 25%;
	        bottom: 5%;
	        height: 10%;
	        width: 50%;
	        z-index: 3;
            transition: all 1s linear;
        }

        :host footer {
            position: fixed;
	        left: 0;
	        bottom: 0;
	        height: 15%;
	        width: 100%;
	        z-index: 3;
            transition: all 1s linear;
        }

        :host([active]) footer div {
            width: 100%;
            height: 100%;
            border: 1px solid #222;
            border-radius: 1rem;
            background: #111;
            transition: all 1s linear;
        }

        :host footer div {
            width: 100%;
            height: 100%;
            background: #111;
            transition: all 1s linear;
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