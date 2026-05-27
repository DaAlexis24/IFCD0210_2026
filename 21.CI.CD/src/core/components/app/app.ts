import type { UserRegister } from '../../entities/user.entity';
import { UsersRepository } from '../../repositories/users-repository';
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
    #usersRepo: UsersRepository;

    constructor() {
        super();
        this.#setTemplate();
        this.#registerEvents();
        this.#usersRepo = new UsersRepository()
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

    #handlerRegister = (ev: Event) => {
        const customEv = ev as CustomEvent<UserRegister & { data: FormData }>;
        const output = this.querySelector<HTMLPreElement>('.register-output');
        if (!output) return;
        const { data, ...user } = customEv.detail;
        output.textContent = JSON.stringify(user, null, 2);
        this.#usersRepo.register(data);
    };

    #registerEvents() {
        this.addEventListener('user:register', this.#handlerRegister);
    }
}
