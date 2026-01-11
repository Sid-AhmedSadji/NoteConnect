require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();

/* =======================
   CONFIG
======================= */

const BACKEND_URL = process.env.BACKEND_URL; // ex: http://127.0.0.1:3000
// const PROXY_API_KEY = process.env.PROXY_API_KEY;

/* =======================
   MIDDLEWARES
======================= */

// CORS ouvert (APK + web)
app.use(cors());

// Limite le spam / DDoS basique
app.use(rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 60,            // 60 req/min par IP
}));

// JSON
app.use(express.json());

// Auth simple par clé API
// app.use((req, res, next) => {
//   const apiKey = req.headers['x-api-key'];
//   if (!apiKey || apiKey !== PROXY_API_KEY) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
//   next();
// });

/* =======================
   PROXY
======================= */
app.use('/proxy', async (req, res) => {
  const targetPath = req.originalUrl.replace('/proxy', '');
  const url = `${BACKEND_URL}${targetPath}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers: {
        authorization: req.headers.authorization,
        'content-type': req.headers['content-type'],
      },
      timeout: 5000,
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: 'Proxy error',
      details: err.message,
    });
  }
});


/* =======================
   START
======================= */

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});
