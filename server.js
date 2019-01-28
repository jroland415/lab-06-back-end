'use strict';

const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

let latlong = [];

app.use(cors());

app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});

app.get('/weather', (request, response) =>{
  const weatherData = searchWeather(request.query.data)
  response.send(weatherData);
});


app.listen(PORT, () => console.log(`Listening on ${PORT}`));

function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('There was a problem processing your request.');
}

function searchToLatLong(query) {
  const geoData = require('./geo.json');
  const location = new Location(geoData);
  location.search_query = query;
  return location;
}
function searchWeather(query){
  const weatherData = require('./darksky.json');
  const weatherObj = new Weather(weatherData);
  weatherObj.search_query = query;
  return weatherObj;
}

function Location (data) {
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
  latlong= [this.latitude, this.longitude];

}

function Weather(data) {
  let weatherArr = [];
  if (data.latitude === latlong[0] && data.longitude === latlong[1]){

    for (let i = 0; i < data.daily.data.length; i++){

      this.forecast = data.daily.data[i].summary;
      this.time = new Date(data.daily.data[i].time * 1000).toLocaleDateString('en-US', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'});
      weatherArr.push(this);
    }
    return weatherArr;
  } else handleError(err, res);
}
