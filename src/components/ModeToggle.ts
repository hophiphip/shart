import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ARFooter } from './ARFooter';

const colors = {
    light: css`#ddd`,
    dark: css`#333`,
};

const sizes = {
    toggleWidth: css`100px`,
    labelHeight: css`50px`,
    translateX: css`47px`,
    darkmodeShadow: css`inset 14px -1px 0px 0px`,
    sliderTop: css`6px`,
    sliderLeft: css`8px`,
    sliderWidth: css`37px`,
    sliderHeight: css`37px`,
};

@customElement('mode-toggle')
export class ModeToggle extends LitElement {
    @property({type: Boolean, reflect: true})
    isDarkMode: boolean;

    @property({type: Boolean, reflect: true})
    isHidden: boolean;

    @property()
    arFooter: ARFooter | null = null;

    constructor() {
        super();

        this.isDarkMode = true;
        this.isHidden = false;
        this.arFooter = document.querySelector('ar-footer');

        this.updateGlobalColorMode(this.isDarkMode);
    }

    static styles = css`
        :host([isHidden]) .toggle {
            display: none;
        }

        .toggle {
            position: relative;
            width: ${sizes.toggleWidth};
            -webkit-tap-highlight-color: transparent;
        }

        label {
            position: absolute;
            width: 100%;
            height: ${sizes.labelHeight};
            background-color: ${colors.dark};
            border-radius: 50px;
            cursor: pointer;
        }

        input {
            position: absolute;
            display: none;
        }

        .slider {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50px;
            transition: 0.3s;
        }

        input:checked ~ .slider {
            background-color: ${colors.light};
        }

        .slider::before {
            content: "";
            position: absolute;
            top: ${sizes.sliderTop};
            left: ${sizes.sliderLeft};
            width: ${sizes.sliderWidth};
            height: ${sizes.sliderHeight};
            border-radius: 50%;
            box-shadow: ${sizes.darkmodeShadow} ${colors.light};
            background-color: ${colors.dark};
            transition: 0.3s;
        }

        input:checked ~ .slider::before {
            transform: translateX(${sizes.translateX});
            background-color: ${colors.dark};
            box-shadow: none;
        }
    `;

    private updateGlobalColorMode(isDarkMode: boolean) {
        const body = document.body;

        if (isDarkMode && !body.hasAttribute('dark')) {
            body.setAttribute('dark', '');
        }

        if (!isDarkMode && body.hasAttribute('dark')) {
            body.removeAttribute('dark');
        }

        this.arFooter!.dark = isDarkMode;
    }

    private modeToggle(_: Event) {
        this.isDarkMode = !this.isDarkMode;
        this.updateGlobalColorMode(this.isDarkMode);
    }

    protected render() {
        return html`
            <div class="toggle"> 
                <label>
                    <input type="checkbox" @click=${this.modeToggle}>
                    <span class="slider"></span>
                </label>
            </div>
        `;
    }
}