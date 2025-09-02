const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// Servir archivos estáticos del frontend
app.use(express.static('.'));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Proxy simple para la API
app.use('/api', createProxyMiddleware({
  target: 'https://devsky-back.vercel.app',
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> https://devsky-back.vercel.app${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response: ${proxyRes.statusCode} for ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error(`[PROXY ERROR] ${err.message} for ${req.url}`);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: err.message,
      url: req.url 
    });
  }
}));

// Proxy para socket.io
app.use('/socket.io', createProxyMiddleware({
  target: 'https://devsky-back.vercel.app',
  changeOrigin: true,
  secure: true,
  ws: true,
  logLevel: 'debug'
}));

app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy ejecutándose en http://localhost:${PORT}`);
  console.log('📁 Frontend disponible en: http://localhost:3001');
  console.log('🔗 API proxy disponible en: http://localhost:3001/api');
  console.log('🔌 Socket.io proxy disponible en: http://localhost:3001/socket.io');
});
