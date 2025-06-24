const express = require('express');
const app = express();
const port = 3000;

const locations = {};

app.use(express.static(__dirname));
app.use(express.json());

app.post('/update-location/:id', (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;
  locations[id] = { lat, lng, timestamp: Date.now() };
  console.log(`Primit locație de la ${id}:`, lat, lng);
  res.sendStatus(200);
});

app.get('/location/:id', (req, res) => {
  const { id } = req.params;
  res.json(locations[id] || {});
});

const path = require('path');

app.get('/client', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

