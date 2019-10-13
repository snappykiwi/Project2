$(document).ready(function () {

  let today = moment();
  let hourDur;
  let minDur;


  let API = {

    getUsers: function (user) {
      $.get({
        url: "api/users",
        success: function (response) {
          console.log(response);
        },
        error: function (error) {
          console.log(error);
        }

      })
    }
  }


  API.getUsers();





  // initialize materialize drop down menu for request
  $('select').formSelect();


  const start = datepicker('.start', { id: 1 });
  const end = datepicker('.end', { id: 1 });

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

  $('select#dur-hours').on("change", function (event) {
    hourDur = $(this).val();
    console.log(hourDur);
  });
  $('select#dur-mins').on("change", function (event) {
    minDur = $(this).val();
    console.log(minDur);
  });


  $('button#submit-request').on("click", function (event) {

    let friend = $('input#friend').val().trim();
    console.log(friend);

    let dateRange = start.getRange();
    let beginDate = dateRange.start;
    let endDate = dateRange.end;
    console.log(beginDate, endDate);

    let beforeTime = $('input#timeTwo').val();
    let afterTime = $('input#timeOne').val();
    console.log(`Before the time of: ${beforeTime}`);
    console.log(`After the time of: ${afterTime}`);

    console.log(hourDur, minDur);
    let duration = parseInt(hourDur) + parseFloat(minDur);
    console.log(`duration: ${duration}`);

    let reqReason = $('input#req-reason').val().trim();
    console.log(reqReason);



  });

});