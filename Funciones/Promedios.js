document.addEventListener("DOMContentLoaded", () => {
    renderizarTablaPromedios();
    configurarVistaDetalleRda();
});

// Variable global para controlar la instancia de la gráfica en el detalle y evitar errores de superposición
let graficaDetalleRdaInstance = null;

function renderizarTablaPromedios() {
    const tablaBody = document.getElementById("tabla-promedios-body");
    if (!tablaBody) return;

    tablaBody.innerHTML = "";

    // Obtenemos las actividades globales centralizadas desde calculos.js
    const listaActividades = typeof obtenerActividadesGlobales === 'function' ? obtenerActividadesGlobales() : [];

    console.log("Pintando promedios con las actividades:", listaActividades);

    if (!listaActividades || listaActividades.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay actividades registradas todavía.</td></tr>`;
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

function configurarVistaDetalleRda() {
    // Usamos delegación de eventos para capturar el botón dinámico de regresar
    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "btn-regresar-promedios") {
            e.preventDefault();

            // 1. Ocultar completamente el modal de estadísticas que muestra la pantalla blanca
            const modalEstadisticas = document.getElementById("modal-estadisticas");
            if (modalEstadisticas) {
                modalEstadisticas.style.display = "none";
            }

            // 2. Limpiar el contenido interno del detalle del RDA
            const contenidoGeneral = document.getElementById("estadisticas-contenido-general");
            if (contenidoGeneral) {
                contenidoGeneral.innerHTML = "";
            }

            // 3. Asegurar que la vista de la tabla de promedios dentro de la sección se muestre correctamente
            const vistaTablaPromedios = document.getElementById("vista-tabla-promedios");
            if (vistaTablaPromedios) {
                vistaTablaPromedios.style.display = "block";
            }

            const vistaDetalleRda = document.getElementById("vista-detalle-rda");
            if (vistaDetalleRda) {
                vistaDetalleRda.style.display = "none";
            }
            
            // 4. Destruir la instancia de la gráfica de Chart.js para liberar memoria y evitar errores
            if (typeof graficaDetalleRdaInstance !== 'undefined' && graficaDetalleRdaInstance) {
                graficaDetalleRdaInstance.destroy();
                graficaDetalleRdaInstance = null;
            }

            // 5. Re-renderizar la tabla de promedios para refrescar los datos del dashboard
            if (typeof renderizarTablaPromedios === 'function') {
                renderizarTablaPromedios();
            }
        }
    });
}

function abrirDetalleRdaPantalla(materia, numeroRda) {
    const vistaPrincipal = document.getElementById("vista-tabla-promedios");
    const vistaDetalle = document.getElementById("vista-detalle-rda");
    const contenidoGeneral = document.getElementById("estadisticas-contenido-general");

    if (!vistaPrincipal || !vistaDetalle || !contenidoGeneral) return;

    // Obtenemos actividades globales
    const listaActividades = typeof obtenerActividadesGlobales === 'function' ? obtenerActividadesGlobales() : [];

    // Filtramos las actividades correspondientes a esta materia y RDA
    const actividadesRda = listaActividades.filter(act =>
        act.materia === materia && String(act.rda) === String(numeroRda)
    );

    if (actividadesRda.length === 0) {
        contenidoGeneral.innerHTML = `
            <button type="button" id="btn-regresar-promedios" class="btn btn-excel" style="margin-bottom: 15px;">← Regresar a Promedios</button>
            <h3>Desglose de RDA ${numeroRda} - ${materia}</h3>
            <p style="text-align: center; padding: 20px; color: #666;">No hay actividades registradas para este RDA en ${materia}.</p>
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
            <!-- Botón de regresar integrado dinámicamente -->
            <button type="button" id="btn-regresar-promedios" class="btn btn-excel" style="margin-bottom: 15px;">← Regresar a Promedios</button>
            
            <h3 style="margin-bottom: 15px; color: #2c3e50;">Desglose de RDA ${numeroRda} - ${materia}</h3>
            
            <!-- Contenedor de la Gráfica de Criterios -->
            <div class="grafica-contenedor" style="margin-bottom: 25px; height: 280px; position: relative;">
                <canvas id="graficaCriteriosRda"></canvas>
            </div>

            <p style="margin-bottom: 15px; font-size: 0.95em; color: #555;">Actividades, notas y promedios detallados por criterio:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background-color: #f2f2f2; text-align: left;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Criterio</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Tema o Actividad</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Nota (0-50)</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Estado</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Fecha Límite</th>
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

    // Ocultar la tabla principal y mostrar la nueva pantalla de estadísticas completa
    vistaPrincipal.style.display = "none";
    vistaDetalle.style.display = "block";
}
