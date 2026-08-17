// ==========================================
// ESTRUCTURA OFICIAL Y DATOS FICTICIOS DE PRUEBA
// ==========================================
let actividades = [
  { materia: "Programación Web", criterio: 1, tema: "Taller HTML/CSS", nota: 45, estado: "entregada" },
  { materia: "Programación Web", criterio: 1, tema: "Lección 1", nota: 40, estado: "entregada" },
  { materia: "Programación Web", criterio: 2, tema: "Proyecto Parte 1", nota: 35, estado: "entregada" },
  { materia: "Programación Web", criterio: 2, tema: "Taller JavaScript", nota: 0, estado: "pendiente" },
  { materia: "Programación Web", criterio: 3, tema: "Examen Final", nota: 0, estado: "pendiente" }
];

const PESO_CRITERIO = 1 / 3; // Equivale al 33.3333...% exacto para cada uno de los 3 criterios

// ==========================================
// FUNCIONES MATEMÁTICAS COMPARTIDAS
// ==========================================

/**
 * Calcula el promedio de un solo criterio tanto en escala 50 como en escala 10.
 */
function calcularPromedioCriterio(listaNotasCriterio) {
  if (!listaNotasCriterio || listaNotasCriterio.length === 0) return 0;

  let sumaAcumuladaNotasIngresadas = 0;
  for (let indice = 0; indice < listaNotasCriterio.length; indice++) {
    sumaAcumuladaNotasIngresadas += listaNotasCriterio[indice];
  }

  let promedioCriterioSobreCincuenta = sumaAcumuladaNotasIngresadas / listaNotasCriterio.length;
  let promedioCriterioSobreDiez = promedioCriterioSobreCincuenta / 5;

  return promedioCriterioSobreDiez;
}

/**
 * Calcula la nota final proyectada de una materia sobre 10 acumulando los 3 criterios.
 */
function calcularNotaFinalProyectada(notasCriterioUno, notasCriterioDos, notasCriterioTres) {
  let promedioUno = calcularPromedioCriterio(notasCriterioUno);
  let promedioDos = calcularPromedioCriterio(notasCriterioDos);
  let promedioTres = calcularPromedioCriterio(notasCriterioTres);

  // Se aplica la constante para evitar repetición de código
  let promedioFinalProyectado = (promedioUno + promedioDos + promedioTres) * PESO_CRITERIO;

  return promedioFinalProyectado.toFixed(2);
}

/**
 * Determina el estado de rendimiento académico para uso del semáforo.
 */
function obtenerEstadoMateria(promedio) {
  if (promedio >= 7.0) {
    return "APROBADO";
  } else if (promedio >= 5.0 && promedio < 7.0) {
    return "EN RIESGO";
  } else {
    return "REPROBADO";
  }
}