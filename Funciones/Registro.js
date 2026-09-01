let actividadSeleccionada = null;

function normalizarTexto(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

// Muestra mensajes flotantes en un modal
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

// Convierte fechas numéricas de Excel a formato de texto estándar
function convertirFechaExcel(valor) {
    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        return "";
    }

    if (typeof valor === "number") {
        const fechaExcel = XLSX.SSF.parse_date_code(
            valor
        );

        if (fechaExcel) {
            const anio = fechaExcel.y;
            const mes = String(fechaExcel.m).padStart(2, "0");
            const dia = String(fechaExcel.d).padStart(2, "0");

            return `${anio}-${mes}-${dia}`;
        }
    }

    String(valor).trim();
}

// Revisa si las fechas límite pasaron para cambiar el estado a vencida
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

// Actualiza la gráfica de materias si está disponible
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

// Rellena los selectores de materias para el simulador
function actualizarMateriasSimulador() {
    const selectMateriaA = document.getElementById("select-materia-a");
    const selectMateriaB = document.getElementById("select-materia-b");

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

// Refresca todas las tablas, promedios y elementos visuales del registro
function actualizarTablasRegistro() {
    mostrarActividades();

    if (typeof mostrarTablaPromedios === "function") {
        mostrarTablaPromedios();
    }

    actualizarMateriasSimulador();
    actualizarGraficaRegistro();
}

// Guarda los cambios generales en el almacenamiento local
function actualizarActividades() {
    localStorage.setItem(
        "actividades",
        JSON.stringify(actividades)
    );

    verificarActividadesVencidas();
    actualizarTablasRegistro();

    mostrarMensaje(
        "Actividades actualizadas correctamente."
    );
}

// Carga las actividades guardadas en el navegador al iniciar
function cargarActividadesGuardadas() {
    const datosGuardados = localStorage.getItem("actividades");

    if (!datosGuardados) {
        return;
    }

    try {
        const datos = JSON.parse(datosGuardados);

        if (Array.isArray(datos)) {
            actividades = datos;
        }

    } catch (error) {
        console.error(
            "Error al cargar actividades:", error
        );
    }
}

// Registra una nueva actividad desde el formulario
function registrarActividad() {
    const materia = document.getElementById("materia").value.trim();
    const rda = Number(document.getElementById("rda").value);
    const criterio = Number(document.getElementById("criterio").value);
    const tema = document.getElementById("tema").value.trim();
    const notaTexto = document.getElementById("nota").value.trim();
    const nota = notaTexto === "" ? 0 : Number(notaTexto);
    const estado = normalizarTexto(document.getElementById("estado").value);
    const fechaLimite = document.getElementById("fechaLimite").value;
    const hora = document.getElementById("hora").value;

    const inputPonderacionEspecial = document.getElementById("input-ponderacion-especial")?.value;
    const ponderacion = (inputPonderacionEspecial !== undefined && inputPonderacionEspecial !== "" && !isNaN(inputPonderacionEspecial))
        ? parseFloat(inputPonderacionEspecial)
        : null;

    if (typeof validarFormularioActividad === "function" && !validarFormularioActividad()) {
        return false;
    }

    actividades.push({
        materia: materia,
        rda: rda,
        criterio: criterio,
        tema: tema,
        nota: nota,
        estado: estado,
        fechaLimite: fechaLimite,
        hora: hora,
        ponderacion: ponderacion
    });

    localStorage.setItem("actividades", JSON.stringify(actividades));

    verificarActividadesVencidas();
    limpiarFormulario();
    actualizarTablasRegistro();

    if (typeof restaurarVistaDashboard === "function") {
        restaurarVistaDashboard();
    } else {
        const modalRegistro = document.getElementById("modal-registro");
        const dashboardColumnas = document.querySelector(".dashboard-columnas");
        const seccionEncabezado = document.getElementById("seccion-encabezado");
        if (modalRegistro) {
            modalRegistro.style.display = "none";
            modalRegistro.classList.add("oculto-inicial");
        }
        if (dashboardColumnas) dashboardColumnas.style.display = "flex";
        if (seccionEncabezado) seccionEncabezado.classList.remove("oculto-inicial");
    }

    mostrarMensaje("Actividad registrada correctamente.");
    return true;
}

// Carga los datos de una actividad específica en el formulario para editarla
function seleccionarActividad(indice) {
    const actividad = actividades[indice];

    if (!actividad) {
        return;
    }

    actividadSeleccionada = indice;

    document.getElementById("materia").value = actividad.materia;
    document.getElementById("rda").value = String(actividad.rda);
    document.getElementById("criterio").value = String(actividad.criterio);
    document.getElementById("tema").value = actividad.tema;
    document.getElementById("nota").value = actividad.nota;
    document.getElementById("estado").value = normalizarTexto(actividad.estado);
    document.getElementById("fechaLimite").value = actividad.fechaLimite || "";
    document.getElementById("hora").value = actividad.hora || "";

    const modalRegistro = document.getElementById("modal-registro");
    const dashboardColumnas = document.querySelector(".dashboard-columnas");
    const encabezadoPrincipal = document.getElementById("seccion-encabezado");

    if (dashboardColumnas) dashboardColumnas.style.display = "none";
    if (encabezadoPrincipal) encabezadoPrincipal.style.display = "none";

    if (modalRegistro) {
        modalRegistro.classList.remove("oculto-inicial");
        modalRegistro.removeAttribute("style");
        modalRegistro.style.display = "block";
    }

    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
    const navRegistroBtn = document.getElementById("nav-registro");
    if (navRegistroBtn) navRegistroBtn.classList.add("activo");

    mostrarMensaje(
        "Actividad seleccionada. Ahora puedes cambiar sus datos y presionar Actualizar actividad."
    );
}

// Guarda los cambios realizados en una actividad que estaba siendo editada
function actualizarActividadSeleccionada() {
    if (actividadSeleccionada === null) {
        mostrarMensaje(
            "Selecciona primero una actividad de la tabla."
        );
        return;
    }

    const actividad = actividades[actividadSeleccionada];

    if (!actividad) {
        actividadSeleccionada = null;
        return;
    }

    const materia = document.getElementById("materia").value.trim();
    const rda = Number(document.getElementById("rda").value);
    const criterio = Number(document.getElementById("criterio").value);
    const tema = document.getElementById("tema").value.trim();
    const notaTexto = document.getElementById("nota").value.trim();
    const nota = notaTexto === "" ? 0 : Number(notaTexto);
    const estado = normalizarTexto(
        document.getElementById("estado").value
    );
    const fechaLimite = document.getElementById("fechaLimite").value;
    const hora = document.getElementById("hora").value;

    if (typeof validarFormularioActividad === "function" && !validarFormularioActividad()) {
        return;
    }

    actividad.materia = materia;
    actividad.rda = rda;
    actividad.criterio = criterio;
    actividad.tema = tema;
    actividad.nota = nota;
    actividad.estado = estado;
    actividad.fechaLimite = fechaLimite;
    actividad.hora = hora;

    localStorage.setItem(
        "actividades",
        JSON.stringify(actividades)
    );

    verificarActividadesVencidas();
    actualizarTablasRegistro();
    limpiarFormulario();

    actividadSeleccionada = null;

    if (typeof restaurarVistaDashboard === "function") {
        restaurarVistaDashboard();
    }

    mostrarMensaje(
        "Actividad actualizada correctamente."
    );
}

// Vacía todos los campos del formulario de registro
function limpiarFormulario() {
    document.getElementById("materia").value = "";
    document.getElementById("rda").value = "1";
    document.getElementById("criterio").value = "1";
    document.getElementById("tema").value = "";
    document.getElementById("nota").value = "";
    document.getElementById("estado").value = "pendiente";
    document.getElementById("fechaLimite").value = "";
    document.getElementById("hora").value = "";

    const inputPonderacion = document.getElementById("input-ponderacion-especial");
    if (inputPonderacion) inputPonderacion.value = "";
}

// Muestra las actividades pendientes en la tabla principal
function mostrarActividades() {
    const tabla = document.getElementById("tabla-actividades-body");

    if (!tabla) return;

    tabla.innerHTML = "";

    const actividadesPendientes = actividades
        .map((actividad, indice) => ({
            actividad: actividad,
            indice: indice
        }))
        .filter(item =>
            normalizarTexto(item.actividad.estado) === "pendiente"
        );

    if (actividadesPendientes.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="tabla-vacia">
                    No hay actividades pendientes.
                </td>
            </tr>
        `;
        return;
    }

    actividadesPendientes.forEach(item => {
        const fila = document.createElement("tr");
        const estado = normalizarTexto(item.actividad.estado);

        fila.classList.add("fila-actividad");
        fila.classList.add("fila-pendiente");
        fila.title = "Haz clic para editar esta actividad";

        fila.innerHTML = `
            <td class="celda-materia">${item.actividad.materia}</td>
            <td>RDA ${item.actividad.rda}</td>
            <td>Criterio ${item.actividad.criterio}</td>
            <td class="celda-tema">${item.actividad.tema}</td>
            <td class="celda-nota">${item.actividad.nota}</td>
            <td>
                <span class="estado-tabla estado-${estado}">
                    ${item.actividad.estado}
                </span>
            </td>
            <td>${item.actividad.fechaLimite ? `${item.actividad.fechaLimite} ${item.actividad.hora ? 'a las ' + item.actividad.hora : ''}` : "Sin fecha"}</td>
        `;

        fila.addEventListener("click", function () {
            seleccionarActividad(item.indice);
        });

        tabla.appendChild(fila);
    });
}

// Muestra el historial académico completo filtrado por materia
function mostrarHistorialAcademicoCompleto(materiaFiltro = null) {
    const modalHistorial = document.getElementById("modal-historial-academico");
    const modalRegistro = document.getElementById("modal-registro");
    const dashboardColumnas = document.querySelector(".dashboard-columnas");
    const encabezadoPrincipal = document.getElementById("seccion-encabezado");
    const cuerpoTablaHistorial = document.getElementById("tabla-historial-body");

    if (!modalHistorial || !cuerpoTablaHistorial) return;

    if (dashboardColumnas) dashboardColumnas.style.display = "none";
    if (encabezadoPrincipal) encabezadoPrincipal.style.display = "none";
    if (modalRegistro) {
        modalRegistro.style.display = "none";
        modalRegistro.classList.add("oculto-inicial");
    }

    cuerpoTablaHistorial.innerHTML = "";

    if (!materiaFiltro || materiaFiltro === "") {
        cuerpoTablaHistorial.innerHTML = `<tr><td colspan="8" style="text-align: center;">Por favor, seleccione una materia para ver su historial.</td></tr>`;
    } else {
        const materiaBusc = materiaFiltro.trim().toLowerCase();
        const actividadesAMostrar = actividades.filter(act => {
            const materiaAct = act.materia ? act.materia.trim().toLowerCase() : "";
            return materiaAct === materiaBusc;
        });

        if (actividadesAMostrar.length === 0) {
            cuerpoTablaHistorial.innerHTML = `<tr><td colspan="8" style="text-align: center;">No hay actividades registradas para esta sección.</td></tr>`;
        } else {
            actividadesAMostrar.forEach((act) => {
                const indiceGlobal = actividades.indexOf(act);
                const fechaFormateada = act.fechaLimite ? act.fechaLimite : "Sin fecha";

                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${act.materia || ""}</td>
                    <td>RDA ${act.rda || ""}</td>
                    <td>Crit. ${act.criterio || ""}</td>
                    <td>${act.tema || ""}</td>
                    <td>${act.nota || 0}</td>
                    <td>${act.estado || "pendiente"}</td>
                    <td>${fechaFormateada}</td>
                    <td>
                        <button class="btn-modificar" onclick="modificarDesdeHistorial(${indiceGlobal})">Editar</button>
                        <button class="btn-eliminar" onclick="eliminarDesdeHistorial(${indiceGlobal})">Eliminar</button>
                    </td>
                `;
                cuerpoTablaHistorial.appendChild(fila);
            });
        }
    }

    modalHistorial.classList.remove("oculto-inicial");
    modalHistorial.style.display = "block";

    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
    const navHistorialBtn = document.getElementById("nav-historial");
    if (navHistorialBtn) navHistorialBtn.classList.add("activo");
}

