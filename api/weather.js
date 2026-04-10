// Proxy del clima — el iPad 2 (iOS 9) no puede conectar directo a open-meteo por TLS
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  var lat = req.query.lat || '36.68033298624759';
  var lon = req.query.lon || '-6.115668851566495';

  var url = 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + lat +
    '&longitude=' + lon +
    '&current_weather=true'+
    '&daily=weather_code'+
    '&hourly=apparent_temperature,relativehumidity_2m' +
    '&timezone=auto' +
    '&forecast_days=4';

  try {
    var response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ error: 'open-meteo error: ' + response.status });
    }
    var data = await response.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
