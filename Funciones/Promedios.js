document.addEventListener("DOMContentLoaded", () => {
    renderizarTablaPromedios();
    configurarModalRda();
});

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

        // Obtenemos el promedio final de la materia
        const promedioFinal = typeof calcularPromedioFinalMateria === 'function'
            ? calcularPromedioFinalMateria(materia)
            : ((rda1 + rda2 + rda3) / 3);

        // Creamos y rellenamos la fila para la tabla HTML sin los números entre paréntesis
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><strong>${materia}</strong></td>
            <td class="celda-rda" data-materia="${materia}" data-rda="1" style="cursor: pointer; color: #0066cc; text-decoration: underline;" title="Haz clic para ver desglose">${Number(rda1).toFixed(2)}</td>
            <td class="celda-rda" data-materia="${materia}" data-rda="2" style="cursor: pointer; color: #0066cc; text-decoration: underline;" title="Haz clic para ver desglose">${Number(rda2).toFixed(2)}</td>
            <td class="celda-rda" data-materia="${materia}" data-rda="3" style="cursor: pointer; color: #0066cc; text-decoration: underline;" title="Haz clic para ver desglose">${Number(rda3).toFixed(2)}</td>
            <td><strong style="color: #2c3e50;">${Number(promedioFinal).toFixed(2)}</strong></td>
        `;
        tablaBody.appendChild(fila);
    });

    // Añadir eventos de clic a las celdas de RDA recién creadas
    document.querySelectorAll(".celda-rda").forEach(celda => {
        celda.addEventListener("click", (e) => {
            const materia = e.currentTarget.getAttribute("data-materia");
            const rda = e.currentTarget.getAttribute("data-rda");
            abrirDetalleRdaModal(materia, rda);
        });
    });
}

function configurarModalRda() {
    const btnCerrar = document.getElementById("btn-cerrar-modal-rda");
    const modal = document.getElementById("modal-detalle-rda");

    if (btnCerrar && modal) {
        btnCerrar.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // Cerrar también si hacen clic fuera del contenido del modal
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
}

function abrirDetalleRdaModal(materia, numeroRda) {
    const modal = document.getElementById("modal-detalle-rda");
    const titulo = document.getElementById("modal-rda-titulo");
    const contenido = document.getElementById("modal-rda-contenido");

    if (!modal || !titulo || !contenido) return;

    titulo.textContent = `Desglose de RDA ${numeroRda} - ${materia}`;

    // Obtenemos actividades globales
    const listaActividades = typeof obtenerActividadesGlobales === 'function' ? obtenerActividadesGlobales() : [];

    // Filtramos las actividades correspondientes a esta materia y RDA
    const actividadesRda = listaActividades.filter(act =>
        act.materia === materia && String(act.rda) === String(numeroRda)
    );

    if (actividadesRda.length === 0) {
        contenido.innerHTML = `<p style="text-align: center; padding: 20px; color: #666;">No hay actividades registradas para este RDA en ${materia}.</p>`;
    } else {
        // Agrupar actividades por Criterio para calcular sus promedios individuales
        const criteriosMap = {};
        actividadesRda.forEach(act => {
            const critKey = act.criterio || '1';
            if (!criteriosMap[critKey]) {
                criteriosMap[critKey] = [];
            }
            criteriosMap[critKey].push(act);
        });

        let html = `
            <p style="margin-bottom: 15px; font-size: 0.95em; color: #555;">A continuación se muestran las actividades, notas y promedios por criterio de este RDA:</p>
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

        // Recorrer cada criterio, pintar sus actividades y calcular su promedio final de criterio en escala 0-100
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

            // Calcular el promedio del criterio sobre 50 y multiplicarlo por 2 para llevarlo a la escala de 0 a 100
            const promedioCriterioBase = cantidadValidas > 0 ? (sumaNotas / cantidadValidas) : 0;
            const promedioCriterioEscala100 = promedioCriterioBase * 2;

            // Fila de resumen con el promedio final del criterio en escala 0-100
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
        contenido.innerHTML = html;
    }

    modal.style.display = "flex";
}