# Reglas del proyecto

Mini CRM de la clase: una página estática, sin servidor. Hay tres páginas, una por persona: `matias`, `sebastian` y `paula`. Empiezan vacías y cada persona construye la suya: un kanban de leads con sus propias métricas.

- Las ramas salen siempre de `staging` y se nombran `feat/pagina-<tu-nombre>`.
- Los pull requests van a `staging`, nunca a `main`.
- Cada persona construye SOLO su archivo `src/paginas/<tu-nombre>.js`. Se explica en `PAGINAS.md`.
- No se toca el menú ni ningún archivo fuera de `src/paginas/` (ni `src/app.js`, ni `styles.css`, ni las otras páginas). Si algo más parece necesitar cambios, se avisa en el pull request.
- No se cambian los campos `nombre` ni `autor` de la página.
- Solo JavaScript del navegador, sin librerías externas, sin `fetch`, sin direcciones web, sin claves ni datos reales de personas.
- Los textos que ve el usuario van en español neutro, sin voseo (tú, no vos).
- Antes de abrir el pull request: `node build.mjs` y `node validate.mjs` deben pasar, y la página debe probarse en el navegador.
- Nunca se aprueba el pull request propio. Quien revisa descarga la rama y prueba la página en su computador.
