let actividadSeleccionada = null;

function normalizarTexto(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function verificarActividadesVencidas() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let huboCambios = false;

    actividades.forEach(actividad => {
        if (
            actividad.fechaLimite &&
            normalizarTexto(actividad.estado) === "pendiente"
        ) {
            const fechaLimite = new Date(
                actividad.fechaLimite + "T00:00:00"
            );

            if (hoy > fechaLimite) {
                actividad.estado = "vencida";
                huboCambios = true;
            }
        }
    });

    if (huboCambios) {
        localStorage.setItem(
            "actividades",
            JSON.stringify(actividades)
        );
    }
}

function actualizarGraficaRegistro() {
    if (
        typeof Chart === "undefined" ||
        typeof inicializarGraficaMaterias !== "function"
    ) {
        return;
    }

    const graficaActual = Chart.getChart("graficaMaterias");

    if (graficaActual) {
        graficaActual.destroy();
    }

    inicializarGraficaMaterias();
}

function actualizarTablasRegistro() {
    mostrarActividades();

    if (typeof mostrarTablaPromedios === "function") {
        mostrarTablaPromedios();
    }

    actualizarGraficaRegistro();
}

function registrarActividad() {
    const materia = document.getElementById("materia").value.trim();
    const criterio = Number(document.getElementById("criterio").value);
    const tema = document.getElementById("tema").value.trim();
    const notaTexto = document.getElementById("nota").value.trim();
    const nota = notaTexto === "" ? 0 : Number(notaTexto);
    const estado = normalizarTexto(
        document.getElementById("estado").value
    );
    const fechaLimite =
        document.getElementById("fechaLimite").value;

    if (!materia) {
        alert("Selecciona una materia.");
        return false;
    }

    if (!tema) {
        alert("Escribe el tema o actividad.");
        return false;
    }

    if (!fechaLimite) {
        alert("Selecciona una fecha límite.");
        return false;
    }

    if (
        isNaN(nota) ||
        nota < 0 ||
        nota > 50
    ) {
        alert("La nota debe estar entre 0 y 50.");
        return false;
    }

    actividades.push({
        materia: materia,
        criterio: criterio,
        tema: tema,
        nota: nota,
        estado: estado,
        fechaLimite: fechaLimite
    });

    localStorage.setItem(
        "actividades",
        JSON.stringify(actividades)
    );

    verificarActividadesVencidas();
    limpiarFormulario();
    actualizarTablasRegistro();

    alert("Actividad registrada correctamente.");

    return true;
}

function seleccionarActividad(indice) {
    const actividad = actividades[indice];

    if (!actividad) {
        return;
    }

    actividadSeleccionada = indice;

    document.getElementById("materia").value =
        actividad.materia;

    document.getElementById("criterio").value =
        String(actividad.criterio);

    document.getElementById("tema").value =
        actividad.tema;

    document.getElementById("nota").value =
        actividad.nota;

    document.getElementById("estado").value =
        normalizarTexto(actividad.estado);

    document.getElementById("fechaLimite").value =
        actividad.fechaLimite || "";

    const formulario =
        document.getElementById("formulario-registro");

    const boton =
        document.getElementById("btn-mostrar-registro");

    if (formulario) {
        formulario.style.display = "block";
    }

    if (boton) {
        boton.textContent = "−";
    }

    alert(
        "Actividad seleccionada. Ahora puedes cambiar sus datos y presionar Actualizar actividad."
    );
}

function actualizarActividadSeleccionada() {
    if (actividadSeleccionada === null) {
        alert(
            "Selecciona primero una actividad de la tabla."
        );
        return;
    }

    const actividad =
        actividades[actividadSeleccionada];

    if (!actividad) {
        actividadSeleccionada = null;
        return;
    }

    const materia =
        document.getElementById("materia").value.trim();

    const criterio =
        Number(document.getElementById("criterio").value);

    const tema =
        document.getElementById("tema").value.trim();

    const notaTexto =
        document.getElementById("nota").value.trim();

    const nota =
        notaTexto === ""
            ? 0
            : Number(notaTexto);

    const estado =
        normalizarTexto(
            document.getElementById("estado").value
        );

    const fechaLimite =
        document.getElementById("fechaLimite").value;

    if (!materia || !tema) {
        alert(
            "Completa la materia y el tema o actividad."
        );
        return;
    }

    if (!fechaLimite) {
        alert("Selecciona una fecha límite.");
        return;
    }

    if (
        isNaN(nota) ||
        nota < 0 ||
        nota > 50
    ) {
        alert(
            "La nota debe estar entre 0 y 50."
        );
        return;
    }

    actividad.materia = materia;
    actividad.criterio = criterio;
    actividad.tema = tema;
    actividad.nota = nota;
    actividad.estado = estado;
    actividad.fechaLimite = fechaLimite;

    localStorage.setItem(
        "actividades",
        JSON.stringify(actividades)
    );

    verificarActividadesVencidas();
    actualizarTablasRegistro();
    limpiarFormulario();

    actividadSeleccionada = null;

    alert(
        "Actividad actualizada correctamente."
    );
}

