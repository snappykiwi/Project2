$(document).ready(function () {

  // let my_calendar = $("#dncalendar-container").dnCalendar({
  //   dataTitles: { defaultDate: 'default', today: 'Today' },
  //   notes: [
  //     { "date": "2019-10-31", "note": ["Happy Halloween 2019"] }
  //   ],
  //   showNotes: true,
  //   monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  //   monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
  //   dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  //   dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  //   dayUseShortName: false,
  //   monthUseShortName: false,
  //   showNotes: true,
  //   startWeek: 'sunday',
  //   dayClick: function (date, view) {
  //     console.log("HELLOOOOO");
  //   }
  // });

  console.log(window.location.href);
  console.log(window.location.href.split("/"));

  if (window.location.href.split("/").includes("home")) {

  $.get({
    url: "/api/events/",
    success: function (res) {
      console.log(res);
      let notesArr = [];
      res.forEach((el) => {
        console.log(el.eventDate);
        let eventDate = moment(allEventDates).format("YYYY-MM-DD");
        let eventTitle = [el.eventTitle];
        notesArray.push({"date": res.length ? eventDate : "", "note": res.length ? eventTitle : []});
      });

      let my_calendar = $("#dncalendar-container").dnCalendar({
        dataTitles: { defaultDate: 'default', today: 'Today' },
        notes: notesArr,
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

  // my_calendar.build();

});
