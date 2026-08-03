SEMANA 1 
Proyecto Integrador: Simulador de Notas y Semáforo de Alertas - Primer Avance

Este repositorio contiene la base de nuestro Proyecto Integrador. El proyecto se desarrollará a lo largo de "4 semanas", y este archivo marca las pautas e instrucciones clave para este primer avance.


Semana 1: Estructura Inicial

En esta primera semana nos hemos enfocado en establecer la arquitectura inicial del proyecto mediante la creación de la estructura de carpetas y archivos base:

* `index.html`: Estructura principal y maquetación general de la página web.
* `Estilos.css`: Hoja de estilos encargada de la apariencia visual y diseño adaptable.
* `FuncionesP.js/`: Carpeta modular que contiene las funciones lógicas de JavaScript:
  * `Validaciones.js`: Comprobación de rangos ($0 \le x \le 10$) y verificación de datos de entrada válidos (números o texto) mediante el uso de bucles de control (`while`, `if`).
  * `Simulador.js`: Modelo algebraico lineal para calcular notas simuladas y calcular la nota exacta necesaria para alcanzar un promedio objetivo.
  * `Semaforo.js`: Sistema de evaluación de alertas (Verde, Amarillo, Rojo) mediante lógica proposicional y tablas de verdad.
  * `Main.js`: Escucha de eventos de botones y manipulación del DOM para conectar la lógica con la interfaz de usuario.
* `README.md`: Guía y normas del proyecto.


Reparto de Tareas 

Para mantener el código limpio y organizado, cada integrante trabajará "exclusivamente" en sus áreas asignadas:

1. David
* Área principal: `FuncionesP.js/Semaforo.js`
* Apoyo: Integración de la lógica del semáforo en `index.html`.
* Responsabilidad: Desarrollar la lógica proposicional para la activación de las alertas según el estado de la tarea y la nota.

2. Diana
* Área principal: `FuncionesP.js/Simulador.js`
* Apoyo: Integración del simulador en `index.html`.
* Responsabilidad: Desarrollar las funciones del modelo algebraico para calcular y simular promedios.

3. Odalis
* Área principal: `index.html` y `Estilos.css`
* Responsabilidad: Una vez terminadas las funciones lógicas, se encargará de la estructuración final, diseño visual y diseño responsivo para integrar de forma estética todo el prototipo inicial.


Pasos para Colaborar en GitHub (Control de Evidencias)

Todo el avance del grupo debe quedar registrado en el historial de "GitHub" como evidencia de nuestro trabajo colaborativo.

Subir los cambios constantemente (Evidencia):
Cada vez que realicen un avance relevante o completen una función, deben hacer commit y push para actualizar el repositorio central.