function limpiarFormulario() {
    document.getElementById("materia").value = "";
    document.getElementById("criterio").value = "1";
    document.getElementById("tema").value = "";
    document.getElementById("nota").value = "";
    document.getElementById("estado").value = "pendiente";
    document.getElementById("fechaLimite").value = "";
}

function mostrarActividades() {
    const tabla =
        document.getElementById("tabla-actividades-body");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    const actividadesPendientes = actividades
        .map((actividad, indice) => ({
            actividad: actividad,
            indice: indice
        }));

    if (actividadesPendientes.length === 0) {
        tabla.innerHTML = `
        <tr>
            <td colspan="6" class="tabla-vacia">
                No hay actividades registradas.
            </td>
        </tr>
    `;
        return;
    }

    actividadesPendientes.forEach(item => {
        const fila =
            document.createElement("tr");

        const estado =
            normalizarTexto(item.actividad.estado);

        fila.classList.add("fila-actividad");

        if (estado === "pendiente") {
            fila.classList.add("fila-pendiente");
        }

        if (estado === "vencida") {
            fila.classList.add("fila-vencida");
        }

        fila.title =
            "Haz clic para editar esta actividad";

        fila.innerHTML = `
            <td class="celda-materia">
                ${item.actividad.materia}
            </td>

            <td>
                Criterio ${item.actividad.criterio}
            </td>

            <td class="celda-tema">
                ${item.actividad.tema}
            </td>

            <td class="celda-nota">
                ${item.actividad.nota}
            </td>

            <td>
                <span class="estado-tabla estado-${estado}">
                    ${item.actividad.estado}
                </span>
            </td>

            <td>
                ${item.actividad.fechaLimite || "Sin fecha"}
            </td>
        `;

        fila.addEventListener(
            "click",
            function() {
                seleccionarActividad(item.indice);
            }
        );

        tabla.appendChild(fila);
    });
}

function cargarActividadesGuardadas() {
    const datosGuardados =
        localStorage.getItem("actividades");

    if (!datosGuardados) {
        return;
    }

    try {
        const datos =
            JSON.parse(datosGuardados);

        if (Array.isArray(datos)) {
            actividades = datos;
        }

    } catch (error) {
        console.error(
            "Error al cargar actividades:",
            error
        );
    }
}

function guardarExcel() {
    if (actividades.length === 0) {
        mostrarMensaje("No existen actividades para exportar.");
        return;
    }

    const libro = XLSX.utils.book_new();

    const datosExcel = [
        [
            "Materia",
            "Criterio",
            "Tema",
            "Nota",
            "Estado",
            "Fecha límite"
        ]
    ];

    actividades.forEach(actividad => {
        datosExcel.push([
            actividad.materia,
            actividad.criterio,
            actividad.tema,
            actividad.nota,
            actividad.estado,
            actividad.fechaLimite || ""
        ]);
    });

    const hoja = XLSX.utils.aoa_to_sheet(datosExcel);

    hoja["!cols"] = [
        { wch: 24 },
        { wch: 12 },
        { wch: 35 },
        { wch: 10 },
        { wch: 16 },
        { wch: 18 }
    ];

    hoja["!autofilter"] = {
        ref: `A1:F${datosExcel.length}`
    };

    hoja["!freeze"] = {
        xSplit: 0,
        ySplit: 1
    };

    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Historial Académico"
    );

    XLSX.writeFile(
        libro,
        "Historial_Academico.xlsx"
    );

    mostrarMensaje("Historial académico exportado correctamente.");
}

