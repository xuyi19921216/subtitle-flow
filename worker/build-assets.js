import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

const files = {
  '/index.html': path.join(publicDir, 'index.html'),
  '/assets/index-DJWQD9II.js': path.join(publicDir, 'assets', 'index-DJWQD9II.js'),
  '/assets/index-DhiG2bFW.css': path.join(publicDir, 'assets', 'index-DhiG2bFW.css'),
  '/vite.svg': path.join(publicDir, 'vite.svg'),
  '/_routes.json': path.join(publicDir, '_routes.json'),
};

const assets = {};
for (const [webPath, filePath] of Object.entries(files)) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    assets[webPath] = content;
  }
}

let assetsCode = `const assets = ${JSON.stringify(assets, null, 2)};\n\nexport { assets };\n`;

fs.writeFileSync(path.join(__dirname, 'src', 'assets.js'), assetsCode);
console.log('Assets built successfully!');
