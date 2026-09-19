#!/usr/bin/env node
/**
 * Serveur de développement minimal (sans dépendance) pour dist/.
 * Usage : npm run build && npm run dev  →  http://localhost:4242
 */
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT || 4242);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.gz': 'application/gzip',
};

http
  .createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (urlPath.endsWith('/')) urlPath += 'index.html';
      let file = path.join(DIST, urlPath);
      if (!file.startsWith(DIST)) throw Object.assign(new Error('forbidden'), { code: 'EACCES' });
      let stat = await fs.stat(file).catch(() => null);
      if (stat?.isDirectory()) {
        res.writeHead(301, { Location: urlPath + '/' });
        return res.end();
      }
      if (!stat) {
        file = path.join(DIST, '404.html');
        res.statusCode = 404;
      }
      const data = await fs.readFile(file);
      res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store');
      res.end(data);
    } catch (e) {
      res.statusCode = 500;
      res.end(String(e.message));
    }
  })
  .listen(PORT, () => console.log(`\n▶ L'Air Gap 42 en local : http://localhost:${PORT}\n`));
