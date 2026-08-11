# Project Detail Scroll Design

## Goal

Rediseñar `ProjectDetail` para que presente el proyecto Turno.uy como un recorrido vertical: hero de marca, información del caso y galería de capturas completa con parallax. La navegación entre imágenes deja de ser un slider.

## Scope

La intervención se limita al detalle de proyecto existente y sus estilos. No modifica el listado de proyectos, la navegación global, la estructura de `ProjectData`, los assets de Turno ni el sistema de tema global.

## Layout and behavior

### Hero

- El primer bloque es negro, de ancho completo dentro del contenedor del detalle y con las esquinas inferiores redondeadas.
- Arranca alineado al borde superior interno del frame y queda visualmente debajo de la navegación global.
- Muestra únicamente el logo del proyecto centrado; no usa capturas como fondo.
- Al abrir el detalle, sólo el logo ejecuta una animación breve de entrada. El bloque no tendrá animaciones adicionales.
- El hero forma parte del flujo normal del contenedor con scroll: sube con el resto de la página y desaparece al continuar bajando. No debe ser `sticky` ni `fixed`.
- El botón “volver” permanece accesible dentro del hero. `Escape` sigue cerrando el detalle.

### Información del proyecto

- Se presenta inmediatamente después del hero con la jerarquía de la referencia: título y enlace, divisor horizontal, datos de proyecto y descripción.
- Los datos incluyen categoría, año, rol y cliente; las tecnologías quedan al final de este bloque.
- La grilla usa metadatos a la izquierda y descripción a la derecha en escritorio; en móvil pasa a una sola columna.
- El enlace al sitio conserva su apertura en una pestaña nueva y la semántica accesible actual.

### Galería vertical

- Aparece debajo de toda la información del proyecto.
- Cada elemento de `proj.images` se renderiza como una sección independiente, en el orden definido por el proyecto.
- Las capturas se muestran enteras, conservando su proporción y sin recorte (`object-fit: contain`). El fondo de cada sección absorbe el espacio restante si la relación de aspecto no llena el ancho.
- El scroll sigue siendo continuo y vertical; no se fija una imagen, no se convierte la rueda en controles de slide y no se incluyen autoplay, flechas, puntos, swipe ni navegación por flechas laterales.
- Cada imagen recibe un desplazamiento vertical interno, pequeño y acotado, calculado desde su posición respecto al viewport del contenedor. El efecto crea parallax sin alterar el orden natural ni ocultar contenido.
- Se respeta `prefers-reduced-motion`: las imágenes quedan estáticas cuando el usuario solicita movimiento reducido.

## Theme and visual language

- El negro del hero es constante en ambos modos para preservar el contraste del logo.
- Se añade un token de acento específico para el detalle: lila claro en modo oscuro y lila oscuro en modo claro.
- Ese acento se aplica a título, etiquetas de metadatos y detalles visuales de la información; el texto descriptivo conserva los tokens de legibilidad existentes.
- El diseño conserva el ruido y el fondo ya presentes en el detalle, sin modificar el sistema de tema global.

## Implementation boundaries

- `components/ProjectDetail/ProjectDetail.tsx`: simplificar el estado y los manejadores del slider; renderizar hero de marca, información y galería; calcular el parallax desde el scroll del contenedor.
- `components/ProjectDetail/ProjectDetail.module.css`: sustituir los estilos del slider por los del hero, la animación de logo, la galería y el comportamiento responsive/reduced-motion.
- No se requieren nuevas dependencias ni cambios de datos.

## Validation

- Comprobar en escritorio y móvil que el hero inicia debajo de la nav y se desplaza fuera de la vista con el scroll.
- Confirmar que el logo es el único elemento animado al abrir el detalle.
- Confirmar que las siete capturas están completas, en orden, sin recorte y que el scroll no actúa como slider.
- Verificar el contraste y el lila de acento en dark y light mode.
- Ejecutar `npm run build` para validar TypeScript y la compilación de Next.js.
