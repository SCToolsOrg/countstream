import { Glob } from "bun";
import tailwindcss from "bun-plugin-tailwind";

const glob = new Glob("pages/**/*.html");
const files = [];
for await (const file of glob.scan()) {
  files.push(file);
}

await Bun.build({
  entrypoints: files,
  outdir: "./dist",
  minify: true,
  plugins: [tailwindcss],
});
