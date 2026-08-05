/**
 * Área de David: Lógica del Semáforo Académico
 * En proceso de desarrollo...
 */
export function evaluarSemaforo(nota) {
    // Implementacion de validaciones y rangos
    if (isNaN(nota) || nota < 0 || nota > 10) {
        return { estado: "No válido", color: "gris", mensaje: "Error en el rango" };
    }
    return { estado: "Pendiente", color: "gris", mensaje: "" };
}


