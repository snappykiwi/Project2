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

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }

            else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                } // color today's date
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }
}

