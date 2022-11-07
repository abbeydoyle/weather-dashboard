
/*
* TODO:
api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
fetch(queryURL);
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

      // *TODO: API get city function
      // *TODO: append html elements
      // *TODO: make user input required
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
    cityViewed.addClass("row").css({
      textAlign: "center",
      border: "1px solid silver",
      height: "50px",
      lineHeight: "50px",
      paddingLeft: "40px",
    });
    cityViewed.html(cities[c]);
    $("#cityViewed").prepend(cityViewed);

    //OnClick event on each city
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
//*FIXME: API doesnt give info
  

//get API data
  $.ajax({ url: queryURL, type: "GET" }).then(function (response) {
    //icon url var, url and element
    console.log(response);
    var iconLoc = response.weather[0].icon;
    console.log(iconLoc);

    var iconSrc = "https://openweathermap.org/img/wn/" + iconLoc + "@2x.png";
    var iconImage = $("<img>");
    iconImage.attr("src", iconSrc);

    $(".current-city").text(response.name + " (" + currentDate + ")");
    $(".current-city").append(iconImage);
    $("#temp").text("Temperature : " + response.main.temp + " °F");
    $("#windy").text("Wind Speed : " + response.wind.speed + " MPH");
    $("#hum").text("Humidity : " + response.main.humidity + " %");
    // Converts the temp to Kelvin with the below formula
    var tempF = (response.main.temp - 273.15) * 1.8 + 32;
    $(".tempF").text("Temperature (Kelvin) " + tempF);
    forecast(city);
    input.val("");


    if (response.iconLoc = "03n") {
      $(".body").attr("style","background-color:red");
    } else if (response.iconLoc != "03n") {
      $(".body").attr("style","background-color:black");
    }

  });
}




// 5 days forecast codes

function forecast(city) {
  var forecastQueryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey;

  $.ajax({ url: forecastQueryURL, type: "GET" }).then(function (response) {
    var list = response.list;
    console.log(response);
    // for each iteration of our loop
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
//*FIXME: 5 day forecast is ahead by one day
      var fullDate = `${month + 1}/${day - 1}/${year}`;
      // Creating and storing a div tag
      var col = $("<div>");
      col.addClass("col");
      var mycard = $("<div>");
      mycard.addClass("card");
      col.append(mycard);

      // Creating a paragraph tag with the response item
      var p = $("<p>").text(fullDate);
      // Creating and storing an image tag

      var iconUrl = "https://openweathermap.org/img/wn/" + iconId + "@2x.png";

      var weatherImage = $("<img>");
      // Setting the src attribute of the image to a property pulled off the result item
      weatherImage.attr("src", iconUrl);

      var p1 = $("<p>").text("Temp: " + temp + "°F");
      var p2 = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
      var p3 = $("<p>").text("Humidity: " + humidity + "%");

      // Appending the paragraph and image tag to mycard
      mycard.append(p);
      mycard.append(weatherImage);
      mycard.append(p1);
      mycard.append(p2);
      mycard.append(p3);

      // Prependng the col to the HTML page in the "#forecast" div

      $("#forecast").prepend(col);
    }
  });
}
