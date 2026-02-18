export const component = () => {
    const selector = 'app-x'

    const setTemplate = () => `Component`

    document.querySelector(selector).outerHTML = setTemplate()
}
