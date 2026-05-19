import './counter.css';

export class Counter extends HTMLElement {
    // Propiedades y métodos estáticos
    static selector = 'app-counter';
    static register() {
        if (customElements.get(Counter.selector) === undefined) {
            customElements.define(Counter.selector, Counter);
        }
    }

    // Propiedades y métodos de instancia
    #template!: string;
    #counter = 0;
    #counterId: string;

    constructor() {
        super();
        this.#counterId = '';
    }

    connectedCallback() {
        this.#counterId = this.getAttribute('counterId') || '';
        this.#setTemplate();
        this.#render();
    }

    #setTemplate(): void {
        // Devolver siempre un solo elemento
        this.#template = /*html*/ `
         <div class="counter">
             <h3>Counter - id ${this.#counterId}</h3>
             <button>Click: <output>${this.#counter}</output></button>
         </div>
         `;
    }

    #render(): void {
        // Convertimos el template en elemento
        this.innerHTML = this.#template;
        this.#registerEvents();
    }

    #registerEvents() {
        this.querySelector('button')?.addEventListener(
            'click',
            this.#handlerButtonClick,
        );
    }

    #handlerButtonClick = (ev: Event) => {
        const output = this.querySelector('output') as HTMLOutputElement;
        ev.stopPropagation();
        this.#counter++;
        console.log(`Click button ${this.#counterId}: ${this.#counter}`);
        output.value = this.#counter.toString();

    };
}
