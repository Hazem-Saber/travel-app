import { checkLocation } from './checkLocation'
import { checkDate } from './checkDate'

// Global Variables
const warningLocation = document.querySelector('.form__warning--location');
const warningDate = document.querySelector('.form__warning--date');
const appResults = document.querySelector('.app__results');
const resultsLocation = document.querySelector('.results__location');
const resultsDays = document.querySelector('.results__days');
const resultsTemp = document.querySelector('.results__temp');
const resultsDescription = document.querySelector('.results__description');
const resultsImageContainer = document.querySelector('.results__image-container');
const currentDate = new Date();
let appData = {};

// Main Function
const submitForm = async (e) => {
  const tripLocation =  document.querySelector('#form-location').value;
  const tripDate =  new Date(document.querySelector('#form-date').value);
  const calcDays = Math.round(Math.abs((tripDate - currentDate) / (24 * 60 * 60 * 1000)));

  e.preventDefault();

  // reset
  clearResults()
  warningLocation.classList.remove('active');
  warningDate.classList.remove('active');

  // Check Location & Date
  if (tripLocation && tripDate) {
    if (checkLocation(tripLocation)) {
      if (checkDate(currentDate, tripDate)) {
        
        getGeonames(tripLocation)
        .then(cityData => weatherbit(cityData, calcDays))
        .then(cityData => pixabay(cityData))
        .then(() => postData('http://localhost:8000/add', appData))
        .then((projectData) => updateUI(projectData))

      } else {
        warningDate.classList.add('active');
      }
    } else {
      warningLocation.classList.add('active');
    }
  } else {
    warningLocation.classList.add('active');
    warningDate.classList.add('active');
  }
}

// getGeonames API Call
const getGeonames = async (location) => {
  const geonamesBase = 'http://api.geonames.org/searchJSON?q=';
  const geonamesKey = '&maxRows=1&username=hazemsss';
  const res = await fetch(geonamesBase + location + geonamesKey);

  try {
    const data = await res.json();
    let cityData;

    if (data.totalResultsCount > 0) {
      cityData = {
        name: data.geonames[0].name,
        latitude: data.geonames[0].lat,
        longitude: data.geonames[0].lng
      }

      // Update appData object
      appData.city = data.geonames[0].name;
      appData.country = data.geonames[0].countryName;
    } else {
      warningLocation.classList.add('active');
    }
    return cityData;
  } catch (error) {
    console.error('error', error)
  } 
}

// weatherbit API Call
const weatherbit =  async (cityData, days) => {
  const weatherbitCurrentBase = 'https://api.weatherbit.io/v2.0/current?';
  const weatherbitForecastBase = 'https://api.weatherbit.io/v2.0/forecast/daily?'
  const weatherbitKey = '&key=d5b05b8c5a9e45a59543472a5fb08c66';

  if (cityData) {
    if (days <= 7) {
      // Current Weather
      const res = await fetch(`${weatherbitCurrentBase}lat=${cityData.latitude}&lon=${cityData.longitude}${weatherbitKey}`);

      try {
        const data = await res.json();
        const temp = data.data[0].temp;
        const weatherIcon = data.data[0].weather.icon;
        const weatherDescription = data.data[0].weather.description;

        // Update appData object
        appData.days = days;
        appData.temp = temp;
        appData.weatherIcon = weatherIcon;
        appData.weatherDescription = weatherDescription;

      } catch (error) {
        console.error('error', error)
      } 
    } else {
      // Predicted forecast
      const res = await fetch(`${weatherbitForecastBase}lat=${cityData.latitude}&lon=${cityData.longitude}${weatherbitKey}`);

      try {
        const data = await res.json();
        const max_temp = data.data[0].max_temp;
        const min_temp = data.data[0].min_temp;
        const weatherIcon = data.data[0].weather.icon;
        const weatherDescription = data.data[0].weather.description;

        // Update appData object
        appData.days = days;
        appData.max_temp = max_temp;
        appData.min_temp = min_temp;
        appData.weatherIcon = weatherIcon;
        appData.weatherDescription = weatherDescription;

      } catch (error) {
        console.error('error', error)
      } 
    }
  }

  return cityData;
}

// pixabay API Call
const pixabay = async (cityData) => {
  const pixabayBase = 'https://pixabay.com/api/';
  const pixabayKey = '40391943-5ef40a6f54945c3c268265ebd';

  if (cityData) {
    const res = await fetch(`${pixabayBase}?key=${pixabayKey}&q=${cityData.name}&image_type=photo`);
  
    try {
      const data = await res.json();

      if (data.total > 0) {
        const cityImageURL = data.hits[0].largeImageURL;

        // Update appData object
        appData.imageURL = cityImageURL;
      }
    } catch (error) {
      console.error('error', error)
    } 
  }
}

// postData
const postData = async (url='', data={}) => {
  if (Object.keys(data).length > 0) {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  
    try {
      const projectData = await res.json();
      console.log(projectData);
      return projectData;
    }
    catch (error) {
      console.error('error', error)
    }
  }
}

// updateUI
const updateUI = (projectData) => {
  
  if (!projectData) return

  // Location
  if (projectData.city && projectData.country && projectData.city !== projectData.country) 
    resultsLocation.textContent = `${projectData.city}, ${projectData.country}`;
  else 
    resultsLocation.textContent = `${projectData.city}`;

  // Days
  resultsDays.textContent = `Your trip is in ${projectData.days} days.`;

  // Temp
  if (projectData.days <= 7) resultsTemp.textContent =`Current weather is ${projectData.temp}°C`
  else resultsTemp.textContent =`Predicted Forecast: High ${projectData.max_temp}°C - Low ${projectData.min_temp}°C`

  // Description
  resultsDescription.innerHTML = `${projectData.weatherDescription}<img class='results__image' src='./media/${projectData.weatherIcon}.png' alt=${projectData.weatherDescription}>`;

  // Image
  if (projectData.imageURL) resultsImageContainer.innerHTML = `<img class='results__image' src='${projectData.imageURL}' alt=${projectData.city}>`;

  // Activate Results
  appResults.classList.add('active');
}

// Clear Form
const clearForm = () => {
  const appForm = document.querySelector('.app__form');
  appForm.reset();
  warningLocation.classList.remove('active');
  warningDate.classList.remove('active');
  clearResults();
}

// Helper Function clearResults
const clearResults = () => {
  appData = {};
  appResults.classList.remove('active');
  resultsLocation.innerHTML = '';
  resultsDays.innerHTML = '';
  resultsTemp.innerHTML = '';
  resultsDescription.innerHTML = '';
  resultsImageContainer.innerHTML = '';
}

export { submitForm, clearForm }