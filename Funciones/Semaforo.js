/**
 * Área de David: Lógica del Semáforo Académico
 */
export function evaluarSemaforo(promedioGeneral, actividadesArray) {
    quitarLucesActivas();

    let vencidas = actividadesArray.filter(a => a.estado === "vencida").length;
    let pendientes = actividadesArray.filter(a => a.estado === "pendiente").length;
    
    let txtEstado = document.getElementById("estado-semaforo");
    let txtMensaje = document.getElementById("mensaje-semaforo");

    let estadoTexto = "";
    let mensajeTexto = "";

    // Lógica del semáforo integrada con notas y pendientes/vencidas
    if (vencidas > 0 || promedioGeneral < 5.0) {
        activarLuz("roja");
        estadoTexto = "Estado Crítico (Rojo)";
        mensajeTexto = `Tienes actividades vencidas o un promedio bajo (${promedioGeneral.toFixed(2)}). ¡Atención!`;
    } else if (pendientes > 0 || (promedioGeneral >= 5.0 && promedioGeneral < 7.0)) {
        activarLuz("amarilla");
        estadoTexto = "Estado Regular / Advertencia (Amarillo)";
        mensajeTexto = `Tienes actividades pendientes o estás en rango regular (Promedio: ${promedioGeneral.toFixed(2)}).`;
    } else {
        activarLuz("verde");
        estadoTexto = "Estado Óptimo / Aprobado (Verde)";
        mensajeTexto = `¡Excelente rendimiento! Promedio general: ${promedioGeneral.toFixed(2)} sin pendientes críticas.`;
    }

    if (txtEstado) txtEstado.textContent = estadoTexto;
    if (txtMensaje) txtMensaje.textContent = mensajeTexto;
}

function quitarLucesActivas() {
    let luces = [
        document.getElementById("luz-verde"), 
        document.getElementById("luz-amarilla"), 
        document.getElementById("luz-roja")
    ];
    luces.forEach(luz => { if(luz) luz.classList.remove("activa"); });
} 

function activarLuz(color) {
    // Recibe directamente "roja", "amarilla" o "verde" y busca exactamente el ID del HTML
    let luz = document.getElementById("luz-" + color);
    if(luz) {
        luz.classList.add("activa");
    }
}

function refrescarSemaforoGeneral() {
    if (typeof actividades === 'undefined' || actividades.length === 0) return;

    let sumaTotal = 0;
    let contador = 0;

    actividades.forEach(act => {
        let notaNum = parseFloat(act.nota);
        if (!isNaN(notaNum)) {
            sumaTotal += notaNum;
            contador++;
        }
    });

    let promedioCalculado = contador > 0 ? (sumaTotal / contador) : 0;
    if (promedioCalculado > 10) {
        promedioCalculado = promedioCalculado / 5;
    }

    if (typeof evaluarSemaforo === "function") {
        evaluarSemaforo(promedioCalculado, actividades);
    }
}