let miGraficaMaterias = null;

// Calcula los promedios finales por materia idénticos a la tabla de promedios
function calcularPromediosPorMateriaGrafica() {
    let promediosPorMateria = {};

    // Obtiene la lista de actividades desde el ámbito global disponible
    let listaActividades = typeof obtenerActividadesGlobales === 'function' ? obtenerActividadesGlobales() : (typeof actividades !== 'undefined' ? actividades : []);

    if (Array.isArray(listaActividades) && listaActividades.length > 0) {
        // Extrae las materias únicas registradas de forma automática
        let materiasUnicas = [...new Set(listaActividades.map(act => act.materia))];

        materiasUnicas.forEach(materia => {
            // Obtiene el promedio final delegando el cálculo a calculos.js
            const promedioFinal = typeof calcularPromedioFinalMateria === 'function'
                ? calcularPromedioFinalMateria(materia)
                : 0;

            promediosPorMateria[materia] = parseFloat(Number(promedioFinal).toFixed(2));
        });
    }

    return promediosPorMateria;
}

// Renderiza o actualiza la gráfica de barras con los datos calculados
function inicializarGraficaMaterias() {
    let datosCalculados = calcularPromediosPorMateriaGrafica();

    let materias = Object.keys(datosCalculados);
    let promedios = Object.values(datosCalculados);

    let elementoCanvas = document.getElementById('graficaMaterias');
    if (!elementoCanvas) return;

    let contexto = elementoCanvas.getContext('2d');

    // Destruye la instancia previa para evitar duplicados o errores de renderizado
    if (miGraficaMaterias instanceof Chart) {
        miGraficaMaterias.destroy();
    }

    // Crea la gráfica de barras sincronizada con la escala del sistema
    miGraficaMaterias = new Chart(contexto, {
        type: 'bar',
        data: {
            labels: materias.length > 0 ? materias : ['Sin materias'],
            datasets: [{
                label: 'Promedio Final',
                data: promedios.length > 0 ? promedios : [0],
                backgroundColor: ['#082149', '#0e5e43', '#0f9c4a', '#228da8'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0,
                        autoSkip: false
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
                        label: function (context) {
                            let valorMateria = context.raw;
                            return ` Promedio Final: ${valorMateria}`;
                        }
                    }
                }
            }
        }
    });
}

// Escucha eventos personalizados para actualizar la gráfica de forma dinámica
window.addEventListener('actualizarDashboard', function () {
    inicializarGraficaMaterias();
});

// Inicializa la gráfica al cargar completamente la página
window.addEventListener('load', function () {
    setTimeout(inicializarGraficaMaterias, 100);
});