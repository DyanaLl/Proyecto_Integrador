//Semáforo


//Simulador de Notas
// Control de visibilidad entre Modo A y Modo B
function cambiarModo() {
    let modo = document.getElementById('select-modo').value;
    let secSimular = document.getElementById('sec-simular');
    let secNecesaria = document.getElementById('sec-necesaria');

    secSimular.style.display = (modo === "simular") ? "block" : "none";
    secNecesaria.style.display = (modo === "necesaria") ? "block" : "none";
}

// Función auxiliar unificada para extraer notas del arreglo global 'actividades' filtrando por materia
function obtenerNotasPorMateriaYCriterio(materia, criterio) {
    let notas = [];
    if (typeof actividades !== 'undefined' && Array.isArray(actividades)) {
        actividades.forEach(act => {
            if (act.materia === materia && String(act.criterio) === String(criterio)) {
                let valor = parseFloat(act.nota);
                if (!isNaN(valor)) notas.push(valor);
            }
        });
    }
    return notas;
}

// Función principal de ejecución al hacer clic en "Calcular Resultado"
function ejecutarCalculo() {
    let modo = document.getElementById('select-modo').value;
    let txtRes = document.getElementById('texto-resultado');

    // ==========================================
    // MODO A: Simulación de Promedio Final
    // ==========================================
    if (modo === "simular") {
        let materia = document.getElementById('select-materia-a').value;
        let criterio = document.getElementById('select-criterio-a').value;
        let notaHipotetica = parseFloat(document.getElementById('input-nota-nueva').value);

        if (!materia) {
            txtRes.innerText = "Por favor, selecciona una materia.";
            return;
        }
        if (isNaN(notaHipotetica) || notaHipotetica < 0 || notaHipotetica > 50) {
            txtRes.innerText = "Ingresa una nota hipotética válida (0 - 50).";
            return;
        }

        // Extraer historial real filtrado por materia para los 3 criterios
        let notasC1 = obtenerNotasPorMateriaYCriterio(materia, "1");
        let notasC2 = obtenerNotasPorMateriaYCriterio(materia, "2");
        let notasC3 = obtenerNotasPorMateriaYCriterio(materia, "3");

        // Añadir nota hipotética al criterio seleccionado
        if (criterio === "1") notasC1.push(notaHipotetica);
        else if (criterio === "2") notasC2.push(notaHipotetica);
        else if (criterio === "3") notasC3.push(notaHipotetica);

        let promedioProyectado = simularNotaFinalPorCriterios(notasC1, notasC2, notasC3);
        txtRes.innerHTML = `Proyección en <strong>${materia}</strong>: <strong>${promedioProyectado} / 10</strong>`;

    }
    // ==========================================
    // MODO B: Cálculo de Nota Necesaria
    // ==========================================
    else {
        let materia = document.getElementById('select-materia-b').value;
        if (!materia) {
            txtRes.innerText = "Por favor, selecciona una materia.";
            return;
        }

        let vObjetivo = validarPromedioObjetivo(document.getElementById('input-T').value);
        if (!vObjetivo.esValido) {
            txtRes.innerText = "Error: " + vObjetivo.mensajeError;
            return;
        }

        let promedioObjetivo = vObjetivo.valor;
        let criterioActivo = document.getElementById('select-crit-activo').value;
        let actividadesPendientes = parseInt(document.getElementById('input-faltantes').value) || 1;

        // Obtener notas existentes del arreglo de actividades para el criterio evaluado
        let notasExistentes = obtenerNotasPorMateriaYCriterio(materia, criterioActivo);
        let totalActividades = notasExistentes.length + actividadesPendientes;

        let nombreCriterio = "Criterio " + criterioActivo;
        let aporteOtrosCriterios = 3.33; // Aporte estándar base de los otros criterios

        let mensajeResultado = calcularNotaNecesariaEnCriterio(
            promedioObjetivo,
            notasExistentes,
            totalActividades,
            nombreCriterio,
            aporteOtrosCriterios
        );

        txtRes.innerText = mensajeResultado;
    }
}