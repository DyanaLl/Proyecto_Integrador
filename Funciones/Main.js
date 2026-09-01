/**
 * =========================================================================
 * ARCHIVO PRINCIPAL DE CONTROL (Main.js)
 * Sistema de Notas Académicas - Módulo del Simulador y Control Global - Semáforo
 * =========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("Sistema de Notas Académicas inicializado correctamente.");

    // 1. Inicialización de módulos globales
    inicializarSimulador();
    vincularEventosSimulador();
    evaluarSemaforoAcademicoGlobal();

    // 2. Vinculación de eventos de la interfaz principal (Registro, Navegación y Excel)
    vincularEventosInterfazPrincipal();
    configurarBotonMasGlobal();
    
    // 3. Activación del menú retráctil (botón de las tres líneas)
    configurarBotonMenuToggle();
});

/**
 * Configura el comportamiento de minimizar/expandir la barra lateral con el botón de las tres líneas.
 */
function configurarBotonMenuToggle() {
    const btnToggle = document.getElementById("btn-toggle-sidebar");
    const sidebar = document.querySelector(".sidebar");

    if (btnToggle && sidebar) {
        btnToggle.addEventListener("click", (e) => {
            e.preventDefault();
            sidebar.classList.toggle("collapsed");
        });
    }
}

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

    const btnAbrirSimuladorSidebar = document.getElementById("nav-simulador");
    const btnAbrirSimuladorCard = document.getElementById("btn-abrir-simulador");
    const modalSimulador = document.getElementById("modal-simulador");

    const abrirSimuladorHandler = (e) => {
        e.preventDefault();
        alternarVistaSimulador(true);
        if (typeof cambiarModo === "function") {
            cambiarModo();
        }
    };

    if (btnAbrirSimuladorSidebar && modalSimulador) {
        btnAbrirSimuladorSidebar.addEventListener("click", abrirSimuladorHandler);
    }

    if (btnAbrirSimuladorCard && modalSimulador) {
        btnAbrirSimuladorCard.addEventListener("click", abrirSimuladorHandler);
    }
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
 * Vincula acciones generales del panel principal (importación de Excel, botón de inicio y registro).
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

    const btnHome = document.getElementById("nav-inicio");
    if (btnHome) {
        btnHome.addEventListener("click", (e) => {
            e.preventDefault();
            restaurarVistaDashboard();
        });
    }

    const btnRegistroSidebar = document.getElementById("nav-registro");
    if (btnRegistroSidebar) {
        btnRegistroSidebar.addEventListener("click", (e) => {
            e.preventDefault();
            alternarVistaRegistroPrincipal(true);
        });
    }

    // Redirige al ítem 5 (Estadísticas / Promedios) al hacer clic en las celdas de notas
    const celdasPromedioNotas = document.querySelectorAll(".tabla-promedios td a, .tabla-promedios span, #tabla-promedios td");
    
    celdasPromedioNotas.forEach(elemento => {
        elemento.addEventListener("click", (e) => {
            e.preventDefault();
            alternarVistaPromedios(true);
            
            document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
            const navPromediosBtn = document.getElementById("nav-promedios");
            if (navPromediosBtn) {
                navPromediosBtn.classList.add("activo");
            }
        });
    });

    const btnHistorialSidebar = document.getElementById("nav-historial");
    if (btnHistorialSidebar) {
        btnHistorialSidebar.addEventListener("click", (e) => {
            e.preventDefault();
            alternarVistaHistorialCompleto(true);
        });
    }

    const btnVerHistorialDashboard = document.getElementById("btn-ver-historial-completo");
    if (btnVerHistorialDashboard) {
        btnVerHistorialDashboard.addEventListener("click", (e) => {
            e.preventDefault();
            alternarVistaHistorialCompleto(true);
        });
    }

    const btnPromediosSidebar = document.getElementById("nav-promedios");
    if (btnPromediosSidebar) {
        btnPromediosSidebar.addEventListener("click", (e) => {
            e.preventDefault();
            alternarVistaPromedios(true);
        });
    }
}

/**
 * Configuración unificada de los botones de registro y navegación auxiliar.
 */
function configurarBotonMasGlobal() {
    const botonesMas = document.querySelectorAll("#btn-mostrar-registro, #nav-registro");
    const btnInicio = document.getElementById("nav-inicio");
    const btnNavHistorial = document.getElementById("nav-historial");

    botonesMas.forEach(boton => {
        boton.addEventListener("click", (e) => {
            if (e) e.preventDefault();

            if (typeof limpiarFormulario === 'function') {
                limpiarFormulario();
            }
            if (typeof actividadSeleccionada !== 'undefined') {
                actividadSeleccionada = null;
            }

            alternarVistaRegistroPrincipal(true);
        });
    });

    if (btnInicio) {
        btnInicio.addEventListener("click", (e) => {
            if (e) e.preventDefault();
            restaurarVistaDashboard();
        });
    }

    if (btnNavHistorial) {
        btnNavHistorial.addEventListener("click", function (e) {
            e.preventDefault();
            if (typeof mostrarHistorialAcademicoCompleto === "function") {
                mostrarHistorialAcademicoCompleto();
            }
        });
    }
}

