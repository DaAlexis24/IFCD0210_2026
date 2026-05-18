const L = "Santa+Cruz+de+Tenerife";
const URL = `https://goweather.xyz/v2/weather/${L}`;

class WeatherTime extends HTMLElement {
  data = {};

  constructor() {
    super();
    this.init();
  }

  async init() {
    const response = await fetch(URL);
    setTimeout(async () => {
      this.data = await response.json();
      this.render();
    }, 2000);
  }

  connectedCallback() { this.render() }

  render() {
    if (!this.data?.temperature) {
      console.log("Cargando datos...");
      this.setHTMLUnsafe(
        /* html */`<div class="loading"></div>`.repeat(3));
    }
    else {
      console.log("Datos cargados.");
      this.setHTMLUnsafe(
        /* html */`<main>${this.data?.temperature}</main>`);
    }
  }
}

customElements.define("weather-time", WeatherTime);

// después de haber definido el custom element, lo añadimos al DOM
// creando la instancia del componente con el operador new

// document.querySelector(".weather-time-container").appendChild(new WeatherTime());

// otra alternativa es crear la instancia del componente 
// con el método createElement, que es el método tradicional para crear elementos en el DOM

const weatherTime = document.createElement("weather-time");
document.querySelector(".weather-time-container").appendChild(weatherTime);


