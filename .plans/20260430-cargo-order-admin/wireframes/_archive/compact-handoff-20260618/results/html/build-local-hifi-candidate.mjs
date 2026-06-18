import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const sourceFile = join(__dirname, "화물 오더 접수수정 (오프라인).html");
const layerFile = join(__dirname, "hifi-local-motion-layer.html");
const outputFile = join(__dirname, "cargo-order-hifi-local-motion-20260616.html");

const templatePattern = /(<script type="__bundler\/template">\s*)([\s\S]*?)(\s*<\/script>)/;
const layerPattern = /\n?<!-- LOCAL_HIFI_MOTION_LAYER_START -->[\s\S]*?<!-- LOCAL_HIFI_MOTION_LAYER_END -->\n?/;

const sourceHtml = await readFile(sourceFile, "utf8");
const layer = await readFile(layerFile, "utf8");
const match = sourceHtml.match(templatePattern);

if (!match) {
  throw new Error("Cannot find __bundler/template script in source HTML.");
}

const template = JSON.parse(match[2]);
const cleanedTemplate = template.replace(layerPattern, "");

if (!cleanedTemplate.includes("</body>")) {
  throw new Error("Cannot find </body> in extracted template.");
}

const enhancedTemplate = cleanedTemplate.replace("</body>", `${layer}\n</body>`);
const serializedTemplate = JSON.stringify(enhancedTemplate).replace(/<\/script/gi, "<\\u002Fscript");
const enhancedHtml = sourceHtml.replace(templatePattern, `$1${serializedTemplate}$3`);

await writeFile(outputFile, enhancedHtml, "utf8");

console.log(JSON.stringify({
  sourceFile,
  layerFile,
  outputFile,
  templateBytes: Buffer.byteLength(enhancedTemplate, "utf8"),
  outputBytes: Buffer.byteLength(enhancedHtml, "utf8")
}, null, 2));
