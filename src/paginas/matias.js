export default {
  nombre: "Página Matías",
  autor: "matias",
  montar(el, crm) {
    // TODO: esta página está vacía. Constrúyela con Claude (mira PAGINAS.md).
    const caja = document.createElement("div");
    caja.className = "vacia";
    const titulo = document.createElement("h2");
    titulo.textContent = "Página Matías";
    const reto = document.createElement("p");
    reto.textContent = "Tu reto: un kanban de leads con métricas de embudo: leads totales, valor del pipeline en UF y tasa de cierre.";
    caja.append(titulo, reto);
    el.append(caja);
  },
};
