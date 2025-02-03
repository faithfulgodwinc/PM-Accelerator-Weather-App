require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const API_KEY = process.env.WEATHER_API_KEY;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//Home Route
app.get('/', (req, res) => {
res.render('index', { weatherData: null, forecast: null, error: null });
});

//Fetch 5-Day Forecast
app.post('/weather', async (req, res) => {
const location = req.body.location;

try {
    // Fetch current weather
     const weatherResponse = await axios.get(
       `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=imperial`
     );

     // Fetch 5-day forecast
     const forecastResponse = await axios.get(
       `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=imperial`
     );

     const weatherData = {
      location: weatherResponse.data.name,
      temperature: weatherResponse.data.main.temp,
      description: weatherResponse.data.weather[0].description
    };

    // Extract 5-day forecast (every 24 hours at 12:00 PM)
    const forecast = forecastResponse.data.list.filter(item => item.dt_txt.includes("12:00:00"))
      .map(item => ({
        date: item.dt_txt.split(" ")[0],
        temp: item.main.temp,
        desc: item.weather[0].description
      }));

    res.render('index', { weatherData, forecast, error: null });
  } catch (error) {
    res.render('index', { weatherData: null, forecast: null, error: "Location not found. Try again!" });
  }
});


app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
