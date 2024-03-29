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
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            clearLocationHints()
            const json = http.response
            const response = JSON.parse(json)
            if(http.status === 200) {
                onTyping(response, hitList)
            }
            else if(http.status >= 400) {
                const msg = `Error ${http.status}: ${response.message}`
                const entry = document.createElement('li');
                entry.className = 'locationSuggestionError'
                entry.appendChild(document.createTextNode(msg))
                hitList.appendChild(entry)
                hitList.hidden = false
                console.error(json)
            }
        }
    }
    const url = `https://graphhopper.com/api/1/geocode?q=${locationInput}` +
        '&key=69f3bd9d-95bf-4292-a4eb-159ac244774a'
    http.open("GET", url)
    http.send()
}

function onLocationClick(latitude, longitude) {
    const weatherRequest = new XMLHttpRequest()
    weatherRequest.onreadystatechange = () => {
        if(weatherRequest.readyState === 4) {
            const json = weatherRequest.response
            const response = JSON.parse(json)
            if(weatherRequest.status === 200) {
                getWeather(response)
            }
            else if(weatherRequest.status >= 400) {
                document.getElementById('weather_bar').hidden = true
                const entry = document.getElementById('weather_error_message')
                entry.textContent = `Error ${response.cod}: ${response.message}`
                entry.hidden = false
                console.error(json)
            }
        }
    }
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}`+
        `&lon=${longitude}&units=metric&lang=ru&appid=afab9125bd210e10cb512ce5631fbf50`

    const placeRequest = new XMLHttpRequest()
    placeRequest.onreadystatechange = () => {
        if(placeRequest.readyState === 4) {
            const json = placeRequest.response
            const response = JSON.parse(json)
            document.getElementById('interesting_places').hidden = false
            if(placeRequest.status === 200) {
                getInterestingPlaces(response)
            }
            else if(placeRequest.status >= 400) {
                document.getElementById('place_data_source').hidden = true
                document.getElementById('place_list').hidden = true
                const error_entry = document.getElementById('place_data_error')
                error_entry.textContent = `${response.error}`
                error_entry.hidden = false
                console.error(json)
            }
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
    document.getElementById('input_location').value = ''
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
    const locationCount = response.hits.length
    if(locationCount === 0) {
        hitList.hidden = true
        return
    }
    for(let index = 0; index <= locationCount - 1; index++) {
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