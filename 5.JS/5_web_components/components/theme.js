export const theme = () => {
    const selector = "app-theme";

    const setTemplate = () => `<label for="theme-toggle">
            <input type="checkbox" class="switch" id="theme-toggle">
            Tema oscuro
        </label>`;

    document.querySelector(selector).outerHTML = setTemplate();
};
