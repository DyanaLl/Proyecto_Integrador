
/**
 * ============================================================================
 * ARCHIVO PRINCIPAL DE CONTROL (Main.js)
 * Sistema de Notas Académicas - Módulo del Simulador y Control Global - Semáforo
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Sistema de Notas Académicas inicializado correctamente.");

    // 1. Inicialización de módulos globales
    inicializarSimulador();
    vincularEventosSimulador();
    evaluarSemaforoAcademicoGlobal();

    // 2. Vinculación de eventos de la interfaz principal (Registro y Excel)
    vincularEventosInterfazPrincipal();
});

/**
 * Configura el estado inicial del simulador.
 */
function inicializarSimulador() {
    if (typeof cambiarModo === "function") {
        cambiarModo();
    } else {
        console.warn("La función 'cambiarModo' no está definida en Simulator.js.");
    }
}

/**
 * Conecta los event listeners necesarios para el funcionamiento del simulador.
 */
function vincularEventosSimulador() {
    const btnCalcular = document.getElementById("btn-calcular");
    if (btnCalcular) {
        btnCalcular.addEventListener("click", (evento) => {
            evento.preventDefault();
            if (typeof ejecutarCalculo === "function") {
                ejecutarCalculo();
            } else {
                console.error("Error crítico: La función 'ejecutarCalculo' no está disponible.");
                mostrarMensajeError("No se pudo ejecutar el cálculo. Verifique los scripts.");
            }
        });
    }

    const selectModo = document.getElementById("select-modo");
    if (selectModo) {
        selectModo.addEventListener("change", () => {
            if (typeof cambiarModo === "function") {
                cambiarModo();
            }
        });
    }

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
 * Evalúa y configura los elementos visuales del Semáforo Académico y sus modales.
 */
function evaluarSemaforoAcademicoGlobal() {
    if (typeof evaluarSemaforoAcademico === "function") {
        evaluarSemaforoAcademico();
    }

    const btnNotif = document.getElementById("btn-notificaciones-semaforo");
    const modalDetalle = document.getElementById("modal-detalle-semaforo");
    const btnCerrar = document.getElementById("btn-cerrar-modal-semaforo");
    const btnAceptar = document.getElementById("btn-aceptar-semaforo");
    const contenidoModal = document.getElementById("modal-semaforo-contenido");

    if (btnNotif && modalDetalle) {
        btnNotif.addEventListener("click", () => {
            if (typeof detallesAlertasActuales !== "undefined") {
                let htmlList = "<ul style='padding-left: 20px; line-height: 1.6;'>";
                detallesAlertasActuales.forEach(detalle => {
                    htmlList += `<li style="margin-bottom: 8px;">${detalle}</li>`;
                });
                htmlList += "</ul>";

                if (contenidoModal) contenidoModal.innerHTML = htmlList;
            }
            modalDetalle.style.display = "flex";
        });

        const cerrarModalFn = () => {
            modalDetalle.style.display = "none";
        };

        if (btnCerrar) btnCerrar.addEventListener("click", cerrarModalFn);
        if (btnAceptar) btnAceptar.addEventListener("click", cerrarModalFn);
    }
}

/**
 * Vincula acciones generales del panel principal (como la importación de Excel y botones de acción).
 */
function vincularEventosInterfazPrincipal() {
    const inputExcel = document.getElementById('archivo-excel');
    if (inputExcel) {
        inputExcel.addEventListener('change', (event) => {
            if (typeof leerExcel === 'function') {
                leerExcel(event);
            } else {
                console.error("La función leerExcel no está definida.");
            }
        });
    }
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
