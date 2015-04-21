$(document).ready(function() {

// CHECK AUTHENTICATION
  //on page load, run checkAuth function (to determine what page to show)
  checkAuth();

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
    signUp();
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
          alert("authenticated!")
            $('.index-page, #openModalLogin, #openModalSignup').hide();
        }
        else {
          $('.index-page, #openModalLogin, #openModalSignup').show();
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
  function signUp() {
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
          return alert("User Exists");
        }
        else {
          alert("Sign Up Successful!");
          // when sign up is successful, run loginUser() function
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
      }
    }) 
  }
});