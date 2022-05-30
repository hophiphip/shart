import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ARMap } from './ARMap';

const zIndex = css`3`;

const colors = {
    bkColorDark: css`#000`,
    borderColorDark: css`#222`,
    borderTopColorDark: css`#333`,

    bkColor: css`#fff`,
    borderColor: css`#444`,
    borderTopColor: css`#555`,
};

@customElement('ar-footer')
export class ARFooter extends LitElement {
    @property({type: Boolean, reflect: true})
    isAr: Boolean;

    @property({type: Boolean, reflect: true})
    active: Boolean;

    @property({type: Boolean, reflect: true})
    dark: Boolean;

    @property()
    private arMap: ARMap | null = null;

    constructor() {
        super();
        this.isAr    = false;
        this.active  = false;
        this.arMap   = document.querySelector('ar-map');
        this.dark    = document.body.hasAttribute('dark');
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
        :host footer {
            left: 0;
            bottom: 0;
            height: 15%;
            width: 100%;
        }

        :host([active]) footer {
	        left: 25%;
	        bottom: 5%;
	        height: 10%;
	        width: 50%;
        }

        footer {
            position: fixed;
	        z-index: ${zIndex};
            transition: all .5s linear;
        }

        :host([active]) footer div {
            width: 100%;
            height: 100%;
            border: 1px solid ${colors.borderColor};
            border-radius: 1rem;
            background: ${colors.bkColor};
        }

        :host([dark]) footer div {
            border: 1px solid ${colors.borderColorDark};
            background: ${colors.bkColorDark};
        }

        :host footer div {
            width: 100%;
            height: 100%;
            background: ${colors.bkColor};
            border-top: 1px solid ${colors.borderTopColor};
        }

        :host([dark]) footer div {
            background: ${colors.bkColorDark};
            border-top: 1px solid ${colors.borderTopColorDark};
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