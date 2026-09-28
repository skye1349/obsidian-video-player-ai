import esbuild from "esbuild";
import { builtinModules } from "node:module";
await esbuild.build({
 entryPoints: ["src/main.ts"], outfile: "main.js", bundle: true,
 external: ["obsidian", "electron", "@codemirror/*", "@lezer/*", ...builtinModules],
 define: { __READER_PRODUCT__: JSON.stringify("video"), __CCLT_PRIVATE_SHARED_MEMORY__: "false" },
 format: "cjs", platform: "node", target: "es2021", minify: true, treeShaking: true
});
