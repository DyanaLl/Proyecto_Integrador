let actividades = [];

const PESO_CRITERIO = 1 / 3;

function calcularPromedioCriterio(listaNotasCriterio) {
  if (!listaNotasCriterio || listaNotasCriterio.length === 0) {
    return 0;
  }

  let sumaAcumuladaNotasIngresadas = 0;

  for (let indice = 0; indice < listaNotasCriterio.length; indice++) {
    sumaAcumuladaNotasIngresadas += Number(listaNotasCriterio[indice]) || 0;
  }

  const promedioCriterioSobreCincuenta =
      sumaAcumuladaNotasIngresadas / listaNotasCriterio.length;

  return promedioCriterioSobreCincuenta / 5;
}

function calcularNotaFinalProyectada(
    notasCriterioUno,
    notasCriterioDos,
    notasCriterioTres
) {
  const promedioUno =
      calcularPromedioCriterio(notasCriterioUno);

  const promedioDos =
      calcularPromedioCriterio(notasCriterioDos);

  const promedioTres =
      calcularPromedioCriterio(notasCriterioTres);

  const promedioFinalProyectado =
      (promedioUno + promedioDos + promedioTres) * PESO_CRITERIO;

  return promedioFinalProyectado.toFixed(2);
}

function obtenerEstadoMateria(promedio) {
  promedio = Number(promedio);

  if (promedio >= 7.0) {
    return "APROBADO";
  }

  if (promedio >= 5.0) {
    return "EN RIESGO";
  }

  return "REPROBADO";
}