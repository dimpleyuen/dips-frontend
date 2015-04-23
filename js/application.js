$(document).ready(function() {

// CHECK AUTHENTICATION
  //on page load, run checkAuth function (to determine what page to show)
  checkAuth();

// DISPLAY LOGS
  //on page load, run getDisplayLogs (to display blocks)
  getDisplayLogs();

  $('.my-logs').click(function() {
    getDisplayLogs();
  })

// ON BACK BUTTON, DISPLAY LOGS 
  $('.arrow-left').click(function() {
    getDisplayLogs();
    $(this).hide(500);
  })

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
        history.pushState({foo: "bar"}, "", "/");
        getDisplayLogs();
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

// DISPLAY ONE LOG
  $(document).on('click', '.blocks', function() {
    getOneLog($(this).attr("value"));
  })

// EDIT ONE LOG
  $(document).on('click', '.edit-log', function() {
    $(this).hide();
    $('.section p').attr("contenteditable", "true");
    $('.section').css("color", "#bbb");
    $('.save-log').show();
  })

// UPDATE (SAVE) A LOG
  $(document).on('click', '.save-log', function() {
    saveLog($(this).attr('value'));
    $('.section').css("color", "#549CFC");
  })

// SEARCH  
  $('.fa-search').click(function() {
    $('.search-field').toggle(500);
    $('.search-field').focus();
  });

  $('.search-field').on('input', function() {
    searchLogs();
    if ($('.search-field').val() == "") {
      getDisplayLogs();
    }
  })

// DELETE A LOG
  $(document).on('click', '.delete-log', function() {    
    var prompt = confirm('Are you sure you wan\'t to delete this log?');
    if (prompt == true) {
      deleteLog($(this).attr('value'));
    }
  })

// NEW LOG
  $('.new-log').click(function() {
    $('.logs-container').text('');
    $('.logs-container').hide();
    $('.arrow-left').show(500);

    $('.logs-container').prepend(
      "<div class='col-xs-12 one-log'>" +
        "<h1 class='divelog-header' style='color:#549CFC'>New Dive" + "<button class='btn btn-default btn-primary add-log' style='float:right' type='button'>ADD</button></h1>" + 
        "<div class='col-xs-12'>" +
          "<div class='col-xs-12 col-sm-6 one-one section'>" +
            "Date (yy/mm/dd): <input type='text' class='form-control new-input new-input' value='' placeholder=''>" +
            "Location: <input type='text' class='form-control new-input' value='' placeholder=''>" +
            "Visibility: <input type='text' class='form-control new-input' value='' placeholder=''>" +
           "</div>" +
          "<div class='col-xs-12 col-sm-5 col-sm-offset-1 one-two section'>" +
            "Bottom Time To Date (mins): <input type='text' class='form-control new-input' value='' placeholder=''>" +
            "Time This Dive (mins): <input type='text' class='form-control new-input' value='' placeholder=''>" +
            "Cumulative Time (mins): <input type='text' class='form-control new-input' value='' placeholder=''>" +
          "</div>" +
        "</div>" +
        "<div class='col-xs-12'>" +
          "<div class='col-xs-12 col-sm-6 two-one section'>" +
            "Surface Interval: <input type='text' class='form-control new-input' value='' placeholder=''>" +
            "Starting Pressure Group: <input type='text' class='form-control new-input' value='' placeholder=''>" +
            "Ending Pressure Group: <input type='text' class='form-control new-input' value='' placeholder=''>" +
            "Depth: <input type='text' class='form-control new-input' value='' placeholder=''>" +
           "</div>" +
          "<div class='col-xs-12 col-sm-5 col-sm-offset-1 two-two section'>" +
            "Dive Center: <input type='text' class='form-control new-input' value='' placeholder=''>" +
            "Verification: <input type='text' class='form-control new-input' value='' placeholder=''>" + 
            "Title: <input type='text' class='form-control new-input' value='' placeholder=''>" +
            "Certificate #: <input type='text' class='form-control new-input' value='' placeholder=''>" +
          "</div>" +
        "</div>" +
        "<div class='col-xs-12'>" +
          "<div class='col-xs-12 three-one section'>" +
            "Description: <input type='text' class='form-control new-input' value='' placeholder=''>" +
           "</div>" +
        "</div>" +
        "<div class='col-xs-12'>" +
          "<div class='col-xs-12 five-one section'>" +
            "Image URL: <input type='text' class='form-control new-input' value='' placeholder=''>" +
            "</div>" + 
          "<div class='col-xs-12 four-one section'>" +
            "Keywords: <input type='text' class='form-control new-input' value='' placeholder=''>" +
           "</div>" +
        "</div>" +
        "<div class='col-xs-12'>" +
        " <br></div>" +
      "</div>"
    );
    $('.logs-container').show(500);
  })

  $(document).on('click', '.add-log', function() {
    addLog();
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
          $('.index-bg, #openModalLogin, #openModalSignup').hide();
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

// function logOut() || delete request to /sessions
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
          $('.user-page').hide();
        }
      }
    }) 
  }

