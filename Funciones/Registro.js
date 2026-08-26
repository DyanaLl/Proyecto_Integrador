let actividadSeleccionada = null;

function normalizarTexto(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function mostrarMensaje(mensaje) {
    const modal = document.getElementById("modal-mensaje");
    const texto = document.getElementById("modal-texto");

    if (!modal || !texto) {
        console.log(mensaje);
        return;
    }

    texto.textContent = mensaje;
    modal.style.display = "flex";
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

function actualizarMateriasSimulador() {
    const selectMateriaA =
        document.getElementById("select-materia-a");

    const selectMateriaB =
        document.getElementById("select-materia-b");

    if (!selectMateriaA || !selectMateriaB) {
        return;
    }

    const valorSeleccionadoA = selectMateriaA.value;
    const valorSeleccionadoB = selectMateriaB.value;

    const materias = [];

    actividades.forEach(actividad => {
        if (
            actividad.materia &&
            !materias.includes(actividad.materia)
        ) {
            materias.push(actividad.materia);
        }
    });

    selectMateriaA.innerHTML =
        '<option value="">-- Selecciona una materia --</option>';

    selectMateriaB.innerHTML =
        '<option value="">-- Selecciona una materia --</option>';

    materias.forEach(materia => {
        const opcionA = document.createElement("option");

        opcionA.value = materia;
        opcionA.textContent = materia;

        selectMateriaA.appendChild(opcionA);

        const opcionB = document.createElement("option");

        opcionB.value = materia;
        opcionB.textContent = materia;

        selectMateriaB.appendChild(opcionB);
    });

    if (materias.includes(valorSeleccionadoA)) {
        selectMateriaA.value = valorSeleccionadoA;
    }

    if (materias.includes(valorSeleccionadoB)) {
        selectMateriaB.value = valorSeleccionadoB;
    }
}

// Función auxiliar unificada para limpiar código repetitivo
function actualizarTablasRegistro() {
    mostrarActividades();

    if (typeof mostrarTablaPromedios === "function") {
        mostrarTablaPromedios();
    }

    actualizarMateriasSimulador();
    actualizarGraficaRegistro();
}

function registrarActividad() {
    const materia =
        document.getElementById("materia").value.trim();

    const rda =
        Number(document.getElementById("rda").value);

    const criterio =
        Number(document.getElementById("criterio").value);

    const tema =
        document.getElementById("tema").value.trim();

    const notaTexto =
        document.getElementById("nota").value.trim();

    const nota =
        notaTexto === "" ? 0 : Number(notaTexto);

    const estado =
        normalizarTexto(
            document.getElementById("estado").value
        );

    const fechaLimite =
        document.getElementById("fechaLimite").value;

    if (!materia) {
        mostrarMensaje("Selecciona una materia.");
        return false;
    }

    if (![1, 2, 3].includes(rda)) {
        mostrarMensaje("Selecciona un RDA válido.");
        return false;
    }

    if (![1, 2, 3].includes(criterio)) {
        mostrarMensaje("Selecciona un criterio válido.");
        return false;
    }

    if (!tema) {
        mostrarMensaje("Escribe el tema o actividad.");
        return false;
    }

    if (!fechaLimite) {
        mostrarMensaje("Selecciona una fecha límite.");
        return false;
    }

    if (
        isNaN(nota) ||
        nota < 0 ||
        nota > 50
    ) {
        mostrarMensaje(
            "La nota debe estar entre 0 y 50."
        );

        return false;
    }

    actividades.push({
        materia: materia,
        rda: rda,
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
    actualizarTablasRegistro(); // Uso de la función centralizada

    mostrarMensaje(
        "Actividad registrada correctamente."
    );

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

    document.getElementById("rda").value =
        String(actividad.rda || 1);

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

    mostrarMensaje(
        "Actividad seleccionada. Ahora puedes cambiar sus datos y presionar Actualizar actividad."
    );
}

function actualizarActividadSeleccionada() {
    if (actividadSeleccionada === null) {
        mostrarMensaje(
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

    const rda =
        Number(document.getElementById("rda").value);

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
        mostrarMensaje(
            "Completa la materia y el tema o actividad."
        );

        return;
    }

    if (![1, 2, 3].includes(rda)) {
        mostrarMensaje(
            "Selecciona un RDA válido."
        );

        return;
    }

    if (![1, 2, 3].includes(criterio)) {
        mostrarMensaje(
            "Selecciona un criterio válido."
        );

        return;
    }

    if (!fechaLimite) {
        mostrarMensaje(
            "Selecciona una fecha límite."
        );

        return;
    }

    if (
        isNaN(nota) ||
        nota < 0 ||
        nota > 50
    ) {
        mostrarMensaje(
            "La nota debe estar entre 0 y 50."
        );

        return;
    }

    actividad.materia = materia;
    actividad.rda = rda;
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
    actualizarTablasRegistro(); // Uso de la función centralizada
    limpiarFormulario();

    actividadSeleccionada = null;

    mostrarMensaje(
        "Actividad actualizada correctamente."
    );
}

function limpiarFormulario() {
    document.getElementById("materia").value = "";
    document.getElementById("rda").value = "1";
    document.getElementById("criterio").value = "1";
    document.getElementById("tema").value = "";
    document.getElementById("nota").value = "";
    document.getElementById("estado").value = "pendiente";
    document.getElementById("fechaLimite").value = "";
}

function mostrarActividades() {
    const tabla =
        document.getElementById(
            "tabla-actividades-body"
        );

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    const actividadesRegistradas =
        actividades.map(
            (actividad, indice) => ({
                actividad: actividad,
                indice: indice
            })
        );

    if (actividadesRegistradas.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="tabla-vacia">
                    No hay actividades registradas.
                </td>
            </tr>
        `;

        return;
    }

    actividadesRegistradas.forEach(item => {
        const fila =
            document.createElement("tr");

        const estado =
            normalizarTexto(
                item.actividad.estado
            );

        fila.classList.add(
            "fila-actividad"
        );

        if (estado === "pendiente") {
            fila.classList.add(
                "fila-pendiente"
            );
        }

        if (estado === "vencida") {
            fila.classList.add(
                "fila-vencida"
            );
        }

        fila.title =
            "Haz clic para editar esta actividad";

        fila.innerHTML = `
            <td class="celda-materia">
                ${item.actividad.materia}
            </td>

            <td>
                RDA ${item.actividad.rda || 1}
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
                seleccionarActividad(
                    item.indice
                );
            }
        );

        tabla.appendChild(fila);
    });
}

function cargarActividadesGuardadas() {
    const datosGuardados =
        localStorage.getItem(
            "actividades"
        );

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
        mostrarMensaje(
            "No existen actividades para exportar."
        );

        return;
    }

    const libro =
        XLSX.utils.book_new();

    const datosExcel = [
        [
            "Materia",
            "RDA",
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
            actividad.rda || 1,
            actividad.criterio,
            actividad.tema,
            actividad.nota,
            actividad.estado,
            actividad.fechaLimite || ""
        ]);
    });

    const hoja =
        XLSX.utils.aoa_to_sheet(
            datosExcel
        );

    hoja["!cols"] = [
        { wch: 32 },
        { wch: 10 },
        { wch: 12 },
        { wch: 36 },
        { wch: 12 },
        { wch: 18 },
        { wch: 20 }
    ];

    hoja["!autofilter"] = {
        ref: `A1:G${datosExcel.length}`
    };

    const estiloEncabezado = {
        font: {
            bold: true,
            color: {
                rgb: "FFFFFF"
            },
            sz: 12
        },
        fill: {
            fgColor: {
                rgb: "4472C4"
            }
        },
        alignment: {
            horizontal: "center",
            vertical: "center"
        },
        border: {
            top: {
                style: "thin",
                color: {
                    rgb: "D9E1F2"
                }
            },
            bottom: {
                style: "thin",
                color: {
                    rgb: "D9E1F2"
                }
            },
            left: {
                style: "thin",
                color: {
                    rgb: "D9E1F2"
                }
            },
            right: {
                style: "thin",
                color: {
                    rgb: "D9E1F2"
                }
            }
        }
    };

    const estiloCelda = {
        alignment: {
            vertical: "center"
        },
        border: {
            top: {
                style: "thin",
                color: {
                    rgb: "E2E8F0"
                }
            },
            bottom: {
                style: "thin",
                color: {
                    rgb: "E2E8F0"
                }
            },
            left: {
                style: "thin",
                color: {
                    rgb: "E2E8F0"
                }
            },
            right: {
                style: "thin",
                color: {
                    rgb: "E2E8F0"
                }
            }
        }
    };

    for (
        let columna = 0;
        columna < 7;
        columna++
    ) {
        const direccion =
            XLSX.utils.encode_cell({
                r: 0,
                c: columna
            });

        if (hoja[direccion]) {
            hoja[direccion].s =
                estiloEncabezado;
        }
    }

    for (
        let fila = 1;
        fila < datosExcel.length;
        fila++
    ) {
        for (
            let columna = 0;
            columna < 7;
            columna++
        ) {
            const direccion =
                XLSX.utils.encode_cell({
                    r: fila,
                    c: columna
                });

            if (hoja[direccion]) {
                hoja[direccion].s = {
                    ...estiloCelda,
                    fill: {
                        fgColor: {
                            rgb:
                                fila % 2 === 0
                                    ? "F7F9FC"
                                    : "FFFFFF"
                        }
                    }
                };
            }
        }

        const celdaEstado =
            hoja[
                XLSX.utils.encode_cell({
                    r: fila,
                    c: 5
                })
                ];

        if (celdaEstado) {
            const estado =
                normalizarTexto(
                    celdaEstado.v
                );

            if (estado === "entregada") {
                celdaEstado.s = {
                    ...estiloCelda,
                    font: {
                        bold: true,
                        color: {
                            rgb: "1B5E20"
                        }
                    },
                    fill: {
                        fgColor: {
                            rgb: "E2F0D9"
                        }
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: "center"
                    }
                };
            }

            if (estado === "pendiente") {
                celdaEstado.s = {
                    ...estiloCelda,
                    font: {
                        bold: true,
                        color: {
                            rgb: "7F6000"
                        }
                    },
                    fill: {
                        fgColor: {
                            rgb: "FFF2CC"
                        }
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: "center"
                    }
                };
            }

            if (estado === "vencida") {
                celdaEstado.s = {
                    ...estiloCelda,
                    font: {
                        bold: true,
                        color: {
                            rgb: "9C0006"
                        }
                    },
                    fill: {
                        fgColor: {
                            rgb: "FFC7CE"
                        }
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: "center"
                    }
                };
            }
        }
    }

    hoja["!rows"] = [
        {
            hpt: 24
        }
    ];

    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Historial Académico"
    );

    XLSX.writeFile(
        libro,
        "Historial_Academico.xlsx"
    );

    mostrarMensaje(
        "Historial académico exportado correctamente."
    );
}

