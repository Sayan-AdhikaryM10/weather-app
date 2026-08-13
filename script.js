// Paste your OpenWeatherMap API Key here
const API_KEY = 'ee15bb2e8adc8e7c115fa7678c31233a'; 

// 1. Initialize the Leaflet Map
// Set view points to [Latitude, Longitude] and Zoom Level (2 = whole world)
const map = L.map('map').setView([20, 0], 2); 

// 2. Add OpenStreetMap map tiles (the actual map images)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// DOM Elements
const weatherPanel = document.getElementById('weather-panel');
const locationName = document.getElementById('location-name');
const tempValue = document.getElementById('temp-value');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const closeBtn = document.getElementById('close-panel');

let currentMarker = null;

// 3. Listen for clicks on the map
map.on('click', async (e) => {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  // Place a pin marker where the user clicked
  if (currentMarker) {
    map.removeLayer(currentMarker); // Remove the old pin
  }
  currentMarker = L.marker([lat, lon]).addTo(map);

  // Fetch weather for those exact coordinates
  await fetchWeatherByCoords(lat, lon);
});

// 4. Fetch weather data using Latitude & Longitude
async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Weather data not found');
    }

    const data = await response.json();
    updateUI(data);
  } catch (error) {
    alert("Could not fetch weather data for this specific location. Try clicking closer to land.");
  }
}

// 5. Update the floating panel with data
function updateUI(data) {
  weatherPanel.classList.remove('hidden');
  
  // If you click in the middle of the ocean, the API might not have a specific city name
  locationName.textContent = data.name || "Unknown Location";
  tempValue.textContent = Math.round(data.main.temp); 
  weatherDescription.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;
}

// 6. Close panel button
closeBtn.addEventListener('click', () => {
  weatherPanel.classList.add('hidden');
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }
});