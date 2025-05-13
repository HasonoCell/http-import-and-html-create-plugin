export const createScript = (script) =>
  `<script type="module" src="${script}"></script>`;
export const createLink = (link) => `<link rel="stylesheet" href="${link}">`;

export const createHTML = (scripts, links) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Esbuild App</title>
  ${links.join("\n")}
</head>

<body>
  <div id="root"></div>
  ${scripts.join("\n")}
</body>

</html>`;
};
