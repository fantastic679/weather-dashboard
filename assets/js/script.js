var load_DOM = function () {

    // loop through all stored searches
    // modify the dropdown menu accordingly
    // then reset the DOM
    
    $(".dropdown-item:first").on("click", function(event) {
        $(".dropdown-item:first").off("click"); 
        // to prevent multiple instances of click event
        // alternative is to use event.stopImmediatePropagation()
        search();
        
    });    

    $(".dropdown-item:last").on("click", function() {
        $(".dropdown-item:last").off("click");
        console.log("clear history");
    });

    $("input").focus();
}

load_DOM();


var search = function() {
    console.log("one more search");
    var APIKey = "b9436ed502002ed5624267bc7336b393";
    var city = $("input").val();
    var queryURL_weather = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey
    
    fetch(queryURL_weather)
    .then(response => response.json())
    .then(data => {
        return([data.coord.lat, data.coord.lon, data.name + " " + data.sys.country]);
    })
    .then(coords => {
        var queryURL_onecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords[0] + "&lon=" + coords[1] + "&exclude=minutely,hourly,alert&appid=" + APIKey + "&units=metric";
        return fetch(queryURL_onecall)
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
                "Temperature: " + data.current.temp + "&degC",
                "Humidity: " + data.current.humidity + "%",
                "Wind speed: " + data.current.wind_speed + "m/s",
                "UV index: " + data.current.uvi,
                coords[2]]);
    
    
            for (let i = 0; i < 5; i++) {
                var dateObj = new Date((data.daily[i].dt)*1000)
                var day = ("0" + dateObj.getUTCDate()).slice(-2);
                var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
                var year = dateObj.getUTCFullYear();
                var dateString = day + "/" + month + "/" + year;
                returnArray.push([dateString,
                                  data.daily[i].weather[0].main + ": " + data.daily[i].weather[0].description,
                                  "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png",
                                  "Temperature: " + data.daily[i].temp.day + "&degC", 
                                  "Humidity: " + data.daily[i].humidity + "%",
                                  "Wind speed: " + data.daily[i].wind_speed + "m/s",
                                  "UV index: " + data.daily[i].uvi]);
            }
            return returnArray;
        })
        .then(returnArray => {
            var cardHTML = [];
            for (let i = 0; i < returnArray.length; i++) {
                if (i === 0) {
                    cardHTML[i] =   '<div class="card col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 text-white bg-primary mb-3">' +
                                        '<div class="card-body">' +
                                            '<h5 class="card-title">' + returnArray[i][7] + '</h5>' +
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
                    cardHTML[i] =   '<div class="card col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 bg-light mb-3">' +
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
            var new_HTML = "";
            for (let i=0; i < cardHTML.length; i++) {
                new_HTML += cardHTML[i];
            }
            var bootstrap_container = $(".row:last");
            bootstrap_container.html(new_HTML + bootstrap_container.html());

            load_DOM();
    
        });
    });
}