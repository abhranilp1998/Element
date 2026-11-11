import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5501);
const types = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css' };

http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replaceAll('\\', '/');
    const segments = pathname.split('/');
    if (segments.some(segment => segment.startsWith('.'))) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : 404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log('Element preview: http://127.0.0.1:' + port));
