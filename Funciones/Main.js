// Inicializa todos los módulos principales al cargar el DOM del documento
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

// Alterna la visibilidad y el estado expandido o colapsado de la barra lateral
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


// Simulador
function inicializarSimulador() {
    if (typeof cambiarModo === "function") {
        cambiarModo();
    } else {
        console.warn("La función 'cambiarModo' no está definida en Simulator.js.");
    }
}

// Vincula los eventos de clic y cambios de selección dentro del simulador
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

// Semáforo
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

// INTERFAZ PRINCIPAL Y NAVEGACIÓN

// Vincula los eventos globales de carga de archivos Excel y accesos del menú lateral
function vincularEventosInterfazPrincipal() {
    const inputExcel = document.getElementById('archivo-excel');
    if (inputExcel) {
        inputExcel.addEventListener('change', (event) => {
            if (typeof leerExcel === 'function') {
                leerExcel(event);
            } else {
                console.error("La función leerExcel não está definida.");
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

// Configura de forma unificada los botones globales de adición, inicio y historial
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

// GESTIÓN DE VISTAS Y PANTALLAS

// Restaura la vista principal del panel ocultando los modales activos
function restaurarVistaDashboard() {
    alternarVistaRegistroPrincipal(false);
    alternarVistaHistorialCompleto(false);
    alternarVistaSimulador(false);
    alternarVistaPromedios(false);

    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("activo"));
    const btnInicio = document.getElementById("nav-inicio");
    if (btnInicio) btnInicio.classList.add("activo");
}

// Muestra u oculta la pantalla de registro principal del sistema
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

// Muestra u oculta la vista completa del historial académico general
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

// Muestra u oculta la pantalla interactiva del módulo de simulación
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

// Muestra u oculta el módulo de estadísticas y promedios académicos
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

// Imprime mensajes de error informativos en la sección de resultados del simulador
function mostrarMensajeError(mensaje) {
    const textoResultado = document.getElementById("texto-resultado");
    if (textoResultado) {
        textoResultado.innerText = mensaje;
    }
}