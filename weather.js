function getWeather(response) {
    const main = response.main
    document.getElementById('weather_city_name').textContent = response.name
    document.getElementById('temperature').textContent = main.temp.toFixed(1)
    document.getElementById('feels_like').textContent =
        main.feels_like.toFixed(1)
    document.getElementById('humidity').textContent = main.humidity
    document.getElementById('pressure').textContent =
        (main.pressure * 0.75).toFixed(0)
    document.getElementById('wind_speed').textContent = response.wind.speed

    const degrees = response.wind.deg
    const directions = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
    const index = Math.round((degrees + 22.5) % 360 / 45) % 8;
    document.getElementById('wind_dir').textContent = directions[index]

    const icon = document.getElementById('weather_icon')
    icon.src = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
    icon.alt = response.weather[0].description
    document.getElementById('weather_bar').hidden = false
}