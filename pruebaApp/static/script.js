
const API_URL_DOLAR = '/datos_cotizacion/';
const API_URL_HISTORICO_COMPLETO = '/datos_cotizacion_historico/';

let paginaActual = 1;
const filasPorPagina = 10;

async function obtenerCotizaciones(){
    const res = await fetch(API_URL_DOLAR);
    const data = await res.json();
    mostrarCotizacionDolar(data,'cotizaciones');
}

function mostrarCotizacionDolar(data, idContainer) {
        const container = document.getElementById(idContainer);
        if (!container) {
            console.error(`Elemento con id ${idContainer} no existe en el DOM`);
            return; 
        }

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
    let fecha_cotizacion = document.getElementById("fecha_cotizacion").value;

    if (fecha_cotizacion) {
        //fecha_cotizacion = fecha_cotizacion.replace(/-/g, '/');
        mostrarTablaFecha(data_historico_completo);
    }
    else{
    mostrarTabla(data_historico_completo);
    }
    mostrarGrafico(data_historico_completo);
}

function mostrarTablaFecha(dato) {
    document.querySelector(".tablaContainerFecha").style.display = "flex";

    const tablaContainerFecha = document.getElementById("tablaFecha");
    tablaContainerFecha.innerHTML = "";

    const tabla = document.createElement("table");
    const encabezado = document.createElement("tr");

    encabezado.innerHTML = 
        `
        <th>Tipo de Dólar</th>
        <th>Compra</th>
        <th>Fecha</th>
        <th>Venta</th>
        `;
    tabla.appendChild(encabezado);

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${dato.casa}</td>
            <td>${dato.compra}</td>
            <td>${dato.fecha}</td>
            <td>${dato.venta}</td>
        `;
        tabla.appendChild(fila);
    tablaContainerFecha.appendChild(tabla);
}


function mostrarTabla(datos) {  
    document.querySelector(".tablaContainer").style.display = "flex";

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

    if (!Array.isArray(datos)) {
        datos = [datos]; // Convierte a un array si no lo es
    }

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
            tabla.appendChild(fila); // Añadir la fila a la tabla en cada iteración
        });
    tablaContainer.appendChild(tabla);
    mostrarControlesPaginacion(datos);
    }

//Paginacion: Crear botones "Anterior" "..." y "Siguiente"
function mostrarControlesPaginacion(datos) {
    const totalPaginas = Math.ceil(datos.length / filasPorPagina);
    const controlesContainer = document.getElementById("controlesPaginacion");
    controlesContainer.innerHTML = ""; 

    const controles = document.createElement("div");
    controles.className = "paginacion";

    //Creo btn Anterior
    const botonAnterior = document.createElement("button");
    botonAnterior.innerText = "Anterior";
    botonAnterior.disabled = paginaActual === 1;
    botonAnterior.addEventListener("click", () => {
        paginaActual--;
        mostrarTabla(datos);
    });
    controles.appendChild(botonAnterior);

    //Limito los botnes que se muestran sino hay que hacer mucho scroll horizontal.
    const maxBotones = 3;
    let inicio = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    let fin = Math.min(totalPaginas, inicio + maxBotones - 1);

    if (fin - inicio < maxBotones - 1) {
        inicio = Math.max(1, fin - maxBotones + 1);
    }

    //Btns de numero de pagina
    if (inicio > 1) {
        const botonPrimero = document.createElement("button");
        botonPrimero.innerText = "1";
        botonPrimero.addEventListener("click", () => {
            paginaActual = 1;
            mostrarTabla(datos);
        });
        controles.appendChild(botonPrimero);

        if (inicio > 2) {
            const puntos = document.createElement("span");
            puntos.innerText = "...";
            controles.appendChild(puntos);
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
            const puntos = document.createElement("span");
            puntos.innerText = "...";
            controles.appendChild(puntos);
        }

        const botonUltimo = document.createElement("button");
        botonUltimo.innerText = totalPaginas;
        botonUltimo.addEventListener("click", () => {
            paginaActual = totalPaginas;
            mostrarTabla(datos);
        });
        controles.appendChild(botonUltimo);
    }

    //Creo el btn Siguiente 
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
//Fin Tabla historicos y paginacion.


//Inicio Grafica
function mostrarGrafico(datos) {
    if (!Array.isArray(datos)) {
        datos = [datos]; // Convierte 'datos' a un array si es un objeto único
    }

    const fechas = datos.map(dato => dato.fecha);
    const valoresVenta = datos.map(dato => parseFloat(dato.venta));

    //Configuracion de la grafica
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
//Fin gfafica 
obtenerHistoricoCompleto();
