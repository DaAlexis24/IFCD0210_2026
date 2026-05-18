import { Theme } from '../theme/theme';
import './header.css';

export class Header extends HTMLElement {
    static selector = 'app-header';
    static register() {
        if (customElements.get(Header.selector) === undefined) {
            customElements.define(Header.selector, Header);
        }
        Theme.register();
    }

    #template!: string;

    constructor() {
        super();
        this.#setTemplate();
    }

    connectedCallback() {
        this.#render();
    }

    #setTemplate() {
        this.#template =
            /*html*/
            `<header class="header">
                <nav>
                    <app-menu menu-type="mobile-menu"></app-menu>
                    <app-menu menu-type="full-menu"></app-menu>
                </nav>
                <dialog class="menu-dialog" id="menu-dialog">
                    <nav>
                        <app-menu></app-menu>
                    </nav>
                </dialog>
                <app-theme></app-theme>
            </header>
            `;
    }

    #render() {
        this.innerHTML = this.#template;
    }
}
