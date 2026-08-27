function mostrarTablaPromedios(){
    const tabla=document.getElementById("tabla-promedios-body");

    if(!tabla)return;

    tabla.innerHTML="";

    const materias=[];

    actividades.forEach(actividad=>{
        if(actividad.materia&&!materias.includes(actividad.materia)){
            materias.push(actividad.materia);
        }
    });

    if(materias.length===0){
        tabla.innerHTML=`
            <tr>
                <td colspan="5" style="text-align:center;">
                    No existen actividades registradas.
                </td>
            </tr>
        `;

        const detalle=document.getElementById("detalle-rda");
        if(detalle)detalle.style.display="none";
        return;
    }

    materias.forEach(materia=>{
        const promedioRDA1=calcularPromedioRDA(materia,1);
        const promedioRDA2=calcularPromedioRDA(materia,2);
        const promedioRDA3=calcularPromedioRDA(materia,3);
        const promedioFinal=calcularPromedioFinalMateria(materia);

        const fila=document.createElement("tr");

        fila.innerHTML=`
            <td>${materia}</td>
            <td class="rda-clicable" data-materia="${materia}" data-rda="1">${promedioRDA1.toFixed(2)}</td>
            <td class="rda-clicable" data-materia="${materia}" data-rda="2">${promedioRDA2.toFixed(2)}</td>
            <td class="rda-clicable" data-materia="${materia}" data-rda="3">${promedioRDA3.toFixed(2)}</td>
            <td>${promedioFinal.toFixed(2)}</td>
        `;

        tabla.appendChild(fila);
    });

    document.querySelectorAll(".rda-clicable").forEach(celda=>{
        celda.style.cursor="pointer";
        celda.title="Haz clic para ver el detalle del RDA";

        celda.addEventListener("click",function(){
            mostrarDetalleRDA(
                this.dataset.materia,
                Number(this.dataset.rda)
            );
        });
    });
}

function mostrarDetalleRDA(materia,rda){
    const contenedor=document.getElementById("detalle-rda");

    if(!contenedor)return;

    const detalle=obtenerDetalleRDA(materia,rda);

    let contenido=`
        <div class="cabecera-historial">
            <h3>Detalle ${materia} - RDA ${rda}</h3>
            <p class="nota-aclaratoria">
                Promedio RDA ${rda}: ${detalle.promedio.toFixed(2)}
            </p>
        </div>
    `;

    detalle.criterios.forEach(item=>{
        contenido+=`
            <div class="tabla-contenedor" style="margin-bottom:15px;">
                <table>
                    <thead>
                        <tr>
                            <th colspan="3">
                                Criterio ${item.criterio} - Promedio: ${item.promedio.toFixed(2)}
                            </th>
                        </tr>
                        <tr>
                            <th>Actividad</th>
                            <th>Nota</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if(item.actividades.length===0){
            contenido+=`
                <tr>
                    <td colspan="3">No existen actividades registradas.</td>
                </tr>
            `;
        }else{
            item.actividades.forEach(actividad=>{
                contenido+=`
                    <tr>
                        <td>${actividad.tema}</td>
                        <td>${Number(actividad.nota).toFixed(2)}</td>
                        <td>${actividad.estado}</td>
                    </tr>
                `;
            });
        }

        contenido+=`
                    </tbody>
                </table>
            </div>
        `;
    });

    contenedor.innerHTML=contenido;
    contenedor.style.display="block";
}

document.addEventListener("DOMContentLoaded",function(){
    mostrarTablaPromedios();
});