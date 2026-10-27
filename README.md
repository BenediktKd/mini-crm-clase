# Mini CRM de la clase

Un CRM solo front-end (sin servidor) para el ejercicio de Vibecoding II. Tiene tres páginas, **Página Matías**, **Página Sebastián** y **Página Paula**, que empiezan vacías. Cada persona construye la suya, un kanban de leads con sus propias métricas, y la sube con un pull request. Se publica solo en Vercel.

Los datos son inventados y se guardan en el navegador.

## Cómo participar

1. Clona este repositorio (pídeselo a Claude) y ábrelo.
2. Crea una rama desde `staging`: `feat/pagina-<tu-nombre>`.
3. Lee `PAGINAS.md` y pídele a Claude que construya tu página (`src/paginas/<tu-nombre>.js`).
4. Pruébala: `node build.mjs`, luego `npx serve .` y abre el link que muestra.
5. Valida: `node validate.mjs`.
6. Sube la rama y abre un pull request **hacia `staging`**.
7. Revisa el pull request de otra persona: descarga la rama, pruébala y aprueba o pide un ajuste.
8. Con pruebas en verde y una aprobación, se une a `staging` y tu página aparece construida en el link publicado.

El menú de arriba no se cambia. Reglas completas en `CLAUDE.md`.
