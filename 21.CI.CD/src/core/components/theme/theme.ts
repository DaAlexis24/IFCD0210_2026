import './theme.css';

export class Theme extends HTMLElement {
    static #selector = 'app-theme';
    static register() {
        if (customElements.get(Theme.#selector) === undefined) {
            customElements.define(Theme.#selector, Theme);
        }
    }

    static get selector()  {
        return Theme.#selector
    }

    #template!: string;

    constructor() {
        super();
        console.log('loading the theme component');
        this.#setTemplate();
    }

    connectedCallback() {
        this.#render();
    }

    handleChange(event: Event) {
        const element = event.target as HTMLInputElement;
        const theme = element.checked ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        console.log(theme);
    }

    #setTemplate = () => {
        this.#template =
            /*html*/
            `
        <label for="theme-toggle" class="theme-toggle-wrapper">
            <span>Claro</span>
            <input type="checkbox" class="switch" id="theme-toggle" />
            <span>Oscuro</span>
        </label>
        `;
    };

    #render() {
        this.innerHTML = this.#template;

        const toggleElement = this.querySelector(
            '#theme-toggle',
        ) as HTMLElement;
        toggleElement.addEventListener('change', this.handleChange.bind(this));
    }
}