// function getDisplayLogs() || get request to /logs (for the blocks)
  function getDisplayLogs() {
    $.ajax({
      type: "GET",
      url: 'http://localhost:3000/logs',
      xhrFields: {
        withCredentials: true
      },
      dataType: "JSON",
      success: function(response) {
        $('.logs-container').text('');
        $('.logs-container').hide();

        response.forEach(function(log) {
          var date = new Date(log.date);
          var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          var actualMonth = months[date.getMonth()];

          $('.logs-container').prepend(
              
            "<div class='col-xs-12 col-sm-4 blocks' value='" + log._id + "'>" +
              "<div class='image' style='background-image: url(" + log.image + ")'>" +
              "</div>" +
              "<p class='deets'>" + log.location + "<br><span class='log-date'>" + actualMonth + "-" + (date.getYear()+1900) + "</span></p>" +
            "</div>"
          );
        });

        $('.logs-container').append(
          "<div class='col-xs-12' style='text-align: center'>" +
          "<span class='page-up'>" +
            "<a href='#top'>&nbsp;&#9650;</a>" +
          "</span></div>"
        )

        $('.logs-container').fadeIn(500);
      }
    }) 
  }

// function getOneLog()
  function getOneLog(id) {
    $.ajax({
      type: "GET",
      url: 'http://localhost:3000/logs/' + id,
      xhrFields: {
        withCredentials: true
      },
      dataType: "JSON",
      success: function(response) {
        console.log(response);

        var date = new Date(response.date);
  
        $('.logs-container').text('');
        $('.logs-container').hide();
        $('.arrow-left').show(500);

        for (var propertyName in response) {
          if (response[propertyName] === null) {
            response[propertyName] = "";
          }
        }

        $('.logs-container').prepend(
          "<div class='col-xs-12 one-log'>" +
            "<h1 class='divelog-header' style='color:#549CFC'>Dive # " + "<button class='btn btn-default btn-primary edit-log' style='float:right' type='button'>EDIT</button>" + "<button class='btn btn-default btn-primary save-log' style='float:right; display:none' type='button' value='" + response._id  + "'>SAVE</button>" + "</h1>" + 
            "<div class='col-xs-12'>" +
              "<div class='col-xs-12 col-sm-6 one-one section'>" +
                "Date (yy/mm/dd): <p>" + (date.getYear()+1900) + "/" + (date.getMonth()+1) + "/" + date.getDate() + "</p>" +
                "Location: <p>" + response.location + "</p>" +
                "Visibility: <p>" + response.visibility + "</p>" +
               "</div>" +
              "<div class='col-xs-12 col-sm-5 col-sm-offset-1 one-two section'>" +
                "Bottom Time To Date (mins): <p>" + response.bottomTimeToDate + "</p>" +
                "Time This Dive (mins): <p>" + response.bottomTime + "</p>" +
                "Cumulative Time (mins): <p>" + response.cumulativeTime + "</p>" +
              "</div>" +
            "</div>" +
            "<div class='col-xs-12'>" +
              "<div class='col-xs-12 col-sm-6 two-one section'>" +
                "Surface Interval: <p>" + response.surfaceInt + "</p>" +
                "Starting Pressure Group: <p>" + response.startingPG + "</p>" +
                "Ending Pressure Group: <p>" + response.endingPG + "</p>" +
                "Depth: <p>" + response.depth + "</p>" +
               "</div>" +
              "<div class='col-xs-12 col-sm-5 col-sm-offset-1 two-two section'>" +
                "Dive Center: <p>" + response.diveCenter + "</p>" +
                "Verification: <p>" + response.buddyName + "</p>" + 
                "Title: <p>" + response.buddyTitle + "</p>" +
                "Certificate #: <p>" + response.buddyCert + "</p>" +
              "</div>" +
            "</div>" +
            "<div class='col-xs-12'>" +
              "<div class='col-xs-12 three-one section'>" +
                "Description: <p>" + response.description + "</p>" +
               "</div>" +
            "</div>" +
            "<div class='col-xs-12'>" +
              "<div class='col-xs-12 five-one section'>" +
                "Image URL: <p>" + response.image + "</p>" +
                "</div>" + 
              "<div class='col-xs-12 four-one section'>" +
                "Keywords: <p>" + response.keywords + "</p>" +
               "</div>" +
            "</div>" +
            "<div class='col-xs-12'>" +
              "<div class='col-xs-12 six-one'>" +
                "<center><button type='submit' value='" + response._id + "' class='btn btn-default btn-danger delete-log' style='width:100%'>DELETE</button></center>" +
               "</div>" +
            "</div>" +
          "</div>"
        );  
        $('.logs-container').fadeIn(500);
      }
    }) 
  }

