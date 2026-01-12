import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import https from 'https';

const app = express();
const frontendDist = process.env.FRONTEND_DIST;

// servir les fichiers statiques
app.use(express.static(frontendDist));

// fallback React Router
app.use((req, res, next) => {
  if (req.path.startsWith('/proxy')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// proxy backend
app.use('/proxy', createProxyMiddleware({
  target: process.env.BACKEND_TARGET,
  changeOrigin: true,
  pathRewrite: { '^/proxy': '' },
}));

// HTTPS
const httpsOptions = {
  key: fs.readFileSync(process.env.HTTPS_KEY),
  cert: fs.readFileSync(process.env.HTTPS_CERT),
};

https.createServer(httpsOptions, app).listen(process.env.PROXY_PORT, () => {
  console.log(`Proxy + frontend running on https://localhost:${process.env.PROXY_PORT}`);
});
