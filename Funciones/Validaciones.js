// =========================================================
// MÓDULO: VALIDACIONES DE ENTRADA
// =========================================================
// Su trabajo es limpiar, verificar y preparar las entradas de texto del usuario para que
//no se rompa el programa ni genere errores aunque no se ingrese el dato solicitado. 

// SEMÁFORO

// SIMULADOR DE NOTAS
function esTextoVacio(texto) {
    if (texto === null || texto === undefined || texto.trim() === "") {
        return true;
    }
    return false;
}

// Analiza un criterio y devuelve la lista de TODOS los errores que encontró
function validarNotasCriterio(texto, nombreCriterio) {
    let errores = [];
    let notasNumericas = [];

    if (esTextoVacio(texto)) {
        return { errores: errores, notas: notasNumericas };
    }

    let listaTexto = texto.split(",");

    for (let i = 0; i < listaTexto.length; i++) {
        let elemento = listaTexto[i].trim();

        if (elemento === "") continue;

        let numero = Number(elemento);

        // 1. Validar si contiene letras o palabras
        if (isNaN(numero)) {
            errores.push("'" + elemento + "' no es un número (solo se aceptan números, no palabras ni letras)");
        } 
        // 2. Validar si está fuera del rango de 0 a 50 (negativos o mayores a 50)
        else if (numero < 0 || numero > 50) {
            errores.push("la nota " + numero + " está fuera de rango (solo se aceptan notas entre 0 y 50)");
        } 
        // 3. Si todo está bien, guardamos el número
        else {
            notasNumericas.push(numero);
        }
    }

    return {
        errores: errores,
        notas: notasNumericas
    };
}