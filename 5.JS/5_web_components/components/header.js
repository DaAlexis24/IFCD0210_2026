import { theme } from "./theme.js";

export const header = () => {
    const selector = "app-header";

    const setTemplate = () => `
    <header class="header">
        <nav>
            <app-menu data-type="mobile-menu"></app-menu>
            <app-menu data-type="full-menu"></app-menu>
        </nav>
        <dialog class="menu-dialog" id="menu-dialog">
            <nav>
                <app-menu></app-menu>
            </nav>
        </dialog>
        <app-theme></app-theme>
    </header>
    `;

    document.querySelector(selector).outerHTML = setTemplate();
    theme();
};
