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

app.get('/weather', (request, response) =>{
  const weatherData = searchWeather(request.query.data)
  response.send(weatherData);
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
function searchWeather(query){
  const weaData = require ('./darksky.json');
  const weather = new Weather(weaData);
  // const latlong = searchToLatLong(query);
  return weather;

}

function Location (data) {
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}
function Weather (data){
  this.forcast = data.daily.data[0].summary;
  let timeObj =data.daily.data[0].time;
  let unixTime = new Date(timeObj *1000);
  let date = unixTime.getDate();
  let day = convertDay(unixTime.getDay());
  let year = unixTime.getFullYear();
  let month = convertMonth(unixTime.getMonth());
  this.time = `${day} ${month} ${date} ${year}`;
}

function convertDay (d) {
  let weekday = ['Sunday','Monday','Tuesdsay','Wednesday','Thursday','Friday','Saturday'];
  return weekday[d];
}
function convertMonth (m){
  let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return month[m];
}
