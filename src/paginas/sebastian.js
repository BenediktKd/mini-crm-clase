const DIA = 864e5;
const LIMITE = 7;
const UF = new Intl.NumberFormat("es-CL");

// Pregunta de la pantalla: ¿a quién llamo hoy?
// Hallazgo: se calcula con los datos y va bajo el título.

const CSS = `
.sb{--sp-azul:#082F52;--sp-rosa:#CC3366;--sb-linea:#D3DCE5;--sb-suave:#EAEFF4;--sb-tinta2:#3A4A58;--tinta:#333;font-family:Poppins,system-ui,-apple-system,"Segoe UI",sans-serif;background:#fff;border-radius:16px;padding:20px 22px 24px;display:flex;flex-direction:column;gap:18px;font-variant-numeric:tabular-nums}
.sb *{box-shadow:none}
.sb-cab{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}
.sb-cab h2{margin:0;font-size:1.6rem;font-weight:600;color:var(--sp-azul)}
.sb-cab p{margin:4px 0 0;color:var(--sb-tinta2);font-size:1rem;max-width:68ch}
.sb-cab p b{color:var(--sp-rosa);font-weight:600}
.sb-kpis{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;background:#fff;border:1px solid var(--sb-linea);border-radius:12px}
.sb-kpi{padding:14px 18px;display:flex;flex-direction:column;gap:2px;min-width:0}
.sb-kpi+.sb-kpi{border-left:1px solid var(--sb-suave)}
.sb-kpi span{font-size:.88rem;color:var(--gris)}
.sb-kpi b{font-size:1.6rem;font-weight:600;line-height:1.15;color:var(--sp-azul)}
.sb-kpi.guia b{font-size:2.1rem}
.sb-kpi small{font-size:.85rem;color:var(--gris)}
.sb-kpi.alerta b{color:var(--sp-rosa)}
.sb-filtros{display:inline-flex;gap:2px;padding:3px;background:var(--sb-suave);border-radius:12px;flex-wrap:wrap}
.sb-filtros button{border:0;background:transparent;border-radius:8px;padding:6px 12px;color:var(--sb-tinta2);font-size:.92rem}
.sb-filtros button:hover{background:#fff}
.sb-filtros button[aria-pressed="true"]{background:#fff;color:var(--sp-azul);font-weight:600;outline:1px solid var(--sb-linea)}
.sb-filtros i{font-style:normal;color:var(--gris);margin-left:6px}
.sb-cuerpo{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;align-items:start}
.sb-tablero{display:grid;grid-template-columns:repeat(5,minmax(190px,1fr));gap:16px;overflow-x:auto;padding-bottom:4px}
.sb-col{background:var(--sb-suave);border-radius:12px;padding:10px;min-height:200px;transition:background .15s}
.sb-col.sobre{background:#D7E4F0}
.sb-col h3{margin:2px 4px 10px;font-size:.95rem;font-weight:600;display:flex;justify-content:space-between;color:var(--sp-azul)}
.sb-col h3 span{color:var(--gris);font-weight:400}
.sb-vacio{color:var(--gris);text-align:center;padding:18px 0;font-size:.9rem}
.sb-card{background:#fff;border:1px solid var(--sb-linea);border-radius:10px;padding:11px 12px;margin-bottom:8px;cursor:grab;transition:border-color .12s}
.sb-card:hover{border-color:var(--sp-azul)}
.sb-card:focus-visible,.sb-fila button:focus-visible,.sb-fila select:focus-visible,.sb-filtros button:focus-visible{outline:2px solid var(--sp-azul);outline-offset:2px}
.sb-card.arrastra{opacity:.45}
.sb-card strong{display:block;font-weight:600}
.sb-card small{display:block;color:var(--gris)}
.sb-avisos{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.sb-chip{padding:2px 8px;border-radius:99px;font-size:.8rem;background:#F9E1EA;color:#8C1F47;white-space:nowrap;flex:none}
.sb-chip.neutro{background:#E1E9F1;color:#082F52}
.sb-pie{display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:.88rem;color:var(--sb-tinta2)}
.sb-av{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;font-size:.78rem;font-weight:700;flex:none}
.sb-av.vacio{background:#fff;color:var(--gris);border:1px dashed var(--gris);font-weight:400}
.sb-panel{background:#fff;border:1px solid var(--sb-linea);border-radius:12px;padding:6px 16px 8px}
.sb-panel header{display:flex;justify-content:space-between;align-items:baseline;padding:10px 0 8px}
.sb-panel h3{margin:0;font-size:1rem;font-weight:600;color:var(--sp-azul)}
.sb-panel header span{color:var(--gris);font-size:.88rem}
.sb-fila{padding:11px 0;border-top:1px solid var(--sb-suave);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;align-items:center}
.sb-fila .nom{font-weight:600;background:none;border:0;padding:0;text-align:left;color:var(--tinta);cursor:pointer;border-radius:4px}
.sb-fila .nom:hover{text-decoration:underline}
.sb-fila .det{grid-column:1;font-size:.88rem;color:var(--gris)}
.sb-fila .det b{color:var(--sp-rosa);font-weight:600}
.sb-fila .acc{grid-column:2;grid-row:1 / span 2;display:flex;flex-direction:column;gap:4px;align-items:stretch}
.sb-fila button.ok{font-size:.88rem;padding:6px 12px;border-radius:12px;white-space:nowrap;background:var(--sp-azul);border-color:var(--sp-azul);color:#F3F4F7}.sb-fila button.ok:hover{background:#0B4274}
.sb-fila select{font:inherit;font-size:.88rem;padding:4px 6px;border:1px solid var(--borde);border-radius:8px;background:#fff;color:var(--tinta)}
.sb-fila .barra{grid-column:1 / -1;height:3px;border-radius:2px;margin-top:6px;background:var(--sp-azul);opacity:.45}
.sb-fila .barra.fuerte{background:var(--sp-rosa);opacity:1}
.sb-nada{padding:14px 0 10px;color:var(--gris);border-top:1px solid var(--sb-suave)}
@media(max-width:1100px){.sb-cuerpo{grid-template-columns:1fr}.sb-panel{order:-1}.sb-kpis{grid-template-columns:1fr 1fr}.sb-kpi:nth-child(3){border-left:0}.sb-kpi:nth-child(n+3){border-top:1px solid var(--sb-suave)}}
@media(max-width:520px){.sb-kpis{grid-template-columns:1fr}.sb-kpi+.sb-kpi{border-left:0;border-top:1px solid var(--sb-suave)}}
@media(prefers-reduced-motion:reduce){.sb *{transition:none!important}}
`;

