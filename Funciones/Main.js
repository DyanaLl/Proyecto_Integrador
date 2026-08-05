//Semáforo


//Simulador de Notas
// Muestra o esconde los formularios según lo que elija el usuario en el menú
function cambiarModo() {
    let modo = document.getElementById('select-modo').value;
    let secSimular = document.getElementById('sec-simular');
    let secNecesaria = document.getElementById('sec-necesaria');

    // Si eligió "simular", muestra la sección A y oculta la B
    if (modo === "simular") {
        secSimular.style.display = "block";
        secNecesaria.style.display = "none";
    } 
    // Si eligió "necesaria", oculta la sección A y muestra la B
    else {
        secSimular.style.display = "none";
        secNecesaria.style.display = "block";
    }
}

// Función principal que se activa al presionar el botón "Calcular Resultado"
function ejecutarCalculo() {
    let modo = document.getElementById('select-modo').value;
    let txtRes = document.getElementById('texto-resultado');

    
    // ACCIONES PARA EL MODO A (Ver como afecta una nota al promedio final.)
   
    if (modo === "simular") {

        // Extrae el texto escrito en cada casilla del Modo A y los valida
        let v1 = validarNotasCriterio(document.getElementById('input-c1').value, "Criterio 1");
        let v2 = validarNotasCriterio(document.getElementById('input-c2').value, "Criterio 2");
        let v3 = validarNotasCriterio(document.getElementById('input-c3').value, "Criterio 3");

        // Junta en una lista los mensajes de error de los criterios que hayan fallado
        let listaErrores = [];
        if (v1.errores.length > 0) listaErrores.push("Criterio 1: " + v1.errores.join("; "));
        if (v2.errores.length > 0) listaErrores.push("Criterio 2: " + v2.errores.join("; "));
        if (v3.errores.length > 0) listaErrores.push("Criterio 3: " + v3.errores.join("; "));

        // Si hay errores, los imprime en la caja de respuesta y detiene el proceso
        if (listaErrores.length > 0) {
            txtRes.innerHTML = listaErrores.join("<br>");
            return;
        }

        // Si las notas son correctas, calcula la nota proyectada y la muestra en pantalla
        let notaFinal = simularNotaFinalPorCriterios(v1.notas, v2.notas, v3.notas);
        txtRes.innerText = "Proyección del Promedio Final (T): " + notaFinal + " / 10";

    } 

    // ACCIONES PARA EL MODO B (Calcular Nota Necesaria para alcanzar promedio deseado)   
    else {

        // Revisa que la meta escrita esté entre 0.0 y 10.0
        let vObjetivo = validarPromedioObjetivo(document.getElementById('input-T').value);
        if (!vObjetivo.esValido) {
            txtRes.innerText = "Error " + vObjetivo.mensajeError;
            return;
        }

        // Lee el promedio deseado, la opción elegida en la lista y las actividades totales
        let promedioObjetivo = vObjetivo.valor;
        let critActivo = document.getElementById('select-crit-activo').value;
        let totalAct = parseInt(document.getElementById('input-total-act').value) || 1;

        let txtActivo = "", txtOtros1 = "", txtOtros2 = "";

        // Ordena las casillas según el criterio que el usuario eligió para buscar la nota faltante
        if (critActivo === "1") {
            txtActivo = document.getElementById('input-c1-b').value;
            txtOtros1 = document.getElementById('input-c2-b').value;
            txtOtros2 = document.getElementById('input-c3-b').value;
        } else if (critActivo === "2") {
            txtActivo = document.getElementById('input-c2-b').value;
            txtOtros1 = document.getElementById('input-c1-b').value;
            txtOtros2 = document.getElementById('input-c3-b').value;
        } else {
            txtActivo = document.getElementById('input-c3-b').value;
            txtOtros1 = document.getElementById('input-c1-b').value;
            txtOtros2 = document.getElementById('input-c2-b').value;
        }

        // Valida que el texto escrito en cada una de las 3 casillas del Modo B contenga notas válidas
        let vActivo = validarNotasCriterio(txtActivo, "Criterio Evaluado");
        let vOtros1 = validarNotasCriterio(txtOtros1, "Otro Criterio 1");
        let vOtros2 = validarNotasCriterio(txtOtros2, "Otro Criterio 2");

        // Junta los errores detectados en el Modo B (ej. palabras como "hola mundo" o notas mayores a 50)
        let listaErrores = [];
        if (vActivo.errores.length > 0) listaErrores.push("Criterio Evaluado: " + vActivo.errores.join("; "));
        if (vOtros1.errores.length > 0) listaErrores.push("Adicional 1: " + vOtros1.errores.join("; "));
        if (vOtros2.errores.length > 0) listaErrores.push("Adicional 2: " + vOtros2.errores.join("; "));

        // Si existen errores en el Modo B, los muestra en la caja de texto y frena la ejecución
        if (listaErrores.length > 0) {
            txtRes.innerHTML = listaErrores.join("<br>");
            return;
        }

        // Obtiene el promedio acumulado sobre 10 de los otros dos criterios que ya tienen notas completas
        // Calcular el aporte de los otros dos criterios
        let promO1 = calcularPromedioCriterioSobreDiez(vOtros1.notas);
        let promO2 = calcularPromedioCriterioSobreDiez(vOtros2.notas);
        let aporteOtrosCriterios = (promO1 * 0.333333) + (promO2 * 0.333333);

        // Definir el nombre del criterio seleccionado (ejemplo: "Criterio 2")
        let nombreCritSeleccionado = "Criterio " + critActivo;

        // Enviar los 5 datos en el ORDEN EXACTO que los recibe Simulador.js
        let msg = calcularNotaNecesariaEnCriterio(
        promedioObjetivo, 
        vActivo.notas, 
        totalAct, 
        aporteOtrosCriterios, 
        nombreCritSeleccionado);

        // Se muestra el resultado o el mensaje de error personalizado en la pantalla
        txtRes.innerText = msg;
    }
}