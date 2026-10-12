// Tiny zero-dependency static server so the team can open the UI locally.
// Usage: npm start  ->  http://localhost:8080  (add #preview for sample data)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.PORT || 8080;

createServer(async (req, res) => {
  try {
    const html = await readFile(join(root, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch {
    res.writeHead(500); res.end('index.html not found');
  }
}).listen(PORT, () => console.log(`SmartVend UI on http://localhost:${PORT}  (try http://localhost:${PORT}/#preview)`));
