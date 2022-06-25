import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ar-map')
export class ARMap extends LitElement {
    @property({type: Boolean, reflect: true})
    active: boolean;

    constructor() {
        super();
        this.active = false;
    }

    static styles = css`
        :host div {
            height: 0;
            width: 100%;
            position: fixed;
            z-index: 1;
            bottom: 0;
            left: 0;
            background-color: #111;
            overflow-x: hidden;
            transition: 0.5s;
        }

        :host([active]) div {
            height: 100%;
            width: 100%;
            position: fixed;
            z-index: 1;
            bottom: 0;
            left: 0;
            background-color: #111;
            overflow-x: hidden;
            transition: 0.5s;
        }
    `;

    protected render() {
        return html`
            <div></div>
        `;
    }
}