const apiKey = '0842a87a1d09385df5c3fe4a0921da3b'; 

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const forecastDisplay = document.getElementById('forecastDisplay');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    getForecast(city);
  }
});

// Fetch current weather
function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayCurrentWeather(data);
      localStorage.setItem(`weather-${city}`, JSON.stringify(data)); // Cache
    })
    .catch(err => {
      weatherDisplay.innerHTML = `<p>City not found. Try again.</p>`;
    });
}

// Display current weather
function displayCurrentWeather(data) {
  const html = `
    <div class="weather-card">
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
      <p>🌡️ Temp: ${data.main.temp}°C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬️ Wind: ${data.wind.speed} m/s</p>
    </div>
  `;
  weatherDisplay.innerHTML = html;
}

// Fetch 5-day forecast
function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayForecast(data);
      localStorage.setItem(`forecast-${city}`, JSON.stringify(data)); // Cache
    })
    .catch(err => {
      forecastDisplay.innerHTML = `<p>Unable to load forecast.</p>`;
    });
}

// Display forecast (one card per day)
function displayForecast(data) {
  const dailyData = {};

  // Group data by day
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = item;
    }
  });

  forecastDisplay.innerHTML = '';

  Object.keys(dailyData).slice(0, 5).forEach(date => {
    const item = dailyData[date];
    const html = `
      <div class="forecast-card">
        <h3>${date}</h3>
        <p><strong>${item.weather[0].main}</strong></p>
        <p>🌡️ Temp: ${item.main.temp}°C</p>
        <p>💧 Humidity: ${item.main.humidity}%</p>
      </div>
    `;
    forecastDisplay.innerHTML += html;
  });
}

