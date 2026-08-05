//Semáforo


//Simulador de Notas
function cambiarModo() {
    let modo = document.getElementById('select-modo').value;
    let secSimular = document.getElementById('sec-simular');
    let secNecesaria = document.getElementById('sec-necesaria');

    if (modo === "simular") {
        secSimular.style.display = "block";
        secNecesaria.style.display = "none";
    } else {
        secSimular.style.display = "none";
        secNecesaria.style.display = "block";
    }
}

function ejecutarCalculo() {
    let modo = document.getElementById('select-modo').value;
    let txtRes = document.getElementById('texto-resultado');

    if (modo === "simular") {
        let v1 = validarNotasCriterio(document.getElementById('input-c1').value, "Criterio 1");
        let v2 = validarNotasCriterio(document.getElementById('input-c2').value, "Criterio 2");
        let v3 = validarNotasCriterio(document.getElementById('input-c3').value, "Criterio 3");

        // Creamos una lista para acumular todos los mensajes de error
        let listaErroresTotales = [];

        if (v1.errores.length > 0) {
            listaErroresTotales.push("❌ Criterio 1: " + v1.errores.join("; "));
        }
        if (v2.errores.length > 0) {
            listaErroresTotales.push("❌ Criterio 2: " + v2.errores.join("; "));
        }
        if (v3.errores.length > 0) {
            listaErroresTotales.push("❌ Criterio 3: " + v3.errores.join("; "));
        }

        // Si encontramos al menos un error, mostramos la lista completa y NO calculamos
        if (listaErroresTotales.length > 0) {
            txtRes.innerHTML = listaErroresTotales.join("<br>");
            return;
        }

        // Si no hubo ningún error, calculamos normalmente
        let notaFinal = simularNotaFinalPorCriterios(v1.notas, v2.notas, v3.notas);
        txtRes.innerText = "📈 Proyección del Promedio Final (T): " + notaFinal + " / 10";

    } else {
        let T = parseFloat(document.getElementById('input-T').value);
        let critActivo = document.getElementById('select-crit-activo').value;
        let totalAct = parseInt(document.getElementById('input-total-act').value) || 1;

        if (isNaN(T) || T < 0 || T > 10) {
            txtRes.innerText = "❌ Por favor, ingresa un Promedio Objetivo válido entre 0.0 y 10.0.";
            return;
        }

        let txtActivo = "", txtOtros1 = "", txtOtros2 = "";

        if (critActivo === "1") {
            txtActivo = document.getElementById('input-c1-b').value;
            txtOtros1 = document.getElementById('input-c2-b').value;
            txtOtros2 = document.getElementById('input-c3-b').value;
        } else if (critActivo === "2") {
            txtActivo = document.getElementById('input-c2-b').value;
            txtOtros1 = document.getElementById('input-c1-b').value;
            txtOtros2 = document.getElementById('input-c3-b').value;
        } else {
            txtActivo = document.getElementById('input-c3-b').value;
            txtOtros1 = document.getElementById('input-c1-b').value;
            txtOtros2 = document.getElementById('input-c2-b').value;
        }

        let vActivo = validarNotasCriterio(txtActivo, "Criterio Seleccionado");
        let vOtros1 = validarNotasCriterio(txtOtros1, "Otro Criterio");
        let vOtros2 = validarNotasCriterio(txtOtros2, "Otro Criterio");

        let listaErroresTotales = [];
        if (vActivo.errores.length > 0) listaErroresTotales.push("❌ Criterio Evaluado: " + vActivo.errores.join("; "));
        if (vOtros1.errores.length > 0) listaErroresTotales.push("❌ Criterio Adicional 1: " + vOtros1.errores.join("; "));
        if (vOtros2.errores.length > 0) listaErroresTotales.push("❌ Criterio Adicional 2: " + vOtros2.errores.join("; "));

        if (listaErroresTotales.length > 0) {
            txtRes.innerHTML = listaErroresTotales.join("<br>");
            return;
        }

        let promO1 = obtenerPromedio10(vOtros1.notas);
        let promO2 = obtenerPromedio10(vOtros2.notas);
        let A_otros = (promO1 * 0.333333) + (promO2 * 0.333333);

        let msg = calcularNotaNecesariaEnCriterio(T, vActivo.notas, totalAct, A_otros);
        txtRes.innerText = msg;
    }
}