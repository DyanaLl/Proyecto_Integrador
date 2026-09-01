
/** Controla la visibilidad entre el Modo A y el Modo B. */
function cambiarModo() {
    let modo = document.getElementById('select-modo').value;
    let secSimular = document.getElementById('sec-simular');
    let secNecesaria = document.getElementById('sec-necesaria');
    let txtRes = document.getElementById('texto-resultado');

    if (secSimular && secNecesaria) {
        secSimular.style.display = (modo === "simular") ? "block" : "none";
        secNecesaria.style.display = (modo === "necesaria") ? "block" : "none";
    }

    if (txtRes) {
        txtRes.innerHTML = "Resultado";
    }

    if (modo === "simular") {
        actualizarActividadesPendientesSimulador();
    }
}

/** Rellena dinámicamente el selector de actividades pendientes del Modo A. */
function actualizarActividadesPendientesSimulador() {
    let materia = document.getElementById('select-materia-a')?.value;
    let rda = document.getElementById('select-rda-a')?.value;
    let criterio = document.getElementById('select-criterio-a')?.value;
    let selectPendientes = document.getElementById('select-actividad-pendiente-a');

    if (!selectPendientes) return;

    selectPendientes.innerHTML = '<option value="">-- Simular nota general / Actividad nueva --</option>';

    if (!materia || !rda || !criterio) return;

    if (typeof actividades !== 'undefined' && Array.isArray(actividades)) {
        actividades.forEach((act, index) => {
            if (
                act.materia === materia &&
                String(act.rda) === String(rda) &&
                String(act.criterio) === String(criterio) &&
                String(act.estado).toLowerCase() === "pendiente"
            ) {
                let option = document.createElement('option');
                option.value = index;
                option.textContent = `${act.tema || 'Actividad sin nombre'} (Pendiente)`;
                selectPendientes.appendChild(option);
            }
        });
    }
}

/** Extrae notas existentes y pendientes filtrando por Materia, RDA y Criterio. */
function obtenerNotasPorMateriaRDAYCriterio(materia, rda, criterio, indiceExcluir = null, tratarPendientesComoCero = true) {
    let notas = [];
    if (typeof actividades !== 'undefined' && Array.isArray(actividades)) {
        actividades.forEach((act, index) => {
            if (indiceExcluir !== null && Number(index) === Number(indiceExcluir)) {
                return;
            }

            if (
                act.materia === materia &&
                String(act.rda) === String(rda) &&
                String(act.criterio) === String(criterio)
            ) {
                let estadoLower = String(act.estado || '').toLowerCase();
                let valor = parseFloat(act.nota);

                if (estadoLower === "pendiente") {
                    if (tratarPendientesComoCero) {
                        notas.push(0);
                    }
                } else if (!isNaN(valor)) {
                    notas.push(valor);
                }
            }
        });
    }
    return notas;
}

/** Ejecuta el cálculo principal según el modo seleccionado (Modo A o Modo B). */
function ejecutarCalculo() {
    let modo = document.getElementById('select-modo').value;
    let txtRes = document.getElementById('texto-resultado');

    if (!txtRes) return;

    // MODO A: Simulación de Promedio Final
    if (modo === "simular") {
        let materia = document.getElementById('select-materia-a').value;
        let rda = document.getElementById('select-rda-a').value;
        let criterio = document.getElementById('select-criterio-a').value;
        let indicePendiente = document.getElementById('select-actividad-pendiente-a').value;

        if (!materia) {
            txtRes.innerText = "Por favor, selecciona una materia.";
            return;
        }

        if (indicePendiente === "") {
            txtRes.innerText = "Por favor, selecciona una actividad pendiente válida para simular.";
            return;
        }

        let validacionNota = validarNotaActividad(document.getElementById('input-nota-nueva').value);
        if (!validacionNota.esValido) {
            txtRes.innerText = validacionNota.mensaje;
            return;
        }
        let notaHipotetica = validacionNota.valor;

        let excluirIdx = parseInt(indicePendiente);

        let notasC1 = obtenerNotasPorMateriaRDAYCriterio(materia, rda, "1", excluirIdx);
        let notasC2 = obtenerNotasPorMateriaRDAYCriterio(materia, rda, "2", excluirIdx);
        let notasC3 = obtenerNotasPorMateriaRDAYCriterio(materia, rda, "3", excluirIdx);

        if (criterio === "1") notasC1.push(notaHipotetica);
        else if (criterio === "2") notasC2.push(notaHipotetica);
        else if (criterio === "3") notasC3.push(notaHipotetica);

        let promedioProyectado = simularNotaFinalPorCriterios(notasC1, notasC2, notasC3);

        txtRes.innerHTML = `
            <div style="padding: 10px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #0056b3;">
                Simulando tarea pendiente en ${materia} (RDA ${rda})<br>
                <span style="font-size: 1.2em; color: #0056b3;">Resultado Proyectado: ${Number(promedioProyectado).toFixed(2)} / 100</span>
            </div>
        `;
    }
    // MODO B: Cálculo de Nota Necesaria
    else {
        let materia = document.getElementById('select-materia-b').value;
        let rda = document.getElementById('select-rda-b').value;

        if (!materia) {
            txtRes.innerText = "Por favor, selecciona una materia.";
            return;
        }

        let inputObjetivoVal = document.getElementById('input-promedio-objetivo').value;
        let validacionObjetivo = validarPromedioObjetivo(inputObjetivoVal);

        if (!validacionObjetivo.esValido) {
            txtRes.innerText = "Error: " + validacionObjetivo.mensaje;
            return;
        }

        let promedioObjetivo = validacionObjetivo.valor;
        let criterioActivo = document.getElementById('select-crit-activo').value;

        let inputFaltantesEl = document.getElementById('input-faltantes');
        let validacionFaltantes = validarCantidadActividadesFaltantes(inputFaltantesEl ? inputFaltantesEl.value : 1);
        if (!validacionFaltantes.esValido) {
            txtRes.innerText = validacionFaltantes.mensaje;
            return;
        }
        let actividadesPendientes = validacionFaltantes.valor;

        let notasExistentes = obtenerNotasPorMateriaRDAYCriterio(materia, rda, criterioActivo, null, false);
        let totalActividades = notasExistentes.length + actividadesPendientes;

        let nombreCriterio = "Criterio " + criterioActivo;

        let mensajeResultado = calcularNotaNecesariaEnCriterio(
            promedioObjetivo,
            notasExistentes,
            totalActividades,
            nombreCriterio,
            materia,
            rda,
            criterioActivo
        );

        txtRes.innerText = mensajeResultado;
    }
}