function convertirFechaExcel(valor) {
    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        return "";
    }

    if (typeof valor === "number") {
        const fechaExcel =
            XLSX.SSF.parse_date_code(
                valor
            );

        if (fechaExcel) {
            const anio =
                fechaExcel.y;

            const mes =
                String(fechaExcel.m)
                    .padStart(2, "0");

            const dia =
                String(fechaExcel.d)
                    .padStart(2, "0");

            return `${anio}-${mes}-${dia}`;
        }
    }

    return String(valor).trim();
}

function leerExcel(evento) {
    const archivo = evento.target.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function(e) {
        try {
            const datos =
                new Uint8Array(
                    e.target.result
                );

            const libro = XLSX.read(datos, { type: "array" });

            const hoja = libro.Sheets[libro.SheetNames[0]];

            const filas = XLSX.utils.sheet_to_json(hoja, {
                header: 1,
                defval: ""
            });

            if (filas.length < 2) {
                mostrarMensaje(
                    "El archivo Excel no contiene actividades."
                );

                return;
            }

            const encabezados =
                filas[0].map(
                    normalizarTexto
                );

            const indiceMateria =
                encabezados.indexOf(
                    "materia"
                );

            const indiceRda =
                encabezados.indexOf(
                    "rda"
                );

            const indiceCriterio =
                encabezados.indexOf(
                    "criterio"
                );

            let indiceTema =
                encabezados.indexOf(
                    "tema"
                );

            if (indiceTema === -1) {
                indiceTema = encabezados.indexOf("tema o actividad");
            }

            const indiceNota =
                encabezados.indexOf(
                    "nota"
                );

            const indiceEstado =
                encabezados.indexOf(
                    "estado"
                );

            let indiceFechaLimite =
                encabezados.indexOf(
                    "fecha limite"
                );

            if (indiceFechaLimite === -1) {
                indiceFechaLimite = encabezados.indexOf("fecha límite");
            }

            if (
                indiceMateria === -1 ||
                indiceRda === -1 ||
                indiceCriterio === -1 ||
                indiceTema === -1 ||
                indiceNota === -1 ||
                indiceEstado === -1
            ) {
                mostrarMensaje(
                    "El Excel debe tener las columnas: Materia, RDA, Criterio, Tema, Nota y Estado."
                );
                return;
            }

            actividades = filas
                .slice(1)
                .filter(fila =>
                    fila.some(
                        valor =>
                            String(valor)
                                .trim() !== ""
                    )
                )
                .map(fila => ({
                    materia:
                        String(
                            fila[
                                indiceMateria
                                ]
                        ).trim(),

                    rda:
                        Number(
                            fila[
                                indiceRda
                                ]
                        ) || 1,

                    criterio:
                        Number(
                            fila[
                                indiceCriterio
                                ]
                        ) || 1,

                    tema:
                        String(
                            fila[
                                indiceTema
                                ]
                        ).trim(),

                    nota:
                        Number(
                            fila[
                                indiceNota
                                ]
                        ) || 0,

                    estado:
                        normalizarTexto(
                            fila[
                                indiceEstado
                                ]
                        ) || "pendiente",

                    fechaLimite:
                        indiceFechaLimite !== -1
                            ? convertirFechaExcel(
                                fila[
                                    indiceFechaLimite
                                    ]
                            )
                            : ""
                }));

            localStorage.setItem(
                "actividades",
                JSON.stringify(
                    actividades
                )
            );

            verificarActividadesVencidas();
            actualizarTablasRegistro(); // Uso de la función centralizada

            mostrarMensaje("Actividades importadas correctamente.");

        } catch (error) {
            console.error("Error al leer Excel:", error);
            mostrarMensaje("No se pudo leer el archivo Excel.");
        }
    };

    lector.readAsArrayBuffer(
        archivo
    );
}

