$(document).ready(function () {

  //event hooks
  let $eventSubmitButton = $("#event-submit");
  let $eventList = $("#event-list");
  let $eventName = $("#event-name");
  let $eventStartTime = $("#event-start-time");
  let $eventDate = $("#event-date");
  let $eventDescription = $("#event-description");
  let $eventAttendee = $("#event-attendee");

  // user hooks
  let $userSubmitButton = $("#user-submit");
  let $loginButton = $("#login");
  let $userList = $("#user-list");
  let $userName = $("#name");
  let $userEmail = $("#email");
  let $loginUser = $("#loginEmail");
  let $loginPass = $("#loginPassword");
  let $userPassword = $("#passwordOne");
  let $userPasswordCheck = $("#passwordTwo");
  let $signUpLink = $("span#signUpLink");
  let $loginLink = $("span#loginLink");
  let $signUpDiv = $("div.signUpDiv");
  let $loginDiv = $("div.loginDiv");

  //modal trigger

  $('#modal').modal();
  $('.modal-trigger').on("click", function () {
    console.log("modal clicked!");
    console.log(this.uuid)
    query = "api/events/" + this.id;
    console.log(query);
    $.ajax({
      url: query,
      type: "GET"
    }).then(function (e) {
      console.log(e);
      console.log("success");
    }).catch(function (err) {
      if (err) throw err
    });

  });

  // The API object contains methods for each kind of request we'll make
  let API = {

    saveEvent: function (eventData) {
      $.post("/api/events", {
        eventTitle: eventData.eventTitle,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        eventDate: eventData.eventDate,
        description: eventData.description
      })
        .then(function (data) {
          console.log("success");
          window.location.replace("/home");
          if (err) throw err;
          refreshEvent();
        })
    },

    saveUser: function (username, name, password) {
      console.log(username, name, password)
      $.post("/api/signup", {
        name: name,
        username: username,
        password: password
      })
        .then(function (data) {
          window.location.replace("/");
        })
        .catch(console.log("error"));
    },

    loginUser: function (username, password) {
      $.post("api/login", {
        username: username,
        password: password
      })
        .then(function () {
          window.location.replace("/home");
        })
        .catch(function (err) {
          console.log(err);
        })
    },

    getEvents: function (events) {
      return $.ajax({
        url: "api/events",
        type: "GET"
      })
    },
    getSingleEvent: function (e) {
      return $.ajax({
        url: "api/events/" + id,
        type: "GET"
      })
    },

    getUser: function (user) {
      return $.ajax({
        url: "api/users",
        type: "GET"
      })
    },

    deleteEvent: function (id) {
      return $.ajax({
        url: "api/events/" + id,
        type: "DELETE"
      });
    },

    deleteUser: function (id) {
      return $.ajax({
        url: "api/users/" + id,
        type: "DELETE"
      });
    }
  };

  $('button#invite').on("click", function (event) {
    $.post("api/invite");
  });

  // refresh event

  const refreshEvent = function () {
    API.getEvents().then(function (data) {
      let $events = data.map(function (event) {
        let $a = $("<a>")
          .text(event.eventTitle)
          .attr("href", "/events/" + event.id)
          .attr("text", "events" + `Starting At ${event.startTime}`)

        let $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": event.id,
          })
          .append($a);

        let $button = $("<button>")
          .addClass("btn btn-danger float-right delete")
          .text("ｘ");

        $li.append($button);

        return $li;
      });

      $eventList.empty();
      $eventList.append($events);
    });
  };

  // refresh User

  const refreshUser = function () {

    console.log("User Refresh Fired")
    API.getUser().then(function (data) {
      let $users = data.map(function (user) {
        let $a = $("<a>")
          .text(user.id)
          .attr("href", "/users/" + user.id);

        let $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": user.id
          })
          .append($a);

        let $button = $("<button>")
          .addClass("btn btn-danger float-right delete")
          .text("ｘ");

        $li.append($button);

        return $li;
      });

      $userList.empty();
      $userList.append($users);
    });
  }

  const handleLogin = function (event) {
    event.preventDefault();
    let user = {
      username: $loginUser.val().trim(),
      password: $loginPass.val().trim()
    };

    console.log(user.username, user.password);

    if (!user.username || !user.password) {
      alert("Please make sure everything is filled out correctly, thank you!");
    }

    API.loginUser(user.username, user.password);
  };

  // handleFormSubmit is called whenever we submit a new event
  // Save the new event to the db and refresh the list

  const handleEventSubmit = function (event) {
    event.preventDefault();
    console.log("Event Submit Button Clicked!")
    let eventData = {
      eventTitle: $eventName.val().trim(),
      startTime: $eventStartTime.val().trim(),
      endTime: $eventStartTime.val().trim(),
      eventDate: $eventDate.val().trim(),
      description: $eventDescription.val().trim(),
    }

    if (!(eventData.eventTitle && eventData.startTime && eventData.eventDate)) {
      alert("Please make sure everything is filled out correctly, thank you!")

    }

    API.saveEvent(eventData);

  };

  // Handle User Submit

  const handleUserSubmit = function (event) {

    event.preventDefault();

    let user = {
      username: $userEmail.val().trim(),
      name: $userName.val().trim(),
      password: $userPassword.val().trim()
    }

    console.log(user.name);
    console.log(user.password);

    if (!user.name || !user.password) {
      alert("Please make sure everything is filled out correctly, thank you!")
      return;
    }

    API.saveUser(user.username, user.name, user.password);

  };

  // handleDeleteBtnClick is called when an event's delete button is clicked
  // Remove the event from the db and refresh the list


  let handleEventBtnClick = function () {
    let idToDelete = $(this)
      .parent()
      .attr("data-id")

    API.deleteEvent(idToDelete).then(function () {
      refreshEvent();
    })
  };

  let deleteUserBtnClick = function () {
    let idToDelete = $(this)
      .parent()
      .attr("data-id");

    API.deleteUser(idToDelete).then(function () {
      refreshUser();
    })
  }

  $signUpLink.on("click", function (event) {
    $loginDiv.fadeOut("slow");
    setTimeout(function () {
      $signUpDiv.fadeIn("slow");
    }, 700)
  });

  $loginLink.on("click", function (event) {
    $signUpDiv.fadeOut("slow");
    setTimeout(function () {
      $loginDiv.fadeIn("slow");
    }, 700)
  });

  // Add event listeners to the submit and delete buttons

  $eventSubmitButton.on("click", handleEventSubmit);
  $eventList.on("click", ".delete", handleEventBtnClick)

  $userSubmitButton.on("click", handleUserSubmit);
  $userList.on("click", ".delete", deleteUserBtnClick)

  $loginButton.on("click", handleLogin);

  // refreshEvent();

});
