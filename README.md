# Mini CRM de la clase

Un CRM solo front-end (sin servidor) para el ejercicio de Vibecoding II. Tiene tres páginas, **Página Matías**, **Página Sebastián** y **Página Paula**, que empiezan vacías. Cada persona construye la suya, un kanban de leads con sus propias métricas, y la propone con un pull request. Lo que se une a `main` se publica solo en Vercel.

Los datos son inventados y se guardan en el navegador.

## Cómo participar

1. Acepta la invitación a este repositorio (llega a tu correo) y haz un **fork**: tu propia copia en tu cuenta de GitHub. Pídeselo a Claude: *«Haz un fork de BenediktKd/mini-crm-clase y clónalo en esta carpeta»*.
2. Crea una rama desde `main`: `feat/pagina-<tu-nombre>`.
3. Lee `PAGINAS.md` y pídele a Claude que construya tu página (`src/paginas/<tu-nombre>.js`).
4. Pruébala: `node build.mjs`, luego `npx serve .` y abre el link que muestra.
5. Valida: `node validate.mjs`.
6. Sube la rama a **tu fork** y abre un pull request **hacia `main` de este repositorio**.
7. Corren las pruebas y yo reviso tu cambio. Si está bien, lo uno y se publica solo.

El menú de arriba no se cambia. Reglas completas en `CLAUDE.md`.
