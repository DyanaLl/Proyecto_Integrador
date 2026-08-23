/**
 * Módulo de Autenticación - Paso 1: Control visual de pantallas
 */
document.addEventListener("DOMContentLoaded", () => {
    const seccionBienvenida = document.getElementById("seccion-bienvenida");
    const seccionRegistro = document.getElementById("seccion-registro");
    const seccionLogin = document.getElementById("seccion-login");

    const btnIrRegistro = document.getElementById("btn-ir-registro");
    const btnIrLogin = document.getElementById("btn-ir-login");
    const volverRegistro = document.getElementById("volver-de-registro");
    const volverLogin = document.getElementById("volver-de-login");

    // Ir al formulario de registro
    if (btnIrRegistro) {
        btnIrRegistro.addEventListener("click", () => {
            seccionBienvenida.style.display = "none";
            seccionRegistro.style.display = "block";
        });
    }

    // Ir al formulario de login
    if (btnIrLogin) {
        btnIrLogin.addEventListener("click", () => {
            seccionBienvenida.style.display = "none";
            seccionLogin.style.display = "block";
        });
    }

    // Volver desde registro
    if (volverRegistro) {
        volverRegistro.addEventListener("click", () => {
            seccionRegistro.style.display = "none";
            seccionBienvenida.style.display = "block";
        });
    }

    // Volver desde login
    if (volverLogin) {
        volverLogin.addEventListener("click", () => {
            seccionLogin.style.display = "none";
            seccionBienvenida.style.display = "block";
        });
    }
});