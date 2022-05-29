import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { renderer, options as sessionInit } from './renderer';

const activeText = 'START AR';
const stopText = 'STOP AR';

const notSupportedText = 'AR NOT SUPPORTED';
const notAllowedText = 'AR NOT ALLOWED';

const webXRNotAvailableText = 'WEBXR NOT AVAILABLE';
const webXRNeedsHTTPS = 'WEBXR NEEDS HTTPS';

@customElement('ar-button')
export class ARButton extends LitElement {
    @property({type: Boolean, reflect: true})
    private active: boolean;

    @property({type: String, reflect: true})
    private text: String;

    @property({ type: XRSession })
    private currentSession: XRSession | null = null;

    constructor() {
        super();
        
        this.active = false;
        this.text = window.isSecureContext ? webXRNotAvailableText : webXRNeedsHTTPS;

        if ('xr' in navigator) {
            navigator.xr?.isSessionSupported('immersive-ar')
            .then((supported) => {
                if (supported) {
                    this.active = true;
                    this.text = activeText
                } else {
                    this.active = false;
                    this.text = notSupportedText;
                }
            })
            .catch((err) => {
                this.active = false;
                this.text = notAllowedText;
                
                console.warn('Exception during the call xr.isSessionSupported', err);
            });
        }
    }

    static styles = css`
        :host([active]) button {
            position: absolute;
            bottom: 1.25rem;
            padding: 0.75rem 0.375rem;
            border: 1px solid #fff;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.1);
            color: #fff;
            font: normal 13px sans-serif;
            text-align: center; 
            display: block;
            outline: none;
            z-index: 999;
            cursor: pointer;
            left: calc(50% - 3.125rem);
            width: 6.25rem;
            opacity: 0.5;
        }

        :host button {
            position: absolute;
            bottom: 1.25rem;
            padding: 0.75rem 0.375rem;
            border: 1px solid #fff;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.1);
            color: #fff;
            font: normal 13px sans-serif;
            text-align: center; 
            display: block;
            outline: none;
            z-index: 999;
            cursor: auto;
            left: calc(50% - 4.688rem);
            width: 9.375rem;
            opacity: 0.5;
        }

        :host([active]) button:hover {
            opacity: 1.0;
        }
    `;

    private onXRSessionStarted = async (session: XRSession) => {
        const onXRSessionEnded = (_: XRSessionEvent) => {
            this.currentSession?.removeEventListener('end', onXRSessionEnded);

		    this.text = activeText;
		    sessionInit.domOverlay.root!.style.display = 'none';
		    this.currentSession = null;
        };

        session.addEventListener('end', onXRSessionEnded);

        renderer.xr.setReferenceSpaceType('local');

        await renderer.xr.setSession(((session as any) as THREE.XRSession));

		this.text = stopText;
		sessionInit.domOverlay.root!.style.display = '';
		this.currentSession = session;
    }

    private onClick = (_: Event) => {
        if (this.active) {
            if (this.currentSession === null) {
                navigator.xr?.requestSession('immersive-ar', sessionInit)
                    .then(this.onXRSessionStarted)
                    .catch((err) => {
                        console.error(err);
                    });
            } else {
                this.currentSession.end();
            }
        }
    }

    protected render() {
        return html`
            <button @click=${this.onClick}>${this.text}</button>
        `;
    }
}