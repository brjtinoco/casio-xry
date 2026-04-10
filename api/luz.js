// api/luz.js
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const { accion, secret } = req.query;
  const DASH_SECRET = process.env.DASH_SECRET;

  // 1. Verificamos la contraseña (la misma que usas para el calendario)
  if (secret !== DASH_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  // 2. Mapeamos las acciones a tus Variables de Entorno de Vercel
  const urls = {
    'mesa_on':    process.env.URL_MESA_ON,
    'mesa_off':   process.env.URL_MESA_OFF,
    'armario_on': process.env.URL_ARMARIO_ON,
    'armario_off':process.env.URL_ARMARIO_OFF
  };

  const targetUrl = urls[accion];

  if (!targetUrl) {
    return res.status(400).json({ error: 'Acción no válida' });
  }

  try {
    // 3. Vercel hace la llamada por ti
    const response = await fetch(targetUrl);
    res.status(200).json({ status: 'ok', sent: accion });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