function actualizarActividades() {
    localStorage.setItem(
        "actividades",
        JSON.stringify(actividades)
    );

    verificarActividadesVencidas();
    actualizarTablasRegistro(); // Uso de la función centralizada

    mostrarMensaje(
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

    formulario.style.display =
        "none";

    boton.addEventListener(
        "click",
        function() {
            if (
                formulario.style.display ===
                "none" ||
                formulario.style.display ===
                ""
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
)}
document.addEventListener("DOMContentLoaded", function() {
    cargarActividadesGuardadas();
    verificarActividadesVencidas();
    mostrarActividades();

    if (
        typeof mostrarTablaPromedios ===
        "function"
    ) {
        mostrarTablaPromedios();
    }

    actualizarMateriasSimulador();

    configurarBotonMas();

    const modal =
        document.getElementById(
            "modal-mensaje"
        );

    const botonAceptar =
        document.getElementById(
            "modal-aceptar"
        );

    if (modal && botonAceptar) {
        botonAceptar.addEventListener(
            "click",
            function() {
                modal.style.display =
                    "none";
            }
        );

        modal.addEventListener(
            "click",
            function(evento) {
                if (
                    evento.target === modal
                ) {
                    modal.style.display =
                        "none";
                }
            }
        );
    }

    const botonRegistrar =
        document.getElementById(
            "btn-registrar"
        );

    if (botonRegistrar) {
        botonRegistrar.addEventListener(
            "click",
            function() {
                if (
                    actividadSeleccionada !==
                    null
                ) {
                    mostrarMensaje(
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
});

