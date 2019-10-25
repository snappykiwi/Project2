$(document).ready(function () {

  if (window.location.href.split("/").includes("home")) {

    $.get({
      url: "/api/events/user",
      success: function (res) {

        let notesArray = [];

        res.forEach((el) => {
          let eventDate = moment(el.eventDate).format("YYYY-MM-DD");
          let eventTitle = [el.eventTitle];
          notesArray.push({ 
            "date": res.length ? eventDate : "", 
            "note": res.length ? eventTitle : [] });
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
            console.log("hello world", date);

            let html = '';
            $.each(notesArray, function(){
              console.log(this);
              if (moment(moment(this.date).toDate()).isSame(moment(date), 'day')){              
                html += `<li><h2 class="modal-header center gold">${this.note}</h2><p class="modal-date center">${this.date}</p></li>`;
                console.log(html);
              }
            });
            
            $('#eventListHtmlPlaceholder').html('<ul>'+html+'</ul>');    
            
            // open modal after html is built
            $('#eventListModal').modal();            
            $('#eventListModal').modal('open');
          }

        });

        my_calendar.build();

      },
      error: function (error) {
        console.log(error);
      }

    });

  }

});
