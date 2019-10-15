$(document).ready(function() {

    let my_calendar = $("#dncalendar-container").dnCalendar({
        dataTitles: { defaultDate: 'default', today : 'Today' },
        notes: [
          { "date": "2019-10-31", "note": ["Happy Halloween 2019"] }
          ],
        showNotes: true,
        monthNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ], 
        monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec' ],
        dayNames: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
        dayUseShortName: false,
        monthUseShortName: false,
        showNotes: false,
        startWeek: 'sunday',
        dayClick: function(date, view) {
            console.log(date);
            console.log(view);
            console.log("HELLOOOOO");
          }
    });
    
    my_calendar.build();
    
});
