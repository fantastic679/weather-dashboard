

var reset_DOM = function() {
    var search_history = $("#search-history");
    search_history.html("");
    new_HTML="";
    if (storage.length > 0) {

        // create dropdown menu items for previous searches
        for (let i = 0; i < storage.length; i++) {
            new_HTML += '<a class="dropdown-item" href="#">Search "' + storage[i] + '" again</a>';
        }
        new_HTML = '<div role="separator" class="dropdown-divider"></div>' + new_HTML;
        search_history.html(new_HTML);

        // sets up click events for each of these new menu items
        // needs to be a separate for loop as event listeners are reset when DOM is changed
        for (let i = 0; i < storage.length; i++) {
            query_element_string = ".dropdown-item:eq(" + (i+1) + ")";
            $(query_element_string).on("click", function(event) {
                event.stopImmediatePropagation();
                $(".dropdown-toggle").dropdown("toggle");
                $("input").val(storage[i]);
                search();
            });
        }
    }
}

// function to generate HTML code for colour-coded badges based on UV index
var rate_UV = function(UV_index) {
    if (UV_index < 3) {
        return(UV_index + ' <span class="badge bg-success">favourable</span>');
    } else if (UV_index < 6) {
        return(UV_index + ' <span class="badge bg-warning">moderate</span>');
    } else {
        return(UV_index + ' <span class="badge bg-danger">severe</span>');
    }  
}

// this function updates the UI to reflect changes in stored searches
// we use it on startup as well as whenever there are any new searches or when local storage is cleared
// it has listener events for user input
var post_search_actions = function () {

    reset_DOM();
    
    // click event to search
    $(".dropdown-item:first").on("click", function(event) {
        event.stopImmediatePropagation();
        $(".dropdown-toggle").dropdown("toggle");
        storage.push($("input").val());
        localStorage.setItem("storage", JSON.stringify(storage));
        search();
    });    

    // click even to clear history
    $(".dropdown-item:last").on("click", function(event) {
        event.stopImmediatePropagation();
        $(".dropdown-toggle").dropdown("toggle");
        storage = [];
        localStorage.removeItem("storage");
        reset_DOM();
        $("input").val("your secrets are safe...");
        $("input").select();
        var bootstrap_container = $(".row:last");
        bootstrap_container.html("");
        post_search_actions();
    });

    // hitting enter in search bar simulates clicking on search button
    $("input").keydown(function(event) {
        event.stopImmediatePropagation();
        if (event.keyCode === 13) {
            $(".dropdown-item:first").click();
        }
    });

    // keep text input field in focus to facilitate another search
    $("input").focus();
}

// this is the meat of the sandwich
// this uses 2x APIs from OpenWeatherMap to retrieve and present data about the searched city
var search = function() {
    var APIKey = "b9436ed502002ed5624267bc7336b393";
    const input = $("input").val();
    var queryURL_weather = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + APIKey
    $("input").val("summoning magic...");
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
                              data.current.weather[0].main,
                              data.current.weather[0].description,
                              "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png",
                              data.current.temp,
                              data.current.humidity,
                              data.current.wind_speed,
                              data.current.uvi,
                              coords[2]]);
    
    
            for (let i = 0; i < 5; i++) {
                var dateObj = new Date((data.daily[i].dt)*1000)
                var day = ("0" + dateObj.getUTCDate()).slice(-2);
                var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
                var year = dateObj.getUTCFullYear();
                var dateString = day + "/" + month + "/" + year;
                returnArray.push([dateString,
                                  data.daily[i].weather[0].main,
                                  data.daily[i].weather[0].description,
                                  "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png",
                                  data.daily[i].temp.day,
                                  data.daily[i].humidity,
                                  data.daily[i].wind_speed,
                                  data.daily[i].uvi]);
            }
            return returnArray;
        })
        .then(returnArray => {
            var cardHTML = [];
            for (let i = 0; i < returnArray.length; i++) {
                if (i === 0) {
                    cardHTML[i] =   '<div class="card col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 text-white bg-primary">' +
                                        '<div class="card-body">' +
                                            '<h5 class="card-title">' + returnArray[i][8] + '</h5>' +
                                            '<img src="' + returnArray[i][3] + '">' +
                                            '<p class="card-text"><strong>' + returnArray[i][1] + ':</strong> ' + returnArray[i][2] + '</p>' +
                                            '<p class="card-text"><strong>Temperature:</strong> ' + returnArray[i][4] + '&degC</p>' +
                                            '<p class="card-text"><strong>Humidity:</strong> ' + returnArray[i][5] + '%</p>' +
                                            '<p class="card-text"><strong>Wind speed:</strong> ' + returnArray[i][6] + 'm/s</p>' +
                                            '<p class="card-text"><strong>UV index:</strong> ' + rate_UV(returnArray[i][7]) + '</p>' +
                                        '</div>' + 
                                    '</div>';
                }
                else {
                    cardHTML[i] =   '<div class="card col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 bg-light">' +
                                        '<div class="card-body">' +
                                            '<h5 class="card-title">' + returnArray[i][0] + '</h5>' +
                                            '<img src="' + returnArray[i][3] + '">' +
                                            '<p class="card-text"><strong>' + returnArray[i][1] + ':</strong> ' + returnArray[i][2] + '</p>' +
                                            '<p class="card-text"><strong>Temperature:</strong> ' + returnArray[i][4] + '&degC</p>' +
                                            '<p class="card-text"><strong>Humidity:</strong> ' + returnArray[i][5] + '%</p>' +
                                            '<p class="card-text"><strong>Wind speed:</strong> ' + returnArray[i][6] + 'm/s</p>' +
                                            '<p class="card-text"><strong>UV index:</strong> ' + rate_UV(returnArray[i][7]) + '</p>' +
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
            bootstrap_container.html(new_HTML + '<div class="form-group col-12"></div>' + bootstrap_container.html());
            
            $("input").val("");

            post_search_actions();
    
        });
    })
    .catch((error) => {
        $("input").val("we couldn't help :(");
        $("input").select();
        post_search_actions();
    });
}

///////////////////////////////////////////////////////

// retrieve previous search strings from local storage
if (localStorage.getItem("storage") !== null) {
    var storage = JSON.parse(localStorage.getItem("storage"));
} else {
    var storage = [];
}

// initialise everything and await user input
post_search_actions();
