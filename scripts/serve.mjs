import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.yml': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };
let basePath = '';
try {
  const index = await readFile(path.join(root, 'index.html'), 'utf8');
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(index)?.[1];
  if (canonical) basePath = decodeURIComponent(new URL(canonical.replace(/&amp;/g, '&')).pathname).replace(/\/$/, '');
} catch { console.error('No valid built site found. Run npm run build first.'); process.exit(1); }

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (basePath && (pathname === '/' || pathname === basePath)) { res.writeHead(302, { Location: `${basePath}/` }); res.end(); return; }
    if (basePath && !pathname.startsWith(`${basePath}/`)) { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(await readFile(path.join(root, '404.html'))); return; }
    const localPath = pathname.slice(basePath.length) || '/';
    const target = path.resolve(root, `.${localPath}`);
    if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    let filename = target;
    try {
      const info = await stat(filename);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) { res.writeHead(301, { Location: `${pathname}/` }); res.end(); return; }
        filename = path.join(filename, 'index.html');
      }
      const body = await readFile(filename);
      res.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(await readFile(path.join(root, '404.html')));
    }
  } catch { res.writeHead(400); res.end('Bad request'); }
});
server.on('error', error => { console.error(`Preview could not start: ${error.message}`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}${basePath}/\nPress Ctrl+C to stop. After editing, run npm run build again and refresh.`));
