
const API_URL_DOLAR = '/datos_cotizacion/';
const API_URL_HISTORICO_COMPLETO = '/datos_cotizacion_historico/';

async function obtenerCotizaciones(){
    const res = await fetch(API_URL_DOLAR);
    const data = await res.json();
    mostrarCotizacionDolar(data,'cotizaciones');
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


async function obtenerHistoricoCompleto(){
    const res = await fetch(API_URL_HISTORICO_COMPLETO);
    const data_historico_completo = await res.json();
    mostrarTabla(data_historico_completo);
}

function mostrarTabla(datos) {
    const tabla = document.createElement("table");
    const encabezado = document.createElement("tr");

    encabezado.innerHTML = `
        <th>Tipo de Dólar</th>
        <th>Compra</th>
        <th>Fecha</th>
        <th>Venta</th>
    `;
    tabla.appendChild(encabezado);

    datos.forEach(dato => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${dato.casa}</td>
            <td>${dato.compra}</td>
            <td>${dato.fecha}</td>
            <td>${dato.venta}</td>
        `;
        tabla.appendChild(fila);
    });
    document.getElementById("tablaHistorico").appendChild(tabla);
}


obtenerHistoricoCompleto();
