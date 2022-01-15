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

        console.log("This is right now");
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

        for (let i = 0; i < 5; i++) {
            console.log("This is the forecast for " + i + " day(s) ahead");
            var dateObj = new Date((data.daily[i].dt)*1000)
            var day = ("0" + dateObj.getUTCDate()).slice(-2);
            var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
            var year = dateObj.getUTCFullYear();
            var dateString = day + "/" + month + "/" + year;
            console.log(dateString); // date
            console.log(data.daily[i].weather[0].main + ": " + data.daily[i].weather[0].description + "; " + "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"
            ); // weather conditions
            console.log(data.daily[i].temp.day) // temperature
            console.log(data.daily[i].humidity); // humidity
            console.log(data.daily[i].wind_speed); // wind speed
            console.log(data.daily[i].uvi); // UV index
        }

    });
});