function leerExcel(evento) {
    const archivo =
        evento.target.files[0];

    if (!archivo) {
        return;
    }

    const lector =
        new FileReader();

    lector.onload = function(e) {

        try {
            const datos =
                new Uint8Array(e.target.result);

            const libro =
                XLSX.read(
                    datos,
                    {
                        type: "array"
                    }
                );

            const hoja =
                libro.Sheets[
                    libro.SheetNames[0]
                    ];

            const filas =
                XLSX.utils.sheet_to_json(
                    hoja,
                    {
                        header: 1,
                        defval: ""
                    }
                );

            if (filas.length < 2) {
                alert(
                    "El archivo Excel no contiene actividades."
                );
                return;
            }

            const encabezados =
                filas[0].map(normalizarTexto);

            const indiceMateria =
                encabezados.indexOf("materia");

            const indiceCriterio =
                encabezados.indexOf("criterio");

            let indiceTema =
                encabezados.indexOf("tema");

            if (indiceTema === -1) {
                indiceTema =
                    encabezados.indexOf(
                        "tema o actividad"
                    );
            }

            const indiceNota =
                encabezados.indexOf("nota");

            const indiceEstado =
                encabezados.indexOf("estado");

            let indiceFechaLimite =
                encabezados.indexOf(
                    "fecha limite"
                );

            if (indiceFechaLimite === -1) {
                indiceFechaLimite =
                    encabezados.indexOf(
                        "fecha límite"
                    );
            }

            if (
                indiceMateria === -1 ||
                indiceCriterio === -1 ||
                indiceTema === -1 ||
                indiceNota === -1 ||
                indiceEstado === -1
            ) {
                alert(
                    "El Excel debe tener las columnas: Materia, Criterio, Tema, Nota y Estado."
                );

                return;
            }

            actividades = filas
                .slice(1)
                .filter(fila =>
                    fila.some(
                        valor =>
                            String(valor).trim() !== ""
                    )
                )
                .map(fila => ({
                    materia:
                        String(
                            fila[indiceMateria]
                        ).trim(),

                    criterio:
                        Number(
                            fila[indiceCriterio]
                        ) || 0,

                    tema:
                        String(
                            fila[indiceTema]
                        ).trim(),

                    nota:
                        Number(
                            fila[indiceNota]
                        ) || 0,

                    estado:
                        normalizarTexto(
                            fila[indiceEstado]
                        ) || "pendiente",

                    fechaLimite:
                        indiceFechaLimite !== -1
                            ? String(
                                fila[
                                    indiceFechaLimite
                                    ]
                            ).trim()
                            : ""
                }));

            localStorage.setItem(
                "actividades",
                JSON.stringify(actividades)
            );

            verificarActividadesVencidas();
            actualizarTablasRegistro();

            alert(
                "Actividades importadas correctamente."
            );

        } catch (error) {
            console.error(
                "Error al leer Excel:",
                error
            );

            alert(
                "No se pudo leer el archivo Excel."
            );
        }
    };

    lector.readAsArrayBuffer(archivo);
}

function actualizarActividades() {
    localStorage.setItem(
        "actividades",
        JSON.stringify(actividades)
    );

    verificarActividadesVencidas();
    actualizarTablasRegistro();

    alert(
        "Actividades actualizadas correctamente."
    );
}

function configurarBotonMas() {
    const boton =
        document.getElementById(
            "btn-mostrar-registro"
        );

    const formulario =
        document.getElementById(
            "formulario-registro"
        );

    if (!boton || !formulario) {
        return;
    }

    formulario.style.display = "none";

    boton.addEventListener(
        "click",
        function() {

            if (
                formulario.style.display === "none" ||
                formulario.style.display === ""
            ) {
                formulario.style.display =
                    "block";

                boton.textContent = "−";

            } else {
                formulario.style.display =
                    "none";

                boton.textContent = "+";
            }
        }
    );
}

document.addEventListener(
    "DOMContentLoaded",
    function() {

        cargarActividadesGuardadas();
        verificarActividadesVencidas();
        actualizarTablasRegistro();
        configurarBotonMas();

        const botonRegistrar =
            document.getElementById(
                "btn-registrar"
            );

        if (botonRegistrar) {
            botonRegistrar.addEventListener(
                "click",
                function() {

                    if (
                        actividadSeleccionada !== null
                    ) {
                        alert(
                            "Tienes una actividad seleccionada. Usa Actualizar actividad para modificarla."
                        );

                        return;
                    }

                    registrarActividad();
                }
            );
        }

        const botonActualizar =
            document.getElementById(
                "btn-actualizar"
            );

        if (botonActualizar) {
            botonActualizar.addEventListener(
                "click",
                function() {
                    actualizarActividadSeleccionada();
                }
            );
        }

        const botonExportar =
            document.getElementById(
                "btn-exportar-excel"
            );

        if (botonExportar) {
            botonExportar.addEventListener(
                "click",
                function() {
                    guardarExcel();
                }
            );
        }
    }
);