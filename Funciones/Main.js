//Semáforo

/**
 * ============================================================================
 * ARCHIVO PRINCIPAL DE CONTROL (Main.js)
 * Sistema de Notas Académicas - Módulo del Simulador y Control Global
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Sistema de Notas Académicas inicializado correctamente.");

    // 1. Inicializar la visibilidad y estados del simulador al cargar la página
    inicializarSimulador();

    // 2. Vincular todos los eventos de interacción del simulador
    vincularEventosSimulador();
});

/**
 * Configura el estado inicial del simulador llamando a las funciones base.
 */
function inicializarSimulador() {
    if (typeof cambiarModo === "function") {
        cambiarModo();
    } else {
        console.warn("La función 'cambiarModo' no está definida en Simulator.js.");
    }
}

/**
 * Conecta los event listeners necesarios para que el simulador responda 
 * con precisión a cada clic y cambio de opción del usuario.
 */
function vincularEventosSimulador() {
    // A) Evento para el botón principal de cálculo ("Calcular Resultado")
    const btnCalcular = document.getElementById("btn-calcular");
    if (btnCalcular) {
        btnCalcular.addEventListener("click", (evento) => {
            evento.preventDefault(); // Previene recargas si estuviera dentro de un formulario

            if (typeof ejecutarCalculo === "function") {
                ejecutarCalculo();
            } else {
                console.error("Error crítico: La función 'ejecutarCalculo' no está disponible en Simulator.js.");
                mostrarMensajeError("No se pudo ejecutar el cálculo. Verifique los scripts.");
            }
        });
    } else {
        console.warn("No se encontró el elemento con ID 'btn-calcular' en el DOM.");
    }

    // B) Evento para cambiar entre Modo A y Modo B
    const selectModo = document.getElementById("select-modo");
    if (selectModo) {
        selectModo.addEventListener("change", () => {
            if (typeof cambiarModo === "function") {
                cambiarModo();
            }
        });
    }

    // C) Eventos para actualizar dinámicamente las actividades pendientes en el Modo A
    const selectsModoA = ['select-materia-a', 'select-rda-a', 'select-criterio-a'];
    selectsModoA.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener("change", () => {
                if (typeof actualizarActividadesPendientesSimulador === "function") {
                    actualizarActividadesPendientesSimulador();
                }
            });
        }
    });

    // D) Control de apertura y cierre de la ventana modal del simulador
    const btnAbrirSimulador = document.getElementById("btn-abrir-simulador");
    const modalSimulador = document.getElementById("modal-simulador");
    const btnCerrarSimulador = document.getElementById("btn-cerrar-simulador");

    if (btnAbrirSimulador && modalSimulador) {
        btnAbrirSimulador.addEventListener("click", () => {
            modalSimulador.style.display = "flex";
            if (typeof cambiarModo === "function") {
                cambiarModo();
            }
        });
    }

    if (btnCerrarSimulador && modalSimulador) {
        btnCerrarSimulador.addEventListener("click", () => {
            modalSimulador.style.display = "none";
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === modalSimulador) {
            modalSimulador.style.display = "none";
        }
    });
}

/**
 * Función auxiliar para mostrar errores de forma visual en la caja de resultados del simulador.
 */
function mostrarMensajeError(mensaje) {
    const textoResultado = document.getElementById("texto-resultado");
    if (textoResultado) {
        textoResultado.innerText = mensaje;
    }
}
