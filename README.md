# Gravedad100 — Clases y horarios (componente frontend en React JS)

**Evidencia:** GA7-220501096-AA4-EV03 — Componente frontend del proyecto formativo
**Aprendiz:** Jean Carlos Buelvas
**Programa:** Análisis y Desarrollo de Software — SENA

## Descripción

Componente frontend desarrollado con **React JS** para el módulo de **Clases
y horarios** del software de gestión de gimnasio Gravedad100. Reproduce las
mismas historias de usuario y reglas de negocio ya construidas y probadas en
el backend del módulo (Spring MVC + Spring JDBC, evidencias AA3_EV01 y
AA3_EV02):

- **HU-01** Listar clases programadas.
- **HU-02** Programar una nueva clase grupal.
- **HU-03** Editar una clase existente.
- **HU-04** Eliminar una clase programada (con confirmación).
- **HU-05** Visualizar el estado de cupo de cada clase (Con cupo / Lleno).
- **HU-06** Manejo de clase no encontrada al intentar editar un id inexistente.

En esta evidencia el componente trabaja con **estado local en memoria**
(`useState` a través del hook `useClases`), con datos de ejemplo definidos en
`src/data/clasesIniciales.js`. La integración con la API real del backend
queda planteada como siguiente paso natural del proyecto.

## Artefactos previos aplicados

- **Historias de usuario / casos de uso** definidos en la evidencia AA3_EV02.
- **Diseño de interfaz y sistema de diseño** ("sala de pesas": acento
  naranja, tipografía Bebas Neue + Inter + IBM Plex Mono) definido en la
  evidencia de diseño frontend HTML/CSS/JS.
- **Estándares de codificación** (nombres descriptivos, comentarios tipo
  Javadoc/JSDoc, separación de responsabilidades) definidos en el informe
  técnico de estándares de codificación del proyecto.
- **Modelo de datos** (`ClaseGrupal`) equivalente al usado en el backend.

## Estructura del proyecto

```
src/
├── data/
│   ├── ClaseGrupal.js       # Modelo de datos y funciones de dominio
│   └── clasesIniciales.js   # Datos de ejemplo (seed)
├── utils/
│   └── validaciones.js      # Validaciones del formulario (espejo del backend)
├── hooks/
│   └── useClases.js         # Estado y operaciones sobre las clases (listar,
│                             # programar, editar, eliminar)
├── components/
│   ├── ListadoClases.jsx
│   ├── FilaClase.jsx
│   ├── FormularioClase.jsx
│   ├── BadgeEstadoCupo.jsx
│   ├── ModalConfirmacion.jsx
│   └── MensajeAlerta.jsx
├── App.jsx                  # Componente raíz, orquesta las vistas
├── main.jsx                 # Punto de entrada
└── index.css                # Estilos (sistema de diseño "sala de pesas")
```

## Cómo ejecutar el proyecto

Requiere [Node.js](https://nodejs.org/) 18 o superior.

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

## Tecnologías

- React 18
- Vite (herramienta de build y servidor de desarrollo)
- CSS puro (sin framework de estilos, reutilizando el sistema de diseño
  propio del proyecto)

## Control de versiones

El proyecto se versionó con Git, con un historial de commits organizado por
capa (modelo de datos, validaciones, hook de estado, componentes de UI,
componente raíz, estilos), siguiendo la misma convención usada en el resto
del proyecto Gravedad100.
