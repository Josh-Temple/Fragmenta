import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const require = createRequire(import.meta.url);
function atlas(): Plugin {
  return {
    name: 'fragmenta-documents',
    configureServer(server) {
      let files: Map<string, string> | undefined;
      server.watcher.on('change', (file) => {
        if (file.includes('/node_modules/')) return;
        files = undefined;
        for (const key of Object.keys(require.cache)) {
          if (key.startsWith(process.cwd() + '/') && !key.includes('/node_modules/'))
            delete require.cache[key];
        }
      });
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url || '/', 'http://localhost').pathname;
        if (
          (/\.[\w]+$/.test(pathname) &&
            !/^\/(art|catalog)\//.test(pathname) &&
            !['/sitemap.xml', '/llms.txt'].includes(pathname)) ||
          /^\/(?:@|node_modules\/|__vite)/.test(pathname)
        )
          return next();
        try {
          if (!files) {
            const output = new Map<string, string>();
            require('./atlas/build.cjs').materialize(
              fs.readFileSync('index.html', 'utf8'),
              (key: string, value: string) => output.set(key, value),
            );
            files = output;
          }
          const key = pathname === '/' ? 'index.html' : pathname.replace(/^\/|\/$/g, '');
          const body = files.get(key) ?? files.get(key + '.html');
          if (!body && /\.(svg|json)$/.test(key)) return next();
          const html = !/\.(svg|xml|json|txt)$/.test(key);
          res.statusCode = body ? 200 : 404;
          res.setHeader(
            'Content-Type',
            html
              ? 'text/html; charset=utf-8'
              : key.endsWith('.svg')
                ? 'image/svg+xml'
                : key.endsWith('.json')
                  ? 'application/json'
                  : key.endsWith('.xml')
                    ? 'application/xml'
                    : 'text/plain; charset=utf-8',
          );
          res.end(
            html ? await server.transformIndexHtml(pathname, body ?? files.get('404.html')!) : body,
          );
        } catch (error) {
          next(error as Error);
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const u = new URL(req.url || '/', 'http://localhost');
        if (u.pathname.startsWith('/a/')) {
          res.writeHead(301, { Location: '/p/' + u.pathname.slice(3) + u.search });
          res.end();
          return;
        }
        const clean = u.pathname.replace(/^\/|\/$/g, '');
        if (!clean || /\.\w+$/.test(clean)) return next();
        if (fs.existsSync(path.join(server.config.build.outDir, clean + '.html')))
          req.url = '/' + clean + '.html' + u.search;
        else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(fs.readFileSync(path.join(server.config.build.outDir, '404.html')));
          return;
        }
        next();
      });
    },
  };
}
export default defineConfig({
  server: { port: 3000, host: '127.0.0.1' },
  plugins: [react(), atlas()],
  resolve: { alias: { '@': process.cwd() } },
});
