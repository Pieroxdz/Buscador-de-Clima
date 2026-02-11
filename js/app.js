import { API_KEY } from "./env.js";
const container = document.querySelector(".container");
const formulario = document.querySelector("#formulario");
const inputCiudad = document.querySelector("#ciudad");
const selectPais = document.querySelector("#pais");
const resultado = document.querySelector("#resultado")

const obj = {
    ciudad: "",
    pais: ""
}

const limpiarHTML = (referencia) => {
    while (referencia.firstChild) {
        referencia.removeChild(referencia.firstChild)
    }
}


const spinner = () => {
    limpiarHTML(resultado)

    const divSpinner = document.createElement("DIV");
    divSpinner.classList.add("sk-fading-circle")
    divSpinner.innerHTML = `
            <div class="sk-circle1 sk-circle"></div>
            <div div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
    `

    resultado.appendChild(divSpinner)
}

const kelvinCentigrados = (grados) => {
    //La api retorna en grados kelvin
    return parseInt(grados - 273.15);
}

const mostrarClima = (data) => {

    const resultadoDIV = document.createElement("DIV");
    resultadoDIV.classList.add("text-center", "text-white");

    const { name, main: { temp, temp_max, temp_min } } = data;

    const centigrados = kelvinCentigrados(temp)
    const max = kelvinCentigrados(temp_max)
    const min = kelvinCentigrados(temp_min)

    const nombreCiudad = document.createElement("P")
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add("font-bold", "text-2xl")

    const actual = document.createElement("P");
    actual.innerHTML = `${centigrados}&#8451`
    actual.classList.add("font-bold", "text-6xl")

    const tempMaxima = document.createElement("P");
    tempMaxima.innerHTML = `Max: ${max}&#8451`
    tempMaxima.classList.add("text-xl")

    const tempMinima = document.createElement("P");
    tempMinima.innerHTML = `Min: ${min}&#8451`
    tempMinima.classList.add("text-xl")


    resultadoDIV.appendChild(nombreCiudad)
    resultadoDIV.appendChild(actual)
    resultadoDIV.appendChild(tempMaxima)
    resultadoDIV.appendChild(tempMinima)

    resultado.appendChild(resultadoDIV)
}

const consultarAPI = (ciudad, pais) => {
    const URI = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${API_KEY}`

    spinner()
    fetch(URI)
        .then(response => response.json())
        .then(data => {

            limpiarHTML(resultado)

            if (data.cod === "404") {
                mostrarError("Ciudad no encontrada")
                return;
            }

            mostrarClima(data)
        })
}

const mostrarError = (mensaje) => {
    const alerta = document.querySelector(".bg-red-100")

    if (!alerta) {
        const alerta = document.createElement("DIV");
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-md", "mx-auto", "mt-6", "text-center")
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `

        container.appendChild(alerta);


        setTimeout(() => {
            alerta.remove();
        }, 3000);

        return
    }
}

const buscarClima = (e) => {
    e.preventDefault();

    if (Object.values(obj).some(valor => valor.trim() === "")) {
        mostrarError("Ambos campos son obligatorios");
        return;
    }

    const { ciudad, pais } = obj;

    consultarAPI(ciudad, pais);
}

const datosClima = (e) => {
    obj[e.target.name] = e.target.value
}

document.addEventListener("DOMContentLoaded", () => {
    inputCiudad.addEventListener("change", datosClima)
    selectPais.addEventListener("change", datosClima)
    formulario.addEventListener("submit", buscarClima)
})