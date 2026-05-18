export class FilmsPage extends HTMLElement {
    static #selector = 'app-films-page';
    static register() {
        // Register custom element
        if (customElements.get(FilmsPage.#selector) === undefined) {
            customElements.define(FilmsPage.#selector, FilmsPage);
        }
        // Prepare main
        FilmsPage.#addPage();
        // Render child custom elements
    }
    static #addPage(selector = 'main') {
        const el: HTMLElement | null = document.querySelector(selector);
        if (el === null) {
            throw new Error(`Selector ${selector} no disponible`);
        }
        el.innerHTML = '';
        el.appendChild(new FilmsPage());
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
                <h2>Films</h2>
                <p>Aquí irán las películas</p>
            </section>
        `;
    }

    #render() {
        this.innerHTML = this.#template;
    }
}
