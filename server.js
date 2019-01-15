'use strict';

const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

app.use(cors());

app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});

// app.get('/testing', (request, response) => {
//   response.json('Hit the /testing route!');
// });

app.listen(PORT, () => console.log(`Listening on ${PORT}`));


function searchToLatLong(query) {
  const geoData = require('./geo.json');
  const location = new Location(geoData);
  location.search_query = query;
  console.log(location);
  return location;
}

function Location (data) {
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}
