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
    
        var input = $(".form-input");
        var city = input.val();
        if (!cities.includes(city)) {
          cities.push(city);
          saveLocalStorage();
        }
        else {
            alert("Please enter a City");
        }
        renderCities();
        retrieveCity(city);
      });
    });



function retrieveCity(city) {
      var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      APIKey;
      
      fetch(queryURL)
      .then(function(response) {
            response.JSON().then(function(data){
                  renderCities(data, city);
            });
      });
};


function renderCities(city, $("#searchedCity")) {
      
}