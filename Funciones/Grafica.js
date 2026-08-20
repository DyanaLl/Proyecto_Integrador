// ==========================================
// MÓDULO DE GRÁFICA ESTADÍSTICA (Grafica.js)
// ==========================================

// Función para calcular automáticamente los promedios finales por materia desde el arreglo 'actividades'
function calcularPromediosPorMateria() {
    let promediosPorMateria = {};

    // Verificar que el arreglo global 'actividades' exista
    if (typeof actividades !== 'undefined' && Array.isArray(actividades)) {
        
        // Agrupar notas por materia
        let materiasAgrupadas = {};
        actividades.forEach(act => {
            if (!materiasAgrupadas[act.materia]) {
                materiasAgrupadas[act.materia] = [];
            }
            let valorNota = parseFloat(act.nota);
            if (!isNaN(valorNota)) {
                materiasAgrupadas[act.materia].push(valorNota);
            }
        });

        // Calcular el promedio general de cada materia
        for (let materia in materiasAgrupadas) {
            let notas = materiasAgrupadas[materia];
            let suma = notas.reduce((total, num) => total + num, 0);
            // Calculamos el promedio y lo normalizamos a escala de 10 (asumiendo notas sobre 50 o 10 según tu base)
            let promedio = notas.length > 0 ? (suma / notas.length) : 0;
            
            // Guardamos el resultado redondeado a 2 decimales
            promediosPorMateria[materia] = (promedio > 10) ? (promedio / 5) : promedio; 
        }
    }

    return promediosPorMateria;
}

// Función principal para renderizar la gráfica de barras
function inicializarGraficaMaterias() {
    let datosCalculados = calcularPromediosPorMateria();
    
    let materias = Object.keys(datosCalculados);
    let promedios = Object.values(datosCalculados);

    let elementoCanvas = document.getElementById('graficaMaterias');
    if (!elementoCanvas) return;

    let contexto = elementoCanvas.getContext('2d');

    // Creación de la gráfica de barras usando Chart.js de forma sencilla
    new Chart(contexto, {
        type: 'bar',
        data: {
            labels: materias, // Nombres de las materias (Ej: Programación Web, Matemáticas, Física)
            datasets: [{
                label: 'Promedio Final',
                data: promedios, // Valores numéricos calculados
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'], // Colores limpios y visuales
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10 // Escala de calificación hasta 10
                }
            },
            onClick: (evento, elementos) => {
                // Interacción al hacer clic en una barra específica
                if (elementos.length > 0) {
                    let indiceBarra = elementos[0].index;
                    let materiaSeleccionada = materias[indiceBarra];
                    alert(`Has seleccionado la materia: ${materiaSeleccionada}. Aquí se desplegaría el desglose por criterios.`);
                    // Nota: Aquí puedes conectar la vista de detalles por criterios si deseas expandirlo luego.
                }
            }
        }
    });
}

// Ejecutar la gráfica al cargar la página
window.onload = function() {
    inicializarGraficaMaterias();
};