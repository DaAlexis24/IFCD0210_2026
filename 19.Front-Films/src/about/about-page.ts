export class AboutPage extends HTMLElement {
    static #selector = 'app-about-page';
    static register() {
        // Register custom element
        if (customElements.get(AboutPage.#selector) === undefined) {
            customElements.define(AboutPage.#selector, AboutPage);
        }
        // Prepare main
        AboutPage.#addPage();
        // Render child custom elements
    }

    static #addPage(selector = 'main') {
        const el: HTMLElement | null = document.querySelector(selector);
        if (el === null) {
            throw new Error(`Selector ${selector} no disponible`);
        }
        el.innerHTML = '';
        el.appendChild(new AboutPage());
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
            <section>
                <h2>About</h2>
                <p>Aquí irá nuestra información</p>
            </section>
        `;
    }

    #render() {
        this.innerHTML = this.#template;
    }
}
