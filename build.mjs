import { readdirSync, writeFileSync } from "node:fs";

const DIR = "src/paginas";
const archivos = readdirSync(DIR).filter((f) => f.endsWith(".js") && f !== "index.js").sort();

const importes = archivos.map((f, i) => `import p${i} from "./${f}";`).join("\n");
const lista = archivos.map((_, i) => `p${i}`).join(", ");
writeFileSync(`${DIR}/index.js`, `// Archivo generado por build.mjs. No lo edites.\n${importes}\n\nexport default [${lista}];\n`);
console.log(`Mini CRM listo con ${archivos.length} página(s).`);
