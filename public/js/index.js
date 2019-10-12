$(document).ready(function () {

  // initialize materialize drop down menu for request
  $('select').formSelect();

  let today = moment();

  const start = datepicker('.start', { id: 1 });
  const end = datepicker('.end', { id: 1 })

  start.setMin(new Date(today));

  let timeSelected = $('input.timepicker').timepicker({
    showClearBtn: true,
    onSelect: function (hour, minute) {

      console.log(hour);
      console.log(minute);
    }
  });


  // when choice for time restriction changes, show/hide timepicker(s)
  $('select#time-rest').on("change", function (event) {

    let choiceVal = $(this).val();

    switch (choiceVal) {
      case '1':
        $('div.time').hide();
        $('input.time').val('')
        break;
      case '2':
        $('div.timeTwo').show().addClass("offset-s3");
        $('div.timeOne').hide().removeClass("offset-s3");
        $('input#timeOne').val('');
        break;
      case '3':
        $('div.timeOne').show().addClass("offset-s3");
        $('div.timeTwo').hide().removeClass("offset-s3");
        $('input#timeTwo').val('')
        break;
      case '4':
        $('div.timeTwo').removeClass("offset-s3");
        $('div.timeOne').removeClass("offset-s3");
        $('div.time').show();
        break;
    }

  });


  //event hooks
  var $eventSubmitButton = $("#event-submit");
  var $eventList = $("#event-list");
  var $eventName = $("#event-name");
  var $eventStartTime = $("#event-start-time");
  var $eventDate = $("#event-date");
  var $eventDescription = $("#event-description");
  var $eventAttendee = $("#event-attendee");
  // user hooks
  var $userSubmitButton = $("#user-submit");
  var $userList = $("#user-list");
  var $userName = $("#user-name");
  var $userPassword = $("#user-password");

  // The API object contains methods for each kind of request we'll make
  var API = {

    saveEvent: function (event) {
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: "api/events",
        data: JSON.stringify(event)
      });
    },
    saveUser: function (event) {
      console.log(event)
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: "api/users",
        data: JSON.stringify(event)
      });
    },

    getEvents: function (events) {
      return $.ajax({
        url: "api/events",
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


  //refresh event

  var refreshEvent = function () {
    API.getEvents().then(function (data) {
      var $events = data.map(function (event) {
        var $a = $("<a>")
          .text(event.title)
          .attr("href", "/events/" + event.id);

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": event.id
          })
          .append($a);

        var $button = $("<button>")
          .addClass("btn btn-danger float-right delete")
          .text("ｘ");

        $li.append($button);

        return $li;
      });

      $eventList.empty();
      $eventList.append($events);
    });
  };

  //refresh User

  var refreshUser = function () {

    console.log("User Refresh Fired")
    API.getUser().then(function (data) {
      var $users = data.map(function (user) {
        var $a = $("<a>")
          .text(user.id)
          .attr("href", "/users/" + user.id);

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": user.id
          })
          .append($a);

        var $button = $("<button>")
          .addClass("btn btn-danger float-right delete")
          .text("ｘ");

        $li.append($button);

        return $li;
      });

      $userList.empty();
      $userList.append($users);
    });
  }

  $('button#submit-request').on("click", function (event) {

    let dateRange = start.getRange();
    let beginDate = dateRange.start;
    let endDate = dateRange.end;
    console.log(beginDate, endDate);

    let beforeTime = $('input#timeTwo').val();
    let afterTime = $('input#timeOne').val();
    console.log(`Before the time of: ${beforeTime}`);
    console.log(`After the time of: ${afterTime}`);

  });



  // handleFormSubmit is called whenever we submit a new event
  // Save the new event to the db and refresh the list

  var handleEventSubmit = function (event) {
    event.preventDefault();
    console.log("Event Submit Button Clicked!")
    var event = {
      title: $eventName.val().trim(),
      startTime: $eventStartTime.val().trim(),
      eventDate: $eventDate.val().trim(),
      description: $eventDescription.val().trim(),
    }

    if (!(event.title && event.startTime && event.eventDate)) {
      alert("Please make sure everything is filled out correctly, thank yoU!")

    }

    API.saveEvent(event).then(function () {
      refreshEvent();
    });



    $eventName.val("");
    $eventStartTime.val("");
    $eventDate.val("");
    $eventDescription.val("");

  };

  //Handle User Submit

  var handleUserSubmit = function (event) {

    event.preventDefault();
    var user = {
      name: $userName.val().trim(),
      password: $userPassword.val().trim()
    }

    console.log(user.name);
    console.log(user.password);

    if (!(user.name && user.password)) {
      alert("Please make sure everything is filled out correctly, thank yoU!")
      return;
    }

    API.saveUser(user).then(function () {
      console.log("made it this far")
      refreshUser();
    });

    $userName.val("");
    $userPassword.val("");
  };

  // handleDeleteBtnClick is called when an event's delete button is clicked
  // Remove the event from the db and refresh the list


  var handleEventBtnClick = function () {
    var idToDelete = $(this)
      .parent()
      .attr("data-id")

    API.deleteEvent(idToDelete).then(function () {
      refreshEvent();
    })
  };

  var deleteUserBtnClick = function () {
    var idToDelete = $(this)
      .parent()
      .attr("data-id");

    API.deleteUser(idToDelete).then(function () {
      refreshUser();
    })
  }


  // Add event listeners to the submit and delete buttons

  $eventSubmitButton.on("click", handleEventSubmit);
  $eventList.on("click", ".delete", handleEventBtnClick)

  $userSubmitButton.on("click", handleUserSubmit);
  $userList.on("click", ".delete", deleteUserBtnClick)

});
