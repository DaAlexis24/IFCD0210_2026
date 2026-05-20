import { Counter } from '../core/components/counter/counter';
import { Register } from '../core/components/register/register';

export class HomePage extends HTMLElement {
    static #selector = 'app-home-page';
    static register() {
        // Register custom element
        if (customElements.get(HomePage.#selector) === undefined) {
            customElements.define(HomePage.#selector, HomePage);
        }
        // Prepare main
        HomePage.#addPage();
        // Render child custom elements
        Counter.register();
        Register.register();
    }

    static get selector() {
        return HomePage.#selector;
    }

    static #addPage(selector = 'main') {
        const el: HTMLElement | null = document.querySelector(selector);
        if (el === null) {
            throw new Error(`Selector ${selector} no disponible`);
        }
        el.innerHTML = '';
        el.appendChild(new HomePage());
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
            <section aria-label="home-page">
                <h2>Uso de componentes y web components</h2>
                <app-counter counterId="1"></app-counter>
                <app-counter counterId="2"></app-counter>
                <app-counter counterId="3"></app-counter>

            </section>
            <section aria-label="test-component">
                <app-register></app-register>
                <pre class="register-output" aria-label="register-output"></pre>
            </section>
        `;
    }

    #render() {
        this.innerHTML = this.#template;
    }


}
