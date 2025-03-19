import { Glob } from "bun";
import tailwindcss from "bun-plugin-tailwind";

const glob = new Glob("pages/**/*.html");
for await (const file of glob.scan()) {
  const folders = file.split("/");
  folders.shift();
  folders.pop();

  await Bun.build({
    entrypoints: [file],
    outdir: `./dist/${folders.join("/")}`,
    plugins: [tailwindcss],
  });
}
