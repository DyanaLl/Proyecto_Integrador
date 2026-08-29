// ==========================================
// SIMULADOR DE NOTAS - MODELO ALGEBRAICO LINEAL
// ==========================================

// BLOQUE A: Proceso de cálculo para el MODO A (Simular cómo una nota afecta al promedio final.)

// Función principal Modo A: Simula la Nota Final Proyectada (reutilizando la función centralizada y PESO_CRITERIO)
function simularNotaFinalPorCriterios(notasCriterioUno, notasCriterioDos, notasCriterioTres) {
    let promedioCriterioUnoSobreDiez = calcularPromedioCriterio(notasCriterioUno);
    let promedioCriterioDosSobreDiez = calcularPromedioCriterio(notasCriterioDos);
    let promedioCriterioTresSobreDiez = calcularPromedioCriterio(notasCriterioTres);

    // Se aplica la constante PESO_CRITERIO importada desde Calculos.js para evitar repetición
    let promedioFinalProyectado = (promedioCriterioUnoSobreDiez + promedioCriterioDosSobreDiez + promedioCriterioTresSobreDiez) * PESO_CRITERIO;

    return promedioFinalProyectado.toFixed(2);
}

// ==========================================
// BLOQUE B: Proceso de cálculo para el MODO B (Nota Necesaria 'x' para obtener un promedio deseado.)
// ==========================================

function calcularNotaNecesariaEnCriterio(promedioObjetivo, notasExistentesArray, totalActividadesEsperadas, nombreCriterio, aporteOtrosCriterios) {
    let cantidadNotasActuales = notasExistentesArray.length;
    let actividadesPendientes = totalActividadesEsperadas - cantidadNotasActuales;

    // Validación si ya completó o se pasó del total de actividades
    if (actividadesPendientes <= 0) {
        return "Error en el " + nombreCriterio + ": Ya has ingresado " + cantidadNotasActuales + " notas de un total de " + totalActividadesEsperadas + " actividades esperadas.";
    }

    // Sumar las notas que el estudiante ya tiene registradas
    let sumaNotasExistentes = 0;
    for (let indice = 0; indice < notasExistentesArray.length; indice++) {
        sumaNotasExistentes += notasExistentesArray[indice];
    }

    // Cálculo del puntaje total faltante en escala sobre 50 para este criterio
    let puntajeTotalFaltanteEscalaCincuenta = (5 * ((promedioObjetivo - aporteOtrosCriterios) / PESO_CRITERIO) * totalActividadesEsperadas) - sumaNotasExistentes;
    
    // Promedio que necesita obtener en las actividades que le faltan
    let promedioFaltanteEscalaCincuenta = puntajeTotalFaltanteEscalaCincuenta / actividadesPendientes;
    let promedioFaltanteEscalaDiez = promedioFaltanteEscalaCincuenta / 5;

    if (puntajeTotalFaltanteEscalaCincuenta <= 0) {
        return "¡Felicidades! Con lo que ya tienes asegurado, ya alcanzaste tu meta de " + promedioObjetivo.toFixed(2) + ". No necesitas sacar puntos adicionales.";
    }

    if (promedioFaltanteEscalaCincuenta > 50) {
        return "Imposible alcanzar la nota deseada (" + promedioObjetivo.toFixed(2) + "). El promedio requerido en tus " + actividadesPendientes + " actividades pendientes supera el máximo de 50 puntos.";
    }

    return "Para alcanzar tu promedio objetivo de " + promedioObjetivo.toFixed(2) + " en el " + nombreCriterio + ", necesitas obtener un promedio de " + promedioFaltanteEscalaDiez.toFixed(2) + " (sobre 10) o " + promedioFaltanteEscalaCincuenta.toFixed(2) + " (sobre 50) en tus " + actividadesPendientes + " actividades pendientes.";
}

