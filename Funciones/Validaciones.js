// =========================================================
// MÓDULO: VALIDACIONES DE ENTRADA
// =========================================================
// Su trabajo es limpiar, verificar y preparar las entradas de texto del usuario para que
//no se rompa el programa ni genere errores aunque no se ingrese el dato solicitado. 

// TABLA - REGISTRO / SIMULADOR DE NOTAS
function validarNotaActividad(valor) {
    let numero = Number(valor);
    if (valor === null || valor === undefined || String(valor).trim() === "" || isNaN(numero) || numero < 0 || numero > 50) {
        return { esValido: false, mensaje: "La nota de la actividad debe ser un número válido entre 0 y 50." };
    }
    return { esValido: true, valor: numero };
}

/**
 * Valida el Promedio Objetivo o notas hipotéticas (Rango: 0 a 100)
 */
function validarPromedioObjetivo(valor) {
    let numero = Number(valor);
    if (valor === null || valor === undefined || String(valor).trim() === "" || isNaN(numero) || numero < 0 || numero > 100) {
        return { esValido: false, mensaje: "El promedio objetivo debe ser un valor válido entre 0 y 100." };
    }
    return { esValido: true, valor: numero };
}

/**
 * Valida que el RDA sea estrictamente 1, 2 o 3
 */
function validarRda(rda) {
    let num = Number(rda);
    if (![1, 2, 3].includes(num)) {
        return { esValido: false, mensaje: "El RDA seleccionado no es válido (debe ser 1, 2 o 3)." };
    }
    return { esValido: true, valor: num };
}

/**
 * Valida que el Criterio sea estrictamente 1, 2 o 3
 */
function validarCriterio(criterio) {
    let num = Number(criterio);
    if (![1, 2, 3].includes(num)) {
        return { esValido: false, mensaje: "El criterio seleccionado no es válido (debe ser 1, 2 o 3)." };
    }
    return { esValido: true, valor: num };
}

/**
 * Valida que un campo de texto obligatorio no esté vacío
 */
function validarTextoObligatorio(texto, nombreCampo = "Este campo") {
    if (!texto || texto.trim() === "") {
        return { esValido: false, mensaje: `${nombreCampo} es obligatorio y no puede estar vacío.` };
    }
    return { esValido: true, valor: texto.trim() };
}

/**
 * Valida que la fecha ingresada tenga un formato coherente y real
 */
function validarFecha(fechaStr) {
    if (!fechaStr) {
        return { esValido: false, mensaje: "La fecha es obligatoria." };
    }
    let fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) {
        return { esValido: false, mensaje: "Por favor, ingresa una fecha válida." };
    }
    return { esValido: true, valor: fechaStr };
}

/**
 * Valida el formato horario (ej. HH:MM)
 */
function validarHora(horaStr) {
    if (!horaStr) {
        return { esValido: false, mensaje: "La hora es obligatoria." };
    }
    // Expresión regular básica para formato de 24 horas (HH:MM)
    let regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regexHora.test(horaStr)) {
        return { esValido: false, mensaje: "El formato de la hora no es válido (debe ser HH:MM)." };
    }
    return { esValido: true, valor: horaStr };
}

/**
 * Valida la ponderación especial cuando corresponda (Rango: 0 a 100)
 */
function validarPonderacionEspecial(ponderacion) {
    if (ponderacion === null || ponderacion === undefined || String(ponderacion).trim() === "") {
        return { esValido: true, valor: null }; // Opcional si no se usa
    }
    let numero = Number(ponderacion);
    if (isNaN(numero) || numero < 0 || numero > 100) {
        return { esValido: false, mensaje: "La ponderación especial debe estar entre 0 y 100." };
    }
    return { esValido: true, valor: numero };
}

/**
 * Valida que el número de actividades faltantes sea un entero mayor que 0
 */
function validarCantidadActividadesFaltantes(cantidad) {
    let numero = Number(cantidad);
    if (isNaN(numero) || !Number.isInteger(numero) || numero <= 0) {
        return { esValido: false, mensaje: "La cantidad de actividades faltantes debe ser un número entero mayor a 0." };
    }
    return { esValido: true, valor: numero };
}