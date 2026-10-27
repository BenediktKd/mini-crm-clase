// Página Paula: kanban de leads con la carga del equipo y asignación automática por turnos.

const CLAVE_TURNO = "mini-crm-paula-turno";
const DIA = 864e5;
const COLOR = { Nuevo: "#5B6B77", Contactado: "#1F5F99", Visita: "#0E8A7A", Reserva: "#B85A14", Ganado: "#003055" };
const ACTIVAS = ["Nuevo", "Contactado", "Visita", "Reserva"];

const ESTILOS = `
.pp{flex:1;min-width:0;width:100%;align-self:stretch;display:flex;flex-direction:column;gap:20px;--pp-sombra:0 10px 28px rgba(16,34,47,.16)}
.pp ::selection{background:#D7E4F0;color:var(--tinta)}
.pp :focus-visible{outline:2px solid var(--azul2);outline-offset:2px}
.pp-num{font-variant-numeric:tabular-nums}

.pp-cabeza{display:flex;align-items:flex-end;justify-content:space-between;gap:16px 24px;flex-wrap:wrap}
.pp-cabeza h2{margin:0;font-size:1.6rem;color:var(--azul);letter-spacing:-.01em}
.pp-cabeza p{margin:4px 0 0;color:var(--gris)}
.pp-asignar{background:var(--naranja);border-color:var(--naranja);color:#fff;font-weight:600;padding:10px 18px;border-radius:99px;transition:transform .12s,background .15s}
.pp-asignar:hover{background:#9E4C10;border-color:#9E4C10}
.pp-asignar:active{transform:scale(.97)}
.pp-asignar:disabled{background:#E9E6DD;border-color:#E9E6DD;color:var(--gris);cursor:default}

.pp-cifras{display:flex;gap:12px 40px;flex-wrap:wrap;margin:0}
.pp-cifras div{display:flex;flex-direction:column}
.pp-cifras dt{color:var(--gris);font-size:.88rem}
.pp-cifras dd{margin:0;font-size:1.9rem;font-weight:700;color:var(--tinta);letter-spacing:-.02em;line-height:1.15}
.pp-cifras dd small{font-size:.9rem;font-weight:500;color:var(--gris);letter-spacing:0;margin-left:4px}
.pp-cifras .pp-reserva dd{color:var(--naranja)}

.pp-equipo{background:#fff;border:1px solid var(--borde);border-radius:14px;padding:6px 0 4px}
.pp-equipo h3,.pp-plan h3{margin:10px 18px 6px;font-size:1rem;color:var(--azul)}
.pp-fila,.pp-titulos{display:grid;grid-template-columns:minmax(150px,1.1fr) minmax(170px,2.4fr) repeat(3,minmax(74px,.6fr));align-items:center;gap:12px;padding:8px 18px}
.pp-titulos{font-size:.82rem;color:var(--gris);padding-top:2px;padding-bottom:4px}
.pp-titulos span:nth-child(n+3),.pp-fila>.pp-num{text-align:right}
.pp-fila{width:100%;border:0;border-top:1px solid #E6EAED;border-radius:0;background:none;text-align:left;font:inherit;color:var(--tinta);cursor:pointer}
.pp-fila:hover{background:#F1F6FB}
.pp-fila[aria-pressed="true"]{background:#E6EEF6}
.pp-persona{display:flex;align-items:center;gap:10px;font-weight:600}
.pp-persona em{font-style:normal;font-weight:500;font-size:.8rem;color:var(--naranja)}
.pp-bloques{display:flex;flex-wrap:wrap;gap:3px;min-height:16px;align-items:center}
.pp-bloques i{width:14px;height:14px;border-radius:3px;display:block;transition:transform .2s}
.pp-bloques .pp-libre{background:none;border:1.5px dashed #9AA6AF}
.pp-bloques .pp-cero{font-style:normal;color:var(--gris);font-size:.85rem;width:auto;height:auto}
.pp-leyenda{display:flex;gap:6px 16px;flex-wrap:wrap;padding:10px 18px 10px;border-top:1px solid #E6EAED;font-size:.82rem;color:var(--gris)}
.pp-leyenda span{display:inline-flex;align-items:center;gap:6px}
.pp-leyenda i{width:10px;height:10px;border-radius:2px;display:block}

.pp-plan{background:#fff;border:1px solid var(--borde);border-radius:14px;padding:4px 0 16px;box-shadow:var(--pp-sombra);animation:pp-entra .22s cubic-bezier(.2,.8,.2,1)}
.pp-plan p{margin:0 18px 10px;color:var(--gris)}
.pp-plan ol{list-style:none;margin:0 0 14px;padding:0}
.pp-plan li{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;padding:9px 18px;border-top:1px solid #E6EAED}
.pp-plan li small{color:var(--gris);display:block}
.pp-flecha{color:var(--gris)}
.pp-destino{display:flex;align-items:center;gap:8px;font-weight:600;min-width:110px}
.pp-acciones{display:flex;gap:8px;justify-content:flex-end;padding:0 18px;flex-wrap:wrap}
.pp-acciones .pp-asignar{margin:0}

.pp-hecho{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#E3F1EE;color:#0A5F54;border-radius:12px;padding:10px 12px 10px 18px;font-weight:500}
.pp-hecho button{background:#fff;border-color:#B6D9D2;color:#0A5F54;font-weight:600}
.pp-filtro{display:flex;align-items:center;gap:10px;color:var(--gris);font-size:.92rem}
.pp-filtro button{padding:4px 12px;border-radius:99px;font-size:.88rem}

.pp-tablero{display:grid;grid-template-columns:repeat(5,minmax(210px,1fr));gap:14px;overflow-x:auto;padding-bottom:6px;scroll-snap-type:x proximity}
.pp-col{background:#E9E6DD;border-radius:14px;padding:10px;min-height:300px;transition:background .15s;scroll-snap-align:start;display:flex;flex-direction:column}
.pp-col.sobre{background:#D7E4F0}
.pp-col h3{margin:4px 6px 4px;font-size:.95rem;display:flex;align-items:center;gap:8px;color:var(--azul)}
.pp-col h3 i{width:10px;height:10px;border-radius:2px;display:block}
.pp-col h3 span{margin-left:auto;color:var(--gris);font-weight:500}
.pp-col>small{margin:0 6px 10px;color:var(--gris);font-size:.82rem}
.pp-vacio{flex:1;display:flex;align-items:center;justify-content:center;text-align:center;color:var(--gris);font-size:.85rem;border:2px dashed #D3CFC3;border-radius:10px;padding:16px}
.pp-tarjeta{background:#fff;border-radius:12px;padding:12px;margin-bottom:10px;border:1px solid #DCE2E6;cursor:grab;transition:transform .15s,box-shadow .15s,opacity .15s}
.pp-tarjeta:hover{border-color:#B8C4CD}
.pp-tarjeta:active{cursor:grabbing}
.pp-tarjeta.arrastrando{opacity:.45}
.pp-tarjeta.nueva .avatar{animation:pp-pop .5s cubic-bezier(.2,.8,.2,1)}
.pp-tarjeta strong{display:block;margin-bottom:2px}
.pp-tarjeta small{color:var(--gris);display:block}
.pp-pie{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:.85rem;gap:8px}
.pp-uf{font-weight:600}
.pp-dias{color:var(--gris);font-size:.8rem}
.pp-dias.frio{color:var(--naranja);font-weight:600}

@keyframes pp-entra{from{opacity:0;transform:translateY(-8px)}}
@keyframes pp-pop{0%{transform:scale(.4)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
@media(prefers-reduced-motion:reduce){.pp *{animation:none!important;transition:none!important}}
@media(max-width:760px){
  .pp-cabeza h2{font-size:1.35rem}
  .pp-asignar{width:100%}
  .pp-cifras{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px}
  .pp-cifras dd{font-size:1.5rem}
  .pp-titulos{display:none}
  .pp-fila{grid-template-columns:1fr auto;row-gap:6px}
  .pp-fila .pp-bloques{grid-column:1/-1;order:3}
  .pp-fila>.pp-num{display:none}
  .pp-fila>.pp-resumen{display:block}
  .pp-plan li{grid-template-columns:1fr auto}
  .pp-plan .pp-flecha{display:none}
  .pp-tablero{grid-template-columns:repeat(5,82%)}
}
.pp-resumen{display:none;text-align:right;font-size:.85rem;color:var(--gris)}
`;

