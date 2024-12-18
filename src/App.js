
let map;
let marker;

// Exported function to initialize the map
async function initMap(lat, lon) {
    const location = { lat: lat, lng: lon };
    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 12
    });
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

// Exported function to increment and display the API call counter
function incrementCounter() {
    const currentDate = new Date().toDateString();
    const storedDate = localStorage.getItem('apiCallDate');
    let counter = localStorage.getItem('apiCallCounter');

    if (storedDate !== currentDate) {
        counter = 0; // Reset counter if the date has changed
        localStorage.setItem('apiCallDate', currentDate);
    }

    counter = parseInt(counter) + 1;
    localStorage.setItem('apiCallCounter', counter);
    displayCounter(counter);
}

// Exported function to display the counter value
function displayCounter(counter) {
    const counterDisplay = document.getElementById('counterDisplay');
    counterDisplay.textContent = `API calls today: ${counter}`;
}

// Exported function to fetch and display the weather data by city name
async function getWeather() {
    incrementCounter(); // Increment the counter when the API is called
    const location = document.getElementById('location').value;
    const apiKey = '414566a386a08cff91c0b2692629a943';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod === 200) {
        displayWeather(data);
        getForecast(data.coord.lat, data.coord.lon); // Fetch forecast data based on coordinates
        displayPrecipitation(data); // Display precipitation data
        adjustWidth(); // Adjust the width of the weather container
    } else {
        alert(data.message);
    }
}

// Exported function to fetch and display the weather data by current location
async function getWeatherByLocation() {
    incrementCounter(); // Increment the counter when the API is called
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const apiKey = '414566a386a08cff91c0b2692629a943';
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod === 200) {
                displayWeather(data);
                getForecast(lat, lon); // Fetch forecast data based on coordinates
                displayPrecipitation(data); // Display precipitation data
                adjustWidth(); // Adjust the width of the weather container
                
                // Initialize the map with the user's location
                initMap(lat, lon);
            } else {
                alert(data.message);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Private function to fetch and display the weather data by latitude and longitude
async function getWeatherByLatLon() {
    incrementCounter(); // Increment the counter when the API is called
    const lat = document.getElementById('latitude').value;
    const lon = document.getElementById('longitude').value;
    const apiKey = '414566a386a08cff91c0b2692629a943';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod === 200) {
        displayWeather(data);
        getForecast(lat, lon);
        displayPrecipitation(data);
        adjustWidth();
    } else {
        alert(data.message);
    }
}
// Private function to display the weather data
function displayWeather(data) {
    const result = document.getElementById('result');
    const weatherInfo = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp} °F</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} mph</p>
    `;
    result.innerHTML = weatherInfo;

    // Make location display visible
    document.getElementById('locationDisplayContainer').classList.remove('hidden');
    document.getElementById('locationDisplay').textContent = data.name;
}

// Private function to display the precipitation data
function displayPrecipitation(data) {
    const precipitationContainer = document.getElementById('precipitation');
    const precipitationInfo = `
        <p>Precipitation: ${data.rain ? data.rain["1h"] : 0} mm/h</p>
        <p>Snow: ${data.snow ? data.snow["1h"] : 0} mm/h</p>
    `;
    precipitationContainer.innerHTML = precipitationInfo;

    // Make precipitation container visible
    document.getElementById('precipitationContainer').classList.remove('hidden');
}

// Private function to fetch and display the forecast data
async function getForecast(lat, lon) {
    const apiKey = '414566a386a08cff91c0b2692629a943';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    data.list.slice(0, 5).forEach(forecast => {
        const forecastDay = `
            <div class="forecast-day">
                <p>${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                <p>Temp: ${forecast.main.temp} °F</p>
                <p>Weather: ${forecast.weather[0].description}</p>
            </div>
        `;
        forecastContainer.innerHTML += forecastDay;
    });

    // Make forecast container visible
    document.getElementById('forecastContainer').classList.remove('hidden');
}

// Private function to adjust the width of the weather container
function adjustWidth() {
    const weatherContainer = document.getElementById('weather');
    weatherContainer.style.width = 'auto'; // Adjust as needed
}

// Call displayCounter on page load to show the current counter value
document.addEventListener('DOMContentLoaded', () => {
    const counter = localStorage.getItem('apiCallCounter') || 0;
    displayCounter(counter);
});

// Private function to toggle tactical mode
function toggleTacticalMode() {
    document.body.classList.toggle('tactical-mode');
    document.getElementById('locationDisplayContainer').classList.toggle('tactical-mode');
    document.getElementById('weather').classList.toggle('tactical-mode');
    document.getElementById('forecastContainer').classList.toggle('tactical-mode');
    document.getElementById('precipitationContainer').classList.toggle('tactical-mode');
    document.getElementById('latLonInputs').classList.toggle('hidden');

    const elements = document.querySelectorAll('h1, h2, h3, h4, p, button, input');
    elements.forEach((element) => element.classList.toggle('tactical-mode'));

    // Toggle the button color
    document.getElementById('tacticalModeToggle').classList.toggle('tactical-mode-button');
    document.getElementById('getWeatherButton').classList.toggle('tactical-mode-button');
    document.getElementById('getWeatherByLocationButton').classList.toggle('tactical-mode-button');
    document.getElementById('getWeatherByLatLonButton').classList.toggle('tactical-mode-button');
}
