// Tomar OpenWeatherMap API Key ekhane boshao
const apiKey = "aa146361522491db17cc45db3f0705c3"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

// Elements
const searchBox = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const weatherCard = document.getElementById("weather-card");
const loading = document.getElementById("loading");
const suggestionsBox = document.getElementById("suggestions");

// Top 20 popular cities for Autocomplete (Tumi chaile aro add korte paro)
const cities = ["Dhaka", "Madaripur", "Chittagong", "Sylhet", "Delhi", "Mumbai", "London", "New York", "Tokyo", "Paris", "Dubai", "Singapore", "Sydney", "Jakarta", "Indonesia", "Istanbul", "Kuala Lumpur", "Seoul", "Beijing", "Bangkok"];

// 1. Fetch Weather Data
async function checkWeather(query) {
    loading.classList.remove("hidden");
    weatherCard.classList.add("hidden");

    try {
        const response = await fetch(apiUrl + query + `&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");
        
        const data = await response.json();
        
        // Update UI
        document.getElementById("city-name").innerText = data.name;
        document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
        document.getElementById("humidity").innerText = data.main.humidity + "%";
        document.getElementById("wind").innerText = data.wind.speed + " km/h";
        document.getElementById("description").innerText = data.weather[0].description;
        
        // Dynamic Icon
        const iconCode = data.weather[0].icon;
        document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Dynamic Background Change based on weather
        changeBackground(data.weather[0].main);

        loading.classList.add("hidden");
        weatherCard.classList.remove("hidden");
    } catch (error) {
        loading.classList.add("hidden");
        alert(error.message + ". Please try again!");
    }
}

// 2. Dynamic Background Logic
function changeBackground(weatherMain) {
    const body = document.body;
    if (weatherMain === "Rain" || weatherMain === "Drizzle") {
        body.style.background = "linear-gradient(135deg, #3a404d, #181b22)";
    } else if (weatherMain === "Clear") {
        body.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
    } else if (weatherMain === "Clouds") {
        body.style.background = "linear-gradient(135deg, #8e9eab, #eef2f3)";
    } else {
        body.style.background = "linear-gradient(135deg, #00feba, #5b548a)"; // Default
    }
}

// 3. Current Location (Geolocation API)
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        loading.classList.remove("hidden");
        weatherCard.classList.add("hidden");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                checkWeather(`lat=${lat}&lon=${lon}`);
            },
            () => {
                loading.classList.add("hidden");
                alert("Location access denied or unavailable.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// 4. Autocomplete Logic
searchBox.addEventListener("input", () => {
    const val = searchBox.value.toLowerCase();
    suggestionsBox.innerHTML = "";
    if (!val) return;

    const matches = cities.filter(city => city.toLowerCase().startsWith(val));
    matches.forEach(match => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.innerText = match;
        div.onclick = () => {
            searchBox.value = match;
            suggestionsBox.innerHTML = "";
            checkWeather(`q=${match}`);
        };
        suggestionsBox.appendChild(div);
    });
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
    if(e.target.id !== "city-input") suggestionsBox.innerHTML = "";
});

// Search Button and Enter Key
searchBtn.addEventListener("click", () => {
    if(searchBox.value) checkWeather(`q=${searchBox.value}`);
});
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchBox.value) {
        suggestionsBox.innerHTML = "";
        checkWeather(`q=${searchBox.value}`);
    }
});

// Default weather on load
checkWeather("q=Madaripur");
async function getForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const res = await fetch(forecastUrl);
    const data = await res.json();
    // Ekhane data.list theke 5 diner data filter kore UI-te dekhate hobe
}
