export default {
  nombre: "Página Sebastián",
  autor: "sebastian",
  montar(el, crm) {
    // TODO: esta página está vacía. Constrúyela con Claude (mira PAGINAS.md).
    const caja = document.createElement("div");
    caja.className = "vacia";
    const titulo = document.createElement("h2");
    titulo.textContent = "Página Sebastián";
    const reto = document.createElement("p");
    reto.textContent = "Tu reto: un kanban de leads con métricas de seguimiento: leads sin contacto hace más de 7 días, leads sin responsable y a quién llamar hoy.";
    caja.append(titulo, reto);
    el.append(caja);
  },
};
