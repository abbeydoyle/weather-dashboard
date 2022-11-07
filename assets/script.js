
/*
api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
*/

const APIKey = "49415678631ad9acec49635922e5f265";
var cities = [];
//organize history new to old
cities.reverse();


//city search history
//local storage
function retrieveLocalStorage() {
  cities = JSON.parse(localStorage.getItem("cities")) || [];
}

function saveLocalStorage() {
  localStorage.setItem("cities", JSON.stringify(cities));
}

//display search history
$(document).ready(function () {
  retrieveLocalStorage();
  if (cities[0]) {
    retrieveCity(cities[cities.length - 1]);
  }

  renderCities();


  //user search button
  $(".btn").on("click", function (event) {
    event.preventDefault();

    var input = $(".form-control");
    var city = input.val();
    if (!cities.includes(city)) {
      cities.push(city);
      saveLocalStorage();
    }
    renderCities();
    retrieveCity(city);
  });
});

//display cities
function renderCities() {
  var limit;

  if (cities.length < 10) {
    limit = cities.length;
  } else {
    limit = 10;
  }
  $("#cityViewed").html("");
  for (var c = 0; c < limit; c++) {
    var cityViewed = $("<div>");
    cityViewed.addClass("history");
    cityViewed.html(cities[c]);
    $("#cityViewed").prepend(cityViewed);

    //display current and forecast city weather based off search history city click
    cityViewed.attr("id", `${cities[c]}`);
    $(`#${cities[c]}`).on("click", function () {
      retrieveCity($(this).text());
    });
  }
}


//retrieve weather api data
// moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
function retrieveCity(city) {
  var currentDate = moment().format("dddd, MMMM Do YYYY");
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    APIKey;
  

//get current day API data
//display current day image and weather
  $.ajax({ url: queryURL, type: "GET" }).then(function (response) {
    console.log(response);
    var iconLoc = response.weather[0].icon;
    console.log(iconLoc);

    var iconSrc = "https://openweathermap.org/img/wn/" + iconLoc + "@2x.png";
    var iconImage = $("<img>");
    iconImage.attr("src", iconSrc);

    $(".current-city").text(response.name + " (" + currentDate + ")");
    $(".current-city").append(iconImage);
    $("#temp").text("Temperature : " + response.main.temp + " °F");
    $("#wind").text("Wind Speed : " + response.wind.speed + " mph");
    $("#humid").text("Humidity : " + response.main.humidity + " %");
    forecast(city);
    input.val("");

    //attempt at changing background color based off current weather image
    // if (iconLoc === "03n") {
    //   $(".body").attr("style","background-color:red");
    // } else if (iconLoc !== "03n") {
    //   $(".body").attr("style","background-color:black");
    // }

  });
}




//get forecast API data
//display forecast image and weather
function forecast(city) {
  var forecastQueryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey;

  $.ajax({ url: forecastQueryURL, type: "GET" }).then(function (response) {
    var list = response.list;
    console.log(response);
    // loop each forecast day
    $("#forecast").html("");
    for (var i = 39; i >= 0; i = i - 8) {
      var temp = ((list[i].main.temp - 273.15) * 1.8 + 32).toFixed(2);
      var iconId = list[i].weather[0].icon;
      var windSpeed = list[i].wind.speed;
      var humidity = list[i].main.humidity;
      var date = new Date(list[i].dt_txt);

      var day = date.getDate();
      var month = date.getMonth();
      var year = date.getFullYear();

      var fullDate = `${month + 1}/${day - 1}/${year}`;
      var col = $("<div>");
      col.addClass("col");
      var mycard = $("<div>");
      mycard.addClass("card");
      col.append(mycard);

      var fh2 = $("#fivedayforecast").text("Five Day Forecast");

      var h4 = $("<h4>").text(fullDate);

      var iconUrl = "https://openweathermap.org/img/wn/" + iconId + "@2x.png";

      var weatherImage = $("<img>");

      weatherImage.attr("src", iconUrl);

      var ptemp = $("<p>").text("Temp: " + temp + " °F");
      var pwind = $("<p>").text("Wind Speed: " + windSpeed + " mph");
      var phumid = $("<p>").text("Humidity: " + humidity + " %");

      // display forecast weather data
      $("#fivedayforecast").append(fh2);
      mycard.append(h4);
      mycard.append(weatherImage);
      mycard.append(ptemp);
      mycard.append(pwind);
      mycard.append(phumid);

      $("#forecast").prepend(col);
    }
  });
}
