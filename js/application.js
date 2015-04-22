$(document).ready(function() {

// CHECK AUTHENTICATION
  //on page load, run checkAuth function (to determine what page to show) & displayLogs
  checkAuth();

// DISPLAY LOGS  
  getDisplayLogs(function(response) {
    $('.logs-container').text('');

    response.forEach(function(log) {
      var date = new Date(log.date);
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var actualMonth = months[date.getMonth()];

      $('.logs-container').prepend(
          
        "<div class='col-xs-12 col-sm-4 blocks' id='" + log._id + "'>" +
          "<div class='image' style='background-image: url(" + log.image + ")'>" +
          "</div>" +
          "<p class='deets'>" + log.location + "<br><span class='log-date'>" + actualMonth + "-" + (date.getYear()+1900) + "</span></p>" +
        "</div>"
      );
    })
  });

// LOGIN
  //on clicking login link, focus on input field
  $('.login-link').click(function() {
    $('.login-username').focus();
  })

  //on clicking login button run loginUser + checkAuth function (to show next page)
  $(document).on('click', '.login-button', function() {
    loginUser( $('.login-username').val(), $('.login-password').val(), function(response){
      if (response.message === true) {
        checkAuth();
        getDisplayLogs(function(response) {
          $('.logs-container').text('');

          response.forEach(function(log) {
            var date = new Date(log.date);
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var actualMonth = months[date.getMonth()];

            $('.logs-container').prepend(
                
              "<div class='col-xs-12 col-sm-4 blocks'>" +
                "<div class='image' style='background-image: url(" + log.image + ")'>" +
                "</div>" +
                "<p class='deets text-uppercase'>" + log.location.toUpperCase() + "<br><span class='log-date'>" + actualMonth + "-" + (date.getYear()+1900) + "</span></p>" +
              "</div>"
            );
          })
        });
      }
      else {
        alert(response.message);
      }
    });
  })

// SIGN UP
  //on clicking signup link, focus on input field
  $('.signup-link').click(function() {
    $('.signup-email').focus();
  })

  $(document).on('click', '.signup-button', function() {
    signUp(function(response){
      if (response.message === true) {
        //if signup is successful, run the loginUser function
        loginUser( $('.signup-username').val(), $('.signup-password').val(), function(response){
          if (response.message === true) {
            checkAuth();
            history.pushState({foo: "bar"}, "", "/");
          }
          else {
            alert(response.message);
          }
        });
      }
      else {
        alert(response.message);
      }
    });
  })

// LOGOUT
  $('.log-out').click(function() {
    logOut();
  })

// function checkAuth() || get request to /authenticated
  function checkAuth() {
    $.ajax({
      type: "GET",
      url: 'http://localhost:3000/authenticated',
      xhrFields: {
        withCredentials: true
      },
      dataType: "JSON",
      success: function(response) {
        console.log('Authentication response: ', response);

        if (response.authenticated === true) {
          $('.index-bg, #openModalLogin, #openModalSignup').fadeOut(500);
          $('.user-page').fadeIn(500);
        }
        else {
          $('.index-bg, #openModalLogin, #openModalSignup').show();
        }
      }
    }) 
  }

// function loginUser() || post request to /sessions 
  function loginUser(username, password, callback) {
    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/sessions',
      data: {
        user: {
          username: username,
          password: password
        }      
      },
      //port for FE & BE is different, which is deemed a cross domain request, so in order to send a cookie to the browser, we need to configure xhrfields to credentials = true
      xhrFields: {
      withCredentials: true
      },
      dataType: "JSON",
      success: function(response) {
        if (response.message === "User Does Not Exist") {
          return callback({
            "message" : "User Does Not Exist"
          });
        }
        else if (response.message === "Password Incorrect") {
          return callback({
            "message": "Password Incorrect"
          });
        }
        else {
          $('#openModalLogin').hide();
          return callback({
            "message": true
          });
        }
      }
    }) 
  }

// function signUp() || post request to /users
  function signUp(callback) {
    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/users',
      data: {
        user: {
          username:  $('.signup-username').val(),
          email: $('.signup-email').val(),
          password: $('.signup-password').val()
        }      
      },
      dataType: "JSON",
      success: function(response) {
        if (response.message) {
          return callback({
            "message" : "User Exists"
          });
        }
        else {
          return callback({
            "message" : true
          });
        }
      }
    }) 
  }

//function logOut() || delete request to /sessions
  function logOut() {
    $.ajax({
      type: "DELETE",
      url: 'http://localhost:3000/sessions',
      xhrFields: {
        withCredentials: true
      },
      dataType: "JSON",
      success: function(response) {
        console.log(response);
        if (response.status === true) {
          $('.index-bg, #openModalLogin, #openModalSignup').show();
        }
      }
    }) 
  }

//function getDisplayLogs() || get request to display /logs
  function getDisplayLogs(callback) {
    $.ajax({
      type: "GET",
      url: 'http://localhost:3000/logs',
      xhrFields: {
        withCredentials: true
      },
      dataType: "JSON",
      success: callback
    }) 
  }

// on click of divs, show full dive info
  $(document).on('click', '.col-xs-12', function() {
    getDisplayLogs(function(response) {
      $('.logs-container').text('');
    
      var date = new Date(response.date);
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var actualMonth = months[date.getMonth()];

      $('.logs-container').prepend(
        "<div class='row'>" +
          "<div class='col-xs-12 one-log'>" +
            "<h1 class='divelog-header'>Dive #</h1>" +
            "<div class='row'>" +
              "<div class='col-xs-6 one-one section'>" +
                "Section 1 : Date, Location" +
               "</div>" +
              "<div class='col-xs-6 one-two section'>" +
                "Section 2: Bottom Time, Time This Dive, Cumulative Time" +
              "</div>" +
            "</div>" +
            "<div class='row'>" +
              "<div class='col-xs-6 two-one section'>" +
                "Section 3 : Image" +
               "</div>" +
              "<div class='col-xs-6 two-two section'>" +
                "Section 4: Visibility, Dive Center, Dive Buddy, Buddy Cert & Cert Number" +
              "</div>" +
            "</div>" +
            "<div class='row'>" +
              "<div class='col-xs-12 three-one section'>" +
                "Section 5 : Description" +
               "</div>" +
            "</div>" +
            "<div class='row'>" +
              "<div class='col-xs-12 four-one section'>" +
                "Section 6: Keywords" +
               "</div>" +
            "</div>" +
            "<div class='row'>" +
              "<div class='col-xs-12 five-one section'>" +
                "Section 7: Close Button/Save Changes Button" +
               "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );  
    });
  })

    


});