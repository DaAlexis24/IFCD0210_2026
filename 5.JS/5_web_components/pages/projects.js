export const projectsPage = () => {

    const setTemplate = () => `<section id="projects">
      <h2>Preguntas frecuentes</h2>
      <details>
        <summary>pregunta 1</summary>
        <p>Texto de los detalles de la pregunta 1..</p>
      </details>
      <details>
        <summary>pregunta 2</summary>
        <p>Texto de los detalles de la pregunta...</p>
      </details>
      <form></form>
    </section>`


    document.querySelector('main').innerHTML = setTemplate()
}
