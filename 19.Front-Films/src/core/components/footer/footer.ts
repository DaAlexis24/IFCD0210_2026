import './footer.css';
import socials from '../../data/socials.json';

export class Footer extends HTMLElement {
    // Propiedades y métodos estáticos
    static selector = 'app-footer';
    static register() {
        if (customElements.get(Footer.selector) === undefined) {
            customElements.define(Footer.selector, Footer);
        }
    }

    // Propiedades y métodos de instancia
    #address = '&copy; 2026 CFD Alcobendas - Curso IF2001';
    #list!: string;
    #template!: string;

    constructor(address?: string) {
        super();
        this.#address = address ?? this.#address;
        this.#setTemplate();
    }

    connectedCallback() {
        this.#render();
    }

    #setList() {
        this.#list = socials
            .map(
                (item) => `
                    <li><a href="${item.url}" target="_blank">
                    ${item.icon}</a></li>`,
            )
            .join('');
    }

    #setTemplate(): void {
        this.#setList();
        this.#template = /*html*/ `    
         <footer class="footer" 
            aria-label="main-footer" 
            title="footer"
            data-testId="footer"
            >
             <ul>${this.#list}</ul>
             <address>${this.#address}</address>
         </footer>
         `;
    }

    #render() {
        this.innerHTML = this.#template;
    }
}
