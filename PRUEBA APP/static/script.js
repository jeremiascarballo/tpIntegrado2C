// URL de la API para obtener las cotizaciones
const API_URL_DOLAR = '/datos_cotizacion/dolar';

// Función para obtener y mostrar las cotizaciones
async function obtenerCotizaciones(){
    const res = await fetch(API_URL_DOLAR);
    const data = await res.json();
    mostrarCotizacionDolar(data,'cotizaciones');
    //mostrarCotizacionOtros(data,'cotizacionesOtros');
}

function mostrarCotizacionDolar(data, idContainer){
        const container = document.getElementById(idContainer);

        data.forEach(data => {
            const cotizacionDiv = document.createElement('div');
        cotizacionDiv.classList.add(data.nombre === "Oficial" ? 'oficial' : 'cotizacion');

        const fecha = new Date(data.fechaActualizacion);
        const fechaFormateada = fecha.toLocaleString();

        cotizacionDiv.innerHTML = `
            <h3>${data.nombre}</h3>
            <p>Compra: $${data.compra}</p>
            <p>Venta: $${data.venta}</p>
            <p>Última actualización: ${fechaFormateada}</p>
        `;
        container.appendChild(cotizacionDiv);

        });
}

/*function mostrarCotizacionOtros(data, idContainer){
    const container = document.getElementById(idContainer);

    data.forEach(data => {
        const cotizacionDiv = document.createElement('div');
    cotizacionDiv.classList.add(data.nombre === "Dólar" ? 'dolar' : 'cotizacion');

    cotizacionDiv.innerHTML = `
        <h3>${data.nombre}</h3>
        <p>Compra: $${data.compra}</p>
        <p>Venta: $${data.venta}</p>
        <p>Última actualización: ${data.fechaActualizacion}</p>
    `;
    container.appendChild(cotizacionDiv);

    });
}*/

obtenerCotizaciones();

document.addEventListener("DOMContentLoaded", function () {
    const paginaActual = window.location.pathname;
    const menues = document.querySelectorAll(".menu");

    menues.forEach(link => {
        if (link.getAttribute("href") === paginaActual) {
            link.classList.add("active");
        }
    });
});
