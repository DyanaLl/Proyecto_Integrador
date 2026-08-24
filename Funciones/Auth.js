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

//Paso 2: Lógica de Registro
const formRegistro = document.getElementById("form-registro");
if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();

        let nombre = document.getElementById("reg-nombre").value;
        let apellido = document.getElementById("reg-apellido").value;
        let usuario = document.getElementById("reg-usuario").value;
        let correo = document.getElementById("reg-correo").value;
        let password = document.getElementById("reg-password").value;

        // Simulamos la matriz de usuarios recuperando el historial
        let historialUsuarios = JSON.parse(localStorage.getItem("matrizUsuarios")) || [];

        // Validar si ya existe el usuario en la matriz
        let existe = historialUsuarios.some(u => u.usuario === usuario);
        if (existe) {
            alert("Este usuario ya está registrado en el sistema.");
            return;
        }

        // Agregamos la nueva "fila" a nuestra matriz
        historialUsuarios.push({
            nombre: nombre,
            apellido: apellido,
            usuario: usuario,
            correo: correo,
            password: password
        });

        // Guardamos la matriz actualizada
        localStorage.setItem("matrizUsuarios", JSON.stringify(historialUsuarios));

        alert("¡Registro guardado con éxito en el historial!");
        formRegistro.reset();
        
        // Cambiar a la vista de login automáticamente
        document.getElementById("seccion-registro").style.display = "none";
        document.getElementById("seccion-login").style.display = "block";
    });
}

// Paso 3: Validación de Login
const formLogin = document.getElementById("form-login");
if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        let usuarioIngresado = document.getElementById("log-usuario").value;
        let passwordIngresado = document.getElementById("log-password").value;

        // Cargamos la matriz de usuarios
        let historialUsuarios = JSON.parse(localStorage.getItem("matrizUsuarios")) || [];

        // Buscamos coincidencia en la matriz
        let usuarioValido = historialUsuarios.find(u => u.usuario === usuarioIngresado && u.password === passwordIngresado);

        if (usuarioValido) {
            alert(`¡Acceso concedido! Bienvenido, ${usuarioValido.nombre}`);
            // Redirige al dashboard principal del semáforo
            window.location.href = "index.html";
        } else {
            alert("Error: Usuario o contraseña incorrectos.");
        }
    });
}