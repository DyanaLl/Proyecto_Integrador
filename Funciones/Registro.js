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
    const nota = Number(document.getElementById("nota").value);
    const estado = document.getElementById("estado").value;

    if (!materia || !tema) {
        alert("Completa la materia y el tema o actividad.");
        return;
    }

    if (nota < 0 || nota > 50 || isNaN(nota)) {
        alert("La nota debe estar entre 0 y 50.");
        return;
    }

    actividades.push({
        materia: materia,
        criterio: criterio,
        tema: tema,
        nota: nota,
        estado: estado
    });

    localStorage.setItem("actividades", JSON.stringify(actividades));

    mostrarActividades();

    document.getElementById("materia").value = "";
    document.getElementById("tema").value = "";
    document.getElementById("nota").value = "";

    alert("Actividad registrada correctamente.");
}

function leerExcel(evento) {
    const archivo = evento.target.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function(e) {
        const datos = new Uint8Array(e.target.result);
        const libro = XLSX.read(datos, { type: "array" });
        const hoja = libro.Sheets[libro.SheetNames[0]];

        const filas = XLSX.utils.sheet_to_json(hoja, {
            header: 1,
            defval: ""
        });

        if (filas.length < 2) {
            alert("El archivo Excel no contiene actividades.");
            return;
        }

        const encabezados = filas[0].map(normalizarTexto);

        const indiceMateria = encabezados.indexOf("materia");
        const indiceCriterio = encabezados.indexOf("criterio");
        const indiceTema = encabezados.indexOf("tema");
        const indiceNota = encabezados.indexOf("nota");
        const indiceEstado = encabezados.indexOf("estado");

        if (indiceMateria === -1 || indiceCriterio === -1 || indiceTema === -1 || indiceNota === -1 || indiceEstado === -1) {
            alert("El Excel debe tener las columnas: Materia, Criterio, Tema, Nota y Estado.");
            return;
        }

        actividades = filas.slice(1)
            .filter(fila => fila.length > 0)
            .map(fila => ({
                materia: String(fila[indiceMateria]).trim(),
                criterio: Number(fila[indiceCriterio]) || 0,
                tema: String(fila[indiceTema]).trim(),
                nota: Number(fila[indiceNota]) || 0,
                estado: String(fila[indiceEstado]).trim().toLowerCase() || "pendiente"
            }));

        localStorage.setItem("actividades", JSON.stringify(actividades));

        mostrarActividades();
    };

    lector.readAsArrayBuffer(archivo);
}

function cargarActividadesGuardadas() {
    const datosGuardados = localStorage.getItem("actividades");

    if (datosGuardados) {
        actividades = JSON.parse(datosGuardados);
        mostrarActividades();
    }
}

function mostrarActividades() {
    const tabla = document.getElementById("tabla-actividades-body");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    actividades.forEach(actividad => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${actividad.materia}</td>
            <td>${actividad.criterio}</td>
            <td>${actividad.tema}</td>
            <td>${actividad.nota}</td>
            <td>${actividad.estado}</td>
        `;

        tabla.appendChild(fila);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    cargarActividadesGuardadas();
    mostrarActividades();

    const botonRegistrar = document.getElementById("btn-registrar-actividad");

    if (botonRegistrar) {
        botonRegistrar.addEventListener("click", registrarActividad);
    }

    const botonImportar = document.getElementById("btn-importar-excel");
    const archivoExcel = document.getElementById("archivo-excel");

    if (botonImportar && archivoExcel) {
        botonImportar.addEventListener("click", function() {
            if (!archivoExcel.files[0]) {
                alert("Selecciona un archivo Excel.");
                return;
            }

            leerExcel({
                target: {
                    files: archivoExcel.files
                }
            });
        });
    }
});