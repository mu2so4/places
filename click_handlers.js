function getPlacesOnClick() {
    const place = document.getElementById('input_place').value

    const http = new XMLHttpRequest()
    http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
            const response = document.getElementById('response_area')
            response.value = http.response
            //alert(http.response)
        }
    }
    const url = 'https://graphhopper.com/api/1/geocode?q=' + place +
        '&key=69f3bd9d-95bf-4292-a4eb-159ac244774a'
    http.open("GET", url)
    http.send()

    //const response = document.getElementById('response_area')
    //response.value = http.response

}