// ==========================================
// MÓDULO DE GRÁFICA ESTADÍSTICA (Grafica.js)
// ==========================================

let miGraficaMaterias = null;

// Función para calcular los promedios finales idénticos a la tabla de promedios
function calcularPromediosPorMateriaGrafica() {
    let promediosPorMateria = {};

    // Verificamos si existe el arreglo global 'actividades' desde calculos.js
    let listaActividades = typeof obtenerActividadesGlobales === 'function' ? obtenerActividadesGlobales() : (typeof actividades !== 'undefined' ? actividades : []);

    if (Array.isArray(listaActividades) && listaActividades.length > 0) {
        // Extraer las materias únicas registradas de forma automática tal cual lo hace promedios.js
        let materiasUnicas = [...new Set(listaActividades.map(act => act.materia))];

        materiasUnicas.forEach(materia => {
            // Obtenemos los RDA exactamente igual que en renderizarTablaPromedios()
            const rda1 = typeof calcularPromedioRDA === 'function' ? calcularPromedioRDA(materia, 1) : 0;
            const rda2 = typeof calcularPromedioRDA === 'function' ? calcularPromedioRDA(materia, 2) : 0;
            const rda3 = typeof calcularPromedioRDA === 'function' ? calcularPromedioRDA(materia, 3) : 0;

            // Calculamos el promedio final exactamente con la misma lógica de la tabla
            let activosRda = [rda1, rda2, rda3].filter(val => val > 0);
            let promedioFinal = 0;

            if (typeof calcularPromedioFinalMateria === 'function') {
                promedioFinal = calcularPromedioFinalMateria(materia);
            } else {
                // Si la función global directa no existe, aplicamos la misma lógica de respaldo
                promedioFinal = activosRda.length > 0 ? (activosRda.reduce((a, b) => a + b, 0) / activosRda.length) : 0;
            }

            promediosPorMateria[materia] = parseFloat(Number(promedioFinal).toFixed(2));
        });
    }

    return promediosPorMateria;
}

// Función principal para renderizar o actualizar la gráfica de barras
function inicializarGraficaMaterias() {
    let datosCalculados = calcularPromediosPorMateriaGrafica();
    
    let materias = Object.keys(datosCalculados);
    let promedios = Object.values(datosCalculados);

    let elementoCanvas = document.getElementById('graficaMaterias');
    if (!elementoCanvas) return;

    let contexto = elementoCanvas.getContext('2d');

    // Destruir instancia previa para evitar duplicados o errores de renderizado
    if (miGraficaMaterias instanceof Chart) {
        miGraficaMaterias.destroy();
    }

    // Creación de la gráfica de barras sincronizada con la escala 0-100 de la tabla
    miGraficaMaterias = new Chart(contexto, {
        type: 'bar',
        data: {
            labels: materias.length > 0 ? materias : ['Sin materias'], 
            datasets: [{
                label: 'Promedio Final',
                data: promedios.length > 0 ? promedios : [0],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        maxRotation: 0, // Evita que los nombres se inclinen feo de lado
                        minRotation: 0,
                        autoSkip: false  // Asegura que se muestren todas las materias
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let valorMateria = context.raw;
                            return ` Promedio Final: ${valorMateria}`;
                        }
                    }
                }
            }
        }
    });
}

// Escuchar eventos personalizados por si el dashboard o la tabla se actualizan dinámicamente
window.addEventListener('actualizarDashboard', function() {
    inicializarGraficaMaterias();
});

// Ejecutar al cargar la página
window.onload = function() {
    setTimeout(inicializarGraficaMaterias, 100); // Pequeño respiro para asegurar carga de scripts previos
};
