import { Theme } from '../theme/theme';
import './header.css';

export class Header extends HTMLElement {
    static #selector = 'app-header';
    static render() {
        if (customElements.get(Header.#selector) === undefined) {
            customElements.define(Header.#selector, Header);
        }
        Theme.render();
    }

    #template!: string;

    constructor() {
        super();
        this.#setTemplate();
        this.#setElement();
    }

    #setTemplate() {
        this.#template =
            /*html*/
            `<header class="header">
                <nav>
                    <app-menu data-type="mobile-menu"></app-menu>
                    <app-menu data-type="full-menu"></app-menu>
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

    #setElement() {
        this.innerHTML = this.#template;
    }
}
