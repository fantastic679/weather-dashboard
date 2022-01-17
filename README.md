# Wea-da!

## Introduction

Wea-da! is a simple web-based weather dashboard that allows uses to quickly search a city name to find out the current weather conditions and forecasted weather conditions for the upcoming 5 days (current day included).

The data is accessed from [OpenWeatherMap](https://openweathermap.org/) using free-to-use APIs.

This particular application uses HTML, CSS and JavaScript. In particular, it uses Bootstrap and jQuery for both stylistic and functional purposes. For simplicity's sake, no additional CSS files were used and the HTML file was kept to a minimum.

## Disclaimer
This application was developed as a homework task for the University of Sydney Full Stack Coding Bootcamp.

## [Live demo](https://fantastic679.github.io/weather-dashboard/)

## [Repo](https://github.com/fantastic679/weather-dashboard/)

## Screenshot

![Wea-da! in action](/assets/screenshots/screenshot1.png?raw=true)

## Specifications

These were the requirements specified by the homework task for which this application was developed.

```
GIVEN a weather dashboard with form inputs

WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history

WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## Other features

The user is initially presented with a search bar, which is automatically in focus. The user can enter the city name and hit `↵ Enter` or use to dropdown menu on the right to search. Where sensible, the search bar remain in focus to facilitate further searches. Searches are stored in local memory and are automatically restored on application startup.

Once available, the weather information is displayed in card format, with the current weather information displayed on a blue card, and forecasted weather information displayed on grey cards. An intentional design choice was made to leave old search results on screen when new searches are made (with new search results on top). Bootstrap was used to ensure responsive web design to allow users on smaller screen be able to read the cards.

Further functionality is included in the dropdown menu on the right side of the search bar. If there are any previous searches that have not been cleared from history, these will be presented in the dropdown menu. Moreover, the ability to clear searches is also included here.

## Contact

Feel free to leave me feedback at stevenphan@msn.com.