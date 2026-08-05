// =========================================================
// SIMULADOR DE NOTAS - MODELO ALGEBRAICO LINEAL
// =========================================================

 // Obtiene el promedio sobre 10 a partir de un arreglo de números
function obtenerPromedio10(arregloNotas) {
    if (arregloNotas.length === 0) {
        return 0;
    }

    let suma = 0;
    for (let i = 0; i < arregloNotas.length; i++) {
        suma = suma + arregloNotas[i];
    }

    let promedio50 = suma / arregloNotas.length;
    return promedio50 / 5; // Convertir escala 50 a escala 10
}

// MODO A: Simular Nota Final T
function simularNotaFinalPorCriterios(notasC1, notasC2, notasC3) {
    let prom1 = obtenerPromedio10(notasC1);
    let prom2 = obtenerPromedio10(notasC2);
    let prom3 = obtenerPromedio10(notasC3);

    let notaFinal = (prom1 + prom2 + prom3) * 0.333333;
    return Number(notaFinal.toFixed(2));
}

// MODO B: Calcular Nota Necesaria x
function calcularNotaNecesariaEnCriterio(T, notasActivas, totalActividades, A_otros) {
    let P = 0.333333;
    let promCriterioNecesario10 = (T - A_otros) / P;
    let promCriterioNecesario50 = promCriterioNecesario10 * 5;

    let sumaActual50 = 0;
    for (let i = 0; i < notasActivas.length; i++) {
        sumaActual50 = sumaActual50 + notasActivas[i];
    }

    let x50 = Number(((promCriterioNecesario50 * totalActividades) - sumaActual50).toFixed(2));
    let x10 = Number((x50 / 5).toFixed(2));

    if (x50 <= 0) {
        return "🎉 ¡Felicidades! Con tus notas actuales ya aseguras un promedio de " + T + " o superior.";
    }
    if (x50 <= 50) {
        return "🎯 Para alcanzar un promedio final de " + T + ", necesitas sacar " + x50 + " / 50 (" + x10 + " / 10) en la evaluación pendiente.";
    }
    return "❌ Tu meta de " + T + " es inalcanzable. Necesitarías una nota equivalente a " + x10 + " / 10, lo cual supera el máximo de 50 pts.";
}

