// Openweathermap API. 
const api = "2a95e3aa94444f6150c3420a186874ee";
let currentCondition = document.getElementById("current-conditions");
let forecastDiv = document.getElementById("fivedayforecast");
// declare week day array for forecast day name
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednessday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Function to get current Data 
async function getcurrent(current) {
  let fetchData = await fetch(current);
  let response = await fetchData.json();
  let { temp } = response.main;
  let { description, icon } = response.weather[0];
  let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  let celsius = temp - 273.15;
  let html =
    "<h2>Current Conditions</h2>" +
    '<img src="' +
    iconUrl +
    '" />' +
    '<div class="current">' +
    '<div class="temp">' +
    celsius.toFixed(2) +
    "℃</div>" +
    '<div class="condition">' +
    description +
    "</div>" +
    "</div>";

  currentCondition.innerHTML = html;
}

window.addEventListener("load", () => {
  let long;
  let lat;
  // Accesing the Geolocation 
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const current = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}`;

      getcurrent(current);

      const forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${api}`;

      getForcast(forecast);
    });
  }
});

// Function to get 5 Days Forecast //
async function getForcast(forecast) {
  let fetchData = await fetch(forecast);
  let response = await fetchData.json();
  let forecastHtml = "";
  let dayHtml = "";
  let headingCondition = true;
  let currentDay = weekDays[new Date(response.list[0].dt_txt).getDay()];

  for (let i = 0; i < response.list.length; i++) {
    let { temp_min, temp_max } = response.list[i].main; 
    let { description, icon } = response.list[i].weather[0]; 
    let dt_txt = response.list[i].dt_txt; 
    let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`; 
    let celsius_min = temp_min - 273.15; 
    let celsius_max = temp_max - 273.15; 
    let date = new Date(dt_txt);
    let day = weekDays[date.getDay()];
    let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    // for heading if first day is same as current day
    if (currentDay == day && headingCondition) {
      forecastHtml += '<h3 class="dayHeading">' + day + "</h3>";
      forecastHtml += '<div class="forecast">';
      headingCondition = false;
    }

    // Adding html in forecastHtml if day change
    if (currentDay != day) {
      forecastHtml += dayHtml;
      forecastHtml += "</div>";
      dayHtml = "";
      headingCondition = true;
      currentDay = day;
    }

    // creating html for each forecast dyanamically
    dayHtml +=
      '<div class="day">' +
      "<h3>" +
      hour +
      ":" +
      minute +
      ":" +
      second +
      "</h3>" +
      '<img src="' +
      iconUrl +
      '" />' +
      '<div class="description">' +
      description +
      "</div>" +
      '<div class="temp">' +
      '<span class="high">' +
      celsius_min.toFixed(2) +
      '℃</span>/<span class="low">' +
      celsius_max.toFixed(2) +
      "℃</span>" +
      "</div>" +
      "</div>";
  }
  forecastHtml += dayHtml;
  forecastHtml += "</div>";
  forecastDiv.innerHTML = forecastHtml;
}

