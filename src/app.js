import { ETAPAS, EQUIPO, SEMILLA } from "./datos.js";
import PAGINAS from "./paginas/index.js";

const CLAVE = "mini-crm-clase-v1";
const CAMPOS = ["nombre", "telefono", "proyecto", "etapa", "responsable", "ultimoContacto", "valorUF", "notas"];
const DIA = 864e5;
const hace = (dias) => new Date(Date.now() - dias * DIA).toISOString().slice(0, 10);
const hoy = () => new Date().toISOString().slice(0, 10);
const $ = (id) => document.getElementById(id);

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) return JSON.parse(guardado);
  } catch { /* sin almacenamiento: se usan los datos de ejemplo */ }
  return SEMILLA.map(({ diasSinContacto, ...c }) => ({ ...c, ultimoContacto: hace(diasSinContacto) }));
}

let contactos = cargar();
let oyentes = [];

function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(contactos)); } catch { /* ignorar */ }
}
function cambio() {
  guardar();
  for (const fn of [...oyentes]) {
    try { fn(crm); } catch (e) { console.error(e); }
  }
}

function avisar(texto) {
  const el = $("aviso");
  el.textContent = texto;
  el.classList.add("on");
  clearTimeout(avisar.t);
  avisar.t = setTimeout(() => el.classList.remove("on"), 2600);
}

function etiqueta(texto, color = "#1F5F99") {
  const el = document.createElement("span");
  el.className = "etiqueta";
  el.textContent = texto;
  el.style.background = color;
  return el;
}

function actualizar(id, cambios) {
  const c = contactos.find((x) => x.id === id);
  if (!c) return;
  for (const k of CAMPOS) if (k in cambios) c[k] = cambios[k];
  cambio();
}
function agregar(datos = {}) {
  const id = Math.max(0, ...contactos.map((c) => c.id)) + 1;
  contactos.push({ id, nombre: "Contacto nuevo", telefono: "", proyecto: "", etapa: ETAPAS[0], responsable: null, ultimoContacto: hoy(), valorUF: 0, notas: "" });
  actualizar(id, datos);
  return id;
}
function eliminar(id) {
  contactos = contactos.filter((c) => c.id !== id);
  cambio();
}

function campo(texto, control) {
  const l = document.createElement("label");
  l.append(texto, control);
  return l;
}
function abrir(id) {
  const c = contactos.find((x) => x.id === id);
  if (!c) return;
  const cont = $("detalle");
  const hoja = document.createElement("div");
  hoja.className = "hoja";
  const texto = (k, tipo = "text") => {
    const i = document.createElement("input");
    i.type = tipo; i.value = c[k] ?? "";
    i.addEventListener("change", () => actualizar(id, { [k]: tipo === "number" ? Number(i.value) : i.value }));
    return i;
  };
  const lista = (k, opciones, vacio) => {
    const s = document.createElement("select");
    if (vacio) s.append(new Option(vacio, ""));
    for (const o of opciones) s.append(new Option(o, o));
    s.value = c[k] ?? "";
    s.addEventListener("change", () => actualizar(id, { [k]: s.value || null }));
    return s;
  };
  const notas = document.createElement("textarea");
  notas.value = c.notas ?? "";
  notas.addEventListener("change", () => actualizar(id, { notas: notas.value }));
  const hoyBtn = document.createElement("button");
  hoyBtn.textContent = "Marcar contactado hoy";
  hoyBtn.addEventListener("click", () => { actualizar(id, { ultimoContacto: hoy() }); avisar("Contacto registrado"); });
  const cerrar = document.createElement("button");
  cerrar.textContent = "Cerrar";
  cerrar.addEventListener("click", () => { cont.hidden = true; });
  hoja.append(
    campo("Nombre", texto("nombre")), campo("Teléfono", texto("telefono")), campo("Proyecto", texto("proyecto")),
    campo("Etapa", lista("etapa", ETAPAS)), campo("Responsable", lista("responsable", EQUIPO, "Sin asignar")),
    campo("Valor (UF)", texto("valorUF", "number")), campo("Notas", notas), hoyBtn, cerrar,
  );
  cont.replaceChildren(hoja);
  cont.hidden = false;
  cont.onclick = (e) => { if (e.target === cont) cont.hidden = true; };
}

const crm = {
  etapas: [...ETAPAS],
  equipo: [...EQUIPO],
  contactos: () => contactos.map((c) => ({ ...c })),
  actualizar,
  agregar,
  eliminar,
  abrir,
  alCambiar: (fn) => oyentes.push(fn),
  avisar,
  etiqueta,
};

// Página de inicio: una tabla simple. Las demás páginas las agrega cada persona.
const INICIO = {
  id: "inicio",
  nombre: "Inicio",
  montar(el, crm) {
    const buscar = document.createElement("div");
    buscar.className = "barra-busqueda";
    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Buscar contacto o proyecto";
    buscar.append(input);
    const tabla = document.createElement("table");
    tabla.className = "tabla";
    el.append(buscar, tabla);
    const pintar = () => {
      const q = input.value.trim().toLowerCase();
      const lista = crm.contactos().filter((c) => !q || `${c.nombre} ${c.proyecto}`.toLowerCase().includes(q));
      tabla.replaceChildren();
      const cab = tabla.insertRow();
      for (const t of ["Nombre", "Proyecto", "Etapa", "Responsable", "UF"]) cab.append(Object.assign(document.createElement("th"), { textContent: t }));
      for (const c of lista) {
        const f = tabla.insertRow();
        f.className = "fila";
        for (const t of [c.nombre, c.proyecto, c.etapa, c.responsable ?? "Sin asignar", Number(c.valorUF).toLocaleString("es-CL")]) f.insertCell().textContent = t;
        f.addEventListener("click", () => crm.abrir(c.id));
      }
    };
    input.addEventListener("input", pintar);
    crm.alCambiar(pintar);
    pintar();
  },
};

const ORDEN = ["matias", "sebastian", "paula"];
const ordenar = (p) => (ORDEN.includes(p.autor) ? ORDEN.indexOf(p.autor) : ORDEN.length);
const todas = [INICIO, ...[...PAGINAS].sort((a, b) => ordenar(a) - ordenar(b)).map((p) => ({ ...p, id: p.autor }))];

function actual() {
  const id = decodeURIComponent(location.hash.slice(1));
  return todas.find((p) => p.id === id) ?? todas[0];
}

function mostrar() {
  const pagina = actual();
  oyentes = [];
  const menu = $("menu");
  menu.replaceChildren();
  for (const p of todas) {
    const a = document.createElement("a");
    a.href = `#${encodeURIComponent(p.id)}`;
    a.textContent = p.nombre;
    if (p === pagina) a.className = "activa";
    menu.append(a);
  }
  const vista = $("vista");
  vista.replaceChildren();
  try {
    pagina.montar(vista, crm);
  } catch (e) {
    console.error(`La página «${pagina.nombre}» falló`, e);
    vista.replaceChildren(Object.assign(document.createElement("p"), { className: "vacia", textContent: `La página «${pagina.nombre}» tuvo un error. Revisa la consola.` }));
  }
}

window.addEventListener("hashchange", mostrar);
mostrar();
