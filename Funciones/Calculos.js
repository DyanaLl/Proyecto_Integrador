let actividades = [];

function obtenerActividadesGlobales() {
    return actividades;
}

/*Permite agregar una actividad al arreglo global.*/
function agregarActividadGlobal(actividad) {
    actividades.push(actividad);
}

/*Filtra las actividades según Materia, RDA y Criterio específicos.*/
function obtenerActividadesPorRDAyCriterio(materia, rda, criterio) {
    return actividades.filter(act =>
        act.materia === materia &&
        Number(act.rda) === Number(rda) &&
        Number(act.criterio) === Number(criterio)
    );
}

/*Calcula el promedio de un criterio específico basándose en sus actividades.
 * Maneja tanto el reparto equitativo automático como las ponderaciones especiales manuales.*/
function calcularPromedioCriterioActividades(listaActividades) {
    if (!listaActividades || listaActividades.length === 0) return 0;

    let sumaPonderada = 0;
    let totalPonderacion = 0;
    let tienePonderacionesManuales = false;

    // Verificar si alguna actividad tiene ponderación especial manual
    for (let i = 0; i < listaActividades.length; i++) {
        const act = listaActividades[i];
        if (act.ponderacion !== undefined && act.ponderacion !== null && act.ponderacion !== "" && !isNaN(act.ponderacion)) {
            tienePonderacionesManuales = true;
            break;
        }
    }

    if (tienePonderacionesManuales) {
        for (let i = 0; i < listaActividades.length; i++) {
            const nota = Number(listaActividades[i].nota) || 0;
            const ponderacion = (listaActividades[i].ponderacion !== undefined && listaActividades[i].ponderacion !== "" && !isNaN(listaActividades[i].ponderacion))
                ? Number(listaActividades[i].ponderacion)
                : (1 / listaActividades.length);

            sumaPonderada += nota * ponderacion;
            totalPonderacion += ponderacion;
        }
        return totalPonderacion > 0 ? sumaPonderada / totalPonderacion : 0;
    } else {
        // Cálculo equitativo automático según el número exacto de actividades en este criterio
        let sumaNotas = 0;
        for (let i = 0; i < listaActividades.length; i++) {
            sumaNotas += Number(listaActividades[i].nota) || 0;
        }
        return sumaNotas / listaActividades.length;
    }
}

function calcularPromedioRDA(materia, numeroRda) {
    const actC1 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 1);
    const actC2 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 2);
    const actC3 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 3);

    const calcularMediaCriterio = (actividades) => {
        if (!actividades || actividades.length === 0) return null;
        let conNota = actividades.filter(a => a.nota !== undefined && a.nota !== '' && !isNaN(a.nota));
        if (conNota.length === 0) return null;
        let suma = conNota.reduce((acc, a) => acc + Number(a.nota), 0);
        return (suma / conNota.length / 50) * 100; // Normalizado a escala 0-100
    };

    let p1 = calcularMediaCriterio(actC1);
    let p2 = calcularMediaCriterio(actC2);
    let p3 = calcularMediaCriterio(actC3);

    let activos = [];
    if (p1 !== null) activos.push(p1);
    if (p2 !== null) activos.push(p2);
    if (p3 !== null) activos.push(p3);

    if (activos.length === 0) return 0;

    let totalRda = 0;

    // REGLA OFICIAL DE PONDERACIÓN EXACTA
    if (activos.length === 2) {
        // Si hay 2 criterios activos, cada uno vale 50%
        let index = 0;
        if (p1 !== null) { totalRda += p1 * 0.50; index++; }
        if (p2 !== null) { totalRda += p2 * (index === 0 ? 0.50 : 0.50); index++; }
        if (p3 !== null) { totalRda += p3 * 0.50; }
    } else if (activos.length === 3) {
        // Si hay 3 criterios activos: 33.33%, 33.33% y 33.34%
        if (p1 !== null) totalRda += p1 * 0.3333;
        if (p2 !== null) totalRda += p2 * 0.3333;
        if (p3 !== null) totalRda += p3 * 0.3334;
    } else {
        // Caso por defecto si solo hubiera 1 activo (100%) u otro caso
        let pesoUnico = 100 / activos.length;
        if (p1 !== null) totalRda += p1 * (pesoUnico / 100);
        if (p2 !== null) totalRda += p2 * (pesoUnico / 100);
        if (p3 !== null) totalRda += p3 * (pesoUnico / 100);
    }

    return Number(totalRda.toFixed(2));
}

