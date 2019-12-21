$(document).ready(function() {
      $('.parallax').parallax();
      $('.carousel').carousel();
      $('.modal-trigger').modal();
   
  
    var firebaseConfig = {
      apiKey: "AIzaSyCXn_4E9valZxUZhJr98_P_lVmT3AuHFz4",
      authDomain: "project-1-7fa91.firebaseapp.com",
      databaseURL: "https://project-1-7fa91.firebaseio.com",
      projectId: "project-1-7fa91",
      storageBucket: "project-1-7fa91.appspot.com",
      messagingSenderId: "341127398178",
      appId: "1:341127398178:web:55c086409ad099f663db7b",
      measurementId: "G-V8MMH4C7GY"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  
    var database = firebase.database();
  
    var search;
  
    $(".results").hide();
    $(".tableHead").hide();
   
  //on-click function for API calls
    $("#search-button").on("click", function (event) {
      event.preventDefault();
      $(".results").show();
      $(".tableHead").show();
  
      search = $("#search-event").val().trim();
  
      database.ref().push({
  
        search: search,
  
      });

  //moment function for determining current time and formatting
      var currentDate = new Date();
      var endDate = moment(currentDate).add(5, 'days').format("YYYY-MM-DD");
      var startDate = moment(currentDate).format("YYYY-MM-DD");
  
  //API ajax call for StubHub
      var queryURl = "https://api.stubhub.com/sellers/search/events/v3?q=" + search + "&dateLocal=" + startDate + "TO" + endDate + "&city=Atlanta";
      $.ajax({
        method: "GET",
        url: queryURl,
        headers: {
          Authorization: "Bearer A0cvfZsGTDdB1nyqgQ68SpoGdOWC"
        }
      })
        .then(function (response) {
          var results = response;
        
          if (results.events.length === 0 || results.events.length === null){
                alert("There are no events on StubHub this week that match your search")
            }
   

          $(".results-card").empty();

          for (var i = 0; i < results.events.length; i++) {
            var eventName = results.events[i].name;
            var eventVenue = results.events[i].venue.name;
            var minTicketPrice = results.events[i].ticketInfo.minListPrice;
            var maxTicketPrice = results.events[i].ticketInfo.maxListPrice;
            var eventDate = results.events[i].eventDateLocal;
            var prettyDate = moment(eventDate).format('MMMM Do YYYY, h:mm a');
  
            var repSpace = eventVenue.split(" ").join("+");
      
  
            var searchResults = `
          
            <div class="col s8 m4">
              <div class="card large">
                    <div class="card-image">
                      <img src="assets/images/Atlanta_Skyline_from_Buckhead.jpg">  
                      </div>
                      <div class="event-info center">
                        <span class="card-title">${eventName}</span>
                        <br><br>
                      <div class="event-desc center">
                        <p><strong>Lowest ticket price: </strong>$${minTicketPrice}</p>
                        <p><strong>Highest ticket price: </strong>$${maxTicketPrice}</p>
                        <p><strong>Venue: </strong>${eventVenue}</p>
                        <p><strong>Date/Time: </strong>${prettyDate}</p>
                      </div>
                    </div>
              </div>
            </div>
      
            `;
  
            $(".results-card").append(searchResults);
  
            }
          
        })
  
    });
  
    //API call for weather
  
    // This is the API key for Open Weather
    var APIKey = "b7b907c1b8d2d7c447d6c40de9d6cb86";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=atlanta,us&mode=json&units=imperial&APPID=" + APIKey
  
    // AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
      })
      .then(function (response) {
  
        //for loop to dynamically create and display table with data from API for the weather
        for (var i = 0; i < 40; i += 8) {
  
          var temp = response.list[i].main.temp
          var formatWords = response.list[i].weather[0].description
          var formatWordsUpper = formatWords.toUpperCase();
          var timestamp = response.list[i].dt_txt;
          var formatted = moment(timestamp).format('LL');
          var humid = response.list[i].main.humidity;
  
          var demoTable = ` 
        <tr>
            <td> ${formatted}</td>
            <td>${temp} deg. F</td>
            <td>${formatWordsUpper}</td>
            <td>${humid}%</td>
            <td>${picWeather()}</td>
        </tr>
      
     `
  //populating icons to display in table for weather
          function picWeather() {
            if (temp >= "70" && formatWordsUpper.includes("CLOUDS") === false && formatWordsUpper.includes("RAIN") === false) {
              return (`<img src="assets/images/sun.jpg" alt="sun" width="40" height="40">`);
            } else if (formatWordsUpper.includes("RAIN") === true) {
              return (`<img src="assets/images/rain.jpg" alt="rain" width="40" height="40">`);
            } else if (temp <= "50") {
              return (`<img src="assets/images/frost.jpg" alt="frost" width="40" height="40">`);
            } else if (formatWordsUpper.includes("CLOUDS") === true) {
              return (`<img src="assets/images/clouds.jpg" alt="clouds" width="40" height="40">`);
            } else if (temp >= "70" && formatWordsUpper.includes("CLOUDS") === true) {
              return (`<img src="assets/images/brokencloudssun.jpg" alt="clouds" width="40" height="40">`)
            } else {
              return (`<img src="assets/images/goodday.jpg" alt="clouds" width="40" height="40">`);
            }
  
          }
  
  
          $("#dynamicTable").append(demoTable);
          picWeather();
  
  
  
        }
  
      });
  })