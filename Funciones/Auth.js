/**
 * Módulo de Autenticación y Manejo Interno de Usuarios
 */
let historialUsuarios = JSON.parse(localStorage.getItem("matrizUsuarios")) || [];

document.addEventListener("DOMContentLoaded", () => {
    const seccionBienvenida = document.getElementById("seccion-bienvenida");
    const seccionRegistro = document.getElementById("seccion-registro");
    const seccionLogin = document.getElementById("seccion-login");

    const btnIrRegistro = document.getElementById("btn-ir-registro");
    const btnIrLogin = document.getElementById("btn-ir-login");
    const volverRegistro = document.getElementById("volver-de-registro");
    const volverLogin = document.getElementById("volver-de-login");

    // Control visual de pantallas
    if (btnIrRegistro) {
        btnIrRegistro.addEventListener("click", () => {
            seccionBienvenida.style.display = "none";
            seccionRegistro.style.display = "block";
        });
    }

    if (btnIrLogin) {
        btnIrLogin.addEventListener("click", () => {
            seccionBienvenida.style.display = "none";
            seccionLogin.style.display = "block";
        });
    }

    if (volverRegistro) {
        volverRegistro.addEventListener("click", () => {
            seccionRegistro.style.display = "none";
            seccionBienvenida.style.display = "block";
        });
    }

    if (volverLogin) {
        volverLogin.addEventListener("click", () => {
            seccionLogin.style.display = "none";
            seccionBienvenida.style.display = "block";
        });
    }
});

// Lógica de Registro de Usuarios de forma interna
const formRegistro = document.getElementById("form-registro");
if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();

        let nombre = document.getElementById("reg-nombre").value.trim();
        let apellido = document.getElementById("reg-apellido").value.trim();
        let usuario = document.getElementById("reg-usuario").value.trim();
        let correo = document.getElementById("reg-correo").value.trim();
        let password = document.getElementById("reg-password").value.trim();

        // Validar si ya existe el usuario en la matriz
        let existe = historialUsuarios.some(u => u.usuario === usuario);
        if (existe) {
            alert("Este usuario ya está registrado en el sistema.");
            return;
        }

        // Agregamos la nueva fila a la matriz interna
        historialUsuarios.push({
            nombre: nombre,
            apellido: apellido,
            usuario: usuario,
            correo: correo,
            password: password
        });

        // Guardamos de forma persistente e interna en localStorage
        localStorage.setItem("matrizUsuarios", JSON.stringify(historialUsuarios));

        alert("¡Registro guardado con éxito!");
        formRegistro.reset();
        
        document.getElementById("seccion-registro").style.display = "none";
        document.getElementById("seccion-login").style.display = "block";
    });
}

// Validación de Login
const formLogin = document.getElementById("form-login");
if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        let usuarioIngresado = document.getElementById("log-usuario").value.trim();
        let passwordIngresado = document.getElementById("log-password").value.trim();

        let usuarioValido = historialUsuarios.find(u => u.usuario === usuarioIngresado && u.password === passwordIngresado);

        if (usuarioValido) {
            alert(`¡Acceso concedido! Bienvenido, ${usuarioValido.nombre}`);
            window.location.href = "index.html"; // Redirige al dashboard del semáforo
        } else {
            alert("Error: Usuario o contraseña incorrectos.");
        }
    });
}

// Funciones de manejo de archivos Excel (SheetJS & File System API)
function activarAlertaModificacion() {
    const btnGuardar = document.getElementById('btnGuardar');
    const statusMsg = document.getElementById('fileStatusMsg');
    if(btnGuardar && statusMsg) {
        btnGuardar.disabled = false;
        btnGuardar.style.background = "#10b981";
        btnGuardar.style.cursor = "pointer";
        statusMsg.textContent = "Estado: Cambios pendientes. Haz clic en 'Crear / Actualizar Archivo Excel' para guardarlos.";
        statusMsg.style.color = "#dc2626";
    }
}

function initExcelEvents() {
    const btnCargar = document.getElementById('btnCargar');
    const btnGuardar = document.getElementById('btnGuardar');

    if (btnCargar) {
        btnCargar.addEventListener('click', async () => {
            try {
                const [handle] = await window.showOpenFilePicker({
                    types: [{ description: 'Archivos Excel', accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } }]
                });
                
                fileHandle = handle;
                const file = await handle.getFile();
                const arrayBuffer = await file.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                if (workbook.Sheets["Usuarios"]) {
                    const jsonDatos = XLSX.utils.sheet_to_json(workbook.Sheets["Usuarios"], { defval: "" });
                    historialUsuarios = jsonDatos.map(row => ({
                        nombre: String(row["Nombre"] || ''),
                        apellido: String(row["Apellido"] || ''),
                        usuario: String(row["Usuario"] || ''),
                        correo: String(row["Correo"] || ''),
                        password: String(row["Contraseña"] || '')
                    }));
                    localStorage.setItem("matrizUsuarios", JSON.stringify(historialUsuarios));
                }

                document.getElementById('btnGuardar').disabled = false;
                document.getElementById('btnGuardar').style.background = "#10b981";
                document.getElementById('btnGuardar').style.cursor = "pointer";
                document.getElementById('fileStatusMsg').textContent = `Estado: Archivo cargado (${file.name}). Listo.`;
                document.getElementById('fileStatusMsg').style.color = "#10b981";
                
                alert('¡Archivo de usuarios cargado correctamente!');
            } catch (error) {
                if (error.name !== 'AbortError') console.error(error);
            }
        });
    }

    if (btnGuardar) {
        btnGuardar.addEventListener('click', async () => {
            try {
                if (!fileHandle) {
                    fileHandle = await window.showSaveFilePicker({
                        suggestedName: 'Usuarios_Sistema_Academico.xlsx',
                        types: [{ description: 'Archivos Excel', accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } }]
                    });
                }

                const wb = XLSX.utils.book_new();
                const datosUsuarios = [
                    ["Nombre", "Apellido", "Usuario", "Correo", "Contraseña"],
                    ...historialUsuarios.map(u => [u.nombre, u.apellido, u.usuario, u.correo, u.password])
                ];
                XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosUsuarios), "Usuarios");

                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const writable = await fileHandle.createWritable();
                await writable.write(excelBuffer);
                await writable.close();

                document.getElementById('fileStatusMsg').textContent = "Estado: Archivo Excel guardado y actualizado exitosamente.";
                document.getElementById('fileStatusMsg').style.color = "#10b981";
                alert('¡Los usuarios se han guardado en tu archivo Excel!');
            } catch (error) {
                if (error.name !== 'AbortError') console.error(error);
            }
        });
    }
}