// function saveLog()
  function saveLog(logID) {
    $.ajax({
      type: "PUT",
      url: 'http://localhost:3000/logs/' + logID,
      xhrFields: {
        withCredentials: true
      },
      data: {
        log: {
          "date" : $($('.one-log p')[0]).text(),
          "location" : $($('.one-log p')[1]).text(),
          "visibility" : $($('.one-log p')[2]).text(),
          "bottomTimeToDate" : $($('.one-log p')[3]).text(),
          "bottomTime" : $($('.one-log p')[4]).text(),
          "cumulativeTime" : $($('.one-log p')[5]).text(),
          "surfaceInt" : $($('.one-log p')[6]).text(),
          "startingPG" : $($('.one-log p')[7]).text(),
          "endingPG" : $($('.one-log p')[8]).text(),
          "depth" : $($('.one-log p')[9]).text(),
          // "safetyStop" : $($('.one-log p')[10]).text(),
          "diveCenter" : $($('.one-log p')[10]).text(),
          "buddyName" : $($('.one-log p')[11]).text(),
          "buddyTitle" : $($('.one-log p')[12]).text(),
          "buddyCert" : $($('.one-log p')[13]).text(),
          "description" : $($('.one-log p')[14]).text(),
          "image" : $($('.one-log p')[15]).text(),
          "keywords" : $($('.one-log p')[16]).text(),
        }
      },
      dataType: "JSON",
      success: function(response) {
        console.log(response);
          $('.section p').attr("contenteditable", "false");
          $('.save-log').hide();
          $(".edit-log").show();
      }
    }) 
  }

// function searchLogs()
  function searchLogs() {
    $.ajax({
      type: "GET",
      url: 'http://localhost:3000/logs/search/' + $('.search-field').val(),
      xhrFields: {
        withCredentials: true
      },
      dataType: "JSON",
      success: function(response) {
        $('.logs-container').text('');
        $('.logs-container').hide();

        response.forEach(function(log) {
          var date = new Date(log.date);
          var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          var actualMonth = months[date.getMonth()];

          $('.logs-container').prepend(
              
            "<div class='col-xs-12 col-sm-4 blocks' value='" + log._id + "'>" +
              "<div class='image' style='background-image: url(" + log.image + ")'>" +
              "</div>" +
              "<p class='deets'>" + log.location + "<br><span class='log-date'>" + actualMonth + "-" + (date.getYear()+1900) + "</span></p>" +
            "</div>"
          );
        })
        $('.logs-container').fadeIn(200);
      }
    }) 
  }

// function deleteLog()
  function deleteLog(logID) {
    $.ajax({
      type: "DELETE",
      url: 'http://localhost:3000/logs/' + logID,
      dataType: "JSON",
      xhrFields: {
        withCredentials: true
      },
      success: function(response) {
        getDisplayLogs();
      }
    }) 
  }

// function addLog();
  function addLog() {
    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/logs',
      xhrFields: {
        withCredentials: true
      },
      data: {
        log: {
          "date" : $($('.one-log input')[0]).val(),
          "location" : $($('.one-log input')[1]).val(),
          "visibility" : $($('.one-log input')[2]).val(),
          "bottomTimeToDate" : $($('.one-log input')[3]).val(),
          "bottomTime" : $($('.one-log input')[4]).val(),
          "cumulativeTime" : $($('.one-log input')[5]).val(),
          "surfaceInt" : $($('.one-log input')[6]).val(),
          "startingPG" : $($('.one-log input')[7]).val(),
          "endingPG" : $($('.one-log input')[8]).val(),
          "depth" : $($('.one-log input')[9]).val(),
          "diveCenter" : $($('.one-log input')[10]).val(),
          "buddyName" : $($('.one-log input')[11]).val(),
          "buddyTitle" : $($('.one-log input')[12]).val(),
          "buddyCert" : $($('.one-log input')[13]).val(),
          "description" : $($('.one-log input')[14]).val(),
          "image" : $($('.one-log input')[15]).val(),
          "keywords" : $($('.one-log input')[16]).val(),
        }    
      },
      dataType: "JSON",
      error: function(xhr, textStatus, errorThrown){
        alert(errorThrown);
      },
      success: function(response) {
        $('.one-log input').val("");
        getDisplayLogs();
      } 
    }) 
  }

//PAGE UP & PAGE DOWN
  $(document).on('click', 'a[href=#top]', function(){
    $('html, body, .container-fluid, .user-page, .logs-wrapper').animate({scrollTop:0}, 'slow');
    return false;
  });

});