function simularNotaFinalPorCriterios(notasC1, notasC2, notasC3) {
    const promediarYNormalizar = (lista) => {
        if (!lista || lista.length === 0) return null; // Retorna null si el criterio está vacío
        let suma = lista.reduce((acc, val) => acc + (Number(val) || 0), 0);
        let promedio50 = suma / lista.length;
        return (promedio50 / 50) * 100; // Escala 0 a 100
    };

    let p1 = promediarYNormalizar(notasC1);
    let p2 = promediarYNormalizar(notasC2);
    let p3 = promediarYNormalizar(notasC3);

    // Contamos cuántos criterios tienen datos reales
    let criteriosActivos = [];
    if (p1 !== null) criteriosActivos.push(p1);
    if (p2 !== null) criteriosActivos.push(p2);
    if (p3 !== null) criteriosActivos.push(p3);

    if (criteriosActivos.length === 0) return 0;

    let promedioFinal = 0;

    // REGLA OFICIAL DE PONDERACIÓN EXACTA EN SIMULACIÓN
    if (criteriosActivos.length === 2) {
        let index = 0;
        if (p1 !== null) { promedioFinal += p1 * 0.50; index++; }
        if (p2 !== null) { promedioFinal += p2 * 0.50; index++; }
        if (p3 !== null) { promedioFinal += p3 * 0.50; }
    } else if (criteriosActivos.length === 3) {
        if (p1 !== null) promedioFinal += p1 * 0.3333;
        if (p2 !== null) promedioFinal += p2 * 0.3333;
        if (p3 !== null) promedioFinal += p3 * 0.3334;
    } else {
        let pesoCriterio = 100 / criteriosActivos.length;
        if (p1 !== null) promedioFinal += p1 * (pesoCriterio / 100);
        if (p2 !== null) promedioFinal += p2 * (pesoCriterio / 100);
        if (p3 !== null) promedioFinal += p3 * (pesoCriterio / 100);
    }

    return Number(promedioFinal.toFixed(2));
}
/**
 * Valida y normaliza el promedio objetivo ingresado por el usuario.
 * Acepta escala de 0 a 100*/
function validarPromedioObjetivo(valorIngresado) {
    let valor = parseFloat(valorIngresado);

    if (isNaN(valor)) {
        return { esValido: false, mensajeError: "Por favor, ingresa un número válido." };
    }

    if (valor < 0 || valor > 100) {
        return { esValido: false, mensajeError: "Por favor, ingresa un Promedio Objetivo válido entre 0 y 100." };
    }

    return { esValido: true, valor: valor };
}

/**
 * Calcula la nota que el estudiante necesita obtener en las actividades faltantes
 * de un criterio específico para alcanzar el promedio objetivo deseado.
 */
