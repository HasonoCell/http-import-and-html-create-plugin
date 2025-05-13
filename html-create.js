import { createHTML, createLink, createScript } from "./utils/index.js";
import path from "node:path";
import fs from "node:fs/promises";

export default () => ({
  name: "esbuild:html-create-plugin",
  setup(build) {
    build.onEnd(async (buildResult) => {
      if (buildResult.errors.length) return;
      const { metafile } = buildResult;
      const scripts = [];
      const links = [];

      if (metafile) {
        const { outputs } = metafile;
        const assets = Object.keys(outputs);

        assets.forEach((asset) => {
          if (asset.endsWith(".js")) {
            scripts.push(createScript(asset));
          } else if (asset.endsWith(".css")) {
            links.push(createLink(asset));
          }
        });

        const htmlContent = createHTML(scripts, links);
        const htmlPath = path.resolve(process.cwd(), "index.html");
        await fs.writeFile(htmlPath, htmlContent);
      }
    });
  },
});
