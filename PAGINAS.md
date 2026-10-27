# Cómo construir tu página del Mini CRM

Hay tres páginas: **Página Matías**, **Página Sebastián** y **Página Paula**. Hoy están **vacías**. Cada persona construye la suya: un **kanban de leads con sus propias métricas**. El reto de cada una está escrito en la propia página.

Tu página es **un solo archivo**: `src/paginas/matias.js`, `src/paginas/sebastian.js` o `src/paginas/paula.js`. **No se toca el menú ni nada más.**

## La forma de una página

```js
export default {
  nombre: "Página Matías",   // lo que dice la pestaña (no se cambia)
  autor: "matias",           // igual al nombre del archivo (no se cambia)
  montar(el, crm) {
    // `el` es el espacio vacío de tu página. Dibuja aquí lo que quieras.
  },
};
```

Cada página tiene su link: `…/#matias`, `…/#sebastian`, `…/#paula`.

## Lo que ya existe (el objeto `crm`)

| Qué | Para qué sirve |
|---|---|
| `crm.contactos()` | Lista de contactos: `id, nombre, telefono, proyecto, etapa, responsable, ultimoContacto, valorUF, notas` |
| `crm.etapas` | Las etapas: Nuevo, Contactado, Visita, Reserva, Ganado |
| `crm.equipo` | Los nombres del equipo, para asignar |
| `crm.actualizar(id, { campo: valor })` | Cambia un contacto (se guarda solo; mover de etapa es cambiar `etapa`) |
| `crm.agregar({...})` / `crm.eliminar(id)` | Crea o borra un contacto |
| `crm.abrir(id)` | Abre la ficha de un contacto |
| `crm.alCambiar(fn)` | Ejecuta `fn` cada vez que cambian los datos: úsalo para redibujar tu página |
| `crm.avisar("mensaje")` | Muestra un aviso breve |
| `crm.etiqueta("texto", "#0E8A7A")` | Crea una etiqueta de color |

## El sistema de diseño

El archivo `styles.css` ya trae colores (variables como `--azul`, `--verde`, `--naranja`) y clases listas: `.col` (columna), `.tarjeta`, `.avatar`, `.etiquetas`, `.kpi`, `.panel`, `.barra`. Úsalas para que tu página se vea igual que el resto, o crea tus propios estilos dentro de tu archivo. **No se edita `styles.css`.**

## Pistas

- Un kanban es una fila de columnas, una por etapa; cada tarjeta es un contacto.
- Para mover tarjetas entre columnas: arrastrar y soltar (`draggable`, `dragstart`, `dragover`, `drop`) y llamar a `crm.actualizar(id, { etapa })`.
- Las métricas se calculan con `crm.contactos()`: contar, sumar `valorUF`, comparar fechas.
- Para saber hace cuántos días fue el último contacto, usa `ultimoContacto`.

## Reglas

- Solo tu archivo en `src/paginas/`. No se toca `src/app.js`, el menú, los estilos ni el resto.
- Todo ocurre en el navegador: **sin servidor, sin `fetch`, sin direcciones web, sin claves**.
- Si tu página falla, el CRM sigue funcionando y avisa cuál falló.

## Cómo pedírselo a Claude

> Lee CLAUDE.md y PAGINAS.md. Construye mi página `src/paginas/<mi-nombre>.js`: un kanban de leads con las métricas que dice mi reto. No toques ningún otro archivo. Luego ejecuta `node build.mjs` y `node validate.mjs`, y ábrela en el navegador para probarla.
