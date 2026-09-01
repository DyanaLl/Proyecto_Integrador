let actividades = [];

// Retorna el arreglo global completo de actividades registradas
function obtenerActividadesGlobales() {
    return actividades;
}

/*** Permite agregar una actividad al arreglo global.*/
function agregarActividadGlobal(actividad) {
    actividades.push(actividad);
}

/*** Lista base predeterminada de materias del plan académico.*/
const MATERIAS_PREDETERMINADAS = [
    "Álgebra",
    "Habilidades Lógico-Matemáticas"
];

/*** Retorna la lista única de materias registradas en la base de datos o arreglo global,
 * combinadas con las materias predeterminadas de la institución.
 * @returns {string[]} Lista de nombres de materias sin duplicados.
 */
function obtenerListaMaterias() {
    const materiasRegistradas = Array.isArray(actividades)
        ? actividades.map(act => act.materia).filter(Boolean)
        : [];

    const todasLasMaterias = [...MATERIAS_PREDETERMINADAS, ...materiasRegistradas];

    // Retorna valores únicos
    return [...new Set(todasLasMaterias)];
}

/**
 * Retorna los RDAs disponibles para una materia (1, 2, 3 por defecto o filtrados).
 */
function obtenerListaRdas(materiaId) {
    if (!materiaId) return [1, 2, 3];

    const rdasMateria = actividades
        .filter(act => act.materia === materiaId && act.rda !== undefined && act.rda !== null && act.rda !== "")
        .map(act => Number(act.rda));

    if (rdasMateria.length === 0) return [1, 2, 3];
    return [...new Set(rdasMateria)].sort((a, b) => a - b);
}

/**
 * Retorna los Criterios disponibles para un RDA de una materia (1, 2, 3 por defecto o filtrados).
 */
function obtenerListaCriterios(materiaId, rdaId) {
    if (!materiaId || !rdaId) return [1, 2, 3];

    const criteriosMateria = actividades
        .filter(act => act.materia === materiaId && Number(act.rda) === Number(rdaId) && act.criterio !== undefined && act.criterio !== null && act.criterio !== "")
        .map(act => Number(act.criterio));

    if (criteriosMateria.length === 0) return [1, 2, 3];
    return [...new Set(criteriosMateria)].sort((a, b) => a - b);
}

/**
 * Filtra las actividades según Materia, RDA y Criterio específicos.
 */
function obtenerActividadesPorRDAyCriterio(materia, rda, criterio) {
    return actividades.filter(act =>
        act.materia === materia &&
        Number(act.rda) === Number(rda) &&
        Number(act.criterio) === Number(criterio)
    );
}

/**
 * Calcula el promedio de un criterio específico basándose en sus actividades.
 * Maneja tanto el reparto equitativo automático como las ponderaciones especiales manuales.
 */
