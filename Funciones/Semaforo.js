/**
 * Área de David: Lógica del Semáforo Académico
 * En proceso de desarrollo...
 */
export function evaluarSemaforo(nota) {
    // Implementacion de validaciones y rangos
    if (isNaN(nota) || nota < 0 || nota > 10) {
        return { 
            estado: "Datos no válidos", 
            color: "gris", 
            mensaje: "Por favor, ingresa una nota valida dentro del rango." 
        };
    }

    let resultado = {};
    // 2. Lógica proposicional y evaluación de rangos
    // Verde: Aprobado / Óptimo (Notas de 7.0 a 10.0)
    if (nota >= 7.0 && nota <= 10.0) {
        resultado = {
            estado: "Óptimo (Aprobado)",
            color: "verde",
            mensaje: "¡Excelente! Estás en zona segura y con buen rendimiento académico."
        };
    } 
    // Amarillo: Advertencia / En riesgo moderado (Notas de 5.0 a 6.9)
    else if (nota >= 5.0 && nota < 7.0) {
        resultado = {
            estado: "En Advertencia",
            color: "amarillo",
            mensaje: "Tu rendimiento es regular. Estas pendiendo de un hilo, ¡esfuérzate más!"
        };
    } 
    // Rojo: Peligro / Reprobatorio (Notas menores a 5.0)
    else {
        resultado = {
            estado: "En Peligro Crítico",
            color: "rojo",
            mensaje: "¡Estás en riesgo de reprobar la materia! Consulta con tu docente urgentemente."
        };
    }
    return resultado;
}
