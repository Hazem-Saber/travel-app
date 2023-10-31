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

// Main Function
const submitForm = async (e) => {
  const tripLocation =  document.querySelector('#form-location').value;
  const tripDate =  new Date(document.querySelector('#form-date').value);
  let calcDays;

  e.preventDefault();

  // reset
  clearResults()
  warningLocation.classList.remove('active');
  warningDate.classList.remove('active');

  // Check Location & Date
  if (tripLocation && tripDate) {
    if (checkLocation(tripLocation)) {
      if (checkDate(currentDate, tripDate)) {
        // CalcDays
        calcDays = Math.round(Math.abs((tripDate - currentDate) / (24 * 60 * 60 * 1000)));

        
        getGeonames(tripLocation)
        .then(cityData => weatherbit(cityData, calcDays))
        .then(cityData => pixabay(cityData))


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
        country: data.geonames[0].countryName,
        latitude: data.geonames[0].lat,
        longitude: data.geonames[0].lng
      }

      // Results Location
      resultsLocation.textContent = `${cityData.name}, ${cityData.country}`;
    } else {
      warningLocation.classList.add('active');
    }
    console.log(cityData);
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

        // Results Info
        resultsDays.textContent = `Your trip is in ${days} days.`;
        resultsTemp.textContent =`Current weather is ${temp}°C`;

        resultsDescription.innerHTML = `${weatherDescription}<img class='results__image' src='./media/${weatherIcon}.png' alt=${weatherDescription}>`;

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

        // Results Info
        resultsDays.textContent = `Your trip is in ${days} days.`;
        resultsTemp.textContent =`Predicted Forecast: High ${max_temp}°C - Low ${min_temp}°C`;

        resultsDescription.innerHTML = `${weatherDescription}<img class='results__image' src='./media/${weatherIcon}.png' alt=${weatherDescription}>`;

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

      console.log(data);

      if (data.total > 0) {
        const cityImageURL = data.hits[0].largeImageURL;
  
        resultsImageContainer.innerHTML = `<img class='results__image' src='${cityImageURL}' alt=${cityData.name}>`;
      }

      appResults.classList.add('active');
    } catch (error) {
      console.error('error', error)
    } 
  }
}

// Clear Form
const clearForm = function() {
  const appForm = document.querySelector('.app__form');
  warningLocation.classList.remove('active');
  warningDate.classList.remove('active');
  appForm.reset();
  clearResults();
}

const clearResults = function() {
  appResults.classList.remove('active');
  resultsLocation.innerHTML = '';
  resultsDays.innerHTML = '';
  resultsTemp.innerHTML = '';
  resultsDescription.innerHTML = '';
  resultsImageContainer.innerHTML = '';
}

// Function to POST data
// const postData = async (url = '', data = {}) => {
//   const res = await fetch(url, {
//     method: 'POST',
//     credentials: 'same-origin',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })

//   try {
//     const newData = await res.json();
//     return newData;
//   }
//   catch (error) {
//     console.error('error', error)
//   }
// };

// Function to GET Project Data
// const updateUI = async () => {
//   const req = await fetch('/all');
//   try {
//     const allData = await req.json();
//     console.log(allData);
//     document.getElementById('date').innerHTML = `Date: ${allData.date}`;
//     document.getElementById('temp').innerHTML = `Temperature: ${allData.temp} degrees`;
//     document.getElementById('content').innerHTML = `Feelings: ${allData.content}`;
//   }
//   catch (error) {
//     console.log("error", error);
//   }
// };



export { submitForm, clearForm }