function getPlaces() {
    const placeInput = document.getElementById('input_place').value
    const textArea = document.getElementById('response_area')

    if(placeInput.length < 2) {
        textArea.value = ''
        return
    }

    const http = new XMLHttpRequest()
    http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
            textArea.value = http.response
            const response = JSON.parse(http.response)
            let cities = ''
            for(let index = 0; index <= response.hits.length - 1; index++) {
                cities += response.hits[index].name + '\n'
            }
            textArea.value = cities
        }
    }
    const url = 'https://graphhopper.com/api/1/geocode?q=' + placeInput +
        '&key=69f3bd9d-95bf-4292-a4eb-159ac244774a'
    http.open("GET", url)
    http.send()
}