function h(tag, props = {}, ...hijos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "style") el.style.cssText = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of hijos.flat()) if (c != null && c !== false) el.append(c);
  return el;
}

const uf = (n) => Number(n || 0).toLocaleString("es-CL");
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const inicial = (nombre) => (nombre ? nombre[0].toUpperCase() : "?");
const avatar = (nombre) => h("span", { class: nombre ? "avatar" : "avatar vacio", "aria-hidden": "true" }, inicial(nombre));

function diasDesde(fecha) {
  if (!fecha) return null;
  const d = Math.floor((Date.now() - new Date(`${fecha}T12:00:00`).getTime()) / DIA);
  return Number.isFinite(d) ? Math.max(0, d) : null;
}
function textoDias(d) {
  if (d == null) return "Sin contacto";
  if (d === 0) return "Hoy";
  if (d === 1) return "Ayer";
  return `Hace ${d} días`;
}

function leerTurno(n) {
  try {
    const v = Number(localStorage.getItem(CLAVE_TURNO));
    return Number.isInteger(v) && v >= 0 ? v % n : 0;
  } catch { return 0; }
}
function guardarTurno(v) {
  try { localStorage.setItem(CLAVE_TURNO, String(v)); } catch { /* sin almacenamiento: el turno vuelve a empezar */ }
}

