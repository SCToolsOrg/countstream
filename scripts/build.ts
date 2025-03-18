import { Glob } from "bun";
import tailwindcss from "bun-plugin-tailwind";

const glob = new Glob("pages/**/*.html");
const files = [];
for await (const file of glob.scan()) {
  const folders = file.split("/");
  folders.shift();
  folders.pop();

  await Bun.build({
    entrypoints: [file],
    outdir: `./dist/${folders.join("/")}`,
    minify: true,
    plugins: [tailwindcss],
  });
}