function calcularPromedioCriterioActividades(listaActividades) {
    if (!listaActividades || listaActividades.length === 0) return 0;

    let tienePonderacionesManuales = false;
    let sumaPonderacionesManuales = 0;
    let cantidadSinPonderacion = 0;

    // Primer paso: Analizar ponderaciones manuales y validar sumatoria
    for (let i = 0; i < listaActividades.length; i++) {
        const act = listaActividades[i];
        if (act.ponderacion !== undefined && act.ponderacion !== null && act.ponderacion !== "" && !isNaN(act.ponderacion)) {
            tienePonderacionesManuales = true;
            sumaPonderacionesManuales += Number(act.ponderacion);
        } else {
            cantidadSinPonderacion++;
        }
    }

    if (tienePonderacionesManuales) {
        // Validar que la suma de ponderaciones manuales no supere 100
        if (sumaPonderacionesManuales > 100) {
            throw new Error("La suma de las ponderaciones manuales no puede ser mayor a 100.");
        }

        let porcentajeRestante = 100 - sumaPonderacionesManuales;
        let ponderacionPorActividadSinPonderar = cantidadSinPonderacion > 0 ? (porcentajeRestante / cantidadSinPonderacion) : 0;

        let sumaPonderada = 0;
        let totalPonderacion = 0;

        for (let i = 0; i < listaActividades.length; i++) {
            const nota = Number(listaActividades[i].nota) || 0;
            const tienePondManual = (listaActividades[i].ponderacion !== undefined && listaActividades[i].ponderacion !== null && listaActividades[i].ponderacion !== "" && !isNaN(listaActividades[i].ponderacion));

            const ponderacion = tienePondManual
                ? Number(listaActividades[i].ponderacion)
                : ponderacionPorActividadSinPonderar;

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
// Calcula RDA
function calcularPromedioRDA(materia, numeroRda) {
    const actC1 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 1);
    const actC2 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 2);
    const actC3 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 3);

    // Convierte el promedio del criterio de escala 0-50 a escala 0-100.
    const obtenerPromedioCriterioEscala100 = (actividadesList) => {
        if (!actividadesList || actividadesList.length === 0) return null;
        let conNota = actividadesList.filter(a => a.nota !== undefined && a.nota !== '' && !isNaN(a.nota));
        if (conNota.length === 0) return null;

        let promedioCriterio50 = calcularPromedioCriterioActividades(conNota);
        return (promedioCriterio50 / 50) * 100; // Normalizado a escala 0-100
    };

    let p1 = obtenerPromedioCriterioEscala100(actC1);
    let p2 = obtenerPromedioCriterioEscala100(actC2);
    let p3 = obtenerPromedioCriterioEscala100(actC3);

    let activos = [];
    if (p1 !== null) activos.push(p1);
    if (p2 !== null) activos.push(p2);
    if (p3 !== null) activos.push(p3);

    if (activos.length === 0) return 0;

    let totalRda = 0;

    // REGLA OFICIAL DE PONDERACIÓN EXACTA
    if (activos.length === 2) {
        let index = 0;
        if (p1 !== null) { totalRda += p1 * 0.50; index++; }
        if (p2 !== null) { totalRda += p2 * 0.50; index++; }
        if (p3 !== null) { totalRda += p3 * 0.50; }
    } else if (activos.length === 3) {
        if (p1 !== null) totalRda += p1 * 0.3333;
        if (p2 !== null) totalRda += p2 * 0.3333;
        if (p3 !== null) totalRda += p3 * 0.3334;
    } else {
        let pesoUnico = 100 / activos.length;
        if (p1 !== null) totalRda += p1 * (pesoUnico / 100);
        if (p2 !== null) totalRda += p2 * (pesoUnico / 100);
        if (p3 !== null) totalRda += p3 * (pesoUnico / 100);
    }

    return Number(totalRda.toFixed(2));
}

// CÁLCULO DE PROMEDIO FINAL DE MATERIA

function calcularPromedioFinalMateria(materiaOrRda1, rda2Param, rda3Param) {
    let promedios = [];

    if (Array.isArray(materiaOrRda1)) {
        promedios = materiaOrRda1;
    } else if (typeof materiaOrRda1 === "string" && rda2Param === undefined) {
        const materia = materiaOrRda1;

        // Comprobar la existencia real de actividades para cada RDA
        const tieneRda1 = actividades.some(a => a.materia === materia && Number(a.rda) === 1);
        const tieneRda2 = actividades.some(a => a.materia === materia && Number(a.rda) === 2);
        const tieneRda3 = actividades.some(a => a.materia === materia && Number(a.rda) === 3);

        if (tieneRda1) promedios.push(calcularPromedioRDA(materia, 1));
        if (tieneRda2) promedios.push(calcularPromedioRDA(materia, 2));
        if (tieneRda3) promedios.push(calcularPromedioRDA(materia, 3));
    } else {
        [materiaOrRda1, rda2Param, rda3Param].forEach(val => {
            if (val !== null && val !== undefined && val !== "" && !isNaN(val)) {
                promedios.push(Number(val));
            }
        });
    }

    if (promedios.length === 0) return 0;

    let promedioFinal = 0;

    if (promedios.length === 2) {
        promedioFinal = (promedios[0] * 0.50) + (promedios[1] * 0.50);
    } else if (promedios.length === 3) {
        promedioFinal = (promedios[0] * 0.3333) + (promedios[1] * 0.3333) + (promedios[2] * 0.3334);
    } else {
        const suma = promedios.reduce((acc, curr) => acc + curr, 0);
        promedioFinal = suma / promedios.length;
    }

    return Number(promedioFinal.toFixed(2));
}

// SIMULACIÓN DE NOTA FINAL POR CRITERIOS

