// Página Matías: embudo de leads de parcelas, al estilo de un tablero de Monday.
// Estados como píldoras de color pleno, grupos con su color, barra de batería del embudo,
// vistas «Kanban» y «Tabla» y filtro por persona con avatares.
// Cuadrícula (1440 px): 1fr + 320 px de riel + 24 px de espacio; el tablero reparte su ancho
// en 5 columnas iguales con 12 px de espacio, así que las tarjetas llegan a ambos bordes.
const DIA = 864e5;
const LIMITE = 7; // días sin contacto a partir de los cuales un lead pide atención
const AZUL = "#0073EA";
const ROJO = "#DF2F4A";
// Un color por etapa (en el orden de crm.etapas) y el color del texto que lleva encima.
const COLORES = [
  { bg: "#579BFC", fg: "#fff" },
  { bg: "#A25DDC", fg: "#fff" },
  { bg: "#FDAB3D", fg: "#fff" },
  { bg: "#FFCB00", fg: "#323338" },
  { bg: "#00C875", fg: "#fff" },
];
const PERSONAS = { Paula: "#FB275D", Matías: "#0086C0", Camila: "#9D50DD", Diego: "#CAB641" };

const uf = (n) => Math.round(n).toLocaleString("es-CL");
const pct = (n) => `${n.toFixed(1).replace(".", ",")} %`;
const dias = (fecha) => Math.max(0, Math.floor((Date.now() - new Date(fecha).getTime()) / DIA));
const hoy = () => new Date().toISOString().slice(0, 10);

