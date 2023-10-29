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
app.get('/all', sendData);

function sendData(req, res) {
  res.send(projectData);
};

// POST Route
app.post('/add', addData)

function addData (req, res) {
  projectData = {
    date: req.body.date,
    temp: req.body.temp,
    content: req.body.content
  } 
  console.log(projectData);
  res.send(projectData);
}