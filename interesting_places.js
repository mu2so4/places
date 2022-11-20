const placeItemClassName = 'placeItem'

function getInterestingPlaces(response) {
    clearPlaces()
    const placeList = document.getElementById('place_list')
    const places = response.features
    for(let index = 0; index <= places.length - 1; index++) {
        const entry = document.createElement('li');
        entry.className = placeItemClassName
        entry.appendChild(document.createTextNode(places[index].properties.name))
        placeList.appendChild(entry)
    }

    document.getElementById('interesting_places').hidden = false
}

function clearPlaces() {
    const items = document.getElementsByClassName(placeItemClassName)
    for(let index = 0; index <= items.length - 1; index++) {
        items[index].remove()
    }
}