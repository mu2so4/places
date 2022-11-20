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
                const value = suggestion.name + ', ' + suggestion.country
                entry.appendChild(document.createTextNode(value));
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