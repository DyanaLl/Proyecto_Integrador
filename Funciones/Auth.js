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
            if (seccionBienvenida) seccionBienvenida.style.display = "none";
            if (seccionRegistro) seccionRegistro.style.display = "block";
        });
    }

    if (btnIrLogin) {
        btnIrLogin.addEventListener("click", () => {
            if (seccionBienvenida) seccionBienvenida.style.display = "none";
            if (seccionLogin) seccionLogin.style.display = "block";
        });
    }

    if (volverRegistro) {
        volverRegistro.addEventListener("click", () => {
            if (seccionRegistro) seccionRegistro.style.display = "none";
            if (seccionBienvenida) seccionBienvenida.style.display = "block";
        });
    }

    if (volverLogin) {
        volverLogin.addEventListener("click", () => {
            if (seccionLogin) seccionLogin.style.display = "none";
            if (seccionBienvenida) seccionBienvenida.style.display = "block";
        });
    }

    // Lógica de Registro de Usuarios
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

            // Guardamos de forma persistente en localStorage
            localStorage.setItem("matrizUsuarios", JSON.stringify(historialUsuarios));

            alert("¡Registro guardado con éxito!");
            formRegistro.reset();

            if (seccionRegistro) seccionRegistro.style.display = "none";
            if (seccionLogin) seccionLogin.style.display = "block";
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
                // Guardar la sesión activa del usuario
                localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValido));
                
                alert(`¡Acceso concedido! Bienvenido, ${usuarioValido.nombre}`);
                window.location.href = "index.html"; // Redirige al dashboard
            } else {
                alert("Error: Usuario o contraseña incorrectos.");
            }
        });
    }
});