/**
 * Restaura la vista inicial del Dashboard ocultando todas las pantallas secundarias y activando la casita.
 */
function restaurarVistaDashboard() {
    alternarVistaRegistroPrincipal(false);
    alternarVistaHistorialCompleto(false);
    alternarVistaSimulador(false);
    alternarVistaPromedios(false);

    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
    const btnInicio = document.getElementById("nav-inicio");
    if (btnInicio) btnInicio.classList.add("activo");
}

/**
 * Alterna dinámicamente la vista entre el Dashboard principal y la pantalla completa de Registro.
 */
function alternarVistaRegistroPrincipal(mostrarRegistro) {
    const modalRegistro = document.getElementById("modal-registro");
    const modalHistorialCompleto = document.getElementById("modal-historial-academico");
    const modalSimulador = document.getElementById("modal-simulador");
    const modalEstadisticas = document.getElementById("modal-estadisticas");
    const dashboardColumnas = document.querySelector(".dashboard-columnas");
    const seccionEncabezado = document.getElementById("seccion-encabezado");

    if (mostrarRegistro) {
        if (modalHistorialCompleto) { modalHistorialCompleto.style.display = "none"; modalHistorialCompleto.classList.add("oculto-inicial"); }
        if (modalSimulador) { modalSimulador.style.display = "none"; modalSimulador.classList.add("oculto-inicial"); }
        if (modalEstadisticas) { modalEstadisticas.style.display = "none"; modalEstadisticas.classList.add("oculto-inicial"); }

        if (seccionEncabezado) seccionEncabezado.classList.add("oculto-inicial");
        if (dashboardColumnas) dashboardColumnas.style.display = "none";

        if (modalRegistro) {
            modalRegistro.classList.remove("oculto-inicial");
            modalRegistro.style.display = "block";
            modalRegistro.style.position = "relative";
            modalRegistro.style.width = "100%";
            modalRegistro.style.marginTop = "0";
        }

        document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
        const navRegistroBtn = document.getElementById("nav-registro");
        if (navRegistroBtn) navRegistroBtn.classList.add("activo");

    } else {
        if (modalRegistro) {
            modalRegistro.style.display = "none";
            modalRegistro.classList.add("oculto-inicial");
        }
        if (
            modalHistorialCompleto && modalHistorialCompleto.classList.contains("oculto-inicial") &&
            modalSimulador && modalSimulador.classList.contains("oculto-inicial") &&
            modalEstadisticas && modalEstadisticas.classList.contains("oculto-inicial")
        ) {
            if (seccionEncabezado) seccionEncabezado.classList.remove("oculto-inicial");
            if (dashboardColumnas) dashboardColumnas.style.display = "flex";
        }
    }
}

/**
 * Alterna dinámicamente la vista entre el Dashboard principal y la pantalla completa del Historial Académico.
 */
function alternarVistaHistorialCompleto(mostrarHistorial) {
    const modalHistorialCompleto = document.getElementById("modal-historial-academico");
    const modalRegistro = document.getElementById("modal-registro");
    const modalSimulador = document.getElementById("modal-simulador");
    const modalEstadisticas = document.getElementById("modal-estadisticas");
    const dashboardColumnas = document.querySelector(".dashboard-columnas");
    const seccionEncabezado = document.getElementById("seccion-encabezado");

    if (mostrarHistorial) {
        if (modalRegistro) { modalRegistro.style.display = "none"; modalRegistro.classList.add("oculto-inicial"); }
        if (modalSimulador) { modalSimulador.style.display = "none"; modalSimulador.classList.add("oculto-inicial"); }
        if (modalEstadisticas) { modalEstadisticas.style.display = "none"; modalEstadisticas.classList.add("oculto-inicial"); }

        if (seccionEncabezado) seccionEncabezado.classList.add("oculto-inicial");
        if (dashboardColumnas) dashboardColumnas.style.display = "none";

        if (modalHistorialCompleto) {
            modalHistorialCompleto.classList.remove("oculto-inicial");
            modalHistorialCompleto.style.display = "block";
            modalHistorialCompleto.style.position = "relative";
            modalHistorialCompleto.style.width = "100%";
            modalHistorialCompleto.style.marginTop = "0";
        }

        document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
        const navHistorialBtn = document.getElementById("nav-historial");
        if (navHistorialBtn) navHistorialBtn.classList.add("activo");

    } else {
        if (modalHistorialCompleto) {
            modalHistorialCompleto.style.display = "none";
            modalHistorialCompleto.classList.add("oculto-inicial");
        }
        if (
            modalRegistro && modalRegistro.classList.contains("oculto-inicial") &&
            modalSimulador && modalSimulador.classList.contains("oculto-inicial") &&
            modalEstadisticas && modalEstadisticas.classList.contains("oculto-inicial")
        ) {
            if (seccionEncabezado) seccionEncabezado.classList.remove("oculto-inicial");
            if (dashboardColumnas) dashboardColumnas.style.display = "flex";
        }
    }
}

