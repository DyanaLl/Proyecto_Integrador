// Variable global para controlar la instancia de la gráfica en el detalle y evitar errores de superposición
let graficaDetalleRdaInstance = null;

// Pinta la tabla principal de promedios por materia y RDA
function renderizarTablaPromedios() {
    const tablaBody = document.getElementById("tabla-promedios-body");
    if (!tablaBody) return;

    tablaBody.innerHTML = "";

    // Obtenemos las actividades globales centralizadas desde calculos.js
    const listaActividades = typeof obtenerActividadesGlobales === 'function' ? obtenerActividadesGlobales() : [];

    console.log("Pintando promedios con las actividades:", listaActividades);

    if (!listaActividades || listaActividades.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #666; padding: 15px;">No hay actividades registradas todavía.</td></tr>`;
        return;
    }

    // Extraer las materias únicas registradas de forma automática
    const materiasUnicas = [...new Set(listaActividades.map(act => act.materia))];

    materiasUnicas.forEach(materia => {
        // Obtenemos los promedios calculados con la lógica exacta de los RDA
        const rda1 = typeof calcularPromedioRDA === 'function' ? calcularPromedioRDA(materia, 1) : 0;
        const rda2 = typeof calcularPromedioRDA === 'function' ? calcularPromedioRDA(materia, 2) : 0;
        const rda3 = typeof calcularPromedioRDA === 'function' ? calcularPromedioRDA(materia, 3) : 0;

        // Obtenemos el promedio final de la materia delegando totalmente la lógica a calculos.js
        const promedioFinal = typeof calcularPromedioFinalMateria === 'function'
            ? calcularPromedioFinalMateria(materia)
            : 0;

        // Creamos y rellenamos la fila para la tabla HTML
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><strong>${materia}</strong></td>
            <td class="celda-rda" data-materia="${materia}" data-rda="1" style="cursor: pointer; color: #0066cc; text-decoration: underline;" title="Haz clic para ver desglose y gráfica">${Number(rda1).toFixed(2)}</td>
            <td class="celda-rda" data-materia="${materia}" data-rda="2" style="cursor: pointer; color: #0066cc; text-decoration: underline;" title="Haz clic para ver desglose y gráfica">${Number(rda2).toFixed(2)}</td>
            <td class="celda-rda" data-materia="${materia}" data-rda="3" style="cursor: pointer; color: #0066cc; text-decoration: underline;" title="Haz clic para ver desglose y gráfica">${Number(rda3).toFixed(2)}</td>
            <td><strong style="color: #2c3e50;">${Number(promedioFinal).toFixed(2)}</strong></td>
        `;
        tablaBody.appendChild(fila);
    });

    // Añadir eventos de clic a las celdas de RDA recién creadas
    document.querySelectorAll(".celda-rda").forEach(celda => {
        celda.addEventListener("click", (e) => {
            const materia = e.currentTarget.getAttribute("data-materia");
            const rda = e.currentTarget.getAttribute("data-rda");
            abrirDetalleRdaPantalla(materia, rda);
        });
    });
}

// Configura los eventos para alternar entre la vista de promedios y el detalle de RDA
function configurarVistaDetalleRda() {
    // Listener general por si llegara a requerirse en otro contexto, sin romper nada
    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "btn-regresar-promedios") {
            e.preventDefault();

            const modalEstadisticas = document.getElementById("modal-estadisticas");
            if (modalEstadisticas) {
                modalEstadisticas.style.display = "none";
            }

            const contenidoGeneral = document.getElementById("estadisticas-contenido-general");
            if (contenidoGeneral) {
                contenidoGeneral.innerHTML = "";
            }

            const vistaTablaPromedios = document.getElementById("vista-tabla-promedios");
            if (vistaTablaPromedios) {
                vistaTablaPromedios.style.display = "block";
            }

            const vistaDetalleRda = document.getElementById("vista-detalle-rda");
            if (vistaDetalleRda) {
                vistaDetalleRda.style.display = "none";
            }
            
            if (typeof graficaDetalleRdaInstance !== 'undefined' && graficaDetalleRdaInstance) {
                graficaDetalleRdaInstance.destroy();
                graficaDetalleRdaInstance = null;
            }

            if (typeof renderizarTablaPromedios === 'function') {
                renderizarTablaPromedios();
            }
        }
    });
}

// Muestra la vista detallada de un RDA específico incluyendo su tabla por criterios y gráfica
function abrirDetalleRdaPantalla(materia, numeroRda) {
    const vistaPrincipal = document.getElementById("vista-tabla-promedios");
    const vistaDetalle = document.getElementById("vista-detalle-rda");
    const contenidoGeneral = document.getElementById("estadisticas-contenido-general");

    if (!contenidoGeneral) return;

    // Asegurarnos de que el contenedor de estadísticas tenga un estilo limpio y centrado si fuera necesario
    // Obtenemos actividades globales
    const listaActividades = typeof obtenerActividadesGlobales === 'function' ? obtenerActividadesGlobales() : [];

    // Filtramos las actividades correspondientes a esta materia y RDA
    const actividadesRda = listaActividades.filter(act =>
        act.materia === materia && String(act.rda) === String(numeroRda)
    );

    if (actividadesRda.length === 0) {
        contenidoGeneral.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Desglose de RDA ${numeroRda} - ${materia}</h3>
                <p style="color: #666;">No hay actividades registradas para este RDA en ${materia}.</p>
            </div>
        `;
    } else {
        // Agrupar actividades por Criterio para calcular sus promedios individuales y alimentar la gráfica
        const criteriosMap = {};
        const etiquetasGrafica = [];
        const valoresGrafica = [];

        actividadesRda.forEach(act => {
            const critKey = act.criterio || '1';
            if (!criteriosMap[critKey]) {
                criteriosMap[critKey] = [];
            }
            criteriosMap[critKey].push(act);
        });

        let html = `
            <div style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin: 0 auto; max-width: 900px;">
                <h3 style="margin-bottom: 15px; color: #2c3e50; text-align: center;">Desglose de RDA ${numeroRda} - ${materia}</h3>
                
                <!-- Contenedor de la Gráfica de Criterios -->
                <div class="grafica-contenedor" style="margin-bottom: 25px; height: 280px; position: relative;">
                    <canvas id="graficaCriteriosRda"></canvas>
                </div>

                <p style="margin-bottom: 15px; font-size: 0.95em; color: #555;">Actividades, notas y promedios detallados por criterio:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f2f2f2; text-align: left;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Criterio</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Tema o Actividad</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Nota (0-50)</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Estado</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Fecha Límite</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Recorrer cada criterio, pintar actividades y calcular promedios
        Object.keys(criteriosMap).sort().forEach(critKey => {
            const actsCriterio = criteriosMap[critKey];
            let sumaNotas = 0;
            let cantidadValidas = 0;

            actsCriterio.forEach(act => {
                const notaNum = (act.nota !== undefined && act.nota !== '' && !isNaN(act.nota)) ? parseFloat(act.nota) : 0;
                sumaNotas += notaNum;
                cantidadValidas++;

                html += `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Criterio ${critKey}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${act.tema || 'Sin nombre'}</td>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${act.nota !== undefined && act.nota !== '' ? act.nota : 'Sin nota'}</td>
                        <td style="padding: 8px; border: 1px solid #ddd; text-transform: capitalize;">${act.estado || 'Pendiente'}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${act.fechaLimite || '-'}</td>
                    </tr>
                `;
            });

            // Promedio del criterio sobre 50 y llevado a escala 0-100
            const promedioCriterioBase = cantidadValidas > 0 ? (sumaNotas / cantidadValidas) : 0;
            const promedioCriterioEscala100 = promedioCriterioBase * 2;

            // Guardamos los datos para estructurar la gráfica de Chart.js
            etiquetasGrafica.push(`Criterio ${critKey}`);
            valoresGrafica.push(promedioCriterioEscala100.toFixed(2));

            // Fila de resumen de criterio
            html += `
                <tr style="background-color: #eef2f7; font-weight: bold;">
                    <td colspan="5" style="padding: 8px; border: 1px solid #ddd; text-align: right; color: #1e293b;">
                        Promedio final Criterio ${critKey} RDA ${numeroRda} = ${promedioCriterioEscala100.toFixed(2)}
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
        contenidoGeneral.innerHTML = html;

        // Renderizar la gráfica de barras de los criterios usando Chart.js
        setTimeout(() => {
            const canvasCriterios = document.getElementById("graficaCriteriosRda");
            if (canvasCriterios) {
                if (graficaDetalleRdaInstance) {
                    graficaDetalleRdaInstance.destroy();
                }

                graficaDetalleRdaInstance = new Chart(canvasCriterios, {
                    type: 'bar',
                    data: {
                        labels: etiquetasGrafica,
                        datasets: [{
                            label: `Rendimiento por Criterio (Escala 0-100)`,
                            data: valoresGrafica,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
            }
        }, 50);
    }

    // Ocultar la tabla principal del dashboard y mostrar la sección de detalle correctamente
    if (vistaPrincipal) vistaPrincipal.style.display = "none";
    if (vistaDetalle) vistaDetalle.style.display = "block";
}

// Configura los escuchadores principales al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    renderizarTablaPromedios();
    configurarVistaDetalleRda();
});