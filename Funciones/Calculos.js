let actividades=[];

const PESO_CRITERIO=1/3;
const PESO_RDA=1/3;

function calcularPromedioCriterio(listaNotasCriterio){
  if(!listaNotasCriterio||listaNotasCriterio.length===0)return 0;

  let suma=0;

  for(let indice=0;indice<listaNotasCriterio.length;indice++){
    suma+=Number(listaNotasCriterio[indice])||0;
  }

  return(suma/listaNotasCriterio.length)/5;
}

function calcularPromedioCriterioActividades(listaActividades){
  if(!listaActividades||listaActividades.length===0)return 0;

  const actividadesConPonderacion=listaActividades.filter(actividad=>{
    const ponderacion=Number(actividad.ponderacion);
    return !isNaN(ponderacion)&&ponderacion>0;
  });

  if(actividadesConPonderacion.length===listaActividades.length){
    let sumaPonderada=0;
    let totalPonderacion=0;

    actividadesConPonderacion.forEach(actividad=>{
      const nota=Number(actividad.nota)||0;
      const ponderacion=Number(actividad.ponderacion)||0;
      sumaPonderada+=nota*ponderacion;
      totalPonderacion+=ponderacion;
    });

    if(totalPonderacion===0)return 0;

    return(sumaPonderada/totalPonderacion)/5;
  }

  const notas=listaActividades.map(actividad=>Number(actividad.nota)||0);
  return calcularPromedioCriterio(notas);
}

function obtenerActividadesPorRDAyCriterio(materia,rda,criterio){
  return actividades.filter(actividad=>
      actividad.materia===materia&&
      Number(actividad.rda||1)===Number(rda)&&
      Number(actividad.criterio)===Number(criterio)
  );
}

function calcularPromedioCriterioRegistrado(materia,rda,criterio){
  const actividadesCriterio=obtenerActividadesPorRDAyCriterio(
      materia,
      rda,
      criterio
  );

  return calcularPromedioCriterioActividades(actividadesCriterio);
}

function calcularPromedioRDA(materia,rda){
  const promedioCriterio1=calcularPromedioCriterioRegistrado(materia,rda,1);
  const promedioCriterio2=calcularPromedioCriterioRegistrado(materia,rda,2);
  const promedioCriterio3=calcularPromedioCriterioRegistrado(materia,rda,3);

  return(
      promedioCriterio1+
      promedioCriterio2+
      promedioCriterio3
  )*PESO_CRITERIO;
}

function calcularPromedioFinalMateria(materia){
  const promedioRDA1=calcularPromedioRDA(materia,1);
  const promedioRDA2=calcularPromedioRDA(materia,2);
  const promedioRDA3=calcularPromedioRDA(materia,3);

  return(
      promedioRDA1+
      promedioRDA2+
      promedioRDA3
  )*PESO_RDA;
}

function obtenerDetalleRDA(materia,rda){
  const criterios=[];

  for(let criterio=1;criterio<=3;criterio++){
    const actividadesCriterio=obtenerActividadesPorRDAyCriterio(
        materia,
        rda,
        criterio
    );

    criterios.push({
      criterio:criterio,
      promedio:calcularPromedioCriterioActividades(actividadesCriterio),
      actividades:actividadesCriterio
    });
  }

  return{
    materia:materia,
    rda:Number(rda),
    promedio:calcularPromedioRDA(materia,rda),
    criterios:criterios
  };
}
function calcularNotaFinalProyectada(
    notasCriterioUno,
    notasCriterioDos,
    notasCriterioTres
){
  const promedioUno=calcularPromedioCriterio(notasCriterioUno);
  const promedioDos=calcularPromedioCriterio(notasCriterioDos);
  const promedioTres=calcularPromedioCriterio(notasCriterioTres);

  return(
      (promedioUno+promedioDos+promedioTres)*PESO_CRITERIO
  ).toFixed(2);
}
function obtenerEstadoMateria(promedio){
  promedio=Number(promedio);

  if(promedio>=7)return"APROBADO";
  if(promedio>=5)return"EN RIESGO";
  return"REPROBADO";
}