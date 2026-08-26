function obtenerNotasTablaPromedios(materia, rda, criterio) {
    let notas = [];

    actividades.forEach(actividad => {
        if (
            actividad.materia === materia &&
            Number(actividad.rda || 1) === Number(rda) &&
            Number(actividad.criterio) === Number(criterio)
        ) {
            const valorNota = Number(actividad.nota);

            if (!isNaN(valorNota)) {
                notas.push(valorNota);
            }
        }
    });

    return notas;
}

function calcularPromedioRDA(materia, rda) {
    const notasCriterioUno = obtenerNotasTablaPromedios(materia, rda, 1);
    const notasCriterioDos = obtenerNotasTablaPromedios(materia, rda, 2);
    const notasCriterioTres = obtenerNotasTablaPromedios(materia, rda, 3);

    return Number(
        calcularNotaFinalProyectada(
            notasCriterioUno,
            notasCriterioDos,
            notasCriterioTres
        )
    );
}

function mostrarTablaPromedios() {
    const tabla = document.getElementById("tabla-promedios-body");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    const materias = [];

    actividades.forEach(actividad => {
        if (
            actividad.materia &&
            !materias.includes(actividad.materia)
        ) {
            materias.push(actividad.materia);
        }
    });

    if (materias.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No existen actividades registradas.
                </td>
            </tr>
        `;
        return;
    }

    materias.forEach(materia => {
        const promedioRDA1 = calcularPromedioRDA(materia, 1);
        const promedioRDA2 = calcularPromedioRDA(materia, 2);
        const promedioRDA3 = calcularPromedioRDA(materia, 3);

        const promedioFinal =
            (promedioRDA1 + promedioRDA2 + promedioRDA3) / 3;

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${materia}</td>
            <td>${promedioRDA1.toFixed(2)}</td>
            <td>${promedioRDA2.toFixed(2)}</td>
            <td>${promedioRDA3.toFixed(2)}</td>
            <td>${promedioFinal.toFixed(2)}</td>
        `;

        tabla.appendChild(fila);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    mostrarTablaPromedios();
});