// =========================================================
// MÓDULO: VALIDACIONES DE ENTRADA
// =========================================================
// Su trabajo es limpiar, verificar y preparar las entradas de texto del usuario para que
//no se rompa el programa ni genere errores aunque no se ingrese el dato solicitado. 

// SEMÁFORO

// SIMULADOR DE NOTAS
function validarNotasCriterio(textoInput, nombreCriterio) {
    let erroresEncontrados = [];
    let notasValidas = [];

    // Si el campo está vacío, retornamos un arreglo vacío de notas sin errores
    if (textoInput === null || textoInput === undefined || textoInput.trim() === "") {
        return {
            errores: erroresEncontrados,
            notas: notasValidas
        };
    }

    // Separar los valores por comas
    let elementos = textoInput.split(',');

    for (let i = 0; i < elementos.length; i++) {
        let elementoLimpio = elementos[i].trim();

        if (elementoLimpio !== "") {
            let numero = Number(elementoLimpio);

            // Verificar si es un número válido y si está entre 0 y 50
            if (isNaN(numero)) {
                erroresEncontrados.push('La nota "' + elementoLimpio + '" no es un número válido');
            } else if (numero < 0 || numero > 50) {
                erroresEncontrados.push('La nota ' + numero + ' está fuera de rango (debe ser de 0 a 50)');
            } else {
                notasValidas.push(numero);
            }
        }
    }

    return {
        errores: erroresEncontrados,
        notas: notasValidas
    };
}

// Función para validar que el Promedio Objetivo este entre (0 a 10)
function validarPromedioObjetivo(valorTexto) {
    let numero = Number(valorTexto);

    if (valorTexto === null || valorTexto === undefined || valorTexto.trim() === "" || isNaN(numero) || numero < 0 || numero > 10) {
        return {
            esValido: false,
            mensajeError: "Por favor, ingresa un Promedio Objetivo válido entre 0.0 y 10.0."
        };
    }

    return {
        esValido: true,
        mensajeError: "",
        valor: numero
    };
}