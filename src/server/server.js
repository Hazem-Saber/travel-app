// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// Dependencies
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware - Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
app.listen(8000, () => console.log('The app listening on http://localhost:8000'))

// GET Route
app.get('/', sendData);

function sendData(req, res) {
  res.send(projectData);
};

// POST Route
app.post('/add', addData)

function addData (req, res) {
  if (req.body.days <= 7) {
    projectData = {
      days: req.body.days,
      city: req.body.city,
      country: req.body.country,
      temp: req.body.temp,
      weatherIcon: req.body.weatherIcon,
      weatherDescription: req.body.weatherDescription,
      imageURL: req.body.imageURL,
    } 
  } else {
    projectData = {
      days: req.body.days,
      city: req.body.city,
      country: req.body.country,
      max_temp: req.body.max_temp,
      min_temp: req.body.min_temp,
      weatherIcon: req.body.weatherIcon,
      weatherDescription: req.body.weatherDescription,
      imageURL: req.body.imageURL,
    } 
  }
  console.log(projectData);
  res.send(projectData);
}