// Permite modificar una actividad directamente desde la vista de historial
function modificarDesdeHistorial(indice) {
    const modalHistorial = document.getElementById("modal-historial-academico");
    const modalRegistro = document.getElementById("modal-registro");
    const dashboardColumnas = document.querySelector(".dashboard-columnas");
    const encabezadoPrincipal = document.getElementById("seccion-encabezado");

    if (dashboardColumnas) dashboardColumnas.style.display = "none";
    if (encabezadoPrincipal) encabezadoPrincipal.style.display = "none";

    if (modalHistorial) {
        modalHistorial.style.display = "none";
        modalHistorial.classList.add("oculto-inicial");
    }

    if (modalRegistro) {
        modalRegistro.classList.remove("oculto-inicial");
        modalRegistro.removeAttribute("style");
        modalRegistro.style.display = "block";
    }

    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
    const navRegistroBtn = document.getElementById("nav-registro");
    if (navRegistroBtn) navRegistroBtn.classList.add("activo");

    if (typeof limpiarFormulario === 'function') {
        limpiarFormulario();
    }
    seleccionarActividad(indice);
}

// Elimina una actividad directamente desde la tabla de historial
function eliminarDesdeHistorial(indice) {
    if (confirm("¿Estás seguro de que deseas eliminar esta actividad?")) {
        actividades.splice(indice, 1);
        localStorage.setItem("actividades", JSON.stringify(actividades));
        verificarActividadesVencidas();
        actualizarTablasRegistro();

        const selectFiltroMateria = document.getElementById("modal-select-materia");
        const filtroActual = selectFiltroMateria ? selectFiltroMateria.value : null;

        mostrarHistorialAcademicoCompleto(filtroActual);

        mostrarMensaje("Actividad eliminada correctamente.");
    }
}