function el(tag, clase, texto) {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

const ESTILO = `
.mx{flex:1;min-width:0;background:#fff;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:20px;color:#323338;font-family:Figtree,Roboto,system-ui,-apple-system,"Segoe UI",sans-serif}
.mx *{box-sizing:border-box}
.mx button{font-family:inherit;font-size:.92rem;cursor:pointer;white-space:nowrap;flex:none}
.mx button:focus-visible,.mx input:focus-visible,.mx .mx-tarj:focus-visible,.mx tr:focus-visible{outline:2px solid ${AZUL};outline-offset:2px}
.mx-cab{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}
.mx-cab h2{margin:0;font-size:1.75rem;font-weight:700;letter-spacing:-.01em}
.mx-cab p{margin:6px 0 0;color:#676879;font-size:.95rem;max-width:64ch}
.mx-cab p b{color:#323338;font-weight:600}
.mx-prim{background:${AZUL};color:#fff;border:0;border-radius:4px;padding:9px 18px;font-weight:500}
.mx-prim:hover{background:#0060B9}
.mx-vistas{display:flex;gap:4px;border-bottom:1px solid #E6E9EF;margin-bottom:-4px}
.mx-vistas button{background:transparent;border:0;border-bottom:2px solid transparent;padding:8px 12px;color:#676879;border-radius:4px 4px 0 0}
.mx-vistas button:hover{background:#F5F6F8}
.mx-vistas button[aria-pressed=true]{color:${AZUL};border-bottom-color:${AZUL};font-weight:500}
.mx-barra{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.mx-barra input[type=search]{padding:7px 12px;border:1px solid #C3C6D4;border-radius:4px;font:inherit;font-size:.92rem;width:min(240px,100%)}
.mx-barra input[type=search]:hover{border-color:#676879}
.mx-pers{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.mx-pers button{display:inline-flex;align-items:center;gap:6px;background:transparent;border:1px solid transparent;border-radius:4px;padding:4px 10px 4px 5px;color:#323338}
.mx-pers button:hover{background:#F5F6F8}
.mx-pers button[aria-pressed=true]{background:#CCE5FF;border-color:${AZUL}}
.mx-pers .sola{padding-left:10px}
.mx-av{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;font-size:.75rem;font-weight:600;color:#fff;flex:none}
.mx-av.vacio{background:#fff;color:#676879;border:1px dashed #C3C6D4}
.mx-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.mx-kpi{border:1px solid #E6E9EF;border-radius:8px;padding:14px 18px;display:flex;flex-direction:column;gap:2px;min-width:0}
.mx-kpi span{font-size:.88rem;color:#676879;display:flex;align-items:center;gap:7px}
.mx-kpi span::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--c,${AZUL});flex:none}
.mx-kpi b{font-size:1.9rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.2}
.mx-kpi b i{font-style:normal;font-size:.9rem;color:#676879;margin-left:4px;font-weight:400}
.mx-kpi small{font-size:.8rem;color:#676879}
.mx-bat{border:1px solid #E6E9EF;border-radius:8px;padding:14px 18px}
.mx-bat .cab{display:flex;justify-content:space-between;gap:12px;font-size:.88rem;color:#676879;margin-bottom:8px;flex-wrap:wrap}
.mx-bat .cab b{color:#323338;font-weight:600}
.mx-bat .tira{display:flex;height:26px;border-radius:4px;overflow:hidden;gap:2px;background:#F5F6F8}
.mx-bat .tira div{display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:600;min-width:0}
.mx-bat .tira div:first-child{border-radius:4px 0 0 4px}
.mx-bat .tira div:last-child{border-radius:0 4px 4px 0}
.mx-bat ul{list-style:none;margin:10px 0 0;padding:0;display:flex;gap:16px;flex-wrap:wrap;font-size:.85rem;color:#676879}
.mx-bat li{display:flex;align-items:center;gap:6px}
.mx-bat li i{width:10px;height:10px;border-radius:2px;display:inline-block}
.mx-cuerpo{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
.mx-tablero{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;align-items:stretch}
.mx-col{background:#F5F6F8;border-radius:8px;padding:8px;min-height:220px;transition:background .12s}
.mx-col.sobre{background:#DCEBFB}
.mx-col h3{margin:0 0 6px;padding:7px 10px;border-radius:4px;font-size:.92rem;font-weight:600;display:flex;justify-content:space-between;align-items:baseline;gap:6px}
.mx-col h3 span{font-weight:500;font-size:.85rem;font-variant-numeric:tabular-nums;opacity:.9}
.mx-sub{margin:0 4px 8px;font-size:.8rem;color:#676879;font-variant-numeric:tabular-nums}
.mx-tarj{background:#fff;border:1px solid #E6E9EF;border-radius:6px;padding:10px 12px;margin-bottom:8px;cursor:grab;display:flex;flex-direction:column;gap:6px}
.mx-tarj:hover{box-shadow:0 2px 8px rgba(50,51,56,.16)}
.mx-tarj.arrastrando{opacity:.45}
.mx-tarj .nom{font-weight:600;font-size:.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mx-tarj .proy{font-size:.8rem;color:#676879;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mx-fila{display:flex;justify-content:space-between;align-items:center;gap:8px}
.mx-valor{font-variant-numeric:tabular-nums;font-size:.92rem;font-weight:600}
.mx-valor i{font-style:normal;font-weight:400;color:#676879;font-size:.78rem;margin-left:3px}
.mx-cont{font-size:.78rem;color:#676879}
.mx-cont.tarde{color:${ROJO};font-weight:600}
.mx-vacia{font-size:.82rem;color:#676879;text-align:center;padding:18px 6px;border:1px dashed #C3C6D4;border-radius:6px}
.mx-grupo{margin-bottom:22px}
.mx-grupo h3{margin:0 0 6px;font-size:1rem;font-weight:600;display:flex;gap:8px;align-items:baseline;color:var(--c)}
.mx-grupo h3 span{font-size:.85rem;color:#676879;font-weight:400}
.mx-tabla{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;font-size:.92rem}
.mx-tabla th:nth-child(1){width:23%}.mx-tabla th:nth-child(2){width:20%}.mx-tabla th:nth-child(3){width:16%}.mx-tabla th:nth-child(4){width:130px}.mx-tabla th:nth-child(5){width:13%}.mx-tabla th:nth-child(6){width:15%}
.mx-tabla th{text-align:left;font-weight:400;font-size:.82rem;color:#676879;padding:8px 12px;border-bottom:1px solid #E6E9EF;border-top:1px solid #E6E9EF}
.mx-tabla th.n,.mx-tabla td.n{text-align:right}
.mx-tabla td{padding:0 12px;height:40px;border-bottom:1px solid #E6E9EF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mx-tabla tbody tr{cursor:pointer}
.mx-tabla tbody tr:hover td{background:#F5F6F8}
.mx-tabla td:first-child{border-left:6px solid var(--c);font-weight:500;border-radius:4px 0 0 4px}
.mx-tabla td.n{font-variant-numeric:tabular-nums}
.mx-tabla td.est{padding:0;width:130px}
.mx-pill{display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-weight:500;font-size:.88rem}
.mx-tabla td.late{color:${ROJO};font-weight:600}
.mx-riel{display:flex;flex-direction:column;gap:16px}
.mx-riel h3{margin:0 0 8px;font-size:1rem;font-weight:600}
.mx-riel .caja{border:1px solid #E6E9EF;border-radius:8px;padding:6px 16px}
.mx-hbar{padding:9px 0}
.mx-hbar .t{display:flex;justify-content:space-between;gap:8px;font-size:.88rem}
.mx-hbar .t span:last-child{font-variant-numeric:tabular-nums;color:#676879}
.mx-hbar .pista{height:8px;border-radius:4px;background:#E6E9EF;margin-top:6px;overflow:hidden}
.mx-hbar .pista div{height:100%;background:${AZUL};border-radius:4px}
.mx-aten{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 0;min-height:52px}
.mx-aten+.mx-aten{border-top:1px solid #E6E9EF}
.mx-aten .nom{font-weight:600;font-size:.9rem;cursor:pointer}
.mx-aten .nom:hover{color:${AZUL}}
.mx-aten small{display:block;color:#676879;font-size:.78rem}
.mx .mx-ghost{background:#fff;border:1px solid #C3C6D4;border-radius:4px;padding:5px 10px;font-size:.82rem;color:#323338}
.mx .mx-ghost:hover{background:#CCE5FF;border-color:${AZUL}}
.mx-ok{font-size:.88rem;color:#676879;padding:10px 0}
@media(max-width:1180px){.mx-cuerpo{grid-template-columns:minmax(0,1fr)}.mx-tablero{grid-template-columns:repeat(5,minmax(190px,1fr));overflow-x:auto;padding-bottom:6px}}
@media(max-width:760px){.mx{padding:16px}.mx-kpis{grid-template-columns:1fr 1fr}.mx-tabla-caja{overflow-x:auto}.mx-tabla{min-width:620px}}
@media(prefers-reduced-motion:reduce){.mx-col{transition:none}}
`;

function avatar(nombre) {
  if (!nombre) {
    const v = el("span", "mx-av vacio", "?");
    v.title = "Sin asignar";
    return v;
  }
  const a = el("span", "mx-av", nombre[0]);
  a.style.background = PERSONAS[nombre] ?? AZUL;
  a.title = nombre;
  return a;
}

export default {
  nombre: "Página Matías",
  autor: "matias",
  montar(contenedor, crm) {
    if (!document.getElementById("mx-estilo")) {
      const s = el("style");
      s.id = "mx-estilo";
      s.textContent = ESTILO;
      document.head.append(s);
    }

    const color = (etapa) => COLORES[crm.etapas.indexOf(etapa)] ?? { bg: AZUL, fg: "#fff" };
    let responsable = "Todos";
    let busqueda = "";
    let vista = "Kanban";

    const raiz = el("div", "mx");
    const cab = el("div", "mx-cab");
    const titulos = el("div");
    const sub = el("p");
    titulos.append(el("h2", "", "Embudo de leads"), sub); // el h1 de la página es el del menú
    const nuevo = el("button", "mx-prim", "Nuevo lead");
    nuevo.type = "button";
    nuevo.addEventListener("click", () => {
      const id = crm.agregar({ nombre: "Lead nuevo", etapa: crm.etapas[0] });
      crm.abrir(id);
    });
    cab.append(titulos, nuevo);

    const tabs = el("div", "mx-vistas");
    tabs.setAttribute("role", "group");
    tabs.setAttribute("aria-label", "Vista");
    const barra = el("div", "mx-barra");
    const buscar = el("input");
    buscar.type = "search";
    buscar.placeholder = "Buscar lead o proyecto";
    buscar.setAttribute("aria-label", "Buscar lead o proyecto");
    const pers = el("div", "mx-pers");
    pers.setAttribute("role", "group");
    pers.setAttribute("aria-label", "Filtrar por persona");
    barra.append(buscar, pers);

    const kpis = el("div", "mx-kpis");
    const bateria = el("div", "mx-bat");
    const cuerpo = el("div", "mx-cuerpo");
    const principal = el("div");
    const riel = el("div", "mx-riel");
    cuerpo.append(principal, riel);
    raiz.append(cab, tabs, barra, kpis, bateria, cuerpo);
    contenedor.append(raiz);

    buscar.addEventListener("input", () => { busqueda = buscar.value.trim().toLowerCase(); pintar(); });

    const visibles = (todos) => todos.filter((c) => {
      if (responsable === "Sin asignar" && c.responsable) return false;
      if (responsable !== "Todos" && responsable !== "Sin asignar" && c.responsable !== responsable) return false;
      return !busqueda || `${c.nombre} ${c.proyecto}`.toLowerCase().includes(busqueda);
    });

    function pintarTabs() {
      tabs.replaceChildren();
      for (const nombre of ["Kanban", "Tabla"]) {
        const b = el("button", "", nombre);
        b.type = "button";
        b.setAttribute("aria-pressed", String(nombre === vista));
        b.addEventListener("click", () => { vista = nombre; pintarTabs(); pintar(); });
        tabs.append(b);
      }
    }

    function pintarPersonas() {
      pers.replaceChildren();
      for (const nombre of ["Todos", ...crm.equipo, "Sin asignar"]) {
        const b = el("button", nombre === "Todos" ? "sola" : "");
        b.type = "button";
        b.setAttribute("aria-pressed", String(nombre === responsable));
        if (nombre !== "Todos") b.append(avatar(nombre === "Sin asignar" ? null : nombre));
        b.append(nombre);
        b.addEventListener("click", () => { responsable = nombre; pintarPersonas(); pintar(); });
        pers.append(b);
      }
    }

    function kpi(c, rotulo, valor, unidad, nota) {
      const k = el("div", "mx-kpi");
      k.style.setProperty("--c", c);
      const v = el("b", "", valor);
      if (unidad) v.append(el("i", "", unidad));
      k.append(el("span", "", rotulo), v, el("small", "", nota));
      return k;
    }

    function pintarKpis(todos) {
      const ganados = todos.filter((c) => c.etapa === "Ganado");
      const abiertos = todos.filter((c) => c.etapa !== "Ganado");
      const pipeline = abiertos.reduce((s, c) => s + Number(c.valorUF || 0), 0);
      const tarde = abiertos.filter((c) => dias(c.ultimoContacto) > LIMITE);
      const enRiesgo = tarde.reduce((s, c) => s + Number(c.valorUF || 0), 0);
      const tasa = todos.length ? (ganados.length / todos.length) * 100 : 0;
      sub.replaceChildren();
      if (!todos.length) {
        sub.textContent = "Aún no hay leads. Crea el primero con «Nuevo lead».";
      } else {
        sub.append("Hay ", Object.assign(el("b"), { textContent: `${uf(pipeline)} UF` }), ` abiertas en ${abiertos.length} leads; `);
        sub.append(tarde.length
          ? Object.assign(el("b"), { textContent: `${tarde.length} llevan más de ${LIMITE} días sin contacto` })
          : "todos tienen contacto reciente");
        sub.append(".");
      }
      kpis.replaceChildren(
        kpi(AZUL, "Valor del pipeline", uf(pipeline), "UF", `${abiertos.length} leads aún sin cerrar`),
        kpi("#579BFC", "Leads totales", String(todos.length), "", `${abiertos.length} abiertos · ${ganados.length} ganados`),
        kpi("#00C875", "Tasa de cierre", todos.length ? pct(tasa) : "—", "", `${ganados.length} de ${todos.length} leads ganados`),
        kpi(tarde.length ? ROJO : "#C3C6D4", `Sin contacto en ${LIMITE}+ días`, String(tarde.length), "", tarde.length ? `${uf(enRiesgo)} UF en riesgo` : "Nada pendiente"),
      );
    }

    // Batería: cómo se reparten los leads entre las etapas.
    function pintarBateria(todos) {
      bateria.replaceChildren();
      const cab2 = el("div", "cab");
      cab2.append(el("b", "", "Estado de los leads"), el("span", "", `${todos.length} leads en total`));
      const tira = el("div", "tira");
      const leyenda = el("ul");
      for (const etapa of crm.etapas) {
        const n = todos.filter((c) => c.etapa === etapa).length;
        const col = color(etapa);
        if (n) {
          const seg = el("div", "", `${n}`);
          seg.style.flex = String(n);
          seg.style.background = col.bg;
          seg.style.color = col.fg;
          seg.title = `${etapa}: ${n}`;
          tira.append(seg);
        }
        const li = el("li");
        const marca = el("i");
        marca.style.background = col.bg;
        li.append(marca, `${etapa} ${n}`);
        leyenda.append(li);
      }
      bateria.append(cab2, tira, leyenda);
    }

    function tarjeta(c) {
      const col = color(c.etapa);
      const t = el("div", "mx-tarj");
      t.style.setProperty("--c", col.bg);
      t.draggable = true;
      t.tabIndex = 0;
      t.setAttribute("role", "button");
      t.setAttribute("aria-label", `${c.nombre}, ${c.proyecto || "sin proyecto"}, ${uf(c.valorUF)} UF. Abrir ficha`);
      const d = dias(c.ultimoContacto);
      const tarde = c.etapa !== "Ganado" && d > LIMITE;
      const valor = el("span", "mx-valor", uf(c.valorUF));
      valor.append(el("i", "", "UF"));
      const f1 = el("div", "mx-fila");
      f1.append(valor, avatar(c.responsable));
      const f2 = el("div", "mx-fila");
      f2.append(el("span", tarde ? "mx-cont tarde" : "mx-cont", d === 0 ? "Contactado hoy" : `Hace ${d} d`));
      t.append(el("div", "nom", c.nombre), el("div", "proy", c.proyecto || "Sin proyecto"), f1, f2);
      t.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", String(c.id));
        e.dataTransfer.effectAllowed = "move";
        t.classList.add("arrastrando");
      });
      t.addEventListener("dragend", () => t.classList.remove("arrastrando"));
      t.addEventListener("click", () => crm.abrir(c.id));
      t.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); crm.abrir(c.id); } });
      return t;
    }

    function pintarKanban(todos, lista) {
      const tablero = el("div", "mx-tablero");
      for (const etapa of crm.etapas) {
        const deEtapa = lista.filter((c) => c.etapa === etapa);
        const col = el("div", "mx-col");
        const c = color(etapa);
        const h = el("h3", "", etapa);
        h.style.background = c.bg;
        h.style.color = c.fg;
        h.append(el("span", "", String(deEtapa.length)));
        col.append(h, el("div", "mx-sub", `${uf(deEtapa.reduce((s, x) => s + Number(x.valorUF || 0), 0))} UF`));
        if (deEtapa.length) for (const x of deEtapa) col.append(tarjeta(x));
        else col.append(el("div", "mx-vacia", "Sin leads en esta etapa"));
        col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("sobre"); });
        col.addEventListener("dragleave", () => col.classList.remove("sobre"));
        col.addEventListener("drop", (e) => {
          e.preventDefault();
          col.classList.remove("sobre");
          const id = Number(e.dataTransfer.getData("text/plain"));
          const lead = todos.find((x) => x.id === id);
          if (!lead || lead.etapa === etapa) return;
          crm.actualizar(id, { etapa });
          crm.avisar(`${lead.nombre} pasó a ${etapa}`);
        });
        tablero.append(col);
      }
      principal.replaceChildren(tablero);
    }

    function pintarTabla(lista) {
      const caja = el("div", "mx-tabla-caja");
      for (const etapa of crm.etapas) {
        const deEtapa = lista.filter((c) => c.etapa === etapa);
        const c = color(etapa);
        const g = el("div", "mx-grupo");
        g.style.setProperty("--c", c.bg);
        const h = el("h3", "", etapa);
        h.append(el("span", "", `${deEtapa.length} leads · ${uf(deEtapa.reduce((s, x) => s + Number(x.valorUF || 0), 0))} UF`));
        const tabla = el("table", "mx-tabla");
        const cabeza = tabla.createTHead().insertRow();
        for (const [t, n] of [["Lead", 0], ["Proyecto", 0], ["Persona", 0], ["Estado", 0], ["Valor (UF)", 1], ["Último contacto", 1]]) {
          const th = el("th", n ? "n" : "", t);
          th.scope = "col";
          cabeza.append(th);
        }
        const cuerpoT = tabla.createTBody();
        for (const x of deEtapa) {
          const f = cuerpoT.insertRow();
          f.tabIndex = 0;
          const d = dias(x.ultimoContacto);
          const tarde = x.etapa !== "Ganado" && d > LIMITE;
          f.insertCell().textContent = x.nombre;
          f.insertCell().textContent = x.proyecto || "Sin proyecto";
          const cp = f.insertCell();
          cp.append(avatar(x.responsable));
          cp.append(" ", x.responsable ?? "Sin asignar");
          const ce = f.insertCell();
          ce.className = "est";
          const pill = el("div", "mx-pill", etapa);
          pill.style.background = c.bg;
          pill.style.color = c.fg;
          ce.append(pill);
          const cv = f.insertCell();
          cv.className = "n";
          cv.textContent = uf(x.valorUF);
          const cc = f.insertCell();
          cc.className = tarde ? "n late" : "n";
          cc.textContent = d === 0 ? "Hoy" : `Hace ${d} d`;
          f.addEventListener("click", () => crm.abrir(x.id));
          f.addEventListener("keydown", (e) => { if (e.key === "Enter") crm.abrir(x.id); });
        }
        if (!deEtapa.length) {
          const f = cuerpoT.insertRow();
          const td = f.insertCell();
          td.colSpan = 6;
          td.textContent = "Sin leads en esta etapa";
          td.style.color = "#676879";
        }
        g.append(h, tabla);
        caja.append(g);
      }
      principal.replaceChildren(caja);
    }

    function hbarra(texto, valor, maximo, lado) {
      const b = el("div", "mx-hbar");
      const t = el("div", "t");
      t.append(el("span", "", texto), el("span", "", lado));
      const p = el("div", "pista");
      const r = el("div");
      r.style.width = `${maximo ? (valor / maximo) * 100 : 0}%`;
      p.append(r);
      b.append(t, p);
      return b;
    }

    function pintarRiel(todos) {
      riel.replaceChildren();

      // Atención: lo que hay que mover hoy, con su acción a un clic.
      const aten = todos
        .filter((c) => c.etapa !== "Ganado" && dias(c.ultimoContacto) > LIMITE)
        .sort((a, b) => dias(b.ultimoContacto) - dias(a.ultimoContacto))
        .slice(0, 4);
      const cAten = el("div");
      cAten.append(el("h3", "", "Para contactar hoy"));
      const bAten = el("div", "caja");
      if (!aten.length) bAten.append(el("div", "mx-ok", "Ningún lead supera los 7 días sin contacto."));
      for (const c of aten) {
        const f = el("div", "mx-aten");
        const dato = el("div");
        const nom = el("span", "nom", c.nombre);
        nom.addEventListener("click", () => crm.abrir(c.id));
        dato.append(nom, Object.assign(el("small"), { textContent: `${dias(c.ultimoContacto)} días sin contacto · ${c.etapa}` }));
        const b = el("button", "mx-ghost", "Contactado hoy");
        b.type = "button";
        b.addEventListener("click", () => { crm.actualizar(c.id, { ultimoContacto: hoy() }); crm.avisar(`Contacto registrado con ${c.nombre}`); });
        f.append(dato, b);
        bAten.append(f);
      }
      cAten.append(bAten);

      // Pipeline abierto por proyecto.
      const proyectos = [...new Set(todos.map((c) => c.proyecto).filter(Boolean))];
      const porProyecto = proyectos
        .map((p) => ({ p, v: todos.filter((c) => c.proyecto === p && c.etapa !== "Ganado").reduce((s, c) => s + Number(c.valorUF || 0), 0) }))
        .sort((a, b) => b.v - a.v);
      const cPro = el("div");
      cPro.append(el("h3", "", "Pipeline por proyecto"));
      const bPro = el("div", "caja");
      const max = Math.max(0, ...porProyecto.map((x) => x.v));
      if (!porProyecto.length) bPro.append(el("div", "mx-ok", "Sin proyectos todavía."));
      for (const x of porProyecto) bPro.append(hbarra(x.p, x.v, max, `${uf(x.v)} UF`));
      cPro.append(bPro);

      riel.append(cAten, cPro);
    }

    function pintar() {
      const todos = crm.contactos();
      const lista = visibles(todos);
      pintarKpis(todos);
      pintarBateria(todos);
      if (vista === "Kanban") pintarKanban(todos, lista);
      else pintarTabla(lista);
      pintarRiel(todos);
    }

    crm.alCambiar(pintar);
    pintarTabs();
    pintarPersonas();
    pintar();
  },
};
