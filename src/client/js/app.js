// Global Variables
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=d2f25ee0d51c056032901095ad1cac2c&units=imperial';
const generateBtn = document.querySelector('#generate');

// Create a new date instance dynamically with JS
let newDate = (new Date()).toLocaleDateString('en-US');

// Event listener to add function to existing HTML DOM element
generateBtn.addEventListener('click', generateData);

// Function called by event listener
function generateData() {
  const zipCode =  document.querySelector('#zip').value;
  const feelings =  document.querySelector('#feelings').value;

  getWeather(baseURL, zipCode, apiKey)
  .then(data => postData('/add', {date: newDate, temp: data.main.temp, content: feelings}))
  .then(() => updateUI());
}

// Function to GET Web API Data
const getWeather = async (baseURL, zipCode, apiKey) => {
  const res = await fetch(baseURL + zipCode + apiKey);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('error', error)
  } 
}

// Function to POST data
const postData = async (url = '', data = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  try {
    const newData = await res.json();
    return newData;
  }
  catch (error) {
    console.error('error', error)
  }
};

// Function to GET Project Data
const updateUI = async () => {
  const req = await fetch('/all');
  try {
    const allData = await req.json();
    console.log(allData);
    document.getElementById('date').innerHTML = `Date: ${allData.date}`;
    document.getElementById('temp').innerHTML = `Temperature: ${allData.temp} degrees`;
    document.getElementById('content').innerHTML = `Feelings: ${allData.content}`;
  }
  catch (error) {
    console.log("error", error);
  }
};

// Main Function
const handleSubmit = () => {
  console.log('Handle Submit function from app.js file');
  alert('Welcome from app.js file!')
}

export { handleSubmit }