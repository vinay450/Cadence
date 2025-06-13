import fs from 'fs';
import path from 'path';

// Read the built index.html
const indexPath = path.resolve('dist', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// Create the production index.html with hardcoded paths
const productionIndex = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cadence AI - Advanced Data Analytics Platform</title>
    <meta name="description" content="Lovable Generated Project" />
    <meta name="author" content="Lovable" />

    <meta property="og:title" content="curious-data-chats" />
    <meta property="og:description" content="Lovable Generated Project" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@lovable_dev" />
    <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
    <script type="module" crossorigin src="./assets/index.js"></script>
    <link rel="stylesheet" crossorigin href="./assets/index.css">
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>`;

// Write the production index.html
fs.writeFileSync(indexPath, productionIndex); 