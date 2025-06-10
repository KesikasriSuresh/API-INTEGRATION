// Splash Screen Animation
window.addEventListener('load', () => {
    const loadingBar = document.getElementById('loadingBar');
    loadingBar.style.width = '100%';
    
    setTimeout(() => {
      document.getElementById('splash').classList.add('fade-out');
      document.getElementById('main').style.display = 'flex';
      
      // Set default date
      updateDate();
    }, 3000);
  });
  
  function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    document.getElementById('date').textContent = today.toLocaleDateString('en-US', options);
  }
  
  // Weather App Functionality
  const apiKey = 'bd5e378503939ddaee76f12ad7a97608';
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  
  // DOM Elements
  const locationInput = document.getElementById('locationInput');
  const searchButton = document.getElementById('searchButton');
  const locationElement = document.getElementById('location');
  const temperatureElement = document.getElementById('temperature');
  const descriptionElement = document.getElementById('description');
  const humidityElement = document.getElementById('humidity');
  const windElement = document.getElementById('wind');
  const cloudsElement = document.getElementById('clouds');
  const feelsLikeElement = document.getElementById('feelsLike');
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherCard = document.getElementById('weatherCard');
  const body = document.body;
  
  // Event Listeners
  searchButton.addEventListener('click', searchWeather);
  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
  });
  
  // Functions
  function searchWeather() {
    const location = locationInput.value.trim();
    if (location) {
      fetchWeather(location);
    } else {
      showAlert('Please enter a city name');
    }
  }
  
  function fetchWeather(location) {
    const url = `${apiUrl}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    
    // Show loading state
    weatherCard.classList.add('loading');
    
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('City not found');
        return response.json();
      })
      .then(data => {
        displayWeather(data);
      })
      .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to fetch weather data. Please try again.');
        weatherCard.classList.remove('loading');
      });
  }
  
  function displayWeather(data) {
    // Update basic info
    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    temperatureElement.textContent = Math.round(data.main.temp);
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `${data.main.humidity}%`;
    windElement.textContent = `${data.wind.speed} m/s`;
    cloudsElement.textContent = `${data.clouds.all}%`;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].main;
    
    // Update background based on weather
    updateBackground(data.weather[0].main);
    
    // Remove loading state
    weatherCard.classList.remove('loading');
  }
  
  function getLocationWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => displayWeather(data))
            .catch(error => {
              console.error('Error:', error);
              showAlert('Error fetching weather for your location');
            });
        },
        error => {
          console.error('Geolocation error:', error);
          showAlert('Location access denied. Please enable location services or search manually.');
        }
      );
    } else {
      showAlert('Geolocation is not supported by your browser. Please search manually.');
    }
  }
  
  function updateBackground(weatherCondition) {
    // Remove all weather classes
    body.className = '';
    
    // Add the appropriate class
    switch(weatherCondition.toLowerCase()) {
      case 'clear':
        body.classList.add('clear');
        break;
      case 'clouds':
        body.classList.add('clouds');
        break;
      case 'rain':
        body.classList.add('rain');
        break;
      case 'snow':
        body.classList.add('snow');
        break;
      case 'thunderstorm':
        body.classList.add('thunderstorm');
        break;
      case 'mist':
      case 'haze':
      case 'fog':
        body.classList.add('mist');
        break;
      default:
        body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }
  
  function showAlert(message) {
    // In a real app, you might use a more sophisticated alert system
    alert(message);
  }
  
  // Get weather for a default location on first load
  window.addEventListener('DOMContentLoaded', () => {
    fetchWeather('London');
  });