document.title = "Weather Dashboard"

var APIKey = "b9436ed502002ed5624267bc7336b393";
var city; //// need to be modified to take user input ////
city = "sydney"; //// to delete later - for testing only ////

var queryURL_weather = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey

var storeData1; //// to delete later - for testing only ////
var storeData2; //// to delete later - for testing only ////

fetch(queryURL_weather)
.then(response => response.json())
.then(data => {
    storeData1 = data; //// to delete later - for testing only ////

    console.log(data.name + " " + data.sys.country); // city name
    return([data.coord.lat, data.coord.lon]);
})
.then(coords => {
    var queryURL_onecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords[0] + "&lon=" + coords[1] + "&exclude=minutely,hourly,alert&appid=" + APIKey + "&units=metric";
    fetch(queryURL_onecall)
    .then(response => response.json())
    .then(data => {
        storeData2 = data; //// to delete later - for testing only ////
        var returnArray = [];

        var dateObj = new Date((data.current.dt+data.timezone_offset)*1000)
        var day = ("0" + dateObj.getUTCDate()).slice(-2);
        var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
        var year = dateObj.getUTCFullYear();
        var dateString = day + "/" + month + "/" + year;
        console.log(dateString); // date
        console.log(data.current.weather[0].main + ": " + data.current.weather[0].description + "; " + "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"
        ); // weather conditions
        console.log(data.current.temp) // temperature
        console.log(data.current.humidity); // humidity
        console.log(data.current.wind_speed); // wind speed
        console.log(data.current.uvi); // UV index

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
                              "Temp: " + data.daily[i].temp.day,
                              "Humidity: " + data.daily[i].humidity,
                              "Wind speed: " + data.daily[i].wind_speed,
                              "UV index: " + data.daily[i].uvi]);
        }

        return returnArray;
        // pass data to external function to create cards

    })
    .then(returnArray => {
        for (let i = 0; i < returnArray.length; i++) {
            console.log(returnArray[i]);
            if (i === 0) {
                // make a blue box
            }
            else {
                // make a grey box
            }
        }
    });
});


// external function to take data and create HTML elements for current weather card

// external function to take data and create HTML elements for forcast cards


// function to capture the search event
// --> needs to include saving the search term into local storage
// --> ?creating buttons that allow previous search terms to be re-searched

// clear history button action

// var makeForecastCards = function(...args) {
//     for 
// }

// <div class="card bg-light mb-3">
//     <div class="card-body">
//         <h5 class="card-title">Card title</h5>
//         <img src="http://openweathermap.org/img/wn/10d@2x.png">
        
//         <p class="card-text">Temp</p>
//         <p class="card-text">Wind</p>
//         <p class="card-text">Humidity</p>
//     </div>
// </div>