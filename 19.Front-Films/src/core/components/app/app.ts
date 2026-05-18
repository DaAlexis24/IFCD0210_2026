import { routes } from '../../router/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Menu } from '../menu/menu';
import './app.css';

export class App extends HTMLElement {
    static #selector = 'app-root';
    static register() {
        if (customElements.get(App.#selector) === undefined) {
            customElements.define(App.#selector, App);
        }
        Header.register();
        Menu.register(routes);
        Footer.register();
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
        this.#template = /*html*/ `
            <app-header></app-header>
            <main></main>
            <app-footer></app-footer>
        `;
    }

    #render() {
        this.innerHTML = this.#template;
    }
}