/**
 * Alterna dinámicamente la vista entre el Dashboard principal y la pantalla completa del Simulador.
 */
function alternarVistaSimulador(mostrarSimulador) {
    const modalSimulador = document.getElementById("modal-simulador");
    const modalRegistro = document.getElementById("modal-registro");
    const modalHistorialCompleto = document.getElementById("modal-historial-academico");
    const modalEstadisticas = document.getElementById("modal-estadisticas");
    const dashboardColumnas = document.querySelector(".dashboard-columnas");
    const seccionEncabezado = document.getElementById("seccion-encabezado");

    if (mostrarSimulador) {
        if (modalRegistro) { modalRegistro.style.display = "none"; modalRegistro.classList.add("oculto-inicial"); }
        if (modalHistorialCompleto) { modalHistorialCompleto.style.display = "none"; modalHistorialCompleto.classList.add("oculto-inicial"); }
        if (modalEstadisticas) { modalEstadisticas.style.display = "none"; modalEstadisticas.classList.add("oculto-inicial"); }

        if (seccionEncabezado) seccionEncabezado.classList.add("oculto-inicial");
        if (dashboardColumnas) dashboardColumnas.style.display = "none";

        if (modalSimulador) {
            modalSimulador.classList.remove("oculto-inicial");
            modalSimulador.style.display = "block";
            modalSimulador.style.position = "relative";
            modalSimulador.style.width = "100%";
            modalSimulador.style.marginTop = "0";
        }

        document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
        const btnSimuladorSidebar = document.getElementById("nav-simulador");
        if (btnSimuladorSidebar) btnSimuladorSidebar.classList.add("activo");

    } else {
        if (modalSimulador) {
            modalSimulador.style.display = "none";
            modalSimulador.classList.add("oculto-inicial");
        }
        if (
            modalRegistro && modalRegistro.classList.contains("oculto-inicial") &&
            modalHistorialCompleto && modalHistorialCompleto.classList.contains("oculto-inicial") &&
            modalEstadisticas && modalEstadisticas.classList.contains("oculto-inicial")
        ) {
            if (seccionEncabezado) seccionEncabezado.classList.remove("oculto-inicial");
            if (dashboardColumnas) dashboardColumnas.style.display = "flex";
        }
    }
}

/**
 * Alterna dinámicamente la vista hacia el módulo de Promedios y Estadísticas.
 */
function alternarVistaPromedios(mostrarPromedios) {
    const modalEstadisticas = document.getElementById("modal-estadisticas");
    const modalRegistro = document.getElementById("modal-registro");
    const modalHistorialCompleto = document.getElementById("modal-historial-academico");
    const modalSimulador = document.getElementById("modal-simulador");
    const dashboardColumnas = document.querySelector(".dashboard-columnas");
    const seccionEncabezado = document.getElementById("seccion-encabezado");

    if (mostrarPromedios) {
        if (modalRegistro) { modalRegistro.style.display = "none"; modalRegistro.classList.add("oculto-inicial"); }
        if (modalHistorialCompleto) { modalHistorialCompleto.style.display = "none"; modalHistorialCompleto.classList.add("oculto-inicial"); }
        if (modalSimulador) { modalSimulador.style.display = "none"; modalSimulador.classList.add("oculto-inicial"); }

        if (seccionEncabezado) seccionEncabezado.classList.add("oculto-inicial");
        if (dashboardColumnas) dashboardColumnas.style.display = "none";

        if (modalEstadisticas) {
            modalEstadisticas.classList.remove("oculto-inicial");
            modalEstadisticas.style.display = "block";
            modalEstadisticas.style.position = "relative";
            modalEstadisticas.style.width = "100%";
            modalEstadisticas.style.marginTop = "0";
        }

        document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
        const navPromedios = document.getElementById("nav-promedios");
        if (navPromedios) navPromedios.classList.add("activo");

    } else {
        if (modalEstadisticas) {
            modalEstadisticas.style.display = "none";
            modalEstadisticas.classList.add("oculto-inicial");
        }
        if (
            modalRegistro && modalRegistro.classList.contains("oculto-inicial") &&
            modalHistorialCompleto && modalHistorialCompleto.classList.contains("oculto-inicial") &&
            modalSimulador && modalSimulador.classList.contains("oculto-inicial")
        ) {
            if (seccionEncabezado) seccionEncabezado.classList.remove("oculto-inicial");
            if (dashboardColumnas) dashboardColumnas.style.display = "flex";
        }
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
