export default {
  nombre: "Página Paula",
  autor: "paula",
  montar(el, crm) {
    // TODO: esta página está vacía. Constrúyela con Claude (mira PAGINAS.md).
    const caja = document.createElement("div");
    caja.className = "vacia";
    const titulo = document.createElement("h2");
    titulo.textContent = "Página Paula";
    const reto = document.createElement("p");
    reto.textContent = "Tu reto (prueba): un kanban de leads con métricas del equipo: carga por responsable, leads por persona, UF en reserva y un botón para asignar automáticamente.";
    caja.append(titulo, reto);
    el.append(caja);
  },
};
