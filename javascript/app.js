const APIkey = 'WFMtyMmKsYIplW455zdGfq98FLfzceoW';

const findCityWeather = async(city) => {
    //finding city
    const locationResponse = await fetch(
        `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${APIkey}&q=${city}`);
    const data = await locationResponse.json();
    //pick 1st city (most relevant to search query) and retrieve key
    const key = data[0].Key;
    console.log('City Key:', key)
    //using key fetch weather data fro the city
    const weatherData = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${APIkey}`);
    const weather = await weatherData.json();
    return {weather:weather[0], city:data[0].EnglishName};
}

//event listener on form submit on search bar
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const searchfield = document.getElementById('searchField');
    findCityWeather(searchfield.value.trim())
    .then(weatherData => {
        console.log(weatherData.weather);
        renderUI(weatherData.weather, weatherData.city);
        searchField.value = '';
    }).catch(err => {
        console.log('Error:', err.message);
    });
});

function renderUI(weather, city, error=false) {
    document.getElementById('cityName').innerText = city;
    document.getElementById('weather').innerText = weather.WeatherText;
    document.getElementById('temperature').innerText = weather.Temperature.Metric.Value;
    const picture = document.getElementById('dayNight')
    if (weather.IsDayTime) {
        picture.setAttribute('src', '/media/day.png')
    } else {
        picture.setAttribute('src', '/media/night.png')
    }
    document.getElementById('icon').setAttribute('src', `/media/icons/${weather.WeatherIcon}.svg`);
    document.querySelector('.card').removeAttribute('hidden');
}