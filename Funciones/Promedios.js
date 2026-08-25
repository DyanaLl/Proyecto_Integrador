function obtenerNotasTablaPromedios(materia, criterio) {
    let notas = [];

    actividades.forEach(actividad => {
        if (
            actividad.materia === materia &&
            Number(actividad.criterio) === Number(criterio)
        ) {
            let valorNota = Number(actividad.nota);

            if (!isNaN(valorNota)) {
                notas.push(valorNota);
            }
        }
    });

    return notas;
}

function mostrarTablaPromedios() {
    const tabla = document.getElementById("tabla-promedios-body");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    let materias = [];

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
        let notasCriterioUno = obtenerNotasTablaPromedios(materia, 1);
        let notasCriterioDos = obtenerNotasTablaPromedios(materia, 2);
        let notasCriterioTres = obtenerNotasTablaPromedios(materia, 3);

        let promedioUno = calcularPromedioCriterio(notasCriterioUno);
        let promedioDos = calcularPromedioCriterio(notasCriterioDos);
        let promedioTres = calcularPromedioCriterio(notasCriterioTres);

        let promedioFinal = calcularNotaFinalProyectada(
            notasCriterioUno,
            notasCriterioDos,
            notasCriterioTres
        );

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${materia}</td>
            <td>${promedioUno.toFixed(2)}</td>
            <td>${promedioDos.toFixed(2)}</td>
            <td>${promedioTres.toFixed(2)}</td>
            <td>${promedioFinal}</td>
        `;

        tabla.appendChild(fila);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    mostrarTablaPromedios();
});