function simularNotaFinalPorCriterios(notasC1, notasC2, notasC3) {
    const promediarYNormalizar = (lista) => {
        if (!lista || lista.length === 0) return null;
        let suma = lista.reduce((acc, val) => acc + (Number(val) || 0), 0);
        let promedio50 = suma / lista.length;
        return (promedio50 / 50) * 100;
    };

    let p1 = promediarYNormalizar(notasC1);
    let p2 = promediarYNormalizar(notasC2);
    let p3 = promediarYNormalizar(notasC3);

    let criteriosActivos = [];
    if (p1 !== null) criteriosActivos.push(p1);
    if (p2 !== null) criteriosActivos.push(p2);
    if (p3 !== null) criteriosActivos.push(p3);

    if (criteriosActivos.length === 0) return 0;

    let promedioFinal = 0;

    if (criteriosActivos.length === 2) {
        if (p1 !== null) { promedioFinal += p1 * 0.50; }
        if (p2 !== null) { promedioFinal += p2 * 0.50; }
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
 * Acepta escala de 0 a 100
 */
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
 * Calcula la nota necesaria en actividades pendientes para lograr un promedio deseado.
 */
function calcularNotaNecesariaEnCriterio(promedioObjetivoRda, notasExistentesCriterio, totalActividadesCriterio, nombreCriterio, materia, numeroRda, criterioActual) {
    const actC1 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 1);
    const actC2 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 2);
    const actC3 = obtenerActividadesPorRDAyCriterio(materia, numeroRda, 3);

    let criteriosActivos = [];
    if (actC1.length > 0) criteriosActivos.push("1");
    if (actC2.length > 0) criteriosActivos.push("2");
    if (actC3.length > 0) criteriosActivos.push("3");

    if (criteriosActivos.length === 0) criteriosActivos = [String(criterioActual)];

    let pesoCriterioPorcentaje = 33.33;
    if (criteriosActivos.length === 2) {
        pesoCriterioPorcentaje = 50.0;
    } else if (criteriosActivos.length === 3) {
        pesoCriterioPorcentaje = (String(criterioActual) === "3") ? 33.34 : 33.33;
    } else {
        pesoCriterioPorcentaje = 100 / criteriosActivos.length;
    }

    let objetivoEscala100 = Number(promedioObjetivoRda);

    let aporteOtros = 0;
    criteriosActivos.forEach(crit => {
        if (String(crit) !== String(criterioActual)) {
            let actividadesOtroCrit = obtenerActividadesPorRDAyCriterio(materia, numeroRda, crit);
            let notasCrit = actividadesOtroCrit.map(a => Number(a.nota)).filter(n => !isNaN(n));
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

    let aporteNecesarioEsteCriterio = objetivoEscala100 - aporteOtros;
    let promedioRequeridoEnCriterioEscala100 = aporteNecesarioEsteCriterio / (pesoCriterioPorcentaje / 100);
    let promedioRequeridoEscala50 = (promedioRequeridoEnCriterioEscala100 / 100) * 50;

    let sumaNotasExistentes = notasExistentesCriterio.reduce((acc, val) => acc + (Number(val) || 0), 0);
    let actividadesPendientes = totalActividadesCriterio - notasExistentesCriterio.length;
    if (actividadesPendientes <= 0) actividadesPendientes = 1;

    let puntajeTotalRequeridoEnCriterio = promedioRequeridoEscala50 * totalActividadesCriterio;
    let puntajeFaltante = puntajeTotalRequeridoEnCriterio - sumaNotasExistentes;
    let notaNecesariaPorActividad = puntajeFaltante / actividadesPendientes;

    let notaFinalRedondeada = Math.round(notaNecesariaPorActividad);

    if (notaFinalRedondeada <= 0) {
        return `Con las notas actuales ya alcanzas el promedio objetivo en el RDA ${numeroRda}. Incluso con un 0 en las pendientes lo lograrías.`;
    } else if (notaFinalRedondeada > 50) {
        return `Matemáticamente es imposible alcanzar este promedio objetivo (${objetivoEscala100}) en el RDA ${numeroRda} con las actividades restantes de este criterio (requerirías ${notaFinalRedondeada}).`;
    }

    return `Para alcanzar tu promedio objetivo en el RDA ${numeroRda}, necesitas obtener una nota de ${notaFinalRedondeada} en la${actividadesPendientes === 1 ? '' : 's'} ${actividadesPendientes} actividad(es) faltante(s) del ${nombreCriterio}.`;
}