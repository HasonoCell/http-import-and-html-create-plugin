export default () => ({
  name: "esbuild:http-import-plugin",
  setup(build) {
    build.onStart(() => {
      console.log("Start Building...");
    });

    build.onResolve({ filter: /^https?:\/\// }, (args) => ({
      path: args.path,
      namespace: "http-url",
    }));

    build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => ({
      path: new URL(args.path, args.importer).toString(),
      namespace: "http-url",
    }));

    build.onLoad({ filter: /.*/, namespace: "http-url" }, async (args) => {
      const http = await import("http");
      const https = await import("https");
      function fetch(url) {
        console.log(`Downloading: ${url}`);
        return new Promise((resolve, reject) => {
          const lib = url.startsWith("https") ? https : http;
          lib
            .get(url, (res) => {
              if ([301, 302, 307].includes(res.statusCode)) {
                fetch(new URL(res.headers.location, url).toString())
                  .then(resolve)
                  .catch(reject);
              } else if (res.statusCode === 200) {
                const chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => resolve(Buffer.concat(chunks)));
              } else {
                reject(new Error(`HTTP error: ${res.statusCode}`));
              }
            })
            .on("error", reject);
        });
      }

      const contents = await fetch(args.path);
      return {
        contents,
      };
    });
  },
});
