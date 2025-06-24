const express = require('express');
const path = require('path');
const app = express();

const locations = {};          // ultima locație per id
const locationsHistory = {};   // istoric locații per id

app.use(express.static(__dirname));
app.use(express.json());

app.post('/update-location/:id', (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;
  const timestamp = Date.now();

  // Salvează ultima locație
  locations[id] = { lat, lng, timestamp };

  // Salvează în istoric
  if (!locationsHistory[id]) locationsHistory[id] = [];
  locationsHistory[id].push({ lat, lng, timestamp });

  console.log(`Primit locație de la ${id}:`, lat, lng);
  res.sendStatus(200);
});

app.get('/location/:id', (req, res) => {
  const { id } = req.params;
  res.json(locations[id] || {});
});

app.get('/export/:id', (req, res) => {
  const { id } = req.params;
  const data = locationsHistory[id] || [];

  let csv = 'lat,lng,timestamp\n';
  data.forEach(loc => {
    csv += `${loc.lat},${loc.lng},${new Date(loc.timestamp).toISOString()}\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${id}_locations.csv"`);
  res.send(csv);
});

app.get('/client', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