// Exporta todas las actividades actuales a un archivo de Excel con estilos
function guardarExcel() {
    if (actividades.length === 0) {
        mostrarMensaje(
            "No existen actividades para exportar."
        );
        return;
    }

    const libro = XLSX.utils.book_new();

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
            actividad.rda,
            actividad.criterio,
            actividad.tema,
            actividad.nota,
            actividad.estado,
            actividad.fechaLimite || ""
        ]);
    });

    const hoja = XLSX.utils.aoa_to_sheet(datosExcel);

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
            top: { style: "thin", color: { rgb: "D9E1F2" } },
            bottom: { style: "thin", color: { rgb: "D9E1F2" } },
            left: { style: "thin", color: { rgb: "D9E1F2" } },
            right: { style: "thin", color: { rgb: "D9E1F2" } }
        }
    };

    const estiloCelda = {
        alignment: {
            vertical: "center"
        },
        border: {
            top: { style: "thin", color: { rgb: "E2E8F0" } },
            bottom: { style: "thin", color: { rgb: "E2E8F0" } },
            left: { style: "thin", color: { rgb: "E2E8F0" } },
            right: { style: "thin", color: { rgb: "E2E8F0" } }
        }
    };

    for (let columna = 0; columna < 7; columna++) {
        const direccion = XLSX.utils.encode_cell({
            r: 0,
            c: columna
        });

        if (hoja[direccion]) {
            hoja[direccion].s = estiloEncabezado;
        }
    }

    for (let fila = 1; fila < datosExcel.length; fila++) {
        for (let columna = 0; columna < 7; columna++) {
            const direccion = XLSX.utils.encode_cell({
                r: fila,
                c: columna
            });

            if (hoja[direccion]) {
                hoja[direccion].s = {
                    ...estiloCelda,
                    fill: {
                        fgColor: {
                            rgb: fila % 2 === 0 ? "F7F9FC" : "FFFFFF"
                        }
                    }
                };
            }
        }

        const celdaEstado = hoja[
            XLSX.utils.encode_cell({
                r: fila,
                c: 5
            })
        ];

        if (celdaEstado) {
            const estado = normalizarTexto(
                celdaEstado.v
            );

            if (estado === "entregada") {
                celdaEstado.s = {
                    ...estiloCelda,
                    font: { bold: true, color: { rgb: "1B5E20" } },
                    fill: { fgColor: { rgb: "E2F0D9" } },
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }

            if (estado === "pendiente") {
                celdaEstado.s = {
                    ...estiloCelda,
                    font: { bold: true, color: { rgb: "7F6000" } },
                    fill: { fgColor: { rgb: "FFF2CC" } },
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }

            if (estado === "vencida") {
                celdaEstado.s = {
                    ...estiloCelda,
                    font: { bold: true, color: { rgb: "9C0006" } },
                    fill: { fgColor: { rgb: "FFC7CE" } },
                    alignment: { horizontal: "center", vertical: "center" }
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

// Lee e importa actividades desde un archivo de Excel subido
function leerExcel(evento) {
    const archivo = evento.target.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function (e) {
        try {
            const datos = new Uint8Array(e.target.result);

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

            const encabezados = filas[0].map(
                normalizarTexto
            );

            const indiceMateria = encabezados.indexOf("materia");
            const indiceRda = encabezados.indexOf("rda");
            const indiceCriterio = encabezados.indexOf("criterio");

            let indiceTema = encabezados.indexOf("tema");

            if (indiceTema === -1) {
                indiceTema = encabezados.indexOf("tema o actividad");
            }

            const indiceNota = encabezados.indexOf("nota");
            const indiceEstado = encabezados.indexOf("estado");

            let indiceFechaLimite = encabezados.indexOf("fecha limite");

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
                        valor => String(valor).trim() !== ""
                    )
                )
                .map(fila => ({
                    materia: String(
                        fila[indiceMateria]
                    ).trim(),

                    rda: Number(
                        fila[indiceRda]
                    ),

                    criterio: Number(
                        fila[indiceCriterio]
                    ) || 1,

                    tema: String(
                        fila[indiceTema]
                    ).trim(),

                    nota: Number(
                        fila[indiceNota]
                    ) || 0,

                    estado: normalizarTexto(
                        fila[indiceEstado]
                    ) || "pendiente",

                    fechaLimite: indiceFechaLimite !== -1
                        ? convertirFechaExcel(
                            fila[indiceFechaLimite]
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
            actualizarTablasRegistro();

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


// Configura los escuchadores de eventos al cargar la página por completo
document.addEventListener("DOMContentLoaded", function () {
    cargarActividadesGuardadas();
    verificarActividadesVencidas();
    mostrarActividades();

    if (typeof mostrarTablaPromedios === "function") {
        mostrarTablaPromedios();
    }

    actualizarMateriasSimulador();

    const modal = document.getElementById("modal-mensaje");
    const botonAceptar = document.getElementById("modal-aceptar");

    if (modal && botonAceptar) {
        botonAceptar.addEventListener("click", function () {
            modal.style.display = "none";
        });

        modal.addEventListener("click", function (evento) {
            if (evento.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    const selectFiltroMateria = document.getElementById("modal-select-materia");

    if (selectFiltroMateria) {
        selectFiltroMateria.addEventListener("change", function (e) {
            const materiaSeleccionada = e.target.value;
            mostrarHistorialAcademicoCompleto(materiaSeleccionada);
        });
    }

    const botonVerHistorial = document.getElementById("btn-ver-historial-completo");
    const modalHistorial = document.getElementById("modal-historial-academico");
    const botonCerrarHistorial = document.getElementById("btn-cerrar-historial");

    if (botonVerHistorial && modalHistorial) {
        botonVerHistorial.addEventListener("click", function () {
            const filtroActual = selectFiltroMateria ? selectFiltroMateria.value : null;
            mostrarHistorialAcademicoCompleto(filtroActual);
        });
    }

    if (botonCerrarHistorial && modalHistorial) {
        botonCerrarHistorial.addEventListener("click", function () {
            modalHistorial.style.display = "none";
        });
    }
});

const botonRegistrar = document.getElementById("btn-registrar");
if (botonRegistrar) {
    botonRegistrar.addEventListener("click", function () {
        if (actividadSeleccionada !== null) {
            mostrarMensaje("Tienes una actividad seleccionada. Usa Actualizar actividad para modificarla.");
            return;
        }
        registrarActividad();
    });
}

const botonActualizar = document.getElementById("btn-actualizar");
if (botonActualizar) {
    botonActualizar.addEventListener("click", function () {
        actualizarActividadSeleccionada();
    });
}

const botonExportar = document.getElementById("btn-exportar-excel");
if (botonExportar) {
    botonExportar.addEventListener("click", function () {
        guardarExcel();
    });
}