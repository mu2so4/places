const placeItemClassName = 'placeItem'

function getInterestingPlaces(response) {
    clearPlaces()
    const placeList = document.getElementById('place_list')
    const places = response.features
    for(let index = 0; index <= places.length - 1; index++) {
        const placeProperties = places[index].properties
        const entry = document.createElement('li');
        entry.className = placeItemClassName
        const name = document.createElement('p')
        name.className = 'placeHeader'
        name.textContent = placeProperties.name
        entry.appendChild(name)
        placeList.appendChild(entry)

        const descriptionRequest = new XMLHttpRequest()
        descriptionRequest.onreadystatechange = () => {
            if(descriptionRequest.readyState === 4 &&
                descriptionRequest.status === 200) {
                const response = descriptionRequest.response
                getPlaceDescription(JSON.parse(response), entry)
            }
        }

        const url = 'https://api.opentripmap.com/0.1/ru/places/xid/' +
            `${placeProperties.xid}` +
            '?apikey=5ae2e3f221c38a28845f05b6ac6a5e25ba4d1cb33d0a32e7a13b8225'
        descriptionRequest.open('GET', url)
        descriptionRequest.send()
    }

    document.getElementById('place_data_source').hidden = false
    document.getElementById('place_list').hidden = false
    document.getElementById('place_data_error').hidden = true
}

function clearPlaces() {
    document.getElementById('place_list').innerHTML = ''
}

function getPlaceDescription(response, placeItem) {
    const description = document.createElement('p')
    description.textContent = response.wikipedia_extracts.text
    placeItem.appendChild(description)

    const link = document.createElement('a')
    link.href = response.wikipedia
    link.textContent = 'Источник'
    link.target = '_blank'
    placeItem.appendChild(link)
}