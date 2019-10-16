$(document).ready(function () {

  if (window.location.href.split("/").includes("home")) {

    $.get({
      url: "/api/events/",
      success: function (res) {
        console.log(res);
        let notesArray = [];
        res.forEach((el) => {
          console.log(el.eventDate);
          let eventDate = moment(el.eventDate).format("YYYY-MM-DD");
          let eventTitle = [el.eventTitle];
          notesArray.push({"date": res.length ? eventDate : "", "note": res.length ? eventTitle : []});
        });

        let my_calendar = $("#dncalendar-container").dnCalendar({
          dataTitles: { defaultDate: 'default', today: 'Today' },
          notes: notesArray,
          showNotes: true,
          monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
          dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          dayUseShortName: false,
          monthUseShortName: false,
          showNotes: false,
          startWeek: 'sunday',
          dayClick: function (date, view) {
            console.log("HELLOOOOO");
          }
        });

        console.log(my_calendar);
        my_calendar.build();

      },
      error: function (error) {
        console.log(error);
      }

    });

  }

});
