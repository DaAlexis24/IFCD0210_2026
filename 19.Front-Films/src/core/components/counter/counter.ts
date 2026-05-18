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
    counter = 0;
    counterId: string;

    constructor() {
        super();
        this.counterId = '';
    }
    
    connectedCallback() {
        this.counterId = this.getAttribute('counterId') || '';
        this.#setTemplate();
        this.#render();
    }

    #setTemplate(): void {
        // Devolver siempre un solo elemento
        this.#template = /*html*/ `
         <div class="counter">
             <h3>Counter - id ${this.counterId}</h3>
             <button>Click: <output>${this.counter}</output></button>
         </div>
         `;
    }

    #render(): void {
        // Convertimos el template en elemento
        this.innerHTML = this.#template;
        const output = this.querySelector('output') as HTMLOutputElement;
        this.querySelector('button')?.addEventListener('click', (ev: Event) => {
            ev.stopPropagation();
            this.counter++;
            console.log(`Click button ${this.counterId}: ${this.counter}`);
            // this.#setTemplate();
            // this.#render();
            output.textContent = this.counter.toString();
        });
    }
}