// Cada persona tiene un tono pálido propio (identidad, no dato).
const TONOS = {
  Paula: ["#E3ECF7", "#1F4D7A"],
  "Matías": ["#E0F0EC", "#0B6B5E"],
  Camila: ["#F1E4F0", "#7A2F73"],
  Diego: ["#F3EBD3", "#6B5413"],
};

function diasSin(c) {
  if (!c.ultimoContacto) return 999;
  const [a, m, d] = c.ultimoContacto.split("-").map(Number);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((hoy - new Date(a, m - 1, d)) / DIA));
}

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

function nodo(tag, clase, texto) {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

function avatar(nombre) {
  const a = nodo("span", nombre ? "sb-av" : "sb-av vacio", nombre ? nombre[0] : "–");
  a.title = nombre || "Sin responsable";
  if (nombre && TONOS[nombre]) {
    a.style.background = TONOS[nombre][0];
    a.style.color = TONOS[nombre][1];
  }
  return a;
}

export default {
  nombre: "Página Sebastián",
  autor: "sebastian",
  montar(el, crm) {
    let filtro = "todos";
    const estilo = nodo("style", "", CSS);

    const dibujar = () => {
      if (!el.isConnected) return;
      const todos = crm.contactos();
      const abiertos = todos.filter((c) => c.etapa !== "Ganado");
      const atrasados = abiertos.filter((c) => diasSin(c) > LIMITE);
      const sinResp = abiertos.filter((c) => !c.responsable);
      const llamar = abiertos
        .filter((c) => diasSin(c) > LIMITE || !c.responsable)
        .sort((a, b) => diasSin(b) - diasSin(a));
      const valorAbierto = abiertos.reduce((s, c) => s + (Number(c.valorUF) || 0), 0);

      const visibles = todos.filter((c) => {
        if (filtro === "atrasados") return c.etapa !== "Ganado" && diasSin(c) > LIMITE;
        if (filtro === "sinresp") return c.etapa !== "Ganado" && !c.responsable;
        return true;
      });

      const prev = el.querySelector(".sb-tablero");
      const scroll = prev ? prev.scrollLeft : 0;

      const raiz = nodo("div", "sb");

      // Título y hallazgo
      const cab = nodo("div", "sb-cab");
      const tit = nodo("div");
      tit.append(nodo("h2", "", "Seguimiento de leads"));
      const frase = nodo("p");
      if (llamar.length) {
        const top = llamar[0];
        frase.append(`${plural(llamar.length, "lead necesita", "leads necesitan")} una llamada hoy. El más atrasado es `);
        frase.append(nodo("b", "", top.nombre));
        frase.append(diasSin(top) > LIMITE ? ` (${diasSin(top)} días sin contacto).` : " (sin responsable).");
      } else {
        frase.textContent = "Todo al día: ningún lead abierto está atrasado ni sin responsable.";
      }
      tit.append(frase);
      cab.append(tit);
      raiz.append(cab);

      // Métricas: un solo bloque dividido, la respuesta lidera
      const kpis = nodo("div", "sb-kpis");
      const kpi = (titulo, valor, nota, clase) => {
        const k = nodo("div", `sb-kpi ${clase || ""}`);
        k.append(nodo("span", "", titulo), nodo("b", "", String(valor)), nodo("small", "", nota));
        return k;
      };
      kpis.append(
        kpi("Para llamar hoy", llamar.length, "Atrasados o sin responsable", "guia"),
        kpi("Sin contacto hace más de 7 días", atrasados.length, "Entre los leads abiertos", atrasados.length ? "alerta" : ""),
        kpi("Sin responsable", sinResp.length, "Entre los leads abiertos", sinResp.length ? "alerta" : ""),
        kpi("Leads abiertos", abiertos.length, `${UF.format(valorAbierto)} UF en seguimiento`)
      );
      raiz.append(kpis);

      // Filtros
      const filtros = nodo("div", "sb-filtros");
      filtros.setAttribute("role", "group");
      filtros.setAttribute("aria-label", "Filtrar el tablero");
      for (const [id, texto, n] of [
        ["todos", "Todos", todos.length],
        ["atrasados", "Sin contacto > 7 días", atrasados.length],
        ["sinresp", "Sin responsable", sinResp.length],
      ]) {
        const b = nodo("button", "", texto);
        b.type = "button";
        b.setAttribute("aria-pressed", String(filtro === id));
        b.append(nodo("i", "", String(n)));
        b.addEventListener("click", () => { filtro = id; dibujar(); });
        filtros.append(b);
      }
      raiz.append(filtros);

      const cuerpo = nodo("div", "sb-cuerpo");
      const tablero = nodo("div", "sb-tablero");

      for (const etapa of crm.etapas) {
        const col = nodo("div", "sb-col");
        const lista = visibles.filter((c) => c.etapa === etapa);
        const h = nodo("h3", "", etapa);
        h.append(nodo("span", "", String(lista.length)));
        col.append(h);

        col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("sobre"); });
        col.addEventListener("dragleave", () => col.classList.remove("sobre"));
        col.addEventListener("drop", (e) => {
          e.preventDefault();
          col.classList.remove("sobre");
          const id = Number(e.dataTransfer.getData("text/plain"));
          const c = todos.find((x) => x.id === id);
          if (c && c.etapa !== etapa) {
            crm.actualizar(id, { etapa });
            crm.avisar(`${c.nombre} pasó a ${etapa}`);
          }
        });

        if (!lista.length) col.append(nodo("div", "sb-vacio", "Sin leads"));

        for (const c of lista) {
          const t = nodo("div", "sb-card");
          t.draggable = true;
          t.tabIndex = 0;
          t.setAttribute("role", "button");
          t.setAttribute("aria-label", `Abrir ficha de ${c.nombre}`);
          t.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", String(c.id)); t.classList.add("arrastra"); });
          t.addEventListener("dragend", () => t.classList.remove("arrastra"));
          t.addEventListener("click", () => crm.abrir(c.id));
          t.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); crm.abrir(c.id); } });
          t.append(nodo("strong", "", c.nombre), nodo("small", "", c.proyecto));

          const dias = diasSin(c);
          const av = nodo("div", "sb-avisos");
          if (c.etapa !== "Ganado") {
            if (dias > LIMITE) av.append(nodo("span", "sb-chip", `${dias} días sin contacto`));
            if (!c.responsable) av.append(nodo("span", "sb-chip neutro", "Sin responsable"));
          }
          if (av.children.length) t.append(av);

          const pie = nodo("div", "sb-pie");
          pie.append(nodo("span", "", `${UF.format(c.valorUF)} UF`), avatar(c.responsable));
          t.append(pie);
          col.append(t);
        }
        tablero.append(col);
      }

      // Panel: a quién llamar hoy, con la acción en la fila
      const panel = nodo("section", "sb-panel");
      const ph = nodo("header");
      ph.append(nodo("h3", "", "A quién llamar hoy"), nodo("span", "", plural(llamar.length, "lead", "leads")));
      panel.append(ph);
      if (!llamar.length) panel.append(nodo("div", "sb-nada", "No hay llamadas pendientes."));

      for (const c of llamar) {
        const dias = diasSin(c);
        const fila = nodo("div", "sb-fila");
        const nom = nodo("button", "nom", c.nombre);
        nom.type = "button";
        nom.addEventListener("click", () => crm.abrir(c.id));
        const det = nodo("div", "det");
        const motivo = [];
        if (dias > LIMITE) { const b = nodo("b", "", `${dias} días sin contacto`); det.append(b); motivo.push(1); }
        if (!c.responsable) det.append((motivo.length ? " · " : "") + "sin responsable");
        const tel = nodo("div", "tel", c.telefono);
        tel.style.whiteSpace = "nowrap";
        det.append(tel);

        const acc = nodo("div", "acc");
        const ok = nodo("button", "ok", "Registrar llamada");
        ok.type = "button";
        ok.addEventListener("click", () => {
          crm.actualizar(c.id, { ultimoContacto: new Date().toISOString().slice(0, 10) });
          crm.avisar(`Llamada registrada: ${c.nombre}`);
        });
        acc.append(ok);
        if (!c.responsable) {
          const sel = nodo("select");
          sel.setAttribute("aria-label", `Asignar responsable a ${c.nombre}`);
          sel.append(new Option("Asignar a…", ""));
          for (const p of crm.equipo) sel.append(new Option(p, p));
          sel.addEventListener("change", () => {
            if (!sel.value) return;
            crm.actualizar(c.id, { responsable: sel.value });
            crm.avisar(`${c.nombre} quedó a cargo de ${sel.value}`);
          });
          acc.append(sel);
        }

        const barra = nodo("div", dias > 14 ? "barra fuerte" : "barra");
        barra.style.width = `${Math.max(4, Math.min(100, (dias / 20) * 100))}%`;
        barra.title = `${dias} días sin contacto`;
        fila.append(nom, acc, det, barra);
        panel.append(fila);
      }

      cuerpo.append(tablero, panel);
      raiz.append(cuerpo);
      el.replaceChildren(estilo, raiz);
      tablero.scrollLeft = scroll;
    };

    dibujar();
    crm.alCambiar(dibujar);
  },
};
