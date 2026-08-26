/**
 * Área de David: Lógica del Semáforo Académico
 * En proceso de desarrollo...
 */
export function evaluarSemaforo(promedio, actividades) {
    // 1. Apagar primero las luces
    quitarLucesActivas();

    // Contadores para evaluar el estado
    let vencidas = actividades.filter(a => a.estado === "vencida").length;
    let pendientes = actividades.filter(a => a.estado === "pendiente").length;
    // 2. Lógica basica
    if (promedio >= 7.0 && vencidas === 0 && pendientes === 0) {
        activarLuz("verde");
        return "Promedio Aprobado: Verde";

    } else if (pendientes > 0 && vencidas === 0) {
        activarLuz("amarillo");
        return "Promedio Regular: Amarillo";

    } else {
        activarLuz("rojo");
        return "Promedio Reprobatorio: Rojo";
    }
}

function quitarLucesActivas() {
    let luces = [document.getElementById("luz-verde"), document.getElementById("luz-amarillo"), document.getElementById("luz-rojo")];
    luces.forEach(luz => { if(luz) luz.classList.remove("activa"); });
} 

function activarLuz(color) {
    let luz = document.getElementById("luz-" + color );
    if(luz) luz.classList.add("activa");
} 