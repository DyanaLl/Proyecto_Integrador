let detallesAlertasActuales = [];

/** Evalúa el semáforo académico según tareas y promedios. */
function evaluarSemaforoAcademico() {
    const luzRoja = document.getElementById("luz-roja");
    const luzAmarilla = document.getElementById("luz-amarilla");
    const luzVerde = document.getElementById("luz-verde");
    const badgeContador = document.getElementById("badge-contador-alertas");
    const mensajeSemaforo = document.getElementById("mensaje-semaforo");
    const estadoSemaforo = document.getElementById("estado-semaforo");

    if (!luzRoja || !luzAmarilla || !luzVerde) return;
    if (typeof actividades === "undefined" || !Array.isArray(actividades)) return;

    // Resetear luces (apagadas por defecto)
    luzRoja.style.backgroundColor = "#555";
    luzRoja.style.boxShadow = "none";
    luzAmarilla.style.backgroundColor = "#555";
    luzAmarilla.style.boxShadow = "none";
    luzVerde.style.backgroundColor = "#555";
    luzVerde.style.boxShadow = "none";

    const alertasSet = new Set();
    const ahora = new Date();

    let hayRojo = false;
    let hayAmarillo = false;

    // Evaluar Condiciones Individuales de Tareas (Fechas y Vencimientos)
    actividades.forEach(actividad => {
        const estadoNorm = String(actividad.estado || "").toLowerCase().trim();
        const nombreActividad = actividad.tema || actividad.nombre || 'Sin nombre';
        const infoMateria = `${actividad.materia} (RDA ${actividad.rda || 'N/A'})`;

        if (actividad.fechaLimite) {
            let horaLimpia = "23:59:59";
            if (actividad.hora) {
                horaLimpia = String(actividad.hora).replace(/[^0-9:]/g, "").padEnd(5, "0") + ":00";
            } else if (String(actividad.fechaLimite).includes("a las")) {
                const partes = actividad.fechaLimite.split(/a\s+las/i);
                actividad.fechaLimite = partes[0].trim();
                if (partes[1]) {
                    horaLimpia = partes[1].trim().padEnd(5, "0") + ":00";
                }
            }

            const fechaHoraStr = `${actividad.fechaLimite}T${horaLimpia}`;
            const fechaLimiteObj = new Date(fechaHoraStr);
            const diferenciaHoras = (fechaLimiteObj - ahora) / (1000 * 60 * 60);

            if (diferenciaHoras < 0 || estadoNorm === "vencida") {
                hayRojo = true;
                alertasSet.add(`🔴 Tarea vencida: "${nombreActividad}" (${infoMateria}). Ya pasó su tiempo límite.`);
            } else if (diferenciaHoras >= 0 && diferenciaHoras <= 24) {
                hayRojo = true;
                alertasSet.add(`🔴 Tarea extremadamente urgente (<24h): "${nombreActividad}" (${infoMateria}). ¡Menos de un día para entregarla!`);
            } else if (diferenciaHoras > 24 && diferenciaHoras <= 48) {
                hayAmarillo = true;
                alertasSet.add(`🟡 Tarea próxima a vencer (1-2 días): "${nombreActividad}" (${infoMateria}). Aún tienes tiempo de presentarla.`);
            }
        }
    });

    // Evaluar Impacto y Promedios Reales por Materia y sus RDA agrupados
    const materiasUnicas = [...new Set(actividades.map(a => a.materia).filter(Boolean))];

    materiasUnicas.forEach(materia => {
        const rdasDeMateria = [...new Set(actividades.filter(a => a.materia === materia).map(a => Number(a.rda)).filter(Boolean))];

        let rdasMenoresA60 = 0;
        let rdasEntre60y70 = 0;

        rdasDeMateria.forEach(numeroRda => {
            let promedioOficialRDA = 0;
            if (typeof calcularPromedioRDA === "function") {
                promedioOficialRDA = calcularPromedioRDA(materia, numeroRda);
            }

            const actsRda = actividades.filter(a => a.materia === materia && Number(a.rda) === numeroRda);
            const tieneNotas = actsRda.some(a => a.nota !== undefined && a.nota !== "" && !isNaN(a.nota));

            if (tieneNotas) {
                if (promedioOficialRDA > 0 && promedioOficialRDA < 60) {
                    rdasMenoresA60++;
                } else if (promedioOficialRDA >= 60 && promedioOficialRDA < 70) {
                    rdasEntre60y70++;
                }
            }
        });

        const claveMateria = `Materia: ${materia}`;

        if (rdasMenoresA60 > 0) {
            hayRojo = true;
            alertasSet.add(`🔴 Alerta Crítica en ${claveMateria}: Tienes ${rdasMenoresA60} RDA(s) con promedio menor a 60% (Ruta Académica).`);
        }

        if (rdasEntre60y70 >= 2) {
            hayRojo = true;
            alertasSet.add(`🔴 Pérdida de Materia en ${claveMateria}: Tienes ${rdasEntre60y70} RDA(s) en el rango de precaución (60% - 70%). ¡Has perdido la materia!`);
        } else if (rdasEntre60y70 === 1 && rdasMenoresA60 === 0) {
            hayAmarillo = true;
            alertasSet.add(`🟡 Precaución en ${claveMateria}: Tienes 1 RDA en el rango de 60% - 70%. Mantente alerta.`);
        }
    });

    detallesAlertasActuales = Array.from(alertasSet);

    // Encender Luces del Semáforo y actualizar mensajes
    if (hayRojo) {
        luzRoja.style.backgroundColor = "#ef4444";
        luzRoja.style.boxShadow = "0 0 10px #ef4444";
    }

    if (hayAmarillo) {
        luzAmarilla.style.backgroundColor = "#f59e0b";
        luzAmarilla.style.boxShadow = "0 0 10px #f59e0b";
    }

    if (!hayRojo && !hayAmarillo) {
        luzVerde.style.backgroundColor = "#22c55e";
        luzVerde.style.boxShadow = "0 0 10px #22c55e";
        estadoSemaforo.textContent = "Estado Óptimo (Todo en orden)";
        mensajeSemaforo.textContent = "¡Respira en paz! Todo se encuentra al día y con excelentes calificaciones.";
        detallesAlertasActuales.push("🟢 ¡Excelente trabajo! Todas tus actividades están al día y tus promedios por RDA son favorables.");
    } else if (hayRojo && hayAmarillo) {
        estadoSemaforo.textContent = "Atención: Alertas Críticas y de Precaución";
        mensajeSemaforo.textContent = "Tienes tareas vencidas, RDA en ruta crítica o pérdida de materias (rojas), además de avisos de precaución (amarillas).";
    } else if (hayRojo) {
        estadoSemaforo.textContent = "Estado Crítico (Alerta Roja)";
        mensajeSemaforo.textContent = "Existen tareas vencidas, entregas urgentes o materias en riesgo crítico / pérdida.";
    } else if (hayAmarillo) {
        estadoSemaforo.textContent = "Estado de Precaución (Alerta Amarilla)";
        mensajeSemaforo.textContent = "Tienes tareas próximas a vencer o un RDA en rango de precaución (60% - 70%).";
    }

    if (badgeContador) {
        badgeContador.textContent = detallesAlertasActuales.length;
    }
}
