import { UserRegisterModelSchema, type UserRegister } from '../../entities/user.entity';
import './register.css';

export class Register extends HTMLElement {
    static selector = 'app-register';
    static register() {
        if (customElements.get(Register.selector) === undefined) {
            customElements.define(Register.selector, Register);
        }
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
        this.#template =
            /*html*/
            `<section class="register" aria-labelledby='h2'>
                <h2 id="h2">Registro</h2>
                <form novalidate aria-label="form">
                    <label>
                        Email
                        <input name="email" type="email" autocomplete="email" required />
                    </label>
                    <label>
                        Password
                        <input name="password" type="password" autocomplete="new-password" required minlength="8" />
                    </label>
                    <label>
                        Rol
                        <input name="role" type="hidden" value="USER" />
                        <select name="role_select" disabled>
                            <option value="USER" selected>USER</option>
                            <option value="EDITOR">EDITOR</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </label>
                    <fieldset>
                        <legend>Perfil</legend>
                        <label>
                            Nombre
                            <input name="firstName" type="text" autocomplete="given-name" required />
                        </label>
                        <label>
                            Apellidos
                            <input name="surname" type="text" autocomplete="family-name" required />
                        </label>
                        <label>
                            Avatar
                            <input name="avatar" type="file" accept="image/*" />
                        </label>
                    </fieldset>
                    <div role="alert" class="error" aria-live="polite"></div>
                    <button type="submit">Crear cuenta</button>
                </form>
            </section>`;
    }

    #render() {
        this.innerHTML = this.#template;
        this.#registerEvents();
    }

    #registerEvents() {
        const form = this.querySelector('form');
        if (!form) return;
        form.addEventListener('submit', (ev) => this.#handlerSubmit(ev));
    }

    #handlerSubmit(ev: SubmitEvent) {
        ev.preventDefault();

        const form = ev.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const email = String(formData.get('email') ?? '').trim();
        const password = String(formData.get('password') ?? '');

        const firstName = String(formData.get('firstName') ?? '').trim();
        const surname = String(formData.get('surname') ?? '').trim();
        const avatar = formData.get('avatar');

        const payload: UserRegister = {
            email,
            password,
            role: 'USER',
            profile: {
                firstName,
                surname,
            },
        };

        if (avatar instanceof File && avatar.size > 0) {
            payload.profile.avatar = avatar;
        }

        const result = UserRegisterModelSchema.safeParse(payload);
        if (!result.success) {
            this.#setError(result.error.issues.map((i) => i.message).join(' · '));
            return;
        }

        this.#setError('');

        const event = new CustomEvent<UserRegister & {data: FormData}>(
            'user:register', {
                detail: {
                    ...result.data,
                    data: formData
                },
                bubbles: true,
                composed: true,
            })

        this.dispatchEvent(event);
        form.reset();
    }

    #setError(message: string) {
        const errorEl = this.querySelector('.error');
        if (!errorEl) return;
        errorEl.textContent = message;
    }
}
