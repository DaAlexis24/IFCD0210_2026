# Vanilla JS functional components

## Componente

- selector
- template
- renderización: template -> selector

```js
export const component = () => {
    const selector = 'app-x'

    const setTemplate = () => `Component`

    document.querySelector(selector).outerHTML = setTemplate()
}
```

## Uso de un componente

- añado el selector
- ejecutar ('registrar') el componente
  - opcionalmente pasamos valores a la instancia

## Uso de props en los componente

```js
  <app-componente data-x="">
```

Al usarlo

```js
  setTemplate(document.querySelector(selector).dataset.x)
```
