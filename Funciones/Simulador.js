// ==========================================
// SIMULADOR DE NOTAS - MODELO ALGEBRAICO Y PONDERADO
// ==========================================

// Control de visibilidad entre Modo A y Modo B
function cambiarModo() {
    let modo = document.getElementById('select-modo').value;
    let secSimular = document.getElementById('sec-simular');
    let secNecesaria = document.getElementById('sec-necesaria');
    let txtRes = document.getElementById('texto-resultado');

    if (secSimular && secNecesaria) {
        secSimular.style.display = (modo === "simular") ? "block" : "none";
        secNecesaria.style.display = (modo === "necesaria") ? "block" : "none";
    }

    // Limpiar la caja de resultado al cambiar de modo para evitar confusiones visuales
    if (txtRes) {
        txtRes.innerHTML = "Resultado";
    }

    if (modo === "simular") {
        actualizarActividadesPendientesSimulador();
    }
}

/**
 * Rellena dinámicamente el selector de actividades pendientes del Modo A 
 * según la Materia, RDA y Criterio que el usuario haya seleccionado.
 */
function actualizarActividadesPendientesSimulador() {
    let materia = document.getElementById('select-materia-a')?.value;
    let rda = document.getElementById('select-rda-a')?.value;
    let criterio = document.getElementById('select-criterio-a')?.value;
    let selectPendientes = document.getElementById('select-actividad-pendiente-a');

    if (!selectPendientes) return;

    // Limpiar opciones anteriores
    selectPendientes.innerHTML = '<option value="">-- Simular nota general / Actividad nueva --</option>';

    if (!materia || !rda || !criterio) return;

    if (typeof actividades !== 'undefined' && Array.isArray(actividades)) {
        actividades.forEach((act, index) => {
            // Evaluamos si coincide con los filtros y su estado es pendiente
            if (
                act.materia === materia &&
                String(act.rda) === String(rda) &&
                String(act.criterio) === String(criterio) &&
                String(act.estado).toLowerCase() === "pendiente"
            ) {
                let option = document.createElement('option');
                option.value = index; // Guardamos el índice en el arreglo global
                option.textContent = `${act.tema || 'Actividad sin nombre'} (Pendiente)`;
                selectPendientes.appendChild(option);
            }
        });
    }
}

/**
 * Extrae notas existentes y pendientes de un criterio filtrando por Materia y RDA.
 * Las actividades pendientes no seleccionadas para simulación se computan automáticamente con nota 0.
 */
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

<<<<<<< HEAD
// Función principal Modo B: Calcula la nota requerida 'x' en la actividad faltante para alcanzar la meta 'T'
function calcularNotaNecesariaEnCriterio(promedioObjetivo, cantidadNotasIngresadas, totalActividadesEsperadas, aporteOtrosCriterios, nombreCriterio) {

    // "cantidadNotasIngresadas" es la lista de notas (un arreglo).
    // Usamos .length para contar cuántas notas metió el usuario.
    if (cantidadNotasIngresadas.length >= totalActividadesEsperadas) {
        return "Error en el " + nombreCriterio + ": Ya ingresaste " + cantidadNotasIngresadas.length + " notas de " + totalActividadesEsperadas + " permitidas. Para calcular la nota faltante (x) debes ingresar máximo " + (totalActividadesEsperadas - 1) + " notas.";
=======
                if (estadoLower === "pendiente") {
                    if (tratarPendientesComoCero) {
                        notas.push(0);
                    }
                    // Si tratarPendientesComoCero es false, las ignoramos (las dejamos como casillas vacías a calcular)
                } else if (!isNaN(valor)) {
                    notas.push(valor);
                }
            }
        });
>>>>>>> 25767640355e9b4823d45432062f4239554b5bcd
    }
    return notas;
}

// Función principal de ejecución al hacer clic en "Calcular Resultado"
function ejecutarCalculo() {
    let modo = document.getElementById('select-modo').value;
    let txtRes = document.getElementById('texto-resultado');

    if (!txtRes) return;

    // ==========================================
    // MODO A: Simulación de Promedio Final
    // ==========================================
    if (modo === "simular") {
        let materia = document.getElementById('select-materia-a').value;
        let rda = document.getElementById('select-rda-a').value;
        let criterio = document.getElementById('select-criterio-a').value;
        let indicePendiente = document.getElementById('select-actividad-pendiente-a').value;

        if (!materia) {
            txtRes.innerText = "Por favor, selecciona una materia.";
            return;
        }

        // NUEVA VALIDACIÓN: Obligar a que el usuario seleccione una actividad pendiente específica
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

        // Añadir nota hipotética al criterio seleccionado
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
    // ==========================================
    // MODO B: Cálculo de Nota Necesaria
    // ==========================================
    else {
        let materia = document.getElementById('select-materia-b').value;
        let rda = document.getElementById('select-rda-b').value;

        if (!materia) {
            txtRes.innerText = "Por favor, selecciona una materia.";
            return;
        }

<<<<<<< HEAD
    if (notaFaltanteEscalaCincuenta <= 0) {
        return "¡Felicidades! Ya alcanzaste tu meta de " + promedioObjetivo.toFixed(2) + ". No necesitas sacar puntos adicionales en las actividades faltantes.";
    }
=======
        let inputObjetivoVal = document.getElementById('input-T').value;
        let validacionObjetivo = validarPromedioObjetivo(inputObjetivoVal);
>>>>>>> 25767640355e9b4823d45432062f4239554b5bcd

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

        // Llamada actualizada pasando los parámetros correctos para evaluar el RDA completo
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