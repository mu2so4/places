const suggestionClassName = 'locationSuggestion'

function getLocations() {
    const locationInput = document.getElementById('input_location').value
    const hitList = document.getElementById('hit_list')

    if(locationInput.length < 2) {
        clearLocationHints()
        hitList.hidden = true
        return
    }

    const http = new XMLHttpRequest()
    http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
            clearLocationHints()
            const response = JSON.parse(http.response)
            onTyping(response, hitList)
        }
    }
    const url = 'https://graphhopper.com/api/1/geocode?q=' + locationInput +
        '&key=69f3bd9d-95bf-4292-a4eb-159ac244774a'
    http.open("GET", url)
    http.send()
}

function onLocationClick(latitude, longitude) {
    const weatherRequest = new XMLHttpRequest()
    weatherRequest.onreadystatechange = function() {
        if(weatherRequest.readyState === 4 && weatherRequest.status === 200) {
            const response = JSON.parse(weatherRequest.response)
            getWeather(response)
        }
    }
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}`+
        `&lon=${longitude}&units=metric&lang=ru&appid=afab9125bd210e10cb512ce5631fbf50`

    const placeRequest = new XMLHttpRequest()
    placeRequest.onreadystatechange = function() {
        if(placeRequest.readyState === 4 && placeRequest.status === 200) {
            const response = placeRequest.response
            getInterestingPlaces(JSON.parse(response))
        }
    }
    const categories = 'natural,religion,historic,cultural,architecture'
    const placeUrl = 'https://api.opentripmap.com/0.1/ru/places/radius?radius=10000&' +
        `lat=${latitude}&lon=${longitude}&rate=3&limit=8&kinds=${categories}&` +
        'apikey=5ae2e3f221c38a28845f05b6ac6a5e25ba4d1cb33d0a32e7a13b8225'

    weatherRequest.open("GET", weatherUrl)
    placeRequest.open("GET", placeUrl)
    weatherRequest.send()
    placeRequest.send()
    document.getElementById('input_place').value = ''
}

function focusOnLocationInput() {
    document.getElementById('hit_list').hidden =
        document.getElementById('input_location').value.length < 2
}

function blurLocationInput() {
    setTimeout(function() {
        document.getElementById('hit_list').hidden = true
    }, 80)
}

function clearLocationHints() {
    document.getElementById('hit_list').innerHTML = ''
}

function onTyping(response, hitList) {
    for(let index = 0; index <= response.hits.length - 1; index++) {
        const entry = document.createElement('li');
        entry.className = suggestionClassName
        const suggestion = response.hits[index]

        const locationName = suggestion.name
        const fullNamePar = document.createElement('p')
        fullNamePar.className = 'locationFullName'
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
            onLocationClick(suggestion.point.lat, suggestion.point.lng)
        }, false)

        hitList.appendChild(entry)
    }
    hitList.hidden = false
}