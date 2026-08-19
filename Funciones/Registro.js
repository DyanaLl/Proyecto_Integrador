let actividadSeleccionada = null;

function normalizarTexto(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function registrarActividad() {
    const materia = document.getElementById("materia").value.trim();
    const criterio = Number(document.getElementById("criterio").value);
    const tema = document.getElementById("tema").value.trim();
    const notaTexto = document.getElementById("nota").value.trim();
    const nota = notaTexto === "" ? 0 : Number(notaTexto);
    const estado = normalizarTexto(document.getElementById("estado").value);

    if (!materia) {
        alert("Selecciona una materia.");
        return false;
    }

    if (!tema) {
        alert("Escribe el tema o actividad.");
        return false;
    }

    if (isNaN(nota) || nota < 0 || nota > 50) {
        alert("La nota debe estar entre 0 y 50.");
        return false;
    }

    actividades.push({
        materia: materia,
        criterio: criterio,
        tema: tema,
        nota: nota,
        estado: estado
    });

    localStorage.setItem("actividades", JSON.stringify(actividades));
    limpiarFormulario();
    mostrarActividades();

    return true;
}

function seleccionarActividad(indice) {
    const actividad = actividades[indice];

    if (!actividad) {
        return;
    }

    actividadSeleccionada = indice;

    document.getElementById("materia").value = actividad.materia;
    document.getElementById("criterio").value = String(actividad.criterio);
    document.getElementById("tema").value = actividad.tema;
    document.getElementById("nota").value = actividad.nota;
    document.getElementById("estado").value = normalizarTexto(actividad.estado);

    const formulario = document.getElementById("formulario-registro");
    const boton = document.getElementById("btn-mostrar-registro");

    if (formulario) {
        formulario.style.display = "block";
    }

    if (boton) {
        boton.textContent = "−";
    }

    alert("Actividad seleccionada. Ahora puedes cambiar su estado y presionar Actualizar.");
}

function actualizarActividadSeleccionada() {
    if (actividadSeleccionada === null) {
        alert("Selecciona primero una actividad de la tabla.");
        return;
    }

    const actividad = actividades[actividadSeleccionada];

    if (!actividad) {
        actividadSeleccionada = null;
        return;
    }

    const materia = document.getElementById("materia").value.trim();
    const criterio = Number(document.getElementById("criterio").value);
    const tema = document.getElementById("tema").value.trim();
    const notaTexto = document.getElementById("nota").value.trim();
    const nota = notaTexto === "" ? 0 : Number(notaTexto);
    const estado = normalizarTexto(document.getElementById("estado").value);

    if (!materia || !tema) {
        alert("Completa la materia y el tema o actividad.");
        return;
    }

    if (isNaN(nota) || nota < 0 || nota > 50) {
        alert("La nota debe estar entre 0 y 50.");
        return;
    }

    actividad.materia = materia;
    actividad.criterio = criterio;
    actividad.tema = tema;
    actividad.nota = nota;
    actividad.estado = estado;

    localStorage.setItem("actividades", JSON.stringify(actividades));

    mostrarActividades();
    limpiarFormulario();
    actividadSeleccionada = null;

    alert("Actividad actualizada correctamente.");
}

function limpiarFormulario() {
    document.getElementById("materia").value = "";
    document.getElementById("criterio").value = "1";
    document.getElementById("tema").value = "";
    document.getElementById("nota").value = "";
    document.getElementById("estado").value = "pendiente";
}

function mostrarActividades() {
    const tabla = document.getElementById("tabla-actividades-body");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    const actividadesPendientes = actividades
        .map((actividad, indice) => ({ actividad, indice }))
        .filter(item => normalizarTexto(item.actividad.estado) === "pendiente");

    if (actividadesPendientes.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No hay actividades pendientes.
                </td>
            </tr>
        `;
        return;
    }

    actividadesPendientes.forEach(item => {
        const fila = document.createElement("tr");
        fila.style.cursor = "pointer";
        fila.title = "Haz clic para editar esta actividad";

        fila.innerHTML = `
            <td>${item.actividad.materia}</td>
            <td>${item.actividad.criterio}</td>
            <td>${item.actividad.tema}</td>
            <td>${item.actividad.nota}</td>
            <td>${item.actividad.estado}</td>
        `;

        fila.addEventListener("click", function() {
            seleccionarActividad(item.indice);
        });

        tabla.appendChild(fila);
    });
}

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
        console.error("Error al cargar actividades:", error);
    }
}

function guardarExcel() {
    if (actividades.length === 0) {
        alert("No existen actividades para guardar.");
        return;
    }

    const libro = XLSX.utils.book_new();

    const datosExcel = [
        ["Materia", "Criterio", "Tema", "Nota", "Estado"]
    ];

    actividades.forEach(actividad => {
        datosExcel.push([
            actividad.materia,
            actividad.criterio,
            actividad.tema,
            actividad.nota,
            actividad.estado
        ]);
    });

    const hoja = XLSX.utils.aoa_to_sheet(datosExcel);

    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Actividades"
    );

    XLSX.writeFile(
        libro,
        "Actividades_Academicas.xlsx"
    );

    alert("Archivo Excel guardado correctamente.");
}

function leerExcel(evento) {
    const archivo = evento.target.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function(e) {
        try {
            const datos = new Uint8Array(e.target.result);
            const libro = XLSX.read(datos, { type: "array" });
            const hoja = libro.Sheets[libro.SheetNames[0]];

            const filas = XLSX.utils.sheet_to_json(
                hoja,
                {
                    header: 1,
                    defval: ""
                }
            );

            if (filas.length < 2) {
                alert("El archivo Excel no contiene actividades.");
                return;
            }

            const encabezados = filas[0].map(normalizarTexto);

            const indiceMateria = encabezados.indexOf("materia");
            const indiceCriterio = encabezados.indexOf("criterio");
            let indiceTema = encabezados.indexOf("tema");

            if (indiceTema === -1) {
                indiceTema = encabezados.indexOf("tema o actividad");
            }

            const indiceNota = encabezados.indexOf("nota");
            const indiceEstado = encabezados.indexOf("estado");

            if (
                indiceMateria === -1 ||
                indiceCriterio === -1 ||
                indiceTema === -1 ||
                indiceNota === -1 ||
                indiceEstado === -1
            ) {
                alert("El Excel debe tener las columnas: Materia, Criterio, Tema, Nota y Estado.");
                return;
            }

            actividades = filas
                .slice(1)
                .filter(fila => fila.length > 0)
                .map(fila => ({
                    materia: String(fila[indiceMateria]).trim(),
                    criterio: Number(fila[indiceCriterio]) || 0,
                    tema: String(fila[indiceTema]).trim(),
                    nota: Number(fila[indiceNota]) || 0,
                    estado: normalizarTexto(fila[indiceEstado]) || "pendiente"
                }));

            localStorage.setItem(
                "actividades",
                JSON.stringify(actividades)
            );

            mostrarActividades();

            alert("Actividades importadas correctamente.");
        } catch (error) {
            console.error("Error al leer Excel:", error);
            alert("No se pudo leer el archivo Excel.");
        }
    };

    lector.readAsArrayBuffer(archivo);
}

function actualizarActividades() {
    localStorage.setItem(
        "actividades",
        JSON.stringify(actividades)
    );

    mostrarActividades();

    alert("Actividades actualizadas correctamente.");
}

function configurarBotonMas() {
    const boton = document.getElementById("btn-mostrar-registro");
    const formulario = document.getElementById("formulario-registro");

    if (!boton || !formulario) {
        return;
    }

    formulario.style.display = "none";

    boton.addEventListener("click", function() {
        if (
            formulario.style.display === "none" ||
            formulario.style.display === ""
        ) {
            formulario.style.display = "block";
            boton.textContent = "−";
        } else {
            formulario.style.display = "none";
            boton.textContent = "+";
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    cargarActividadesGuardadas();
    mostrarActividades();
    configurarBotonMas();

    const botonGuardar = document.getElementById("btn-guardar-excel");

    if (botonGuardar) {
        botonGuardar.addEventListener("click", function() {
            if (actividadSeleccionada !== null) {
                alert("Tienes una actividad seleccionada. Usa Actualizar para modificarla.");
                return;
            }

            const registrada = registrarActividad();

            if (registrada) {
                guardarExcel();
            }
        });
    }

    const botonActualizar = document.getElementById("btn-actualizar");

    if (botonActualizar) {
        botonActualizar.addEventListener(
            "click",
            function() {
                actualizarActividadSeleccionada();
            }
        );
    }
});