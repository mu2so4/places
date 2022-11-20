const suggestionClassName = 'placeSuggestion'

function getPlaces() {
    const placeInput = document.getElementById('input_place').value
    const hitList = document.getElementById('hit_list')

    if(placeInput.length < 2) {
        clearPlaceHints()
        hitList.hidden = true
        return
    }

    const http = new XMLHttpRequest()
    http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
            clearPlaceHints()
            const response = JSON.parse(http.response)
            onTyping(response, hitList)
        }
    }
    const url = 'https://graphhopper.com/api/1/geocode?q=' + placeInput +
        '&key=69f3bd9d-95bf-4292-a4eb-159ac244774a'
    http.open("GET", url)
    http.send()
}

function onItemClickListener(latitude, longitude) {
    const http = new XMLHttpRequest()
    http.onreadystatechange = function() {
        if(http.readyState === 4 && http.status === 200) {
            const response = JSON.parse(http.response)
            getWeather(response)
        }
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}`+
        `&lon=${longitude}&units=metric&lang=ru&appid=afab9125bd210e10cb512ce5631fbf50`
    http.open("GET", url)
    http.send()
    document.getElementById('input_place').value = ''
}

function onSelect() {
    document.getElementById('hit_list').hidden =
        document.getElementById('input_place').value.length < 2
}

function onUnselect() {
    setTimeout(function() {
        document.getElementById('hit_list').hidden = true
    }, 60)
}

function clearPlaceHints() {
    const items = document.getElementsByClassName(suggestionClassName)
    for(let index = 0; index <= items.length - 1; index++) {
        items[index].remove()
    }
}

function onTyping(response, hitList) {
    for(let index = 0; index <= response.hits.length - 1; index++) {
        const entry = document.createElement('li');
        entry.className = suggestionClassName
        const suggestion = response.hits[index]

        const locationName = suggestion.name
        const fullNamePar = document.createElement('p')
        fullNamePar.className = 'placeFullName'
        fullNamePar.textContent = locationName
        entry.appendChild(fullNamePar)

        const regionPar = document.createElement('p')
        regionPar.className = 'regionFullName'
        let region = ''
        if(suggestion.city !== undefined) {
            region += suggestion.city + ', '
        }
        if(suggestion.state !== undefined) {
            region += suggestion.state + ', '
        }
        region += suggestion.country
        regionPar.textContent = region
        entry.appendChild(regionPar)

        const coordsPar = document.createElement('p')
        coordsPar.className = 'coordsSuggestion'
        coordsPar.textContent = parseFloat(suggestion.point.lat).
        toFixed(4) + ', ' + parseFloat(suggestion.point.lng).
        toFixed(4)
        entry.appendChild(coordsPar)

        entry.addEventListener('click', function () {
            hitList.hidden = true
            onItemClickListener(suggestion.point.lat, suggestion.point.lng)
        }, false)

        hitList.appendChild(entry)
    }
    hitList.hidden = false
}

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