
const API_URL_DOLAR = '/datos_cotizacion/';
const API_URL_HISTORICO_COMPLETO = '/datos_cotizacion_historico/';

let paginaActual = 1;
const filasPorPagina = 10;

async function obtenerCotizaciones(){
    const res = await fetch(API_URL_DOLAR);
    const data = await res.json();
    mostrarCotizacionDolar(data,'cotizaciones');
}

function mostrarCotizacionDolar(data, idContainer){
        const container = document.getElementById(idContainer);
        container.innerHTML = '';

        data.forEach(data => {
            const cotizacionDiv = document.createElement('div');
            cotizacionDiv.classList.add(data.nombre === "Oficial" ? 'oficial' : 'cotizacion');

            const fecha = new Date(data.fechaActualizacion);
            const fechaFormateada = fecha.toLocaleString();

            cotizacionDiv.innerHTML = 
                `<h3>${data.nombre}</h3>
                <p>Compra: $${data.compra}</p>
                <p>Venta: $${data.venta}</p>
                <p>Última actualización: ${fechaFormateada}</p>`;
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

async function obtenerHistoricoCompleto() {
    const res = await fetch(API_URL_HISTORICO_COMPLETO);
    const data_historico_completo = await res.json();
    mostrarTabla(data_historico_completo);
    mostrarGrafico(data_historico_completo);
}

function mostrarTabla(datos) {
    const tablaContainer = document.getElementById("tablaHistorico");
    tablaContainer.innerHTML = "";

    const tabla = document.createElement("table");
    const encabezado = document.createElement("tr");

    encabezado.innerHTML = `
        <th>Tipo de Dólar</th>
        <th>Compra</th>
        <th>Fecha</th>
        <th>Venta</th>
    `;
    tabla.appendChild(encabezado);

    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const datosPaginados = datos.slice(inicio, fin);

    datosPaginados.forEach(dato => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${dato.casa}</td>
            <td>${dato.compra}</td>
            <td>${dato.fecha}</td>
            <td>${dato.venta}</td>
        `;
        tabla.appendChild(fila);
    });

    tablaContainer.appendChild(tabla);
    mostrarControlesPaginacion(datos);
}

function mostrarControlesPaginacion(datos) {
    const totalPaginas = Math.ceil(datos.length / filasPorPagina);
    const controlesContainer = document.getElementById("controlesPaginacion");
    controlesContainer.innerHTML = ""; // Limpiar los controles de paginación anteriores

    const controles = document.createElement("div");
    controles.className = "paginacion";

    // Botón de página anterior
    const botonAnterior = document.createElement("button");
    botonAnterior.innerText = "Anterior";
    botonAnterior.disabled = paginaActual === 1;
    botonAnterior.addEventListener("click", () => {
        paginaActual--;
        mostrarTabla(datos);
    });
    controles.appendChild(botonAnterior);

    // Límite de botones de página a mostrar
    const maxBotones = 3;
    let inicio = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    let fin = Math.min(totalPaginas, inicio + maxBotones - 1);

    if (fin - inicio < maxBotones - 1) {
        inicio = Math.max(1, fin - maxBotones + 1);
    }

    // Botones de número de página
    if (inicio > 1) {
        const botonPrimero = document.createElement("button");
        botonPrimero.innerText = "1";
        botonPrimero.addEventListener("click", () => {
            paginaActual = 1;
            mostrarTabla(datos);
        });
        controles.appendChild(botonPrimero);

        if (inicio > 2) {
            const elipsis = document.createElement("span");
            elipsis.innerText = "...";
            controles.appendChild(elipsis);
        }
    }

    for (let i = inicio; i <= fin; i++) {
        const botonPagina = document.createElement("button");
        botonPagina.innerText = i;
        botonPagina.className = i === paginaActual ? "activo" : "";
        botonPagina.addEventListener("click", () => {
            paginaActual = i;
            mostrarTabla(datos);
        });
        controles.appendChild(botonPagina);
    }

    if (fin < totalPaginas) {
        if (fin < totalPaginas - 1) {
            const elipsis = document.createElement("span");
            elipsis.innerText = "...";
            controles.appendChild(elipsis);
        }

        const botonUltimo = document.createElement("button");
        botonUltimo.innerText = totalPaginas;
        botonUltimo.addEventListener("click", () => {
            paginaActual = totalPaginas;
            mostrarTabla(datos);
        });
        controles.appendChild(botonUltimo);
    }

    // Botón de página siguiente
    const botonSiguiente = document.createElement("button");
    botonSiguiente.innerText = "Siguiente";
    botonSiguiente.disabled = paginaActual === totalPaginas;
    botonSiguiente.addEventListener("click", () => {
        paginaActual++;
        mostrarTabla(datos);
    });
    controles.appendChild(botonSiguiente);

    controlesContainer.appendChild(controles);
}

function mostrarGrafico(datos) {
    // Obtener fechas y valores de venta para la gráfica
    const fechas = datos.map(dato => dato.fecha);
    const valoresVenta = datos.map(dato => parseFloat(dato.venta));

    // Configuración de la gráfica
    const ctx = document.getElementById('graficoHistorico').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Venta (en pesos)',
                data: valoresVenta,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor de Venta'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

obtenerHistoricoCompleto();
