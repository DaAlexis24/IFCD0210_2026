export class FilmsPage extends HTMLElement {
    static #selector = 'app-films-page';
    static render() {
        // Prepare main
        const el: HTMLElement | null = document.querySelector('main');
        if (el === null) {
            throw new Error('Selector main no disponible');
        }
        el.innerHTML = `<${FilmsPage.#selector}></${FilmsPage.#selector}>`;
        // Register custom element
        if (customElements.get(FilmsPage.#selector) === undefined) {
            customElements.define(FilmsPage.#selector, FilmsPage);
        }
        // Render child custom elements
    }

    #template!: string;

    constructor() {
        super();
        this.#setTemplate();
        this.#setElement();
    }

    #setTemplate() {
        this.#template = /*html*/ `
            <section>
                <h2>Films</h2>
                <p>Aquí irán las películas</p>
            </section>
        `;
    }

    #setElement() {
        this.innerHTML = this.#template;
    }
}
