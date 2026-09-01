// =========================================================
// MÓDULO: VALIDACIONES DE ENTRADA
// =========================================================
// Su trabajo es limpiar, verificar y preparar las entradas de texto del usuario para que
// no se rompa el programa ni genere errores aunque no se ingrese el dato solicitado. 

/**
 * Función general coordinadora que integra las validaciones individuales
 * para los campos del formulario de actividad.
 * @returns {boolean} - true si el formulario es completamente válido, false si falla alguna regla.
 */
function validarFormularioActividad() {
    const materia = document.getElementById("materia")?.value;
    const rda = document.getElementById("rda")?.value;
    const criterio = document.getElementById("criterio")?.value;
    const tema = document.getElementById("tema")?.value;
    const nota = document.getElementById("nota")?.value;
    const fechaLimite = document.getElementById("fechaLimite")?.value;
    const hora = document.getElementById("hora")?.value;
    const ponderacionEspecial = document.getElementById("ponderacionEspecial")?.value;
    
    // CORRECCIÓN: Capturamos el estado del formulario para enviarlo a la validación de la nota
    const estado = document.getElementById("estado")?.value;

    // 1. Validar materia
    const valMateria = validarTextoObligatorio(materia, "La materia");
    if (!valMateria.esValido) {
        if (typeof mostrarMensaje === "function") mostrarMensaje(valMateria.mensaje);
        return false;
    }

    // 2. Validar RDA
    const valRda = validarRda(rda);
    if (!valRda.esValido) {
        if (typeof mostrarMensaje === "function") mostrarMensaje(valRda.mensaje);
        return false;
    }

    // 3. Validar Criterio
    const valCriterio = validarCriterio(criterio);
    if (!valCriterio.esValido) {
        if (typeof mostrarMensaje === "function") mostrarMensaje(valCriterio.mensaje);
        return false;
    }

    // 4. Validar Tema / Actividad
    const valTema = validarTextoObligatorio(tema, "El tema de la actividad");
    if (!valTema.esValido) {
        if (typeof mostrarMensaje === "function") mostrarMensaje(valTema.mensaje);
        return false;
    }

    // 5. Validar Nota (Ahora pasamos correctamente la variable 'estado')
    const valNota = validarNotaActividad(nota, estado);
    if (!valNota.esValido) {
        if (typeof mostrarMensaje === "function") mostrarMensaje(valNota.mensaje);
        return false;
    }

    // 6. Validar Fecha límite
    const valFecha = validarFecha(fechaLimite);
    if (!valFecha.esValido) {
        if (typeof mostrarMensaje === "function") mostrarMensaje(valFecha.mensaje);
        return false;
    }

    // 7. Validar Hora
    const valHora = validarHora(hora);
    if (!valHora.esValido) {
        if (typeof mostrarMensaje === "function") mostrarMensaje(valHora.mensaje);
        return false;
    }

    // 8. Validar Ponderación Especial (opcional)
    const valPonderacion = validarPonderacionEspecial(ponderacionEspecial);
    if (!valPonderacion.esValido) {
        if (typeof mostrarMensaje === "function") mostrarMensaje(valPonderacion.mensaje);
        return false;
    }

    return true;
}


// =========================================================
// 2. FUNCIONES AUXILIARES DE VALIDACIÓN ESPECÍFICA
// =========================================================

// TABLA - REGISTRO / SIMULADOR DE NOTAS
function validarNotaActividad(valor, estadoStr = "") {
    const estadoNormalizado = String(estadoStr || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();

    const esPendiente = estadoNormalizado.includes("pendiente");

    // Si está pendiente y la nota está vacía, se acepta de inmediato como válido
    if ((valor === null || valor === undefined || String(valor).trim() === "") && esPendiente) {
        return { esValido: true, valor: null };
    }

    // Para cualquier otro caso (o si no está pendiente), se valida el número normalmente
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
    if (!fechaStr || fechaStr.trim() === "") {
        return { esValido: true, valor: null };
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
    if (!horaStr || horaStr.trim() === "") {
        return { esValido: true, valor: null };
    }
    let regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regexHora.test(horaStr.trim())) {
        return { esValido: false, mensaje: "El formato de la hora no es válido (debe ser HH:MM)." };
    }
    return { esValido: true, valor: horaStr.trim() };
}

/**
 * Valida la ponderación especial cuando corresponda (Rango: 0 a 100)
 */
function validarPonderacionEspecial(ponderacion) {
    if (ponderacion === null || ponderacion === undefined || String(ponderacion).trim() === "") {
        return { esValido: true, valor: null };
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