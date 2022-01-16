document.title = "Weather Dashboard"

var APIKey = "b9436ed502002ed5624267bc7336b393";
var city; //// need to be modified to take user input ////
city = "melbourne"; //// to delete later - for testing only ////

var queryURL_weather = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey

fetch(queryURL_weather)
.then(response => response.json())
.then(data => {
    console.log(data.name + " " + data.sys.country);
    return([data.coord.lat, data.coord.lon]);
})
.then(coords => {
    var queryURL_onecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords[0] + "&lon=" + coords[1] + "&exclude=minutely,hourly,alert&appid=" + APIKey + "&units=metric";
    fetch(queryURL_onecall)
    .then(response => response.json())
    .then(data => {
        var returnArray = [];
        var dateObj = new Date((data.current.dt+data.timezone_offset)*1000)
        var day = ("0" + dateObj.getUTCDate()).slice(-2);
        var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
        var year = dateObj.getUTCFullYear();
        var dateString = day + "/" + month + "/" + year;

        returnArray.push([dateString,
            data.current.weather[0].main + ": " + data.current.weather[0].description,
            "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png",
            "Temp: " + data.current.temp,
            "Humidity: " + data.current.humidity,
            "Wind speed: " + data.current.wind_speed,
            "UV index: " + data.current.uvi]);


        for (let i = 0; i < 5; i++) {
            var dateObj = new Date((data.daily[i].dt)*1000)
            var day = ("0" + dateObj.getUTCDate()).slice(-2);
            var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
            var year = dateObj.getUTCFullYear();
            var dateString = day + "/" + month + "/" + year;
            returnArray.push([dateString,
                              data.daily[i].weather[0].main + ": " + data.daily[i].weather[0].description,
                              "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png",
                              "Temperature: " + data.daily[i].temp.day,
                              "Humidity: " + data.daily[i].humidity,
                              "Wind speed: " + data.daily[i].wind_speed,
                              "UV index: " + data.daily[i].uvi]);
        }
        return returnArray;
    })
    .then(returnArray => {
        var cardHTML = [];
        for (let i = 0; i < returnArray.length; i++) {
            if (i === 0) {
                cardHTML[i] =   '<div class="card text-white bg-primary mb-3">' +
                                    '<div class="card-body">' +
                                        '<h5 class="card-title">Today</h5>' +
                                        '<img src="' + returnArray[i][2] + '">' +
                                        '<p class="card-text">' + returnArray[i][1] + '</p>' +
                                        '<p class="card-text">' + returnArray[i][3] + '</p>' +
                                        '<p class="card-text">' + returnArray[i][4] + '</p>' +
                                        '<p class="card-text">' + returnArray[i][5] + '</p>' +
                                        '<p class="card-text">' + returnArray[i][6] + '</p>' +
                                    '</div>' + 
                                '</div>';
            }
            else {
                cardHTML[i] =   '<div class="card bg-light mb-3">' +
                                    '<div class="card-body">' +
                                        '<h5 class="card-title">' + returnArray[i][0] + '</h5>' +
                                        '<img src="' + returnArray[i][2] + '">' +
                                        '<p class="card-text">' + returnArray[i][1] + '</p>' +
                                        '<p class="card-text">' + returnArray[i][3] + '</p>' +
                                        '<p class="card-text">' + returnArray[i][4] + '</p>' +
                                        '<p class="card-text">' + returnArray[i][5] + '</p>' +
                                        '<p class="card-text">' + returnArray[i][6] + '</p>' +
                                    '</div>' + 
                                '</div>';
            }
        }
        return cardHTML;
    })
    .then(cardHTML => {
        var temp = document.querySelector(".row");
        for (let i=0; i < cardHTML.length; i++) {
            temp.innerHTML = temp.innerHTML + cardHTML[i];
        }
    })
    ;
});