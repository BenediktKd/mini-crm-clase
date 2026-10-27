import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = "src/paginas";
const PROHIBIDO = [
  [/\bfetch\s*\(/, "fetch (este proyecto no usa servidores)"],
  [/XMLHttpRequest|WebSocket|sendBeacon/, "peticiones de red"],
  [/\beval\s*\(|new\s+Function/, "eval o new Function"],
  [/\bimport\s*\(/, "imports dinámicos"],
  [/https?:\/\//, "direcciones web (nada de recursos externos)"],
  [/document\.cookie/, "cookies"],
];
const errores = [];

for (const archivo of readdirSync(DIR).filter((f) => f.endsWith(".js") && f !== "index.js")) {
  if (!/^[a-z0-9-]+\.js$/.test(archivo)) {
    errores.push(`${archivo}: el nombre solo puede tener minúsculas, números y guiones`);
    continue;
  }
  const ruta = path.resolve(DIR, archivo);
  const fuente = readFileSync(ruta, "utf8");
  for (const [patron, motivo] of PROHIBIDO) {
    if (patron.test(fuente)) errores.push(`${archivo}: usa ${motivo}`);
  }
  let modulo;
  try {
    modulo = await import(pathToFileURL(ruta).href);
  } catch (e) {
    errores.push(`${archivo}: no se pudo cargar (${e.message})`);
    continue;
  }
  const f = modulo.default;
  if (!f || typeof f !== "object") { errores.push(`${archivo}: falta "export default { ... }"`); continue; }
  if (typeof f.nombre !== "string" || f.nombre.length < 3 || f.nombre.length > 50) errores.push(`${archivo}: "nombre" debe tener entre 3 y 50 caracteres`);
  if (f.autor !== archivo.replace(/\.js$/, "")) errores.push(`${archivo}: "autor" debe llamarse igual que el archivo`);
  if (typeof f.montar !== "function") errores.push(`${archivo}: "montar" debe ser una función`);
}

if (errores.length) {
  console.error("Hay páginas con errores:\n- " + errores.join("\n- "));
  process.exit(1);
}
console.log("Todas las páginas están bien.");