export default {
  nombre: "Página Paula",
  autor: "paula",
  montar(el, crm) {
    const equipo = crm.equipo;
    const estado = { filtro: null, plan: null, deshacer: null, nuevas: new Set() };
    let arrastrado = null;

    const raiz = h("section", { class: "pp", "aria-labelledby": "pp-titulo" });
    el.append(h("style", {}, ESTILOS), raiz);

    // Reparto por turnos: sigue el orden del equipo desde quien tenga el turno.
    function armarPlan() {
      const pendientes = crm.contactos().filter((c) => !c.responsable && ACTIVAS.includes(c.etapa));
      const inicio = leerTurno(equipo.length);
      const filas = pendientes.map((c, i) => ({ contacto: c, persona: equipo[(inicio + i) % equipo.length] }));
      return { inicio, filas, siguiente: (inicio + filas.length) % equipo.length };
    }

    function aplicarPlan() {
      const { filas, inicio, siguiente } = estado.plan;
      estado.plan = null;
      estado.deshacer = { filas: filas.map((f) => ({ id: f.contacto.id, persona: f.persona })), turno: inicio };
      estado.nuevas = new Set(filas.map((f) => f.contacto.id));
      guardarTurno(siguiente);
      for (const f of filas) crm.actualizar(f.contacto.id, { responsable: f.persona });
      crm.avisar(`${plural(filas.length, "lead asignado", "leads asignados")} por turnos`);
      setTimeout(() => estado.nuevas.clear(), 700);
    }

    function deshacer() {
      const { filas, turno } = estado.deshacer;
      estado.deshacer = null;
      guardarTurno(turno);
      const actuales = new Map(crm.contactos().map((c) => [c.id, c]));
      for (const f of filas) {
        // Solo se revierte si nadie cambió ese lead después.
        if (actuales.get(f.id)?.responsable === f.persona) crm.actualizar(f.id, { responsable: null });
      }
      crm.avisar("Asignación deshecha");
      pintar();
    }

    function pintar() {
      const foco = document.activeElement?.dataset?.foco;
      const todos = crm.contactos();
      const activos = todos.filter((c) => ACTIVAS.includes(c.etapa));
      const enReserva = todos.filter((c) => c.etapa === "Reserva");
      const sinAsignar = activos.filter((c) => !c.responsable);
      const turno = equipo[leerTurno(equipo.length)];

      // Cabecera y botón principal
      const boton = h("button", {
        class: "pp-asignar", type: "button", "data-foco": "asignar",
        disabled: sinAsignar.length === 0 || estado.plan ? true : null,
        onclick: () => { estado.plan = armarPlan(); estado.deshacer = null; pintar(); },
      }, sinAsignar.length ? `Asignar ${plural(sinAsignar.length, "lead", "leads")} por turnos` : "Todo está asignado");

      const cabeza = h("header", { class: "pp-cabeza" },
        h("div", {},
          h("h2", { id: "pp-titulo" }, "Carga del equipo"),
          h("p", {}, `Le toca a ${turno} recibir el próximo lead.`)),
        boton);

      const cifras = h("dl", { class: "pp-cifras" },
        h("div", { class: "pp-reserva" }, h("dt", {}, "UF en reserva"), h("dd", { class: "pp-num" }, uf(enReserva.reduce((s, c) => s + Number(c.valorUF || 0), 0)), h("small", {}, plural(enReserva.length, "reserva", "reservas")))),
        h("div", {}, h("dt", {}, "Leads activos"), h("dd", { class: "pp-num" }, String(activos.length), h("small", {}, `de ${todos.length}`))),
        h("div", {}, h("dt", {}, "Sin responsable"), h("dd", { class: "pp-num" }, String(sinAsignar.length))),
        h("div", {}, h("dt", {}, "Promedio por persona"), h("dd", { class: "pp-num" }, (activos.filter((c) => c.responsable).length / equipo.length).toLocaleString("es-CL", { maximumFractionDigits: 1 }), h("small", {}, "activos"))));

      // Tabla de carga: un cuadrado por lead activo, del color de su etapa.
      // "Más cargado" solo cuando una persona supera claramente al resto.
      const cargas = equipo.map((p) => activos.filter((c) => c.responsable === p).length);
      const maxCarga = Math.max(...cargas);
      const unico = cargas.filter((n) => n === maxCarga).length === 1;
      const filaEquipo = (persona) => {
        const suyos = todos.filter((c) => (c.responsable ?? null) === persona);
        const act = suyos.filter((c) => ACTIVAS.includes(c.etapa)).sort((a, b) => ACTIVAS.indexOf(a.etapa) - ACTIVAS.indexOf(b.etapa));
        const ufRes = suyos.filter((c) => c.etapa === "Reserva").reduce((s, c) => s + Number(c.valorUF || 0), 0);
        const clave = persona ?? "";
        const bloques = act.length
          ? act.map((c) => h("i", { class: persona ? null : "pp-libre", style: persona ? `background:${COLOR[c.etapa]}` : null, title: `${c.nombre} · ${c.etapa}` }))
          : [h("i", { class: "pp-cero" }, "Sin leads activos")];
        const nombre = persona ?? "Sin asignar";
        return h("button", {
          class: "pp-fila", type: "button", "data-foco": `fila-${clave}`,
          "aria-pressed": estado.filtro === clave ? "true" : "false",
          "aria-label": `${nombre}: ${plural(act.length, "lead activo", "leads activos")}, ${plural(suyos.length, "lead", "leads")} en total, ${uf(ufRes)} UF en reserva. Filtrar tablero.`,
          onclick: () => { estado.filtro = estado.filtro === clave ? null : clave; pintar(); },
        },
          h("span", { class: "pp-persona" }, avatar(persona), nombre,
            persona && unico && act.length === maxCarga && maxCarga > 1 ? h("em", {}, "más cargado") : null),
          h("span", { class: "pp-bloques", "aria-hidden": "true" }, bloques),
          h("span", { class: "pp-num" }, String(act.length)),
          h("span", { class: "pp-num" }, String(suyos.length)),
          h("span", { class: "pp-num" }, ufRes ? uf(ufRes) : "—"),
          h("span", { class: "pp-resumen pp-num" }, `${act.length} activos · ${suyos.length} total${ufRes ? ` · ${uf(ufRes)} UF` : ""}`));
      };

      const tablaEquipo = h("section", { class: "pp-equipo", "aria-labelledby": "pp-equipo-t" },
        h("h3", { id: "pp-equipo-t" }, "Leads por persona"),
        h("div", { class: "pp-titulos", "aria-hidden": "true" },
          h("span", {}, "Responsable"), h("span", {}, "Carga activa por etapa"), h("span", {}, "Activos"), h("span", {}, "Total"), h("span", {}, "UF reserva")),
        equipo.map(filaEquipo),
        filaEquipo(null),
        h("div", { class: "pp-leyenda" }, ACTIVAS.map((e) => h("span", {}, h("i", { style: `background:${COLOR[e]}` }), e)),
          h("span", {}, h("i", { style: "border:1.5px dashed #9AA6AF" }), "Sin responsable")));

      // Vista previa del reparto
      let plan = null;
      if (estado.plan) {
        estado.plan = armarPlan();
        const { filas } = estado.plan;
        plan = h("section", { class: "pp-plan", "aria-labelledby": "pp-plan-t" },
          h("h3", { id: "pp-plan-t" }, `Así quedaría el reparto de ${plural(filas.length, "lead", "leads")}`),
          h("p", {}, `Por turnos, empezando por ${equipo[estado.plan.inicio]}. Después le tocará ${estado.plan.siguiente === estado.plan.inicio ? "de nuevo " : ""}a ${equipo[estado.plan.siguiente]}.`),
          h("ol", {}, filas.map(({ contacto: c, persona }) => h("li", {},
            h("span", {}, h("strong", {}, c.nombre), h("small", {}, `${c.proyecto || "Sin proyecto"} · ${c.etapa} · ${uf(c.valorUF)} UF`)),
            h("span", { class: "pp-flecha", "aria-hidden": "true" }, "→"),
            h("span", { class: "pp-destino" }, avatar(persona), persona)))),
          h("div", { class: "pp-acciones" },
            h("button", { type: "button", onclick: () => { estado.plan = null; pintar(); } }, "Cancelar"),
            h("button", { class: "pp-asignar", type: "button", "data-foco": "confirmar", onclick: aplicarPlan }, "Confirmar reparto")));
      }

      const hecho = estado.deshacer
        ? h("div", { class: "pp-hecho", role: "status" },
          h("span", {}, `Se asignaron ${plural(estado.deshacer.filas.length, "lead", "leads")} por turnos.`),
          h("span", {},
            h("button", { type: "button", "data-foco": "deshacer", onclick: deshacer }, "Deshacer"), " ",
            h("button", { type: "button", "aria-label": "Cerrar aviso", onclick: () => { estado.deshacer = null; pintar(); } }, "Listo")))
        : null;

      // Kanban
      const visibles = estado.filtro == null ? todos : todos.filter((c) => (c.responsable ?? "") === estado.filtro);
      const filtro = estado.filtro != null
        ? h("div", { class: "pp-filtro" },
          `Mostrando solo los leads de ${estado.filtro || "nadie (sin asignar)"}.`,
          h("button", { type: "button", onclick: () => { estado.filtro = null; pintar(); } }, "Ver todos"))
        : null;

      const tarjeta = (c) => {
        const d = diasDesde(c.ultimoContacto);
        const idx = crm.etapas.indexOf(c.etapa);
        return h("article", {
          class: `pp-tarjeta${estado.nuevas.has(c.id) ? " nueva" : ""}`, draggable: "true", tabindex: "0",
          "data-foco": `t-${c.id}`,
          "aria-label": `${c.nombre}, ${c.etapa}, ${c.responsable ?? "sin responsable"}. Enter abre la ficha; flechas mueven de etapa.`,
          ondragstart: (e) => { arrastrado = c.id; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(c.id)); e.currentTarget.classList.add("arrastrando"); },
          ondragend: (e) => { arrastrado = null; e.currentTarget.classList.remove("arrastrando"); },
          onclick: () => crm.abrir(c.id),
          onkeydown: (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); crm.abrir(c.id); }
            const paso = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
            const destino = crm.etapas[idx + paso];
            if (paso && destino) { e.preventDefault(); crm.actualizar(c.id, { etapa: destino }); }
          },
        },
          h("strong", {}, c.nombre),
          h("small", {}, c.proyecto || "Sin proyecto"),
          h("div", { class: "pp-pie" },
            h("span", { class: "pp-uf pp-num" }, `${uf(c.valorUF)} UF`),
            c.etapa === "Ganado" ? null : h("span", { class: `pp-dias${d != null && d > 7 ? " frio" : ""}` }, textoDias(d)),
            h("span", { title: c.responsable ?? "Sin responsable" }, avatar(c.responsable))));
      };

      const tablero = h("div", { class: "pp-tablero" }, crm.etapas.map((etapa) => {
        const lista = visibles.filter((c) => c.etapa === etapa);
        const total = lista.reduce((s, c) => s + Number(c.valorUF || 0), 0);
        const col = h("section", {
          class: "pp-col", "aria-label": `${etapa}, ${plural(lista.length, "lead", "leads")}`,
          ondragover: (e) => { if (arrastrado != null) { e.preventDefault(); col.classList.add("sobre"); } },
          ondragleave: (e) => { if (!col.contains(e.relatedTarget)) col.classList.remove("sobre"); },
          ondrop: (e) => {
            e.preventDefault(); col.classList.remove("sobre");
            const id = arrastrado ?? Number(e.dataTransfer.getData("text/plain"));
            const c = todos.find((x) => x.id === id);
            if (c && c.etapa !== etapa) { crm.actualizar(id, { etapa }); crm.avisar(`${c.nombre} pasó a ${etapa}`); }
          },
        },
          h("h3", {}, h("i", { style: `background:${COLOR[etapa]}`, "aria-hidden": "true" }), etapa, h("span", { class: "pp-num" }, String(lista.length))),
          h("small", { class: "pp-num" }, lista.length ? `${uf(total)} UF` : "—"),
          lista.length ? lista.map(tarjeta) : h("div", { class: "pp-vacio" }, "Arrastra un lead aquí"));
        return col;
      }));

      raiz.replaceChildren(...[cabeza, plan, hecho, cifras, tablaEquipo, filtro, tablero].filter(Boolean));
      if (foco) raiz.querySelector(`[data-foco="${foco}"]`)?.focus({ preventScroll: true });
      else if (plan) raiz.querySelector('[data-foco="confirmar"]')?.focus({ preventScroll: true });
    }

    crm.alCambiar(pintar);
    pintar();
  },
};
