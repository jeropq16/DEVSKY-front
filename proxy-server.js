const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3001;

// Servir archivos estáticos del frontend
app.use(express.static('.'));

// Proxy para la API del backend
app.use('/api', createProxyMiddleware({
  target: 'https://devsky-back.vercel.app',
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    '^/api': '/api' // Mantener la ruta /api
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to backend`);
    console.log(`Target URL: https://devsky-back.vercel.app${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response from backend: ${proxyRes.statusCode} for ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}));

// Proxy para socket.io
app.use('/socket.io', createProxyMiddleware({
  target: 'https://devsky-back.vercel.app',
  changeOrigin: true,
  secure: true,
  ws: true, // Habilitar WebSocket
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying socket.io ${req.url} to backend`);
  }
}));

app.listen(PORT, () => {
  console.log(`Servidor proxy ejecutándose en http://localhost:${PORT}`);
  console.log('Frontend disponible en: http://localhost:3001');
  console.log('API proxy disponible en: http://localhost:3001/api');
});