function calcularNotaNecesariaEnCriterio(promedioObjetivoRda, notasExistentesCriterio, totalActividadesCriterio, nombreCriterio, materia, numeroRda, criterioActual) {
    // 1. Obtenemos los bloques completos de actividades de cada criterio
    const actC1 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 1);
    const actC2 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 2);
    const actC3 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 3);

    // Determinamos cuántos criterios tienen actividades reales registradas en este RDA
    let criteriosActivos = [];
    if (actC1.length > 0) criteriosActivos.push("1");
    if (actC2.length > 0) criteriosActivos.push("2");
    if (actC3.length > 0) criteriosActivos.push("3");

    if (criteriosActivos.length === 0) criteriosActivos = [String(criterioActual)];
    
    // Ponderación exacta según la regla institucional
    let pesoCriterioPorcentaje = 33.33; 
    if (criteriosActivos.length === 2) {
        pesoCriterioPorcentaje = 50.0;
    } else if (criteriosActivos.length === 3) {
        // Si el criterio actual es el 3, evaluamos su peso específico exacto (33.34), de lo contrario 33.33
        pesoCriterioPorcentaje = (String(criterioActual) === "3") ? 33.34 : 33.33;
    } else {
        pesoCriterioPorcentaje = 100 / criteriosActivos.length;
    }

    // Normalizamos el objetivo del usuario a escala 0-100 por si viene en formato 0-10
    let objetivoEscala100 = Number(promedioObjetivoRda);

    // 2. Calculamos los puntos ya asegurados por los OTROS criterios
    let aporteOtros = 0;
    criteriosActivos.forEach(crit => {
        if (String(crit) !== String(criterioActual)) {
            let notasCrit = obtenerNotasPorMateriaRDAYCriterio(materia, numeroRda, crit);
            if (notasCrit.length > 0) {
                let sumaCrit = notasCrit.reduce((a, b) => a + b, 0);
                let promedio50Crit = sumaCrit / notasCrit.length;
                let promedio100Crit = (promedio50Crit / 50) * 100;
                
                let pesoOtroCrit = 33.33;
                if (criteriosActivos.length === 2) {
                    pesoOtroCrit = 50.0;
                } else if (criteriosActivos.length === 3 && String(crit) === "3") {
                    pesoOtroCrit = 33.34;
                }
                
                aporteOtros += promedio100Crit * (pesoOtroCrit / 100);
            }
        }
    });

    // 3. Despejamos qué puntaje porcentual (0-100) necesita aportar este criterio activo
    let aporteNecesarioEsteCriterio = objetivoEscala100 - aporteOtros;
    let promedioRequeridoEnCriterioEscala100 = aporteNecesarioEsteCriterio / (pesoCriterioPorcentaje / 100);

    // Convertimos el promedio requerido de porcentaje (0-100) a la escala visual de notas (0-50)
    let promedioRequeridoEscala50 = (promedioRequeridoEnCriterioEscala100 / 100) * 50;

    // 4. Calculamos con base en las notas existentes de este criterio y sus pendientes
    let sumaNotasExistentes = notasExistentesCriterio.reduce((acc, val) => acc + (Number(val) || 0), 0);
    let actividadesPendientes = totalActividadesCriterio - notasExistentesCriterio.length;
    if (actividadesPendientes <= 0) actividadesPendientes = 1;

    let puntajeTotalRequeridoEnCriterio = promedioRequeridoEscala50 * totalActividadesCriterio;
    let puntajeFaltante = puntajeTotalRequeridoEnCriterio - sumaNotasExistentes;
    let notaNecesariaPorActividad = puntajeFaltante / actividadesPendientes;

    let notaFinalRedondeada = Math.round(notaNecesariaPorActividad);

    // 5. Validaciones finales
    if (notaFinalRedondeada <= 0) {
        return `Con las notas actuales ya alcanzas el promedio objetivo en el RDA ${numeroRda}. Incluso con un 0 en las pendientes lo lograrías.`;
    } else if (notaFinalRedondeada > 50) {
        return `Matemáticamente es imposible alcanzar este promedio objetivo (${objetivoEscala100}) en el RDA ${numeroRda} con las actividades restantes de este criterio (requerirías ${notaFinalRedondeada}).`;
    }

    return `Para alcanzar tu promedio objetivo en el RDA ${numeroRda}, necesitas obtener una nota de ${notaFinalRedondeada} en la${actividadesPendientes === 1 ? '' : 's'} ${actividadesPendientes} actividad(es) faltante(s) del ${nombreCriterio}.`;
}
