/**
 * Área de David: Lógica del Semáforo Académico
 * En proceso de desarrollo...
 */
export function evaluarSemaforo(nota) {
    // 1. Apagar primero las luces
        quitarLucesActivas();

    // 2. Lógica basica
    if (nota >= 7.0 && nota <= 10.0) {
        activarLuz("verde");
        return "Promedio Aprobado: Verde";

    } else if (nota >= 5.0 && nota < 7.0) {
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