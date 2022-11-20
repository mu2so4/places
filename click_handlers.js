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
                const coords = parseFloat(suggestion.point.lat).toFixed(4) +
                    ', ' + parseFloat(suggestion.point.lng).toFixed(4)
                coordsPar.textContent = coords
                entry.appendChild(coordsPar)

                hitList.appendChild(entry)
            }
            hitList.hidden = false
        }
    }
    const url = 'https://graphhopper.com/api/1/geocode?q=' + placeInput +
        '&key=69f3bd9d-95bf-4292-a4eb-159ac244774a'
    http.open("GET", url)
    http.send()
}

function clearPlaceHints() {
    const items = document.getElementsByClassName(suggestionClassName)
    for(let index = 0; index <= items.length -1; index++) {
        items[index].remove()
    }
}