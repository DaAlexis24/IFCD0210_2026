export const contactPage = () => {
    const setTemplate =
        () => `  
        <section id="contact" aria-label="Contacto">
      <h2>Contacto</h2>
      <p>¿Quieres contactar conmigo?</p>

      <form>
        <label class="label">
          <span>Nombre:</span>
          <input type="text" name="userName" placeholder="Dime tu nombre" autocomplete="name">
        </label>
        <label class="label">
          Teléfono:
          <input type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="123-456-7890">
        </label>
        <label class="label">
          Edad:
          <input type="number" name="age" min="0" max="120">
        </label>
        <label class="label">
          Contraseña:
          <input type="password" id="password" minlength="4" maxlength="8" name="password"
            autocomplete="current-password">
        </label>
        <label class="label">
          Fecha de nacimiento:
          <input type="date" id="dob" name="dob">
        </label>
        <label class="label">
          Hora de contacto:
          <input type="time" id="contact-time" name="contactTime">
        </label>
        <label class="label">
          Avatar
          <input type="file" name="file" id="file" accept=".pdf,.doc,.docx,image/*">
        </label>
        <div class="label">
          <label for="email">Correo electrónico:</label>
          <input type="email" id="email" name="email">
        </div>
        <label class="label">
          <span>Mensaje:</span>
          <textarea id="message" name="message"></textarea>
        </label>
        <fieldset>
          <legend>¿Cómo prefieres que te contacte?</legend>
          <label>
            <input type="radio" name="contactMethod" value="email">
            Correo electrónico
          </label>
          <label>
            <input type="radio" name="contactMethod" value="phone">
            Teléfono
          </label>
        </fieldset>
        <fieldset>
          <legend>Suscribirse a:</legend>
          <label>
            <input type="checkbox" name="subscribeNewsletter">
            Newsletter
          </label>
          <label>
            <input type="checkbox" name="subscribeUpdates">
            Actualizaciones de productos
          </label>
        </fieldset>
        <label class="label">País:
          <select name="country">
            <option value="">Selecciona un país</option>
            <option value="es">España</option>
            <option value="fr">Francia</option>
            <option value="de">Alemania</option>
            <option value="other">Otros</option>
          </select>
        </label>
        <div class="button-wrapper">
          <button type="submit">Enviar</button>
        </div>
      </form>

    </section>`;

    document.querySelector('main').innerHTML = setTemplate();
};
