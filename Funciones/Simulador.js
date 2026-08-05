// =========================================================
// SIMULADOR DE NOTAS - MODELO ALGEBRAICO LINEAL
// =========================================================

// BLOQUE A: Proceso de cálculo para el MODO A (Simular como una nota afecta al promedio final.)

// Función auxiliar: Convierte las notas de un criterio (escala 0-50) a su promedio equivalente sobre 10
function calcularPromedioCriterioSobreDiez(listaNotasCriterio) {
    if (listaNotasCriterio.length === 0) return 0;

    let sumaAcumuladaDeNotasIngresadas = 0;
    for (let indice = 0; indice < listaNotasCriterio.length; indice++) {
        sumaAcumuladaDeNotasIngresadas += listaNotasCriterio[indice];
    }

    let promedioCriterioSobreCincuenta = sumaAcumuladaDeNotasIngresadas / listaNotasCriterio.length;
    let promedioCriterioSobreDiez = promedioCriterioSobreCincuenta / 5;

    return promedioCriterioSobreDiez;
}

// Función principal Modo A: Simula la Nota Final Proyectada T (ponderación de 33.33% por criterio)
function simularNotaFinalPorCriterios(notasCriterioUno, notasCriterioDos, notasCriterioTres) {
    let promedioCriterioUnoSobreDiez = calcularPromedioCriterioSobreDiez(notasCriterioUno);
    let promedioCriterioDosSobreDiez = calcularPromedioCriterioSobreDiez(notasCriterioDos);
    let promedioCriterioTresSobreDiez = calcularPromedioCriterioSobreDiez(notasCriterioTres);

    let aporteCriterioUnoAlTotal = promedioCriterioUnoSobreDiez * 0.333333;
    let aporteCriterioDosAlTotal = promedioCriterioDosSobreDiez * 0.333333;
    let aporteCriterioTresAlTotal = promedioCriterioTresSobreDiez * 0.333333;

    let promedioFinalProyectado = aporteCriterioUnoAlTotal + aporteCriterioDosAlTotal + aporteCriterioTresAlTotal;

    return promedioFinalProyectado.toFixed(2);
}

// BLOQUE B: Proceso de cálculo para el MODO B (Nota Necesaria x para obtener un promedio deseado.)


// Función principal Modo B: Calcula la nota requerida 'x' en la actividad faltante para alcanzar la meta 'T'
    function calcularNotaNecesariaEnCriterio(promedioObjetivo, cantidadNotasIngresadas, totalActividadesEsperadas, aporteOtrosCriterios, nombreCriterio) {

    // "cantidadNotasIngresadas" es la lista de notas (un arreglo).
    // Usamos .length para contar cuántas notas metió el usuario.
    if (cantidadNotasIngresadas.length >= totalActividadesEsperadas) {
        return "Error en el " + nombreCriterio + ": Ya ingresaste " + cantidadNotasIngresadas.length + " notas de " + totalActividadesEsperadas + " permitidas. Para calcular la nota faltante (x) debes ingresar máximo " + (totalActividadesEsperadas - 1) + " notas.";
    }

    let sumaNotasExistentes = 0;
    for (let indice = 0; indice < cantidadNotasIngresadas; indice++) {
        sumaNotasExistentes += notasObtenidas[indice];
    }

    let notaFaltanteEscalaCincuenta = (5 * ((promedioObjetivo - aporteOtrosCriterios) / 0.333333) * totalActividadesEsperadas) - sumaNotasExistentes;
    let notaFaltanteEscalaDiez = notaFaltanteEscalaCincuenta / 5;

    if (notaFaltanteEscalaCincuenta <= 0) {
        return "¡Felicidades! Ya alcanzaste tu meta de " + promedioObjetivo.toFixed(2) + ". No necesitas sacar puntos adicionales en las actividades faltantes.";
    } 

    if (notaFaltanteEscalaCincuenta > 50) {
        return "Imposible alcanzar la nota deseada (" + promedioObjetivo.toFixed(2) + "). Necesitarías sacar " + notaFaltanteEscalaCincuenta.toFixed(2) + " / 50 en la actividad faltante (supera el límite de 50 pts).";
    }

    return "Para alcanzar tu promedio objetivo de " + promedioObjetivo.toFixed(2) + ", necesitas sacar una nota de " + notaFaltanteEscalaCincuenta.toFixed(2) + " / 50 (" + notaFaltanteEscalaDiez.toFixed(2) + " / 10) en la actividad faltante.";
}