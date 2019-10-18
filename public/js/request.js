$(document).ready(function () {

  // CREATE EVENT
  //event hooks
  let $eventSubmitButton = $("#submit-create");
  let $eventList = $("#event-list");
  let $eventName = $("#createTitle");
  let $eventStartTime = $("#createSTime");
  let $eventEndTime = $("#createETime");
  let $eventDate = $("#createDate");
  let $eventDescription = $("#createDesc");
  let $eventAttendee = $("#event-attendee");
  let selectedDate;


  let $requestDiv = $('div#requestEvent');
  let $createDiv = $('div#createEvent');
  let $requestSwitch = $('button#requestSwitch');
  let $createSwitch = $('button#createSwitch');


  let today = moment();
  let hourDur;
  let minDur = 0;

  let API = {

    getUsers: function (user) {

      $.get({
        url: "/api/users",
        success: function (response) {
          console.log(response);
        },
        error: function (error) {
          console.log(error);
        }

      })
    },

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

    saveRequest: function (startDate, endDate, afterTime, beforeTime, duration, reason) {
      // console.log(username, name, password)
      $.post("/api/request", {
        dateStart: startDate,
        dateEnd: endDate,
        starTime: afterTime,
        endTime: beforeTime,
        duration: duration,
        reason: reason,
        status: "pending"
      })
        .then(function (data) {
          console.log(data);
        })
        .catch(console.log("error"));
    },

  }



  API.getUsers();

  // initialize materialize drop down menu for request
  $('select').formSelect();

  // datepickers for request page
  const start = datepicker('.start', { id: 1 });
  const end = datepicker('.end', { id: 1 });

  // event date
  const createDate = datepicker('.createDate', {
    onSelect: (instance, date) => {
      selectedDate = date;
    }
  });

  start.setMin(new Date(today));
  createDate.setMin(new Date(today));




  let timeSelected = $('input.timepicker').timepicker({
    showClearBtn: true,
    // twelveHour: false,
    onSelect: function (hour, minute) {

      console.log(hour);
      console.log(minute);
    }
  });


  // Showing/Hiding Create/Request Divs
  $createSwitch.on("click", function (event) {
    $requestSwitch.removeClass('selected');
    $createSwitch.addClass('selected');

    $requestDiv.removeClass('flipInY, delay-2s').addClass('flipOutY');

    setTimeout(function () {
      $requestDiv.hide().removeClass('flipOutY');
      $createDiv.addClass('flipInY').fadeIn();
    }, 1000)
  });

  $requestSwitch.on("click", function (event) {

    $createSwitch.removeClass('selected');
    $requestSwitch.addClass('selected');

    $createDiv.removeClass('flipInY, delay-2s').addClass('flipOutY');

    setTimeout(function () {
      $createDiv.hide().removeClass('flipOutY');
      $requestDiv.addClass('flipInY').fadeIn();
    }, 1000)
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

  $('select#dur-hours').on("change", function (event) {
    hourDur = $(this).val();
    console.log(hourDur);
  });
  $('select#dur-mins').on("change", function (event) {
    minDur = $(this).val();
    console.log(minDur);
  });

  $('button#submit-request').on("click", function (event) {

    // let friend = $('input#friend').val().trim();
    // console.log(friend);

    let dateRange = start.getRange();
    let beginDate = dateRange.start;
    let endDate = dateRange.end;
    console.log(beginDate, endDate);

    let startDt = $('input.start').val().trim();
    let endDt = $('input.end').val().trim();

    let beforeTime = $('input#timeTwo').val().trim();
    let afterTime = $('input#timeOne').val().trim();
    console.log(beforeTime);

    beforeTime = `${startDt} ${beforeTime}`;
    afterTime = `${endDt} ${afterTime}`;

    beforeTime = moment(beforeTime).format('HHmmss');
    afterTime = moment(afterTime).format('HHmmss');

    let duration = parseInt(hourDur) + parseFloat(minDur);


    let reqReason = $('input#req-reason').val().trim();


    API.saveRequest(beginDate, endDate, afterTime, beforeTime, duration, reqReason);

  });





  // handleFormSubmit is called whenever we submit a new event
  // Save the new event to the db and refresh the list

  const handleEventSubmit = function (event) {
    event.preventDefault();

    console.log(selectedDate);
    console.log("Event Submit Button Clicked!");

    let eventDate = $eventDate.val().trim()

    let startTime = `${eventDate} ${$eventStartTime.val().trim()}`;
    let endTime = `${eventDate} ${$eventEndTime.val().trim()}`;

    startTime = moment(startTime).format('HHmmss');
    endTime = moment(endTime).format('HHmmss');
    
    let eventData = {
      eventTitle: $eventName.val().trim(),
      startTime: startTime,
      endTime: endTime,
      eventDate: selectedDate,
      description: $eventDescription.val().trim(),
    }

    if (!(eventData.eventTitle && eventData.startTime && eventData.eventDate)) {
      alert("Please make sure everything is filled out correctly, thank you!")

    }

    API.saveEvent(eventData);

  };

  $eventSubmitButton.on("click", handleEventSubmit);
});