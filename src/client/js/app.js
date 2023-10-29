import { checkLocation } from './checkLocation'
import { checkDate } from './checkDate'

// Global Variables
const warningLocation = document.querySelector('.form__warning--location');
const warningDate = document.querySelector('.form__warning--date');
const currentDate = new Date();

// Main Function
const submitForm = async (e) => {
  const tripLocation =  document.querySelector('#form-location').value;
  const tripDate =  new Date(document.querySelector('#form-date').value);
  let calcDays;

  e.preventDefault();

  // reset
  warningLocation.classList.remove('active');
  warningDate.classList.remove('active');

  // Check Location & Date
  if (tripLocation && tripDate) {
    if (checkLocation(tripLocation)) {
      if (checkDate(currentDate, tripDate)) {
        // CalcDays
        calcDays = Math.round(Math.abs((tripDate - currentDate) / (24 * 60 * 60 * 1000)));

        // geonames API
        getGeonames(tripLocation)

        // TODO: store calcDays somewhere

        // TODO: Weatherbit API 

        // TODO: Pixabay API

        // TODO: Update UI

      } else {
        warningDate.classList.add('active');
      }
    } else {
      warningLocation.classList.add('active');
    }

  } else {
    alert('Please fill form inputs!')
  }
  

  // getWeather(baseURL, zipCode, apiKey)
  // .then(data => postData('/add', {date: newDate, temp: data.main.temp, content: feelings}))
  // .then(() => updateUI());
}

// Function to GET Web API Data
const getGeonames = async (location) => {
  const geonamesBase = 'http://api.geonames.org/searchJSON?q=';
  const geonamesKey = '&maxRows=1&username=hazemsss';
  const res = await fetch(geonamesBase + location + geonamesKey);
  try {
    const data = await res.json();

    if (data.totalResultsCount > 0) {
      const cityData = {
        latitude: data.geonames[0].lat,
        longitude: data.geonames[0].lng,
        country: data.geonames[0].countryName,
      }
      console.log(cityData);
      return cityData;
    } else {
      warningLocation.classList.add('active');
    }
  } catch (error) {
    console.error('error', error)
  } 
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

export { submitForm }